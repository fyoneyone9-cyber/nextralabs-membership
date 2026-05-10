'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import {
  Activity, Clock, History, Cpu, Repeat, Zap, ChevronRight, Users, Crown, TrendingUp, BarChart2, Shield
} from 'lucide-react'
import Link from 'next/link'

const TOOL_NAMES: Record<string, string> = {
  'universal-converter': '究極AIマルチコンバーター',
  'staysee-ai-finder': 'Nextra AI（ホテルDX）',
  'youtube-producer': 'AI YouTubeプロデューサー',
  'inbox-organizer': 'Gmail AI Accelerator',
  'disaster-guard': 'AI防災パーソナルガイド',
  'money-guard': 'AI家計防衛シミュレーター',
  'kdp-guide': 'Kindle出版実況ナビ',
  'loan-advisor': '借金完済・おまとめ診断',
  'ai-exam-generator': 'AI試験対策ジェネレーター',
  'buy-smart-nav': 'Buy Smart Nav',

  'contact-sync': 'Contact Sync',
  'expense-sync': 'Expense Sync',
  'interior-sync': 'Interior Sync',
  'youtube-sync': 'YouTube Sync',
  'kindle-factory': 'KindleFactory',
  'ai-side-hustle': 'AI副業スタートダッシュ',
}

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:     { label: '無料',      color: '#64748b' },
  light:    { label: 'ライト',   color: '#38bdf8' },
  standard: { label: 'スタンダード', color: '#10b981' },
  premium:  { label: 'プレミアム',  color: '#f59e0b' },
}

