import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const { email, name, tags } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, message: '有効なメールアドレスを入力してください' }, { status: 400 })
    }

    // upsert — 既存メアドは updated_at だけ更新して重複エラーを防ぐ
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
          tags: tags || [],
          status: 'active',
          source: 'web',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (error) throw error

    return NextResponse.json({ ok: true, message: '登録完了！NextraLabsからのお知らせをお楽しみに 🎉' })
  } catch (e: any) {
    console.error('[newsletter/subscribe]', e)
    return NextResponse.json({ ok: false, message: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
