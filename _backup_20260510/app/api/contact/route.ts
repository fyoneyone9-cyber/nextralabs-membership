import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CATEGORY_LABELS: Record<string, string> = {
  general: '一般的なお問い合わせ',
  tool: 'ツールについて',
  billing: 'お支払い・料金について',
  bug: '不具合の報告',
  feature: '機能のリクエスト',
  partnership: '提携・コラボのご提案',
  other: 'その他',
}

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

async function sendNotificationEmail(name: string, email: string, category: string, message: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.log('RESEND_API_KEY not set, skipping email notification')
    return
  }

  const categoryLabel = CATEGORY_LABELS[category] || category
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #f97316); padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">📩 新規お問い合わせ — NextraLabs</h1>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px;">お名前</td>
            <td style="padding: 8px 0; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">メール</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">種別</td>
            <td style="padding: 8px 0;">${categoryLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">受付日時</td>
            <td style="padding: 8px 0;">${now}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <h3 style="margin: 0 0 8px 0; color: #374151;">お問い合わせ内容</h3>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; white-space: pre-wrap; line-height: 1.6;">
${message}
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          このメールは NextraLabs お問い合わせフォームから自動送信されています。<br />
          <a href="mailto:${email}">返信する</a> |
          <a href="https://membership-site-nextralabos.vercel.app/admin">管理画面</a>
        </p>
      </div>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NextraLabs <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `【NextraLabs】新規お問い合わせ: ${categoryLabel} — ${name}`,
        html,
        reply_to: email,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend email error:', err)
    } else {
      console.log('Notification email sent to', ADMIN_EMAIL)
    }
  } catch (err) {
    console.error('Failed to send notification email:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, category, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'すべての必須項目を入力してください。' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '有効なメールアドレスを入力してください。' }, { status: 400 })
    }

    // Save to Supabase
    const { error } = await supabaseAdmin.from('contacts').insert({
      name: name.trim(),
      email: email.trim(),
      category: category || 'general',
      category_label: CATEGORY_LABELS[category] || category,
      message: message.trim(),
      status: 'new',
    })

    if (error) {
      console.error('Contact save error:', error)
      if (error.code !== '42P01') {
        return NextResponse.json({ error: '送信に失敗しました。' }, { status: 500 })
      }
    }

    // Send email notification
    await sendNotificationEmail(name.trim(), email.trim(), category || 'general', message.trim())

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: '送信に失敗しました。' }, { status: 500 })
  }
}
