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

  // 期間内の全ページビューを取得（referrer・countryも含む）
  const { data, error } = await adminSupabase
    .from('page_views')
    .select('path, created_at, referrer, country')
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

  // 流入元（referrer）集計
  // ※ referer=null は「新規流入（直接アクセス or 初回訪問）」として別カウント
  // ※ referer=自サイト は「サイト内回遊（同一セッション内ページ遷移）」としてスキップ（集計から除外）
  let newVisits = 0  // referer なし = 新規流入
  const referrerCounts: Record<string, number> = {}
  for (const row of data || []) {
    const ref = row.referrer
    if (!ref) {
      // refererなし = 直接アクセスまたは新規流入（ブックマーク・URL直打ち含む）
      newVisits++
    } else {
      try {
        const url = new URL(ref)
        if (
          url.hostname.includes('nextralabs') ||
          url.hostname.includes('membership-site') ||
          url.hostname.includes('nextralab')
        ) {
          // 自サイト内遷移はスキップ（同一セッションの回遊なので流入元には含めない）
        } else {
          const domain = url.hostname.replace(/^www\./, '')
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1
        }
      } catch {
        referrerCounts['(不明)'] = (referrerCounts['(不明)'] || 0) + 1
      }
    }
  }
  // 新規流入を先頭に追加
  if (newVisits > 0) {
    referrerCounts['(新規流入・直接アクセス)'] = newVisits
  }

  const referrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([source, count]) => ({ source, count }))

  // 国別集計
  const countryCounts: Record<string, number> = {}
  for (const row of data || []) {
    const c = row.country || '不明'
    countryCounts[c] = (countryCounts[c] || 0) + 1
  }

  const countries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }))

  const total = (data || []).length

  return NextResponse.json({ pages: sorted, daily, total, days, referrers, countries })
}
