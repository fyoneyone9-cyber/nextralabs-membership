'use client'
import { useEffect, useState } from 'react'
import { MousePointer2, TrendingUp, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PageStat {
  path: string
  count: number
}

interface DailyStat {
  date: string
  count: number
}

interface AnalyticsData {
  pages: PageStat[]
  daily: DailyStat[]
  total: number
  days: number
}

const PATH_LABELS: Record<string, string> = {
  '/': 'トップページ',
  '/products': 'ツールストア',
  '/pricing': '料金プラン',
  '/dashboard': 'ダッシュボード',
  '/login': 'ログイン',
  '/contact': 'お問い合わせ',
}

function getLabel(path: string) {
  if (PATH_LABELS[path]) return PATH_LABELS[path]
  // /products/xxx/app → ツール名として表示
  const m = path.match(/^\/products\/([^/]+)/)
  if (m) return `🔧 ${m[1]}`
  return path
}

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [error, setError] = useState<string | null>(null)

  const load = async (d: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics?days=${d}`)
      if (!res.ok) throw new Error(await res.text())
      setData(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(days) }, [days])

  const maxCount = data?.pages?.[0]?.count || 1

  return (
    <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
      <CardHeader className="p-0 border-b border-white/5 mb-6 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            <MousePointer2 className="h-6 w-6 text-emerald-400" />
            アクセス解析
            <span className="text-xs font-normal text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">本物データ</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {[7, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                  days === d
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {d}日
              </button>
            ))}
            <button
              onClick={() => load(days)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* 合計PV */}
        {data && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm text-slate-400">過去{days}日間の総PV</span>
            <span className="ml-auto text-2xl font-bold text-white">{data.total.toLocaleString()}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-500 text-sm gap-2">
            <RefreshCw size={14} className="animate-spin" />
            読み込み中...
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            エラー: {error}
          </div>
        )}

        {!loading && data && data.total === 0 && (
          <div className="text-center py-12 text-slate-600 text-sm">
            <p>まだデータがありません。</p>
            <p className="text-xs mt-1 text-slate-700">ページが訪問されると自動で記録されます。</p>
          </div>
        )}

        {/* ページ別ランキング */}
        {!loading && data && data.pages.length > 0 && (
          <div className="space-y-3">
            {data.pages.map((pv, i) => (
              <div key={pv.path}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 w-4">{i + 1}</span>
                    <span className="text-sm font-semibold text-slate-300 truncate max-w-[200px]" title={pv.path}>
                      {getLabel(pv.path)}
                    </span>
                    <span className="text-[10px] text-slate-600 hidden md:block">{pv.path}</span>
                  </div>
                  <span className="text-sm font-bold text-white shrink-0">{pv.count.toLocaleString()} PV</span>
                </div>
                {/* バー */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((pv.count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 日別グラフ（シンプルバー） */}
        {!loading && data && data.daily.length > 1 && (
          <div className="pt-4 border-t border-white/5">
            <p className="text-xs font-semibold text-slate-500 mb-3">日別推移</p>
            <div className="flex items-end gap-0.5 h-16">
              {data.daily.slice(-30).map((d, i) => {
                const maxDay = Math.max(...data.daily.map(x => x.count), 1)
                const h = Math.max(4, Math.round((d.count / maxDay) * 64))
                return (
                  <div key={i} className="flex-1 group relative">
                    <div
                      className="bg-emerald-500/40 hover:bg-emerald-500 rounded-sm transition-all"
                      style={{ height: `${h}px` }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                      {d.date}: {d.count}PV
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
