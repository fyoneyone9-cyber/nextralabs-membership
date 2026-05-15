﻿'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Star, Building2, TrendingUp, Share2, ShieldCheck, Youtube,
  User, Sofa, Briefcase, Shield, HeartHandshake, BookOpen, Mail, Search, AlertTriangle,
  ShoppingCart, Scissors, MessageCircle, LogOut, Camera, Pen, BarChart2,
  Home, TreePine, Ticket, DollarSign, Map, FileText, Brain,
  Crown, Zap, Lock, ChevronRight, Settings, Activity, History, Clock, Repeat, MousePointer2,
  Network, Calendar, UserPlus, LineChart, Archive, Utensils, Wallet
} from 'lucide-react'
import DashboardActivity from '@/components/dashboard/DashboardActivity'
import SalesMailPanel from '@/components/dashboard/SalesMailPanel'
import { DebugPanel } from '@/components/tools/DebugPanel'
function PWAInstallCard() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [isInstallable, setIsInstallable] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    })
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
  }

  if (isInstalled) return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
      <CheckCircle size={16} className="text-emerald-400" />
      <div>
        <p className="text-emerald-300 text-xs font-semibold">アプリインストール済み</p>
        <p className="text-slate-500 text-[10px] mt-0.5">ホーム画面から起動できます</p>
      </div>
    </div>
  )

  return (
    <div className="bg-[#0d0f1a] border border-emerald-500/20 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Smartphone size={14} className="text-emerald-400" />
        <p className="text-xs font-semibold text-white">アプリとしてインストール</p>
      </div>
      <p className="text-slate-500 text-[11px] leading-relaxed">
        ホーム画面に追加してアプリ感覚で使えます。
      </p>
      {isInstallable ? (
        <button
          onClick={handleInstall}
          className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Download size={13} /> ホーム画面に追加
        </button>
      ) : (
        <p className="text-slate-600 text-[10px]">Chrome推奨。メニュー→「ホーム画面に追加」</p>
      )}
    </div>
  )
}

