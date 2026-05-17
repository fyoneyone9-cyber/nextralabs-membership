import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL || 'NextraLabs <newsletter@nextralabs.jp>'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''

export async function POST(req: NextRequest) {
  // 管理者チェック
  if (req.headers.get('x-admin-email') !== ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, message: '権限がありません' }, { status: 403 })
  }

  if (!RESEND_API_KEY || RESEND_API_KEY === 'REPLACE_ME') {
    return NextResponse.json({ ok: false, message: 'RESEND_API_KEY が未設定です。.env.local に追加してください。' }, { status: 500 })
  }

  const { subject, body, tagFilter } = await req.json()

  if (!subject || !body) {
    return NextResponse.json({ ok: false, message: 'subject と body は必須です' }, { status: 400 })
  }

  // 読者取得
  let query = supabase
    .from('newsletter_subscribers')
    .select('id, email, name')
    .eq('status', 'active')

  if (tagFilter) query = query.contains('tags', [tagFilter])

  const { data: subscribers, error: fetchError } = await query
  if (fetchError) return NextResponse.json({ ok: false, message: fetchError.message }, { status: 500 })
  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ ok: false, message: '配信対象の読者が0件です' }, { status: 400 })
  }

  const resend = new Resend(RESEND_API_KEY)

  let sentCount = 0
  let failedCount = 0

  // バッチ送信（Resend無料枠: 1リクエスト/秒 → 少し待機）
  for (const sub of subscribers) {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}`
    const personalizedBody = body.replace(/\{\{name\}\}/g, sub.name || 'ゲスト')
    const textWithFooter = `${personalizedBody}

──────────────────────────
NextraLabs メルマガ
配信停止はこちら: ${unsubscribeUrl}
`

    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: sub.email,
        subject,
        text: textWithFooter,
      })
      if (error) {
        console.error(`[send] failed for ${sub.email}:`, error)
        failedCount++
      } else {
        sentCount++
      }
    } catch (e) {
      console.error(`[send] exception for ${sub.email}:`, e)
      failedCount++
    }

    // レート制限対策: 200ms 待機
    await new Promise(r => setTimeout(r, 200))
  }

  // 送信履歴を保存
  await getSupabase().from('newsletter_campaigns').insert({
    subject,
    body,
    tag_filter: tagFilter || null,
    sent_count: sentCount,
    failed_count: failedCount,
    status: failedCount === 0 ? 'sent' : sentCount === 0 ? 'failed' : 'partial',
    sent_at: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: `配信完了 — 成功: ${sentCount}件 / 失敗: ${failedCount}件`,
    sentCount,
    failedCount,
  })
}
