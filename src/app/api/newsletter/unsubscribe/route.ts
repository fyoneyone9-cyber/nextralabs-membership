import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ ok: false, message: 'メールアドレスが必要です' }, { status: 400 })

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim())

    if (error) throw error

    return NextResponse.json({ ok: true, message: '配信停止しました。今までありがとうございました。' })
  } catch (e: any) {
    console.error('[newsletter/unsubscribe]', e)
    return NextResponse.json({ ok: false, message: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
