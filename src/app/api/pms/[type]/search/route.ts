/**
 * /api/pms/[type]/search
 * 汎用PMSアダプター — 予約検索エンドポイント
 *
 * 対応PMS:
 *   staysee          → /api/staysee/search に委譲（既存）
 *   cloudbeds        → Cloudbeds API v1.1
 *   beds24           → Beds24 API v2
 *   airhost          → エアホスト API
 *   hostaway         → Hostaway API v1
 *   easyaccounting   → イージー会計 API
 *   little_hotelier  → Little Hotelier / SiteMinder API
 *   apaleo           → apaleo API
 *
 * APIキーは dms_tenants.pms_fields から取得（Cookie: dms_session）
 * クエリパラメータ:
 *   q     — 検索文字列（予約番号 / 氏名 / 電話番号）
 *   mode  — all | checkin | checkout
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── セッション + 物件IDからAPIキーを解決 ──
// 優先順位: 物件固有のpms_fields > テナントのグローバルpms_fields
async function resolvePmsConfig(
  req: NextRequest,
  propertyId?: string
): Promise<{ pmsType: string; fields: Record<string, string> } | null> {
  try {
    const cookie = req.cookies.get('dms_session')?.value
    if (!cookie) return null
    const session = JSON.parse(cookie)
    if (!session?.id || session.id === 'super-admin') return null

    // テナントのグローバル設定
    const { data: tenant } = await supabase
      .from('dms_tenants')
      .select('pms_type, pms_fields')
      .eq('id', session.id)
      .single()

    const globalFields: Record<string, string> = tenant?.pms_fields || {}
    const globalType: string = tenant?.pms_type || 'none'

    // 物件固有の設定（propertyIdが指定されている場合）
    if (propertyId) {
      const { data: prop } = await supabase
        .from('dms_properties')
        .select('pms_type, pms_fields')
        .eq('id', propertyId)
        .eq('tenant_id', session.id)
        .single()

      if (prop?.pms_fields?.apiKey) {
        // 物件固有キーが設定されていればそちらを優先
        return {
          pmsType: prop.pms_type || globalType,
          fields: { ...globalFields, ...prop.pms_fields },
        }
      }
    }

    // フォールバック: テナントのグローバル設定
    return { pmsType: globalType, fields: globalFields }
  } catch { return null }
}

// ── 予約データを共通形式に正規化 ──
interface Reservation {
  id: string
  pms_reservation_id?: string
  name_kanji?: string
  name?: string
  tel?: string
  email?: string
  start_date?: string
  end_date?: string
  check_in_time?: string
  check_out_time?: string
  room_id?: string
  room_name?: string
  person_number?: number
  billing_amount?: number
  status?: string
  ota_source?: string
}

// ─────────────────────────────────────────────
// 各PMSアダプター
// ─────────────────────────────────────────────

/** Cloudbeds */
async function searchCloudbeds(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    status: 'confirmed,checked_in',
    pageSize: '50',
    ...(mode === 'checkin'  ? { checkInFrom: today, checkInTo: today }   : {}),
    ...(mode === 'checkout' ? { checkOutFrom: today, checkOutTo: today } : {}),
    ...(q ? { search: q } : {}),
  })
  const res = await fetch(`https://hotels.cloudbeds.com/api/v1.1/getReservations?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) throw new Error(`Cloudbeds API error: ${res.status}`)
  const data = await res.json()
  return (data.data || []).map((r: any): Reservation => ({
    id: r.reservationID,
    pms_reservation_id: r.reservationID,
    name_kanji: `${r.guestName || ''}`.trim(),
    name: r.guestName,
    tel: r.guestPhone,
    email: r.guestEmail,
    start_date: r.startDate,
    end_date: r.endDate,
    check_in_time: r.checkInTime,
    check_out_time: r.checkOutTime,
    room_id: r.roomID,
    room_name: r.roomName,
    person_number: Number(r.adults || 1) + Number(r.children || 0),
    billing_amount: Number(r.grandTotal || 0),
    status: r.status,
    ota_source: r.channelName,
  }))
}

/** Beds24 */
async function searchBeds24(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const body: Record<string, unknown> = {
    authentication: { apiKey },
    data: {
      numAdults: { minValue: 0 },
      ...(mode === 'checkin'  ? { firstNight: today } : {}),
      ...(mode === 'checkout' ? { lastNight:  today } : {}),
    },
  }
  const res = await fetch('https://api.beds24.com/v2/bookings', {
    method: 'GET',
    headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Beds24 API error: ${res.status}`)
  const data = await res.json()
  const list: any[] = Array.isArray(data) ? data : (data.data || [])
  const filtered = q ? list.filter((r: any) => {
    const qL = q.toLowerCase()
    return (r.bookId || '').toString().includes(qL)
      || (r.guestFirstName + ' ' + r.guestLastName).toLowerCase().includes(qL)
      || (r.guestPhone || '').includes(q)
  }) : list
  return filtered.map((r: any): Reservation => ({
    id: String(r.bookId),
    pms_reservation_id: String(r.bookId),
    name_kanji: `${r.guestFirstName || ''} ${r.guestLastName || ''}`.trim(),
    tel: r.guestPhone,
    email: r.guestEmail,
    start_date: r.firstNight,
    end_date: r.lastNight,
    room_id: String(r.roomId || ''),
    person_number: Number(r.numAdult || 1),
    billing_amount: Number(r.price || 0),
    status: r.status,
    ota_source: r.channel,
  }))
}

