'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import {
  Activity, Clock, History, Cpu, Repeat, Zap, ChevronRight, Users, Crown, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardActivity() {
  const supabase = createClient()
  const [activities, setActivities] = useState<any[]>([])
  const [totalUsage, setTotalUsage] = useState(0)
  const [todayUsage, setTodayUsage] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminStats, setAdminStats] = useState<{ totalUsers: number; premiumUsers: number; totalCalls: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const toolIcons: Record<string, any> = {
    'universal-converter': Repeat,
    'staysee-ai-finder': Activity,
    'youtube-producer': TrendingUp,
    'default': Cpu,
  }

  const toolNames: Record<string, string> = {
    'universal-converter': '究極AIマルチコンバーター',
    'staysee-ai-finder': 'Nextra AI（ホテルDX）',
    'youtube-producer': 'AI YouTubeプロデューサー',
    'inbox-organizer': 'Gmail AI Accelerator',
    'disaster-guard': 'AI防災パーソナルガイド',
    'money-guard': 'AI家計防衛シミュレーター',
    'kdp-guide': 'Kindle出版実況ナビ',
    'office-politics-graph': '社内政治 相関図',
    'loan-advisor': '借金完済・おまとめ診断',
  }

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // プロフィール・管理者確認
      const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
      const admin = prof?.role === 'admin'
      setIsAdmin(admin)

      // 利用履歴（最新5件）
      const { data: acts } = await supabase
        .from('api_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setActivities(acts || [])

      // 累計利用数
      const { count: total } = await supabase
        .from('api_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setTotalUsage(total || 0)
      setTotalSavings((total || 0) * 5)

      // 今日の利用数
      const today = new Date().toISOString().slice(0, 10)
      const { count: todayCount } = await supabase
        .from('api_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today)
      setTodayUsage(todayCount || 0)

      // 管理者のみ：全体統計
      if (admin) {
        const { count: allUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
        const { count: premiumUsers } = await supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .neq('plan', 'free')
        const { count: allCalls } = await supabase
          .from('api_usage')
          .select('*', { count: 'exact', head: true })
        setAdminStats({
          totalUsers: allUsers || 0,
          premiumUsers: premiumUsers || 0,
          totalCalls: allCalls || 0,
        })
      }

      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="space-y-5">

      {/* 管理者ステータス */}
      {isAdmin && adminStats && (
        <div className="bg-[#0d0f1a] border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={14} className="text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">管理者パネル</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-[9px] font-semibold text-slate-500 mb-1">総会員数</p>
              <p className="text-xl font-black text-white">{adminStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-[9px] font-semibold text-slate-500 mb-1">有料会員</p>
              <p className="text-xl font-black text-emerald-400">{adminStats.premiumUsers.toLocaleString()}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-[9px] font-semibold text-slate-500 mb-1">総API呼出</p>
              <p className="text-xl font-black text-white">{adminStats.totalCalls.toLocaleString()}</p>
            </div>
          </div>
          <Link href="/dms/admin" className="block text-center text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            管理者画面へ →
          </Link>
        </div>
      )}

      {/* 自分の利用状況 */}
      <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-white">AI利用状況</p>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] ml-auto">稼働中</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[9px] font-semibold text-slate-500 mb-1">累計利用</p>
            <p className="text-xl font-black text-white">{totalUsage}</p>
            <p className="text-[9px] text-slate-600">回</p>
          </div>
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[9px] font-semibold text-slate-500 mb-1">今日</p>
            <p className="text-xl font-black text-emerald-400">{todayUsage}</p>
            <p className="text-[9px] text-slate-600">回</p>
          </div>
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[9px] font-semibold text-slate-500 mb-1">節約総額</p>
            <p className="text-lg font-black text-white">¥{totalSavings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 最近の利用履歴 */}
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
              const Icon = toolIcons[act.tool_id] || toolIcons.default
              const name = toolNames[act.tool_id] || act.tool_id?.replace(/-/g, ' ')
              return (
                <div key={i} className="flex items-center gap-3 bg-[#0d0f1a] border border-white/5 hover:border-emerald-500/20 rounded-xl p-3 transition-all group">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0">
                    <Icon size={15} />
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
