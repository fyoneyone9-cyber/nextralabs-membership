import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

// service_role で直書き（RLSをバイパスして確実にINSERT）
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// bot判定（UA文字列チェック）
function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|lighthouse|prerender|vercel|checker/i.test(ua)
}

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // service_role でクライアント生成（ハンドラ内で遅延初期化 → ビルド時エラー回避）
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { path } = await req.json()
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') || ''
    if (isBot(ua)) {
      return NextResponse.json({ ok: true, skipped: 'bot' })
    }

    // /api/* や /_next/* は記録しない
    if (path.startsWith('/api/') || path.startsWith('/_next/')) {
      return NextResponse.json({ ok: true, skipped: 'internal' })
    }

    const country = req.headers.get('x-vercel-ip-country') || null
    const referrer = req.headers.get('referer') || null

    const { error } = await getSupabase().from('page_views').insert({
      path,
      referrer,
      user_agent: ua.slice(0, 200),
      country,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[pageview]', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
