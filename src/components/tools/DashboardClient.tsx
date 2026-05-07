'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Star, Rocket, Building2, TrendingUp, Share2, ShieldCheck, Network, Wallet, Youtube,
  User, Sofa, Briefcase, Shield, HeartHandshake, BookOpen, Mail, Search, AlertTriangle,
  ShoppingCart, Scissors, MessageCircle, LogOut, Camera, Pen, BarChart2,
  Home, TreePine, Ticket, DollarSign, Map, FileText, Brain,
  Crown, Zap, Lock, ChevronRight, Settings, CreditCard, Bell
} from 'lucide-react'

const PLAN_META = {
  premium:  { label: 'プレミアム', color: 'from-amber-500 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Crown },
  standard: { label: 'スタンダード', color: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Zap },
  light:    { label: 'ライト', color: 'from-blue-500 to-indigo-500', text: 'text-blue-400', border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Zap },
  free:     { label: '無料', color: 'from-slate-600 to-slate-700', text: 'text-slate-400', border: 'border-slate-500/40', badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: User },
}

const TOOL_CATEGORIES = [
  {
    label: 'プレミアム',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    tools: [
      { id: 'inbox-organizer',      name: 'Gmail AI Accelerator',    icon: Mail,         color: 'text-blue-400',    plan: 'premium' },
      { id: 'staysee-ai-finder',    name: 'Staysee AI Finder',       icon: Building2,    color: 'text-emerald-500', plan: 'premium' },
      { id: 'youtube-producer',     name: 'AI YouTubeプロデューサー', icon: Youtube,      color: 'text-red-500',     plan: 'premium' },
      { id: 'ai-sidejob',           name: 'AI副業スタートダッシュ',   icon: Briefcase,    color: 'text-indigo-400',  plan: 'premium' },
      { id: 'ai-select-shop',       name: 'AIセレクトショップ',       icon: ShoppingCart, color: 'text-pink-400',    plan: 'premium' },
      { id: 'pet-translator',       name: 'AIペット翻訳モニター',     icon: Camera,       color: 'text-amber-400',   plan: 'premium' },
      { id: 'interior-coordinator', name: 'Interior Sync',           icon: Sofa,         color: 'text-amber-500',   plan: 'premium' },
      { id: 'youtube-coordinator',  name: 'YouTube Sync',            icon: Youtube,      color: 'text-red-400',     plan: 'premium' },
      { id: 'prompt-master',        name: 'AI画像プロンプトマスター', icon: Pen,          color: 'text-violet-400',  plan: 'premium' },
      { id: 'ai-recipe',            name: 'AIレシピスコープ',         icon: Camera,       color: 'text-orange-400',  plan: 'premium' },
      { id: 'ai-report-generator',  name: 'AIレポートジェネレーター', icon: FileText,     color: 'text-blue-300',    plan: 'premium' },
      { id: 'location-finder',      name: 'AI Location Scout',       icon: Map,          color: 'text-teal-400',    plan: 'premium' },
    ]
  },
  {
    label: 'スタンダード',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    tools: [
      { id: 'buy-smart-nav',         name: '中古・新品比較ナビ',         icon: Search,         color: 'text-cyan-400',    plan: 'standard' },
      { id: 'scam-defender',         name: 'AI詐欺ディフェンダー',       icon: Shield,         color: 'text-red-400',     plan: 'standard' },
      { id: 'shopping-stopper',      name: 'AI買い物依存ストッパー',     icon: AlertTriangle,  color: 'text-orange-400',  plan: 'standard' },
      { id: 'closet-coach',          name: 'AIクローゼット断捨離',       icon: Scissors,       color: 'text-pink-400',    plan: 'standard' },
      { id: 'buzz-writer',           name: 'AIバズ文章コーチ',           icon: Pen,            color: 'text-emerald-400', plan: 'standard' },
      { id: 'comm-coach',            name: 'AIコミュニケーション改善',   icon: MessageCircle,  color: 'text-blue-400',    plan: 'standard' },
      { id: 'resignation-assistant', name: '退職あんしんAI',             icon: LogOut,         color: 'text-slate-400',   plan: 'standard' },
      { id: 'ai-konkatsu',           name: 'AI婚活コーチ',               icon: HeartHandshake, color: 'text-rose-400',    plan: 'standard' },
      { id: 'money-guard',           name: 'AI家計防衛シミュレーター',   icon: Wallet,         color: 'text-amber-500',   plan: 'standard' },
      { id: 'shio-taiou',            name: '塩対応AI',                   icon: MessageCircle,  color: 'text-slate-300',   plan: 'standard' },
      { id: 'trend-stock',           name: 'SNSトレンド自動仕入れ',      icon: TrendingUp,     color: 'text-green-400',   plan: 'standard' },
      { id: 'hotel-affiliate',       name: 'ホテルアフィリエイトAI',     icon: Network,        color: 'text-emerald-400', plan: 'standard' },
      { id: 'disaster-guard',        name: 'AI防災パーソナルガイド',     icon: Shield,         color: 'text-red-400',     plan: 'standard' },
      { id: 'exam-scheduler',        name: 'AI試験スケジューラー',       icon: Brain,          color: 'text-purple-400',  plan: 'standard' },
      { id: 'kdp-guide',             name: 'KDPガイド',                  icon: BookOpen,       color: 'text-amber-300',   plan: 'standard' },
      { id: 'smart-gardening',       name: 'AIスマートガーデニング',     icon: TreePine,       color: 'text-green-400',   plan: 'standard' },
      { id: 'ticket-scout',          name: 'AIチケットスカウト',         icon: Ticket,         color: 'text-yellow-400',  plan: 'standard' },
    ]
  },
  {
    label: 'ライト',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    tools: [
      { id: 'expense-sync',       name: 'Expense Sync',        icon: DollarSign, color: 'text-green-400',  plan: 'light' },
      { id: 'contact-sync',       name: 'Contact Sync',        icon: User,       color: 'text-indigo-400', plan: 'light' },
      { id: 'price-tracker',      name: '底値監視予測Bot',      icon: BarChart2,  color: 'text-cyan-400',   plan: 'light' },
      { id: 'sns-auto-poster',    name: 'AI SNSオートポスター', icon: Share2,     color: 'text-rose-500',   plan: 'light' },
      { id: 'kindle-factory',     name: 'Kindle本ファクトリー', icon: BookOpen,   color: 'text-amber-400',  plan: 'light' },
      { id: 'comp-price-monitor', name: '競合AI価格監視',       icon: TrendingUp, color: 'text-blue-500',   plan: 'light' },
    ]
  },
  {
    label: '無料',
    color: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    tools: [
      { id: 'office-politics-graph', name: '社内政治 相関図',      icon: Network,     color: 'text-violet-400',  plan: 'free' },
      { id: 'moving-checker',        name: 'AI引越し安心チェッカー', icon: Home,       color: 'text-teal-400',    plan: 'free' },
      { id: 'evidence-manager',      name: 'エビデンス・マネージャー', icon: ShieldCheck, color: 'text-emerald-400', plan: 'free' },
    ]
  },
]

const PLAN_ORDER = { premium: 0, standard: 1, light: 2, free: 3 }

function hasAccess(userPlan: string, toolPlan: string): boolean {
  return PLAN_ORDER[userPlan] <= PLAN_ORDER[toolPlan]
}

export default function DashboardClient({ user, profile, subscription }: any) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'accessible'>('all')

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('nextra_favorites')
      if (saved) setFavorites(JSON.parse(saved))
    } catch {}
  }, [])

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation()
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('nextra_favorites', JSON.stringify(next))
  }

  if (!mounted) return null

  const plan = (subscription?.plan || 'free') as keyof typeof PLAN_META
  const meta = PLAN_META[plan] || PLAN_META.free
  const PlanIcon = meta.icon
  const displayName = user?.email?.split('@')[0] || 'ゲスト'

  // アクセス可能ツール数
  const allTools = TOOL_CATEGORIES.flatMap(c => c.tools)
  const accessibleCount = allTools.filter(t => hasAccess(plan, t.plan)).length
  const totalCount = allTools.length
  const favCount = favorites.length

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 space-y-10">

        {/* ── 会員ステータスカード ── */}
        <div className={`relative overflow-hidden rounded-[2.5rem] border ${meta.border} bg-[#0d0e17] p-8 md:p-10`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-5 pointer-events-none`} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* 左：ユーザー情報 */}
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg`}>
                <PlanIcon size={28} className="text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">ようこそ</p>
                <h1 className="text-2xl font-black text-white">{displayName} さん</h1>
                <p className="text-slate-400 text-sm font-bold mt-0.5">{user?.email}</p>
              </div>
            </div>
            {/* 中：プラン */}
            <div className="flex flex-col items-start md:items-center gap-1">
              <Badge className={`text-sm font-black px-5 py-1.5 rounded-full border ${meta.badge}`}>
                {meta.label}プラン
              </Badge>
              <p className="text-slate-500 text-xs font-bold">現在のプラン</p>
            </div>
            {/* 右：スタッツ */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-black text-white">{accessibleCount}</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">利用可能</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">{totalCount}</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">総ツール数</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-amber-400">{favCount}</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">お気に入り</p>
              </div>
            </div>
            {/* アップグレードボタン */}
            {plan !== 'premium' && (
              <Link href="/pricing">
                <button className={`h-12 px-6 rounded-xl font-black text-sm uppercase bg-gradient-to-r ${meta.color} text-white shadow-lg hover:opacity-90 transition-all whitespace-nowrap`}>
                  アップグレード ➔
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* ── タブ ── */}
        <div className="flex gap-2 border-b border-white/5 pb-0">
          {([
            { key: 'all', label: `全ツール (${totalCount})` },
            { key: 'accessible', label: `利用可能 (${accessibleCount})` },
            { key: 'favorites', label: `お気に入り (${favCount})` },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-black uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                activeTab === tab.key
                  ? `${meta.text} border-current bg-white/5`
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <Link href="/products" className="self-center text-[11px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-all pr-2">
            ツール一覧 ➔
          </Link>
        </div>

        {/* ── ツール一覧 ── */}
        {TOOL_CATEGORIES.map(cat => {
          let tools = cat.tools
          if (activeTab === 'accessible') tools = tools.filter(t => hasAccess(plan, t.plan))
          if (activeTab === 'favorites') tools = tools.filter(t => favorites.includes(t.id))
          if (tools.length === 0) return null

          return (
            <div key={cat.label} className="space-y-4">
              {/* カテゴリヘッダー */}
              <div className={`flex items-center gap-3 border-l-4 ${cat.borderColor} pl-4`}>
                <h2 className={`font-black text-lg uppercase tracking-wider ${cat.color}`}>{cat.label}</h2>
                <span className="text-slate-600 text-xs font-bold">
                  {tools.filter(t => hasAccess(plan, t.plan)).length}/{tools.length} 利用可能
                </span>
              </div>

              {/* ツールグリッド */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {tools.map(tool => {
                  const locked = !hasAccess(plan, tool.plan)
                  const isFav = favorites.includes(tool.id)
                  const Icon = tool.icon

                  return (
                    <div
                      key={tool.id}
                      className={`group relative rounded-2xl border transition-all ${
                        locked
                          ? 'bg-black/30 border-white/5 opacity-50'
                          : 'bg-[#13141f] border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:scale-[1.02]'
                      }`}
                    >
                      <Link
                        href={locked ? '/pricing' : `/products/${tool.id}/app`}
                        className="flex flex-col items-start gap-3 p-4"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${tool.color}`}>
                          {locked ? <Lock size={18} className="text-slate-600" /> : <Icon size={20} />}
                        </div>
                        <div className="w-full">
                          <p className={`text-xs font-black leading-tight ${locked ? 'text-slate-600' : 'text-white'}`}>
                            {tool.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wide">
                            {locked ? 'アップグレード要' : '起動する →'}
                          </p>
                        </div>
                      </Link>
                      {/* お気に入りボタン */}
                      {!locked && (
                        <button
                          onClick={e => toggleFavorite(e, tool.id)}
                          className={`absolute top-3 right-3 p-1 rounded-lg transition-all ${
                            isFav ? 'text-amber-400 opacity-100' : 'text-slate-700 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                          }`}
                        >
                          <Star size={14} fill={isFav ? 'currentColor' : 'none'} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* お気に入りゼロ時 */}
        {activeTab === 'favorites' && favCount === 0 && (
          <div className="text-center py-20 space-y-3">
            <Star size={40} className="text-slate-700 mx-auto" />
            <p className="text-slate-500 font-bold">お気に入りはまだありません</p>
            <p className="text-slate-600 text-sm">ツールカードの ★ をクリックして追加できます</p>
          </div>
        )}

      </div>

      <div className="text-center mt-20 opacity-10 text-[8px] font-black uppercase tracking-[0.5em] italic">
        NextraLabs MASTERMODEL © 2026
      </div>
    </div>
  )
}