const PLAN_META = {
  premium:  { label: 'プレミアム', color: 'from-emerald-500 to-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Crown },
  standard: { label: 'スタンダード', color: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Zap },
  light:    { label: 'ライト', color: 'from-emerald-500 to-emerald-500', text: 'text-blue-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-blue-400 border-emerald-500/30', icon: Zap },
  free:     { label: '無料', color: 'from-slate-600 to-slate-700', text: 'text-slate-400', border: 'border-slate-500/40', badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: User },
}

const TOOL_CATEGORIES = [
  {
    label: 'プレミアム・マスタ',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    tools: [
      { id: 'nextra-ai',            name: 'Nextra AI (総合ホテルDX)', icon: Building2,    color: 'text-emerald-500', plan: 'premium' },
      { id: 'inbox-organizer',      name: 'Gmail AI Accelerator',    icon: Mail,         color: 'text-blue-400',    plan: 'premium' },
      { id: 'youtube-producer',     name: 'AI YouTubeプロデューサー', icon: Youtube,      color: 'text-red-500',     plan: 'premium', hasVideo: true },
      { id: 'ai-sidejob',           name: 'AI副業スタートダッシュ',   icon: Briefcase,    color: 'text-emerald-400',  plan: 'premium' },
      { id: 'ai-select-shop',       name: 'AIセレクトショップ',       icon: ShoppingCart, color: 'text-pink-400',    plan: 'premium', hasVideo: true },
      { id: 'ai-exam-generator',    name: 'AI問題生成 & 苦手分析',    icon: Brain,        color: 'text-emerald-400',  plan: 'premium' },

      { id: 'scam-defender',         name: 'AI詐欺ディフェンダー',       icon: ShieldCheck,   color: 'text-red-400',     plan: 'premium' },
    ]
  },
  {
    label: 'スタンダード',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    tools: [
      { id: 'money-guard',           name: 'AI家計防衛シミュレーター',   icon: Wallet,         color: 'text-emerald-500',   plan: 'standard' },
      { id: 'disaster-guard',        name: 'AI防災パーソナルガイド',     icon: Shield,         color: 'text-red-400',     plan: 'standard' },
      { id: 'exam-scheduler',        name: 'AI試験スケジューラー',       icon: Calendar,       color: 'text-emerald-400',  plan: 'standard' },
      { id: 'buzz-writer',           name: 'AIバズ文章コーチ',           icon: Pen,            color: 'text-emerald-400', plan: 'standard' },
      { id: 'comm-coach',            name: 'AIコミュニケーション改善',   icon: MessageCircle,  color: 'text-blue-400',    plan: 'standard' },
      { id: 'resignation-assistant', name: '退職あんしんAI',             icon: LogOut,         color: 'text-slate-400',   plan: 'standard' },

      { id: 'kdp-guide',             name: 'Kindle KDP 攻略ナビ',       icon: BookOpen,       color: 'text-emerald-300',   plan: 'standard' },
    ]
  },
  {
    label: 'ライト・無料',
    color: 'text-blue-400',
    borderColor: 'border-emerald-500/30',
    tools: [
      { id: 'universal-converter', name: '究極AIマルチコンバーター',  icon: Repeat,       color: 'text-emerald-400', plan: 'light' },

      { id: 'moving-checker',        name: 'AI引越し安心チェッカー', icon: Home,         color: 'text-teal-400',    plan: 'free' },
      { id: 'ai-recipe',            name: 'AIレシピ献立コーチ',       icon: Utensils,     color: 'text-emerald-400',  plan: 'free' },


    ]
  },
]

const PLAN_ORDER = { premium: 0, standard: 1, light: 2, free: 3 }

function hasAccess(userPlan: string, toolPlan: string): boolean {
  return PLAN_ORDER[userPlan as keyof typeof PLAN_ORDER] <= PLAN_ORDER[toolPlan as keyof typeof PLAN_ORDER]
}


export default function DashboardClient({ user, profile, subscription }: any) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'accessible' | 'sales'>('all')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return
    try {
      const { data } = await supabase.from('user_favorites').select('tool_id').eq('user_id', user.id)
      if (data) setFavorites(data.map((r: any) => r.tool_id))
    } catch (e) { console.error(e) }
  }, [user?.id, supabase])

  useEffect(() => {
    setMounted(true)
    loadFavorites()
  }, [loadFavorites])

  if (!mounted) return null

  const plan = (subscription?.plan || 'free') as keyof typeof PLAN_META
  const meta = PLAN_META[plan] || PLAN_META.free
  const PlanIcon = meta.icon
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'ゲスト'
  const isAdmin = profile?.role === 'admin'

  const allTools = TOOL_CATEGORIES.flatMap(c => c.tools)
  const accessibleCount = allTools.filter(t => hasAccess(plan, t.plan)).length
  const favCount = favorites.length

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans pb-32 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 space-y-10">
        
        {/* 会員ステータスカード（本物化・巨大フォント） */}
        <div className={`relative overflow-hidden rounded-[3rem] border-4 ${meta.border} bg-[#0d0e17] p-10 md:p-16 shadow-[0_0_50px_rgba(16,185,129,0.1)]`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-10 pointer-events-none`} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <Link href="/dashboard/profile">
                <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-2xl hover:scale-105 transition-transform overflow-hidden border-2 border-white/10`}>
                  {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <PlanIcon size={44} className="text-white" />}
                </div>
              </Link>
              <div className="text-left">
                <p className="text-emerald-400 text-[11px] font-medium tracking-tight uppercase mb-2">Welcome</p>
                <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-[1.1]">{displayName} <span className="text-lg md:text-xl text-slate-500 font-normal">さん</span></h1>
                <p className="text-slate-500 text-sm font-normal mt-2 font-mono">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge className={`text-sm font-medium px-6 py-2 rounded-full border ${meta.badge} shadow-lg`}>{meta.label}プラン</Badge>
              <p className="text-slate-600 text-[10px] font-medium tracking-tight uppercase">Plan</p>
            </div>
            <div className="flex gap-10">
              <div className="text-center"><p className="text-4xl font-semibold text-white">{accessibleCount}</p><p className="text-slate-500 text-[10px] font-medium tracking-tight uppercase mt-1">利用可能</p></div>
              <div className="text-center"><p className="text-4xl font-semibold text-emerald-400">{favCount}</p><p className="text-slate-500 text-[10px] font-medium tracking-tight uppercase mt-1">お気に入り</p></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* タブ */}
            <div className="flex gap-4 border-b border-white/5">
              {[{ key: 'all', label: '全ツール' }, { key: 'accessible', label: '利用可能' }, { key: 'favorites', label: 'お気に入り' }, ...(isAdmin ? [{ key: 'sales', label: '📧 営業メール' }] : [])].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab.key ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 営業メールパネル（admin専用） */}
            {activeTab === 'sales' && isAdmin && <SalesMailPanel />}

            {/* ツール一覧（本物化・日本語化） */}
            {activeTab !== 'sales' && TOOL_CATEGORIES.map(cat => {
              let tools = cat.tools
              if (activeTab === 'accessible') tools = tools.filter(t => hasAccess(plan, t.plan))
              if (activeTab === 'favorites') tools = tools.filter(t => favorites.includes(t.id))
              if (tools.length === 0) return null
              return (
                <div key={cat.label} className="space-y-6 text-left">
                  <div className={`flex items-center gap-3 border-l-4 ${cat.borderColor} pl-4`}>
                    <h2 className={`font-semibold text-lg tracking-tight ${cat.color}`}>{cat.label}</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tools.map(tool => {
                      const locked = !hasAccess(plan, tool.plan)
                      const Icon = tool.icon
                      return (
                        <div key={tool.id} className={`group relative rounded-xl border transition-all ${locked ? 'bg-black/30 border-white/5 opacity-40' : 'bg-[#13141f] border-white/8 hover:border-emerald-500/30 hover:shadow-[0_0_16px_rgba(16,185,129,0.1)] hover:scale-[1.02]'}`}>
                          <Link href={locked ? '/pricing' : `/products/${tool.id}/app`} className="flex flex-col items-start gap-3 p-5">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 ${tool.color}`}>{locked ? <Lock size={18} /> : <Icon size={18} />}</div>
                            <div className="space-y-1">
                               <p className={`text-sm font-medium leading-tight ${locked ? 'text-slate-600' : 'text-white'}`}>{tool.name}</p>
                               <p className="text-[10px] text-slate-500">{locked ? 'アップグレードが必要' : '起動する →'}</p>
                            </div>
                          </Link>
                          {(tool as any).hasVideo && !locked && (
                            <a
                              href={tool.id === 'youtube-producer' ? '/products/youtube-producer#demo' : tool.id === 'ai-select-shop' ? 'https://www.youtube.com/watch?v=frDeVaGoqZ4' : '#'}
                              target={tool.id === 'youtube-producer' ? '_self' : '_blank'}
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
                              title="紹介動画を見る"
                            >
                              <Youtube size={12} className="text-red-400" />
                              <span className="text-[10px] text-red-400 font-medium">動画</span>
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 右サイドバー：活動ログ & ライブステータス */}
          <div className="lg:col-span-1 space-y-6">
            <DashboardActivity />

            {/* 管理者専用ツール（adminのみ表示） */}
            {isAdmin && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">🔧 Admin Tools</p>
                <Link
                  href="/mobile-preview"
                  className="flex items-center gap-3 rounded-xl bg-[#0d1117] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all px-4 py-3 group"
                >
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">スマホプレビュー</p>
                    <p className="text-[11px] text-slate-500">各ページをデバイス別に確認</p>
                  </div>
                </Link>

                {/* PR動画ナレーター */}
                <Link
                  href="/pr-video-narrator"
                  className="flex items-center gap-3 rounded-xl bg-[#0d1117] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all px-4 py-3 group"
                >
                  <span className="text-lg">🎬</span>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">PR動画ナレーター</p>
                    <p className="text-[11px] text-slate-500">OpenClawに動画パスを送るだけで自動ナレーション合成</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 復活：デバッグパネル */}
      <DebugPanel data={{ status: "MASTERMODEL", user_id: user?.id }} toolId="dashboard-core" />
    </div>
  )
}
