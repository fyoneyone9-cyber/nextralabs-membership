'use client'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Zap, Star, Crown, Shield, TrendingUp, Share2, ShieldCheck, Mail, Briefcase, Wallet, Building2, Youtube, User, HeartHandshake, Sofa, Network, LayoutGrid } from 'lucide-react'

export default function ProductsPage() {
  const CATEGORIES = [
    { title: "本日のおすすめ", icon: BookOpen, color: "text-emerald-500", items: [
      { id: 'staysee-ai-finder', name: 'AI×ホテルDXシステム【Nextra】', desc: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'premium', color: 'emerald' },
      { id: 'sns-auto-poster', name: 'AI SNSオートポスター', desc: 'バズる投稿をAIが自動生成', icon: Share2, plan: 'light', color: 'rose' }
    ]},
    { title: "無料ツール", icon: Shield, color: "text-slate-400", items: [
      { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', desc: '証拠資料の自動整理・管理', icon: ShieldCheck, plan: 'free', color: 'emerald' },
      { id: 'office-politics-graph', name: '社内政治 AI相関図', desc: '組織の人間関係を可視化', icon: Share2, plan: 'free', color: 'slate' }
    ]},
    { id: 'light', title: "ライトプラン", icon: Zap, color: "text-blue-500", items: [
      { id: 'comp-price-monitor', name: '競合価格AI監視', desc: '市場価格をリアルタイム追跡', icon: TrendingUp, plan: 'light', color: 'blue' },
      { id: 'contact-sync', name: 'AI Contact Sync', desc: '連絡先情報の自動同期', icon: User, plan: 'light', color: 'indigo' },
      { id: 'price-tracker', name: '底値監視予測Bot', desc: '楽天の買い時をAIが特定', icon: TrendingUp, plan: 'light', color: 'emerald' }
    ]},
    { id: 'standard', title: "スタンダードプラン", icon: Star, color: "text-amber-500", items: [
      { id: 'trend-stock', name: 'SNSトレンド自動仕入', desc: 'バズり商品を即座に特定', icon: TrendingUp, plan: 'standard', color: 'orange' },
      { id: 'ai-konkatsu', name: 'AI婚活コーチ', desc: '心理学に基づいた成婚戦略', icon: HeartHandshake, plan: 'standard', color: 'rose' },
      { id: 'money-guard', name: 'AI家計防衛シミュレーター', desc: '家計をAIが鉄壁防御', icon: Wallet, plan: 'standard', color: 'amber' }
    ]},
    { id: 'premium', title: "プレミアムプラン", icon: Crown, color: "text-purple-500", items: [
      { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: '台本からBGMまで一括生成', icon: Youtube, plan: 'premium', color: 'red' },
      { id: 'inbox-organizer', name: 'Gmail AI Accelerator', desc: 'メール業務を10倍速化', icon: Mail, plan: 'premium', color: 'blue' },
      { id: 'staysee-ai-finder-p', name: 'AI×ホテルDXシステム【Nextra】', desc: '宿泊特化型DXソリューション', icon: Building2, plan: 'premium', color: 'emerald' }
    ]}
  ]

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <div className="container mx-auto px-4 py-20 max-w-7xl space-y-24">
        <div className="text-center space-y-6">
          <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-[0.3em] animate-pulse">Master Intelligence Catalogue</Badge>
          <h1 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">AI Tool Store</h1>
        </div>

        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-12">
            <div className="flex items-center gap-6 border-l-[12px] border-orange-500 pl-8">
               <cat.icon className={cat.color} size={48} />
               <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">{cat.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cat.items.map((item) => (
                <Link key={item.id} href={"/products/" + item.id.replace('-p', '')}>
                  <Card className="bg-[#13141f] border-4 border-white/5 p-10 rounded-[3.5rem] hover:border-emerald-500/50 transition-all group shadow-2xl relative overflow-hidden h-80 flex flex-col justify-between">
                    <div className="space-y-8">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border-2 border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                        <item.icon className="text-emerald-500" size={40} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase leading-none group-hover:text-emerald-400">{item.name}</h3>
                        <p className="text-slate-500 text-sm font-bold leading-relaxed italic">{item.desc}</p>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="bg-black/50 px-4 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.plan}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500 italic uppercase tracking-widest group-hover:translate-x-2 transition-transform">Enter Unit ➔</span>
                    </div>
                    {/* Decorative Background Icon */}
                    <item.icon className="absolute -bottom-10 -right-10 h-40 w-40 opacity-[0.02] rotate-12 group-hover:rotate-0 transition-transform" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}