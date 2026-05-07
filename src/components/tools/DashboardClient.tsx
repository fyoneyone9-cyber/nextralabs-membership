'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Rocket, Star, Zap, Building2, Mail, Share2, ShieldCheck, 
  TrendingUp, Network, Wallet, Youtube, Briefcase, Shield, 
  User, Crown, BookOpen, Sparkles, CheckCircle2, HeartHandshake, Sofa
} from 'lucide-react'

// 蜈ｨ繝・・繝ｫ繝槭せ繧ｿ螳夂ｾｩ・医・繝ｩ繝ｳ諠・ｱ莉倥″・・const ALL_TOOLS = [
  { id: 'staysee-ai-finder', name: 'AI 繝帙ユ繝ｫ繝ｻ繧ｭ繝ｼ騾｣謳ｺ', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', plan: 'premium' },
  { id: 'comp-price-monitor', name: '遶ｶ蜷井ｾ｡譬ｼAI逶｣隕・, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', plan: 'light' },
  { id: 'sns-auto-poster', name: 'AI SNS繧ｪ繝ｼ繝医・繧ｹ繧ｿ繝ｼ', icon: Share2, color: 'text-rose-500', bg: 'bg-rose-500/10', plan: 'light' },
  { id: 'evidence-manager', name: 'AI 繧ｨ繝薙ョ繝ｳ繧ｹ繝ｻ繝槭ロ繝ｼ繧ｸ繝｣繝ｼ', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', plan: 'free' },
  { id: 'hotel-affiliate', name: '繧｢繝輔ぅ繝ｪ繧ｨ繧､繝・I騾｣謳ｺ', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-400/10', plan: 'premium' },
  { id: 'money-guard', name: 'AI螳ｶ險磯亟陦帙す繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10', plan: 'standard' },
  { id: 'youtube-producer', name: 'AI YouTube繝励Ο繝・Η繝ｼ繧ｵ繝ｼ', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', plan: 'premium' },
  { id: 'contact-sync', name: 'AI Contact Sync', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-400/10', plan: 'light' },
  { id: 'interior-coordinator', name: 'AI Interior Sync', icon: Sofa, color: 'text-amber-500', bg: 'bg-amber-500/10', plan: 'premium' },
  { id: 'ai-sidejob', name: 'AI蜑ｯ讌ｭ繧ｹ繧ｿ繝ｼ繝医ム繝・す繝･', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-400/10', plan: 'premium' },
  { id: 'disaster-guard', name: 'AI髦ｲ轣ｽ繝代・繧ｽ繝翫Ν繧ｬ繧､繝・, icon: Shield, color: 'text-sky-500', bg: 'bg-sky-500/10', plan: 'standard' },
  { id: 'ai-konkatsu', name: 'AI蟀壽ｴｻ繧ｳ繝ｼ繝・, icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-400/10', plan: 'standard' },
]

export default function DashboardClient({ user, profile, subscription }: any) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('nextra_favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavs)
    localStorage.setItem('nextra_favorites', JSON.stringify(newFavs))
  }

  if (!mounted) return null

  const plan = subscription?.plan || 'free'
  const isPremium = plan === 'premium'
  const planDisplay = plan === 'premium' ? '繝励Ξ繝溘い繝莨壼藤' : plan === 'standard' ? '繧ｹ繧ｿ繝ｳ繝繝ｼ繝我ｼ壼藤' : plan === 'light' ? '繝ｩ繧､繝井ｼ壼藤' : '辟｡譁吩ｼ壼藤'
  
  // 讓ｩ髯舌メ繧ｧ繝・け
  const hasAccess = (toolPlan: string) => {
    if (plan === 'premium') return true
    if (plan === 'standard') return ['standard', 'light', 'free'].includes(toolPlan)
    if (plan === 'light') return ['light', 'free'].includes(toolPlan)
    return toolPlan === 'free'
  }

  const favoriteTools = ALL_TOOLS.filter(t => favorites.includes(t.id))
  const regularTools = ALL_TOOLS.filter(t => !favorites.includes(t.id)).slice(0, 6)

  const ToolCard = ({ tool }: any) => {
    const Icon = tool.icon
    const locked = !hasAccess(tool.plan)
    const isFav = favorites.includes(tool.id)

    return (
      <div className={`group relative h-32 p-6 rounded-[2rem] border-2 transition-all overflow-hidden ${locked ? 'opacity-40 grayscale' : 'hover:scale-[1.03] active:scale-95 shadow-lg'} ${locked ? 'bg-slate-900 border-white/5' : 'bg-black border-emerald-500/30 hover:border-emerald-500'}`}>
        <Link href={locked ? '/pricing' : `/products/${tool.id}/app`} className="flex items-start gap-4 h-full">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tool.bg} flex-shrink-0 transition-transform group-hover:scale-110`}>
            <Icon className={`h-6 w-6 ${tool.color}`} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-lg font-black text-white italic leading-tight group-hover:text-emerald-400 transition-colors uppercase truncate">{tool.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[7px] px-2 py-0 border-white/10 opacity-50 uppercase">{tool.plan}</Badge>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">{locked ? 'Upgrade required' : '繝・・繝ｫ繧定ｵｷ蜍輔☆繧・筐・}</p>
            </div>
          </div>
        </Link>
        <button 
          onClick={(e) => toggleFavorite(e, tool.id)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isFav ? 'text-amber-400 scale-110' : 'text-slate-700 hover:text-white opacity-0 group-hover:opacity-100'}`}
        >
          <Star size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
        <Icon className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <Badge variant="outline" className="px-4 py-1 text-xs font-black uppercase tracking-widest text-emerald-500 border-emerald-500/20">繝繝・す繝･繝懊・繝・/Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              Welcome, {profile?.display_name || '繧ｲ繧ｹ繝域ｧ・}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${isPremium ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'} px-6 py-2 font-black italic uppercase rounded-xl shadow-lg border-0`}>
              {planDisplay}
            </Badge>
          </div>
        </div>

        {/* Favorites Section */}
        {favoriteTools.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 px-4">
               <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
               <h3 className="font-black italic uppercase tracking-tighter text-2xl">縺頑ｰ励↓蜈･繧翫す繧ｹ繝・Β</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          </div>
        )}

        {/* Regular Tools Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="font-black italic uppercase tracking-tighter text-2xl flex items-center gap-3">
               <Rocket className="h-6 w-6 text-emerald-500" />
               繝槭せ繧ｿ繝・・繝ｫ繝ｻ繧｢繧ｯ繧ｻ繧ｹ
             </h3>
             <Link href="/products" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest italic">蜈ｨ繝・・繝ｫ繧定ｦ九ｋ 筐・/Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] shadow-xl overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">蛻ｩ逕ｨ蜿ｯ閭ｽ繝励Λ繝ｳ</CardTitle>
              <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white italic uppercase leading-none">{planDisplay}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Identified Account</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-white truncate">{user.email}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2rem] shadow-xl overflow-hidden flex flex-col justify-center px-8">
             <Link href="/guide" className="flex items-center justify-between group">
                <span className="font-black italic uppercase text-sm">Open Guide Protocol</span>
                <BookOpen className="text-emerald-500 group-hover:scale-110 transition-transform" />
             </Link>
          </Card>
        </div>

        <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px]">
           Operational OS 窶｢ NextraLabs MASTERMODEL 窶｢ 2026
        </div>
      </div>
    </div>
  )
}