export default function DashboardActivity() {
  const supabase = createClient()
  const [activities, setActivities] = useState<any[]>([])
  const [totalUsage, setTotalUsage] = useState(0)
  const [todayUsage, setTodayUsage] = useState(0)
  const [toolBreakdown, setToolBreakdown] = useState<{ tool_id: string; count: number }[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminStats, setAdminStats] = useState<{
    totalUsers: number
    premiumUsers: number
    totalCalls: number
    planBreakdown: { plan: string; count: number }[]
    topTools: { tool_id: string; count: number }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
      const admin = prof?.role === 'admin'
      setIsAdmin(admin)

      // 最新5件
      const { data: acts } = await supabase
        .from('api_usage').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(5)
      setActivities(acts || [])

      // 累計
      const { count: total } = await supabase
        .from('api_usage').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      setTotalUsage(total || 0)

      // 今日
      const today = new Date().toISOString().slice(0, 10)
      const { count: todayCount } = await supabase
        .from('api_usage').select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).gte('created_at', today)
      setTodayUsage(todayCount || 0)

      // ツール別内訳（自分）
      const { data: allUsage } = await supabase
        .from('api_usage').select('tool_id').eq('user_id', user.id)
      if (allUsage) {
        const counts: Record<string, number> = {}
        allUsage.forEach(r => { counts[r.tool_id] = (counts[r.tool_id] || 0) + 1 })
        const sorted = Object.entries(counts)
          .map(([tool_id, count]) => ({ tool_id, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
        setToolBreakdown(sorted)
      }

      // 管理者統計
      if (admin) {
        const { count: allUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const { count: premiumUsers } = await supabase
          .from('subscriptions').select('*', { count: 'exact', head: true })
          .eq('status', 'active').neq('plan', 'free')
        const { count: allCalls } = await supabase.from('api_usage').select('*', { count: 'exact', head: true })

        // プラン別内訳
        const { data: subs } = await supabase.from('subscriptions').select('plan').eq('status', 'active')
        const planCounts: Record<string, number> = { free: 0, light: 0, standard: 0, premium: 0 }
        if (subs) subs.forEach(s => { planCounts[s.plan] = (planCounts[s.plan] || 0) + 1 })
        const planBreakdown = Object.entries(planCounts).map(([plan, count]) => ({ plan, count }))

        // ツール別全体Top5
        const { data: allToolUsage } = await supabase.from('api_usage').select('tool_id')
        const toolCounts: Record<string, number> = {}
        if (allToolUsage) allToolUsage.forEach(r => { toolCounts[r.tool_id] = (toolCounts[r.tool_id] || 0) + 1 })
        const topTools = Object.entries(toolCounts)
          .map(([tool_id, count]) => ({ tool_id, count }))
          .sort((a, b) => b.count - a.count).slice(0, 5)

        setAdminStats({
          totalUsers: allUsers || 0,
          premiumUsers: premiumUsers || 0,
          totalCalls: allCalls || 0,
          planBreakdown,
          topTools,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}
    </div>
  )

  const maxToolCount = toolBreakdown[0]?.count || 1
  const adminMaxCount = adminStats?.topTools[0]?.count || 1

  return (
    <div className="space-y-5">

      {/* ━━━ 管理者専用パネル ━━━ */}
      {isAdmin && adminStats && (
        <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
          {/* ヘッダーバー */}
          <div className="bg-emerald-950/60 px-5 py-3 flex items-center justify-between border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 tracking-tight uppercase">Admin Console</span>
            </div>
            <Badge className="bg-emerald-500 text-slate-950 text-[9px] font-bold px-2 py-0.5">ADMIN</Badge>
          </div>

          <div className="bg-[#080f10] p-5 space-y-5">
            {/* KPIグリッド */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '総会員数', value: adminStats.totalUsers.toLocaleString(), unit: '人', color: 'text-white' },
                { label: '有料会員', value: adminStats.premiumUsers.toLocaleString(), unit: '人', color: 'text-emerald-400' },
                { label: '総API呼出', value: adminStats.totalCalls.toLocaleString(), unit: '回', color: 'text-white' },
              ].map(k => (
                <div key={k.label} className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-semibold text-slate-500 mb-1">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                  <p className="text-[9px] text-slate-600">{k.unit}</p>
                </div>
              ))}
            </div>

            {/* プラン別内訳 */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">プラン別会員内訳</p>
              <div className="grid grid-cols-2 gap-2">
                {adminStats.planBreakdown.map(p => {
                  const meta = PLAN_LABELS[p.plan] || { label: p.plan, color: '#64748b' }
                  return (
                    <div key={p.plan} className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs text-slate-400 font-semibold">{meta.label}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{p.count}<span className="text-[9px] text-slate-600 ml-0.5">人</span></span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ツール別利用Top5（全体） */}
            {adminStats.topTools.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">人気ツール Top5（全会員）</p>
                {adminStats.topTools.map((t, i) => {
                  const pct = Math.round((t.count / adminMaxCount) * 100)
                  const name = TOOL_NAMES[t.tool_id] || t.tool_id.replace(/-/g, ' ')
                  return (
                    <div key={t.tool_id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-600 w-3">{i + 1}</span>
                          <span className="text-[10px] font-semibold text-slate-300 truncate max-w-[140px]">{name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">{t.count}回</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <Link href="/admin"
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 rounded-xl text-xs font-semibold text-emerald-400 transition-all">
              管理者画面を開く →
            </Link>
          </div>
        </div>
      )}

      {/* ━━━ 自分の利用状況 ━━━ */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-white">AI利用状況</p>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] ml-auto">稼働中</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[9px] font-semibold text-slate-500 mb-1">累計利用</p>
            <p className="text-2xl font-bold text-white">{totalUsage}<span className="text-xs text-slate-600 ml-0.5">回</span></p>
          </div>
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[9px] font-semibold text-slate-500 mb-1">今日</p>
            <p className="text-2xl font-bold text-emerald-400">{todayUsage}<span className="text-xs text-slate-600 ml-0.5">回</span></p>
          </div>
        </div>

        {/* ツール別内訳 */}
        {toolBreakdown.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <BarChart2 size={11} className="text-slate-500" />
              <p className="text-[10px] font-semibold text-slate-500">ツール別内訳</p>
            </div>
            {toolBreakdown.map(t => {
              const pct = Math.round((t.count / maxToolCount) * 100)
              const name = TOOL_NAMES[t.tool_id] || t.tool_id.replace(/-/g, ' ')
              return (
                <div key={t.tool_id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[160px]">{name}</span>
                    <span className="text-[10px] font-bold text-white">{t.count}回</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ━━━ 最近の利用履歴 ━━━ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={13} className="text-slate-500" />
            <p className="text-xs font-semibold text-slate-500">最近の利用履歴</p>
          </div>
          <Link href="/dashboard/history" className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            すべて見る →
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="bg-[#0d0f1a] border border-dashed border-white/10 rounded-xl p-8 text-center">
            <Zap size={20} className="text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-semibold">まだ利用履歴がありません</p>
            <p className="text-[10px] text-slate-700 mt-1">ツールを使うと記録されます</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((act, i) => {
              const name = TOOL_NAMES[act.tool_id] || act.tool_id?.replace(/-/g, ' ')
              return (
                <div key={i} className="flex items-center gap-3 bg-[#0d0f1a] border border-white/5 hover:border-emerald-500/20 rounded-xl p-3 transition-all group">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0">
                    <Cpu size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{name}</p>
                    <p className="text-[9px] text-slate-600 flex items-center gap-1 mt-0.5">
                      <Clock size={8} />
                      {new Date(act.created_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ChevronRight size={12} className="text-slate-700 group-hover:text-emerald-500 transition-colors shrink-0" />
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