/** エアホスト (Airhost) */
async function searchAirhost(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    limit: '50',
    ...(mode === 'checkin'  ? { check_in_date: today }  : {}),
    ...(mode === 'checkout' ? { check_out_date: today } : {}),
  })
  const res = await fetch(`https://api.airhost.co/api/v1/reservations?${params}`, {
    headers: { 'X-API-KEY': apiKey },
  })
  if (!res.ok) throw new Error(`Airhost API error: ${res.status}`)
  const data = await res.json()
  const list: any[] = data.reservations || data || []
  const filtered = q ? list.filter((r: any) => {
    const qL = q.toLowerCase()
    return (r.confirmation_code || '').toLowerCase().includes(qL)
      || (r.guest_name || '').toLowerCase().includes(qL)
      || (r.guest_phone || '').includes(q)
  }) : list
  return filtered.map((r: any): Reservation => ({
    id: r.id || r.confirmation_code,
    pms_reservation_id: r.confirmation_code || r.id,
    name_kanji: r.guest_name,
    tel: r.guest_phone,
    email: r.guest_email,
    start_date: r.check_in,
    end_date: r.check_out,
    room_id: String(r.listing_id || ''),
    room_name: r.listing_name,
    person_number: Number(r.guests || 1),
    billing_amount: Number(r.payout_price || 0),
    status: r.status,
    ota_source: r.channel,
  }))
}

/** Hostaway */
async function searchHostaway(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    limit: '50',
    status: 'confirmed',
    ...(mode === 'checkin'  ? { arrivalStartDate: today, arrivalEndDate: today }     : {}),
    ...(mode === 'checkout' ? { departureStartDate: today, departureEndDate: today } : {}),
  })
  const res = await fetch(`https://api.hostaway.com/v1/reservations?${params}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Cache-Control': 'no-cache',
    },
  })
  if (!res.ok) throw new Error(`Hostaway API error: ${res.status}`)
  const data = await res.json()
  const list: any[] = data.result || []
  const filtered = q ? list.filter((r: any) => {
    const qL = q.toLowerCase()
    return (r.confirmationCode || '').toLowerCase().includes(qL)
      || ((r.guestFirstName || '') + ' ' + (r.guestLastName || '')).toLowerCase().includes(qL)
      || (r.guestPhone || '').includes(q)
  }) : list
  return filtered.map((r: any): Reservation => ({
    id: String(r.id),
    pms_reservation_id: r.confirmationCode || String(r.id),
    name_kanji: `${r.guestFirstName || ''} ${r.guestLastName || ''}`.trim(),
    tel: r.guestPhone,
    email: r.guestEmail,
    start_date: r.arrivalDate,
    end_date: r.departureDate,
    room_id: String(r.listingId || ''),
    room_name: r.listingName,
    person_number: Number(r.numberOfGuests || 1),
    billing_amount: Number(r.totalPrice || 0),
    status: r.status,
    ota_source: r.channelName,
  }))
}

/** イージー会計 */
async function searchEasyAccounting(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  // イージー会計はホテル向け予約管理SaaS
  // APIドキュメント: https://easy-accounting.jp/api
  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    api_key: apiKey,
    limit: '50',
    ...(mode === 'checkin'  ? { check_in: today }  : {}),
    ...(mode === 'checkout' ? { check_out: today } : {}),
    ...(q ? { q } : {}),
  })
  const res = await fetch(`https://api.easy-accounting.jp/v1/reservations?${params}`)
  if (!res.ok) throw new Error(`イージー会計 API error: ${res.status}`)
  const data = await res.json()
  const list: any[] = data.reservations || []
  return list.map((r: any): Reservation => ({
    id: String(r.id || r.reservation_no),
    pms_reservation_id: r.reservation_no || String(r.id),
    name_kanji: r.guest_name_kanji || r.guest_name,
    name: r.guest_name,
    tel: r.guest_tel,
    email: r.guest_email,
    start_date: r.check_in_date,
    end_date: r.check_out_date,
    check_in_time: r.check_in_time,
    check_out_time: r.check_out_time,
    room_id: String(r.room_no || r.room_id || ''),
    room_name: r.room_name,
    person_number: Number(r.person_number || 1),
    billing_amount: Number(r.total_amount || 0),
    status: r.status,
    ota_source: r.ota_name || r.channel,
  }))
}

