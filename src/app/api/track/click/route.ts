import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/track/click?id=ai-recipe-cooking&tool=ai-recipe&label=🍳調理器具&url=https://...
// → クリックを記録してAmazonへリダイレクト
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const linkId = searchParams.get('id')
  const toolId = searchParams.get('tool')
  const label  = searchParams.get('label') || ''
  const url    = searchParams.get('url')

  // urlがない or Amazon以外はリジェクト
  if (!url || !url.includes('amazon.co.jp')) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  // 非同期で記録（失敗してもリダイレクトは止めない）
  if (linkId && toolId) {
    getSupabase().from('affiliate_clicks').insert({
      link_id:    linkId,
      tool_id:    toolId,
      label:      decodeURIComponent(label),
      url,
      clicked_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.error('[track/click]', error)
    })
  }

  // Amazonへリダイレクト
  return NextResponse.redirect(decodeURIComponent(url), { status: 302 })
}
