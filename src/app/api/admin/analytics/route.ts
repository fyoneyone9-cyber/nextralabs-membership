import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // 管理者のみ
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isOwner = user.email === 'f.yoneyone9@gmail.com'
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
  if (!isOwner && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '30')
  const since = new Date(Date.now() - days * 86400_000).toISOString()

  // 期間内の全ページビューを取得
  const { data, error } = await adminSupabase
    .from('page_views')
    .select('path, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50000)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // パス別集計
  const counts: Record<string, number> = {}
  for (const row of data || []) {
    counts[row.path] = (counts[row.path] || 0) + 1
  }

  // 上位10件にソート
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }))

  // 日別推移（過去30日）
  const dailyCounts: Record<string, number> = {}
  for (const row of data || []) {
    const day = row.created_at.slice(0, 10)
    dailyCounts[day] = (dailyCounts[day] || 0) + 1
  }
  const daily = Object.entries(dailyCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))

  const total = (data || []).length

  return NextResponse.json({ pages: sorted, daily, total, days })
}
