import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-email') !== ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, message: '権限がありません' }, { status: 403 })
  }

  // リンク別集計
  const { data: byLink, error } = await supabase
    .from('affiliate_clicks')
    .select('link_id, label, tool_id, clicked_at')
    .order('clicked_at', { ascending: false })

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

  // 集計処理
  const summary: Record<string, { linkId: string; label: string; toolId: string; count: number; lastClick: string }> = {}
  for (const row of byLink ?? []) {
    if (!summary[row.link_id]) {
      summary[row.link_id] = { linkId: row.link_id, label: row.label, toolId: row.tool_id, count: 0, lastClick: row.clicked_at }
    }
    summary[row.link_id].count++
  }

  const result = Object.values(summary).sort((a, b) => b.count - a.count)
  const total  = result.reduce((s, r) => s + r.count, 0)

  return NextResponse.json({ ok: true, total, data: result })
}
