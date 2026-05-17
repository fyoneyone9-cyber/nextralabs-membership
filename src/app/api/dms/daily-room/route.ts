import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Daily.co APIキーの解決順:
 *   1. 物件固有キー (dms_properties.pms_fields.daily_api_key)
 *   2. テナント共通キー (dms_tenants.daily_api_key)
 *   3. Vercel環境変数 DAILY_API_KEY
 *   4. リクエストヘッダー x-daily-api-key（レガシー互換）
 */
async function resolveApiKey(req: NextRequest, propertyId?: string): Promise<string> {
  // 物件固有 / テナント共通キーを試みる
  if (propertyId) {
    try {
      const { data: prop } = await supabase
        .from('dms_properties')
        .select('pms_fields, tenant_id')
        .eq('id', propertyId)
        .single()

      if (prop?.pms_fields?.daily_api_key) {
        return prop.pms_fields.daily_api_key
      }

      // テナント共通キー
      if (prop?.tenant_id) {
        const { data: tenant } = await supabase
          .from('dms_tenants')
          .select('daily_api_key')
          .eq('id', prop.tenant_id)
          .single()
        if (tenant?.daily_api_key) return tenant.daily_api_key
      }
    } catch { /* フォールバックへ */ }
  } else {
    // property_id なし → セッションからテナントキーを試みる
    try {
      const cookie = req.cookies.get('dms_session')?.value
      if (cookie) {
        const session = JSON.parse(cookie)
        if (session?.id && session.id !== 'super-admin') {
          const { data: tenant } = await supabase
            .from('dms_tenants')
            .select('daily_api_key')
            .eq('id', session.id)
            .single()
          if (tenant?.daily_api_key) return tenant.daily_api_key
        }
      }
    } catch { /* フォールバックへ */ }
  }

  // Vercel環境変数 → ヘッダー
  return process.env.DAILY_API_KEY || req.headers.get('x-daily-api-key') || ''
}

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  const { propertyName = 'フロント', property_id } = body

  const apiKey = await resolveApiKey(req, property_id)
  if (!apiKey) {
    return NextResponse.json({
      error: 'Daily.co APIキーが設定されていません。物件設定またはVercel環境変数 DAILY_API_KEY を確認してください。'
    }, { status: 400 })
  }

  const roomName = `dms-call-${Date.now()}`

  const res = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: 'public',
      properties: {
        exp: Math.floor(Date.now() / 1000) + 3600,
        max_participants: 2,
        enable_chat: false,
        enable_screenshare: false,
        start_video_off: false,
        start_audio_off: false,
      }
    })
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const room = await res.json()
  const createdAt = new Date().toISOString()

  // Supabaseにイベント保存 → CallsEngineがRealtimeで検知して通知
  try {
    await getSupabase().from('dms_call_events').insert({
      room_name: room.name,
      room_url:  room.url,
      property_name: propertyName,
      property_id:   property_id || null,
      created_at: createdAt,
      status: 'active',
    })
  } catch {
    // 保存失敗してもルーム作成自体は成功として返す
  }

  return NextResponse.json({
    url: room.url,
    name: room.name,
    propertyName,
    createdAt,
  })
}

export async function DELETE(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  const { roomName, property_id } = body

  const apiKey = await resolveApiKey(req, property_id)
  if (!apiKey || !roomName) return NextResponse.json({ ok: false }, { status: 400 })

  await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  })

  try {
    await getSupabase().from('dms_call_events').update({ status: 'ended' }).eq('room_name', roomName)
  } catch { /* 無視 */ }

  return NextResponse.json({ ok: true })
}
