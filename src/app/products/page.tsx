'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, Zap, Star, Crown, Shield, TrendingUp, Share2, ShieldCheck, 
  Mail, Briefcase, Wallet, Building2, Youtube, User, HeartHandshake, 
  Sofa, Network, LayoutGrid, Heart, Search, ShoppingCart, MessageSquare, 
  Smartphone, FileText, Lock, Image as ImageIcon
} from 'lucide-react'

// ツールデータの定義
const ALL_TOOLS = [
  { id: 'staysee-ai-finder', name: 'AI×ホテルDXシステム【Nextra】', desc: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'premium', category: 'recommend', badge: 'マスタ' },
  { id: 'sns-auto-poster', name: 'AI SNSオートポスター', desc: 'バズる投稿をAIが自動生成', icon: Share2, plan: 'light', category: 'recommend', badge: 'マスタ' },
  { id: 'office-politics-graph', name: '社内政治 AI相関図', desc: '組織の人間関係を可視化', icon: Share2, plan: 'free', category: 'free', badge: '人気' },
  { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', desc: '証拠資料の自動整理・管理', icon: ShieldCheck, plan: 'free', category: 'free', badge: 'NEW' },
  { id: 'comp-price-monitor', name: '競合価格AI監視', desc: '市場価格をリアルタイム追跡', icon: TrendingUp, plan: 'light', category: 'light', badge: 'NEW' },
  { id: 'contact-sync', name: 'AI Contact Sync', desc: '連絡先情報の自動同期', icon: User, plan: 'light', category: 'light', badge: 'NEW' },
  { id: 'price-tracker', name: '底値監視予測Bot', desc: '楽天の買い時をAIが特定', icon: TrendingUp, plan: 'light', category: 'light', badge: 'NEW' },
  { id: 'trend-stock', name: 'SNSトレンド自動仕入', desc: 'バズり商品を即座に特定', icon: TrendingUp, plan: 'standard', category: 'standard', badge: 'NEW' },
  { id: 'ai-konkatsu', name: 'AI婚活コーチ', desc: '心理学に基づいた成婚戦略', icon: HeartHandshake, plan: 'standard', category: 'standard', badge: '注目' },
  { id: 'money-guard', name: 'AI家計防衛シミュレーター', desc: '家計をAIが鉄壁防御', icon: Wallet, plan: 'standard', category: 'standard', badge: 'マスタ' },
  { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: '台本からBGMまで一括生成', icon: Youtube, plan: 'premium', category: 'premium', badge: '注目' },
  { id: 'hotel-affiliate', name: 'アフィリエイトAI連携', desc: '収益化を自動最適化', icon: Network, plan: 'premium', category: 'premium', badge: 'マスタ' },
]

export default function ProductsPage() {
  const categories = [
    { id: 'recommend', title: '本日のおすすめ', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'free', title: '無料ツール', icon: Shield, color: 'text-slate-400' },
    { id: 'light', title: 'ライトプラン', icon: Zap, color: 'text-blue-500' },
    { id: 'standard', title: 'スタンダードプラン', icon: Star, color: 'text-amber-500' },
    { id: 'premium', title: 'プレミアムプラン', icon: Crown, color: 'text-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-6 py-1 text-xs font-black text-emerald-500 border-emerald-500/20 uppercase tracking-widest">Master Intelligence Catalogue</Badge>
          <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">AI Tool Store</h1>
        </div>

        {categories.map((cat) => (
          <div key={cat.id} className="space-y-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-500 font-black">|</span>
              <cat.icon className={"w-5 h-5 " + cat.color} />
              {cat.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_TOOLS.filter(t => t.category === cat.id).map((tool) => (
                <Link key={tool.id} href={"/products/" + tool.id}>
                  <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group shadow-xl h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <tool.icon className="text-emerald-500" size={24} />
                        </div>
                        <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20">{tool.badge}</Badge>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white italic uppercase leading-tight group-hover:text-emerald-400">{tool.name}</h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed mt-2">{tool.desc}</p>
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                      <Badge variant="outline" className="text-[8px] uppercase border-white/10 opacity-50">{tool.plan} PLAN</Badge>
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