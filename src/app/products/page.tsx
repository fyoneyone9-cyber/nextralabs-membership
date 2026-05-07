'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, Zap, Star, Crown, Shield, TrendingUp, Share2, ShieldCheck, 
  Mail, Briefcase, Wallet, Building2, Youtube, User, HeartHandshake, 
  Sofa, Network, Heart, Search, ShoppingCart, MessageSquare, 
  Smartphone, FileText, Lock, Image as ImageIcon, Activity, CloudRain, AlertTriangle
} from 'lucide-react'

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const CATEGORIES = [
    { title: "本日のおすすめ", icon: BookOpen, color: "text-emerald-500", items: [
      { id: 'staysee-ai-finder', name: 'AI×ホテルDXシステム【Nextra】', desc: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'premium', badge: 'マスタ' },
      { id: 'sns-auto-poster', name: 'AI SNSオートポスター', desc: 'バズる投稿をAIが自動生成', icon: Share2, plan: 'light', badge: 'マスタ' },
      { id: 'hotel-affiliate', name: 'アフィリエイト連携', desc: '宿紹介 × 楽天収益化OS', icon: Network, plan: 'standard', badge: 'マスタ' }
    ]},
    { title: "無料ツール", icon: Shield, color: "text-slate-400", items: [
      { id: 'evidence-manager', name: 'AI エビデンス・マネージャー', desc: '証拠資料の自動整理・管理', icon: ShieldCheck, plan: 'free', badge: 'NEW' },
      { id: 'office-politics-graph', name: '社内政治 AI相関図', desc: '組織の人間関係を可視化', icon: Share2, plan: 'free', badge: '人気' },
      { id: 'moving-checker', name: 'AI引越し安心チェッカー', desc: '治安・物件リスクを徹底分析', icon: CloudRain, plan: 'free', badge: 'マスタ' },
      { id: 'buy-smart-nav', name: '中古・新品比較ナビ', desc: '損得勘定のAI市場判定OS', icon: Search, plan: 'free', badge: 'NEW' },
      { id: 'kdp-guide', name: 'Kindle出版完全ナビ', desc: '執筆から出版までの一気通貫', icon: FileText, plan: 'free', badge: '標準' },
      { id: 'ai-report-generator', name: 'AIレポートジェネレーター', desc: '箇条書きからプロ級文書生成', icon: FileText, plan: 'free', badge: 'マスタ' },
      { id: 'shopping-stopper', name: 'AI買い物依存ストッパー', desc: '散財の鎖を断ち切る', icon: AlertTriangle, plan: 'free', badge: '最強' }
    ]},
    { title: "ライトプラン", icon: Zap, color: "text-blue-500", items: [
      { id: 'contact-sync', name: 'Contact Sync', desc: '名刺の全自動・連絡先登録OS', icon: User, plan: 'light', badge: 'NEW' },
      { id: 'price-tracker', name: '底値監視予測Bot', desc: '価格変動 × AI将来予測OS', icon: TrendingUp, plan: 'light', badge: 'NEW' },
      { id: 'expense-sync', name: 'Expense Sync', desc: '経費精算の全自動・記帳OS', icon: Wallet, plan: 'light', badge: 'NEW' },
      { id: 'prompt-master', name: 'AI画像プロンプトマスター', desc: '究極の画像生成パーツ工房', icon: ImageIcon, plan: 'light', badge: '必須' },
      { id: 'ai-sidejob', name: 'AI副業スタートダッシュ', desc: '適性診断 × 収益ロードマップ', icon: Briefcase, plan: 'light', badge: 'マスタ' }
    ]},
    { title: "スタンダードプラン", icon: Star, color: "text-amber-500", items: [
      { id: 'trend-stock', name: 'SNSトレンド自動仕入', desc: 'バズ予測 × 楽天商品検索OS', icon: TrendingUp, plan: 'standard', badge: 'NEW' },
      { id: 'ai-konkatsu', name: 'AI婚活コーチ', desc: '戦略的成婚支援システム', icon: HeartHandshake, plan: 'standard', badge: '注目' },
      { id: 'money-guard', name: 'AI家計防衛シミュレーター', desc: '衝動買いの心理的抑止', icon: Wallet, plan: 'standard', badge: 'マスタ' },
      { id: 'disaster-guard', name: 'AI防災パーソナルガイド', desc: '避難ルート × 備蓄最適化', icon: Shield, plan: 'standard', badge: 'マスタ' }
    ]},
    { title: "プレミアムプラン", icon: Crown, color: "text-purple-500", items: [
      { id: 'youtube-producer', name: 'AI YouTubeプロデューサー', desc: '最新ニュースからの全自動台本', icon: Youtube, plan: 'premium', badge: '注目' },
      { id: 'inbox-organizer', name: 'Gmail AI Accelerator', desc: '未読ゼロを最速で実現', icon: Mail, plan: 'premium', badge: 'マスタ' },
      { id: 'comp-price-monitor', name: '競合価格監視', desc: '楽天API連携 × 価格最適化OS', icon: TrendingUp, plan: 'premium', badge: 'NEW' },
      { id: 'interior-coordinator', name: 'Interior Sync', desc: '空間分析 × 楽天一括購入OS', icon: Sofa, plan: 'premium', badge: 'NEW' },
      { id: 'youtube-coordinator', name: 'YouTube Sync', desc: '動画解析 × 楽天連動コーデ', icon: Youtube, plan: 'premium', badge: 'NEW' },
      { id: 'ai-select-shop', name: 'AIセレクトショップ', desc: 'トレンド分析 × Shopify連携', icon: ShoppingCart, plan: 'premium', badge: '人気' },
      { id: 'scam-defender', name: 'AI詐欺ディフェンダー', desc: '詐欺・悪意を即座に判定', icon: ShieldCheck, plan: 'premium', badge: '最強' }
    ]}
  ]

  if (!mounted) return <div className="min-h-screen bg-[#050507]" />

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <div className="container mx-auto px-4 py-20 max-w-7xl space-y-24">
        <div className="text-center space-y-6">
          <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-[0.3em]">Master Intelligence Catalogue</Badge>
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
                <Link key={item.id} href={"/products/" + item.id + "/app"}>
                  <Card className="bg-[#13141f] border-4 border-white/5 p-10 rounded-[3.5rem] hover:border-emerald-500/50 transition-all group shadow-2xl relative overflow-hidden h-80 flex flex-col justify-between">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border-2 border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                          <item.icon className="text-emerald-500" size={40} />
                        </div>
                        <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-4 py-1 font-black text-xs">{item.badge}</Badge>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase leading-tight group-hover:text-emerald-400">{item.name}</h3>
                        <p className="text-slate-500 text-sm font-bold leading-relaxed italic">{item.desc}</p>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="bg-black/50 px-4 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.plan}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500 italic uppercase tracking-widest group-hover:translate-x-2 transition-transform">Enter Unit ➔</span>
                    </div>
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