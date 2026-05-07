'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, Rocket, Zap, Building2, TrendingUp, Share2, ShieldCheck, Network, Wallet, Youtube, User, Sofa, Briefcase, Shield, HeartHandshake, BookOpen, LayoutDashboard
} from 'lucide-react'

const ALL_TOOLS = [
  { id: 'staysee-ai-finder', name: 'Nextra AI', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', plan: 'プレミアム', badge: 'MASTER' },
  { id: 'comp-price-monitor', name: '競合AI価格監視', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', plan: 'プレミアム', badge: 'NEW' },
  { id: 'sns-auto-poster', name: 'AI SNSオートポスター', icon: Share2, color: 'text-rose-500', bg: 'bg-rose-500/10', plan: 'ライト', badge: 'MASTER' },
  { id: 'evidence-manager', name: 'AI エビデンスAIマネージャー', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', plan: '無料', badge: 'NEW' },
  { id: 'hotel-affiliate', name: 'アフィリエイトAI連携', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-400/10', plan: 'プレミアム', badge: 'MASTER' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10', plan: 'スタンダード', badge: 'MASTER' },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', plan: 'プレミアム', badge: 'TOP' },
  { id: 'contact-sync', name: 'AI Contact Sync', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-400/10', plan: 'ライト', badge: 'NEW' },
  { id: 'interior-coordinator', name: 'AI Interior Sync', icon: Sofa, color: 'text-amber-500', bg: 'bg-amber-500/10', plan: 'プレミアム', badge: 'NEW' },
  { id: 'youtube-coordinator', name: 'YouTube AI Sync', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', plan: 'プレミアム', badge: 'NEW' },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-400/10', plan: 'プレミアム', badge: 'MASTER' },
  { id: 'ai-konkatsu', name: 'AI婚活コーチ', icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-400/10', plan: 'スタンダード', badge: 'TOP' },
]

export default function DashboardClient({ user, profile, subscription }) {
  const [favorites, setFavorites] = useState([])
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('nextra_favorites')
    if (saved) { try { setFavorites(JSON.parse(saved)) } catch (e) {} }
  }, [])
  const toggleFavorite = (e, id) => {
    e.preventDefault(); e.stopPropagation()
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(newFavs); localStorage.setItem('nextra_favorites', JSON.stringify(newFavs))
  }
  if (!mounted) return null
  const plan = subscription?.plan || 'free'
  const isPremium = plan === 'premium'
  const planDisplay = plan === 'premium' ? 'プレミアム会員' : plan === 'standard' ? 'スタンダード会員' : plan === 'light' ? 'ライト会員' : '無料会員'
  const hasAccess = (toolPlan) => {
    if (plan === 'premium') return true
    if (plan === 'standard') return ['standard', 'light', 'free'].includes(toolPlan)
    if (plan === 'light') return ['light', 'free'].includes(toolPlan)
    return toolPlan === 'free'
  }
  const favoriteTools = ALL_TOOLS.filter(t => favorites.includes(t.id))
  const regularTools = ALL_TOOLS.filter(t => !favorites.includes(t.id)).slice(0, 6)
  
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <div className="container mx-auto px-6 py-20 max-w-7xl space-y-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-16">
          <div className="space-y-4 text-left">
            <Badge variant="outline" className="px-6 py-1 text-xs font-black text-emerald-500 border-emerald-500/20 uppercase tracking-[0.4em] animate-pulse">Operational Dashboard</Badge>
            <h1 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none">Welcome</h1>
          </div>
          <Badge className={"px-8 py-3 font-black italic uppercase rounded-2xl shadow-2xl border-0 text-lg " + (isPremium ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950" : "bg-slate-800 text-slate-400")}>{planDisplay}</Badge>
        </div>

        {/* お気に入り */}
        {favoriteTools.length > 0 && (
          <div className="space-y-10">
            <div className="flex items-center gap-6 px-4 border-l-[12px] border-amber-500 pl-8"><Star className="h-10 w-10 text-amber-500 fill-amber-500 animate-pulse" /><h2 className="font-black italic uppercase tracking-tighter text-4xl text-white">お気に入りシステム</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteTools.map(tool => (
                <div key={tool.id} className="group relative h-40 p-8 rounded-[2.5rem] border-2 transition-all overflow-hidden bg-[#13141f] border-emerald-500/30 hover:border-emerald-500 shadow-2xl hover:scale-[1.03]">
                  <Link href={"/products/" + tool.id + "/app"} className="flex items-start gap-6 h-full relative z-10">
                    <div className={"w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-inner " + tool.color}><tool.icon size={32} /></div>
                    <div className="flex-1 min-w-0 pt-2 text-left">
                      <p className="text-xl font-black text-white italic leading-none uppercase truncate mb-2">{tool.name}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">ツールを起動する ➔</p>
                    </div>
                  </Link>
                  <button onClick={(e) => toggleFavorite(e, tool.id)} className="absolute top-6 right-6 p-2 text-amber-400 scale-110 z-20"><Star size={20} fill="currentColor" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* マスタツール・アクセス */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-4 border-l-[12px] border-emerald-500 pl-8"><h2 className="font-black italic uppercase tracking-tighter text-4xl flex items-center gap-6 text-white"><Rocket className="h-10 w-10 text-emerald-500" />マスタツール・アクセス</h2><Link href="/products" className="text-[12px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest italic border-b border-transparent hover:border-emerald-500 transition-all">全ツールを見る ➔</Link></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularTools.map(tool => {
              const locked = !hasAccess(tool.plan); const isFav = favorites.includes(tool.id)
              return (
                <div key={tool.id} className={"group relative h-40 p-8 rounded-[2.5rem] border-2 transition-all overflow-hidden " + (locked ? "opacity-40 grayscale bg-slate-900 border-white/5" : "bg-[#13141f] border-emerald-500/30 hover:border-emerald-500 shadow-2xl hover:scale-[1.03]")}>
                  <Link href={locked ? "/pricing" : "/products/" + tool.id + "/app"} className="flex items-start gap-6 h-full relative z-10">
                    <div className={"w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-inner " + tool.color}><tool.icon size={32} /></div>
                    <div className="flex-1 min-w-0 pt-2 text-left">
                      <p className="text-xl font-black text-white italic leading-none uppercase truncate mb-2">{tool.name}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">{locked ? 'Upgrade required' : 'ツールを起動する ➔'}</p>
                    </div>
                  </Link>
                  {!locked && <button onClick={(e) => toggleFavorite(e, tool.id)} className="absolute top-6 right-6 p-2 text-slate-700 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20"><Star size={20} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-amber-400" : ""} /></button>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="text-center opacity-10 mt-40 font-black uppercase tracking-[0.5em] italic text-[8px]">Operational OS • NextraLabs MASTERMODEL • 2026</div>
    </div>
  )
}