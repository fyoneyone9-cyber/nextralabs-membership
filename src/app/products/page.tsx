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
      { id: 'staysee-ai-finder', name: 'AI×ホテルDXシステム【Nextra】', desc: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'premium' },
      { id: 'sns-auto-poster', name: 'AI SNSオートポスター', desc: 'バズる投稿をAIが自動生成', icon: Share2, plan: 'light' }
    ]},
    { title: "無料ツール", icon: Shield, color: "text-slate-400", items: [
      { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', desc: '証拠資料の自動整理・管理', icon: ShieldCheck, plan: 'free' },
      { id: 'office-politics-graph', name: '社内政治 AI相関図', desc: '組織の人間関係を可視化', icon: Share2, plan: 'free' }
    ]},
    { id: 'light', title: "ライトプラン", icon: Zap, color: "text-blue-500", items: [
      { id: 'comp-price-monitor', name: '競合価格AI監視', desc: '市場価格をリアルタイム追跡', icon: TrendingUp, plan: 'light' },
      { id: 'contact-sync', name: 'AI Contact Sync', desc: '連絡先情報の自動同期', icon: User, plan: 'light' }
    ]},
    { id: 'standard', title: "スタンダードプラン", icon: Star, color: "text-amber-500", items: [
      { id: 'trend-stock', name: 'SNSトレンド自動仕入', desc: 'バズり商品を即座に特定', icon: TrendingUp, plan: 'standard' },
      { id: 'ai-konkatsu', name: 'AI婚活コーチ', desc: '心理学に基づいた成婚戦略', icon: HeartHandshake, plan: 'standard' }
    ]},
    { id: 'premium', title: "プレミアムプラン", icon: Crown, color: "text-purple-500", items: [
      { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: '台本からBGMまで一括生成', icon: Youtube, plan: 'premium' },
      { id: 'hotel-affiliate', name: 'アフィリエイトAI連携', desc: '収益化を自動最適化', icon: Network, plan: 'premium' }
    ]}
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-6 py-1 text-xs font-black text-emerald-500 border-emerald-500/20 uppercase tracking-widest">Master Intelligence Catalogue</Badge>
          <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">AI Tool Store</h1>
        </div>

        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-8">
            <h2 className="text-2xl font-black italic uppercase flex items-center gap-3 border-l-4 border-orange-500 pl-6">
              <cat.icon className={cat.color} size={28} />
              {cat.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item) => (
                <Link key={item.id} href={"/products/" + item.id}>
                  <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group shadow-xl h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <item.icon className="text-emerald-500" size={32} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white italic uppercase leading-tight group-hover:text-emerald-400">{item.name}</h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                      <Badge variant="outline" className="text-[8px] uppercase border-white/10 opacity-50">{item.plan}</Badge>
                      <span className="text-[10px] font-black text-emerald-500 italic uppercase">View Details ➔</span>
                    </div>
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