'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, Rocket, Zap, Building2, TrendingUp, Share2, ShieldCheck, Network, Wallet, Youtube, User, Sofa, Briefcase, Shield, HeartHandshake, BookOpen, LayoutDashboard, Lock, UserPlus, Smartphone
} from 'lucide-react'

const ALL_TOOLS = [
  { id: 'staysee-ai-finder', name: 'Nextra AI', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', plan: 'プレミアム', badge: 'MASTER' },
  { id: 'comp-price-monitor', name: '競合AI価格監視', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', plan: 'プレミアム', badge: 'NEW' },
  { id: 'sns-auto-poster', name: 'AI SNSオートポスター', icon: Share2, color: 'text-rose-500', bg: 'bg-rose-500/10', plan: 'ライト', badge: 'MASTER' },
  { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', plan: '無料', badge: 'NEW' },
  { id: 'hotel-affiliate', name: 'アフィリエイトAI連携', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-400/10', plan: 'プレミアム', badge: 'MASTER' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10', plan: 'スタンダード', badge: 'MASTER' },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', plan: 'プレミアム', badge: 'TOP' },
  { id: 'contact-sync', name: 'AI Contact Sync', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-400/10', plan: 'ライト', badge: 'NEW' },
  { id: 'interior-coordinator', name: 'AI Interior Sync', icon: Sofa, color: 'text-amber-500', bg: 'bg-amber-500/10', plan: 'プレミアム', badge: 'NEW' },
  { id: 'youtube-coordinator', name: 'YouTube AI Sync', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', plan: 'プレミアム', badge: 'NEW' },
  { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-400/10', plan: 'プレミアム', badge: 'MASTER' },
  { id: 'ai-konkatsu', name: 'AI婚活コーチ', icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-400/10', plan: 'スタンダード', badge: 'TOP' },
  { id: 'office-politics-graph', name: '社内政治 AI相関図', icon: Share2, color: 'text-slate-400', bg: 'bg-slate-400/10', plan: '無料', badge: 'HOT' },
  { id: 'trend-stock', name: 'SNSトレンドAI分析', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10', plan: 'スタンダード', badge: 'NEW' },
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
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <Badge variant="outline" className="px-4 py-1 text-xs font-black text-emerald-500 border-emerald-500/20">OPERATIONAL DASHBOARD</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Welcome, " + (profile?.display_name || 'ゲスト様') + "</h1>
          </div>
          <Badge className="px-6 py-2 font-black italic uppercase rounded-xl shadow-lg border-0 bg-slate-800 text-slate-400">{planDisplay}</Badge>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-4 px-4">
             <LayoutDashboard className="h-8 w-8 text-emerald-500 animate-pulse" />
             <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">DMS：自律型宿泊司令塔</h2>
          </div>
          <Link href="/products/staysee-ai-finder/app">
            <Card className="bg-gradient-to-br from-[#0a0b14] to-[#13141f] border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] rounded-[3rem] p-10 hover:scale-[1.01] transition-all group relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="space-y-4 flex-1">
                     <Badge className="bg-emerald-600 text-white font-black px-4 py-1">MASTER UNIT</Badge>
                     <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Nextra AI</h3>
                     <p className="text-slate-400 text-lg font-bold leading-relaxed max-w-xl italic">PMSと錠デバイスをAPIで直結し、予約一覧・自動チェックイン・鍵発行を完全無人化。宿泊運営の物理的労働をゼロにする「本物」のDMS司令塔。</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                     <div className="bg-black/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2"><Lock className="text-emerald-500" /><span className="text-[10px] font-black uppercase text-white">Key Sync</span></div>
                     <div className="bg-black/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2"><UserPlus className="text-emerald-500" /><span className="text-[10px] font-black uppercase text-white">Check-in</span></div>
                  </div>
                  <Button className="h-24 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-2xl shadow-xl transition-all uppercase italic">司令塔を起動 ➔</Button>
               </div>
            </Card>
          </Link>
        </section>

        {favoriteTools.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4"><Star className="h-6 w-6 text-amber-500 fill-amber-400" /><h3 className="font-black italic uppercase tracking-tighter text-2xl">お気に入りシステム</h3></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTools.map(tool => (
                <div key={tool.id} className="group relative h-32 p-6 rounded-[2rem] border-2 transition-all overflow-hidden bg-black border-emerald-500/30 hover:border-emerald-500">
                  <Link href={"/products/" + tool.id + "/app"} className="flex items-start gap-4 h-full">
                    <div className={"inline-flex h-12 w-12 items-center justify-center rounded-2xl " + tool.bg}><tool.icon className={"h-6 w-6 " + tool.color} /></div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-lg font-black text-white italic leading-tight uppercase truncate">{tool.name}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">ツールを起動する ➔</p>
                    </div>
                  </Link>
                  <button onClick={(e) => toggleFavorite(e, tool.id)} className="absolute top-4 right-4 p-2 text-amber-400 scale-110"><Star size={18} fill="currentColor" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4"><h3 className="font-black italic uppercase tracking-tighter text-2xl flex items-center gap-3"><Rocket className="h-6 w-6 text-emerald-500" />マスタツール・アクセス</h3><Link href="/products" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest italic">全ツールを見る ➔</Link></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTools.map(tool => {
              const locked = !hasAccess(tool.plan)
              return (
                <div key={tool.id} className={"group relative h-32 p-6 rounded-[2rem] border-2 transition-all overflow-hidden " + (locked ? "opacity-40 grayscale bg-slate-900 border-white/5" : "bg-black border-emerald-500/30 hover:border-emerald-500")}>
                  <Link href={locked ? "/pricing" : "/products/" + tool.id + "/app"} className="flex items-start gap-4 h-full">
                    <div className={"inline-flex h-12 w-12 items-center justify-center rounded-2xl " + tool.bg}><tool.icon className={"h-6 w-6 " + tool.color} /></div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-lg font-black text-white italic leading-tight uppercase truncate">{tool.name}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">{locked ? "Upgrade required" : "ツールを起動する ➔"}</p>
                    </div>
                  </Link>
                  {!locked && <button onClick={(e) => toggleFavorite(e, tool.id)} className="absolute top-4 right-4 p-2 text-slate-700 hover:text-white opacity-0 group-hover:opacity-100 transition-all"><Star size={18} fill="none" /></button>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}