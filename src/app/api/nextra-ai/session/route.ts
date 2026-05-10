import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Nextra AI KIOSK/DMS セッションデータクラウド保存API
 * - チェックイン台帳・電子署名有無・チェックアウト記録を Supabase に永続保存
 * - データは消えない（supabase RLSポリシーでINSERT許可）
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, reservationId, pms, ledger, hasSig, timestamp } = body

    if (!type || !reservationId) {
      return NextResponse.json({ error: 'type と reservationId は必須です' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // nextra_ai_sessions テーブルにupsert（なければINSERT、あればUPDATE）
    const { error } = await supabase
      .from('nextra_ai_sessions')
      .upsert({
        reservation_id: reservationId,
        event_type: type,          // 'checkin' | 'checkout'
        pms_source: pms || 'unknown',
        guest_name: ledger?.name || null,
        guest_address: ledger?.address || null,
        guest_occupation: ledger?.occupation || null,
        guest_travel: ledger?.travel || null,
        has_signature: hasSig ?? false,
        recorded_at: timestamp || new Date().toISOString(),
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'reservation_id,event_type',
      })

    if (error) {
      // テーブルが存在しない場合など、サイレントフェイル（UXを壊さない）
      console.warn('[nextra-ai/session] Supabase upsert warn:', error.message)
      return NextResponse.json({ ok: false, warn: error.message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[nextra-ai/session] Error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Nextra AI Session API v1.0' })
}