/** Little Hotelier / SiteMinder */
async function searchLittleHotelier(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    per_page: '50',
    ...(mode === 'checkin'  ? { arrival_date: today }   : {}),
    ...(mode === 'checkout' ? { departure_date: today } : {}),
    ...(q ? { q } : {}),
  })
  const res = await fetch(`https://api.littlehotelier.com/properties/reservations?${params}`, {
    headers: { 'X-Api-Key': apiKey },
  })
  if (!res.ok) throw new Error(`Little Hotelier API error: ${res.status}`)
  const data = await res.json()
  const list: any[] = data.reservations || []
  return list.map((r: any): Reservation => ({
    id: String(r.id),
    pms_reservation_id: r.confirmation_number || String(r.id),
    name_kanji: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
    tel: r.phone,
    email: r.email,
    start_date: r.arrival_date,
    end_date: r.departure_date,
    room_id: String(r.room_id || ''),
    room_name: r.room_name,
    person_number: Number(r.adults || 1),
    billing_amount: Number(r.total || 0),
    status: r.status,
    ota_source: r.channel_name,
  }))
}

/** apaleo */
async function searchApaleo(apiKey: string, q: string, mode: string): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const params = new URLSearchParams({
    pageSize: '50',
    ...(mode === 'checkin'  ? { dateFilter: 'Arrival',   from: today, to: today }   : {}),
    ...(mode === 'checkout' ? { dateFilter: 'Departure', from: today, to: today }   : {}),
    ...(q ? { textSearch: q } : {}),
  })
  const res = await fetch(`https://api.apaleo.com/booking/v1/reservations?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) throw new Error(`apaleo API error: ${res.status}`)
  const data = await res.json()
  const list: any[] = data.reservations || []
  return list.map((r: any): Reservation => ({
    id: r.id,
    pms_reservation_id: r.id,
    name_kanji: `${r.primaryGuest?.firstName || ''} ${r.primaryGuest?.lastName || ''}`.trim(),
    tel: r.primaryGuest?.phone,
    email: r.primaryGuest?.email,
    start_date: r.arrival?.split('T')[0],
    end_date: r.departure?.split('T')[0],
    room_id: r.assignedUnit?.id,
    room_name: r.assignedUnit?.name,
    person_number: Number(r.adults || 1),
    billing_amount: Number(r.totalGrossAmount?.amount || 0),
    status: r.status,
    ota_source: r.channelCode,
  }))
}

// ─────────────────────────────────────────────
// メインルートハンドラー
// ─────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const pmsType = params.type.toLowerCase()
  const { searchParams } = new URL(req.url)
  const q          = (searchParams.get('q') || '').trim()
  const mode       = searchParams.get('mode') || 'all'
  const propertyId = searchParams.get('property_id') || undefined

  // Staysee は既存APIに委譲
  if (pmsType === 'staysee') {
    const url = new URL('/api/staysee/search', req.url)
    url.search = req.url.split('?')[1] || ''
    return fetch(url.toString(), { headers: req.headers })
  }

  // 物件固有 → テナントのグローバル設定の順でAPIキーを解決
  const config = await resolvePmsConfig(req, propertyId)
  if (!config) {
    return NextResponse.json({ error: '認証情報が取得できません。DMSにログインしてください。' }, { status: 401 })
  }

  const apiKey = config.fields?.apiKey || config.fields?.api_key || ''
  if (!apiKey) {
    return NextResponse.json({
      error: `${pmsType} のAPIキーが設定されていません。DMS設定タブ（物件設定またはテナント設定）から入力してください。`,
      propertyId: propertyId || null,
    }, { status: 400 })
  }

  try {
    let reservations: Reservation[] = []

    switch (pmsType) {
      case 'cloudbeds':
        reservations = await searchCloudbeds(apiKey, q, mode)
        break
      case 'beds24':
        reservations = await searchBeds24(apiKey, q, mode)
        break
      case 'airhost':
      case 'エアホスト':
        reservations = await searchAirhost(apiKey, q, mode)
        break
      case 'hostaway':
        reservations = await searchHostaway(apiKey, q, mode)
        break
      case 'easyaccounting':
      case 'イージー会計':
      case 'easy_accounting':
        reservations = await searchEasyAccounting(apiKey, q, mode)
        break
      case 'little_hotelier':
      case 'littlehotelier':
        reservations = await searchLittleHotelier(apiKey, q, mode)
        break
      case 'apaleo':
        reservations = await searchApaleo(apiKey, q, mode)
        break
      default:
        return NextResponse.json({
          error: `未対応のPMSタイプです: ${pmsType}`,
          supportedTypes: ['staysee', 'cloudbeds', 'beds24', 'airhost', 'hostaway', 'easyaccounting', 'little_hotelier', 'apaleo'],
        }, { status: 400 })
    }

    return NextResponse.json({ reservations, total: reservations.length, pmsType })
  } catch (e: any) {
    console.error(`[pms/${pmsType}/search]`, e.message)
    return NextResponse.json({
      error: e.message,
      hint: 'APIキーが正しいか、PMSの管理画面でAPI連携が有効になっているか確認してください。',
      reservations: [],
    }, { status: 500 })
  }
}
