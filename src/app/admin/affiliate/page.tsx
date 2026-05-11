'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { ShoppingCart, TrendingUp, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react'

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

interface StatRow { linkId: string; label: string; toolId: string; count: number; lastClick: string }

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'たった今'
  if (m < 60) return `${m}分前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}時間前`
  return `${Math.floor(h / 24)}日前`
}

export default function AffiliateStatsPage() {
  const [stats, setStats]     = useState<StatRow[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed]   = useState(false)
  const [email, setEmail]     = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === ADMIN_EMAIL) {
        setAuthed(true)
        setEmail(user.email)
        load(user.email)
      } else {
        setLoading(false)
      }
    })
  }, [])

  const load = async (adminEmail: string) => {
    setLoading(true)
    const res  = await fetch('/api/track/stats', { headers: { 'x-admin-email': adminEmail } })
    const data = await res.json()
    if (data.ok) { setStats(data.data); setTotal(data.total) }
    setLoading(false)
  }

  if (!authed && !loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <p className="text-slate-500 text-sm">管理者専用ページです</p>
      </div>
    )
  }

  // 今日・今週のクリック数
  const now   = new Date()
  const today = stats.reduce((s, r) => {
    const d = new Date(r.lastClick)
    return d.toDateString() === now.toDateString() ? s + r.count : s
  }, 0)

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-20">
      {/* ヘッダー */}
      <div className="border-b border-white/5 bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-slate-600 hover:text-slate-400 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <ShoppingCart size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-white">アフィリエイト クリック集計</span>
          </div>
          <button onClick={() => load(email)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
            <RefreshCw size={12} /> 更新
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* サマリーカード */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: '累計クリック', value: total, icon: ShoppingCart, color: 'text-emerald-400' },
            { label: '今日のクリック', value: today, icon: TrendingUp, color: 'text-sky-400' },
            { label: '計測リンク数', value: stats.length, icon: ExternalLink, color: 'text-amber-400' },
          ].map((c, i) => (
            <div key={i} className="bg-[#0d1117] border border-white/5 rounded-2xl p-5 space-y-1">
              <div className="flex items-center gap-2">
                <c.icon size={13} className={c.color} />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{c.label}</span>
              </div>
              <p className={`text-2xl font-bold ${c.color}`}>{loading ? '—' : c.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* テーブル */}
        <div className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-600 text-xs">読み込み中...</div>
          ) : stats.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <ShoppingCart size={28} className="text-slate-700 mx-auto" />
              <p className="text-slate-600 text-xs">まだクリックデータがありません</p>
              <p className="text-slate-700 text-[10px]">ツールページにAffiliateBannerを追加すると計測が始まります</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">リンク名</th>
                    <th className="px-5 py-3">ツール</th>
                    <th className="px-5 py-3 text-center">クリック数</th>
                    <th className="px-5 py-3">最終クリック</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.map((s, i) => (
                    <tr key={s.linkId} className="hover:bg-white/5 transition-all">
                      <td className="px-5 py-3 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">1位</span>}
                          {s.label}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 font-mono text-[10px]">{s.toolId}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-emerald-400 font-bold text-sm">{s.count}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{timeAgo(s.lastClick)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-5 py-3 border-t border-white/5">
            <p className="text-[10px] text-slate-700">累計 {total} クリック / {stats.length} リンク</p>
          </div>
        </div>
      </div>
    </div>
  )
}
