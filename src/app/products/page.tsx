'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, 
  ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, Lock, CreditCard, Coins, Sparkles, Archive, UserPlus, Table, Sofa, Play, TrendingUp, LineChart, Scale, Crown, Gift, HeartHandshake
} from 'lucide-react'

// ツール全データ定義
const TOOLS = [
  // 【宿泊・不動産DX】
  { id: 'staysee-ai-finder', cat: 'hotel', title: 'AI×ホテルDXシステム【Nextra】', sub: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'プレミアム', badge: 'MASTER' },
  { id: 'comp-price-monitor', cat: 'hotel', title: '競合価格監視', sub: '楽天API連携 × 価格最適化OS', icon: LineChart, plan: 'プレミアム', badge: 'NEW' },
  { id: 'hotel-affiliate', cat: 'hotel', title: 'アフィリエイト連携', sub: '宿紹介 × 楽天収益化OS', icon: Network, plan: 'スタンダード', badge: 'MASTER' },
  { id: 'moving-checker', cat: 'hotel', title: 'AI引越し安心チェッカー', sub: '治安・物件リスクを徹底分析', icon: Home, plan: '無料', badge: 'MASTER' },

  // 【SNS・コンテンツ戦略】
  { id: 'sns-auto-poster', cat: 'sns', title: 'AI SNSオートポスター', sub: 'バズを量産するマルチSNS生成', icon: Share2, plan: 'ライト', badge: 'MASTER' },
  { id: 'ai-select-shop', cat: 'sns', title: 'AIセレクトショップ', sub: 'トレンド分析 × Shopify連携', icon: Store, plan: 'プレミアム', badge: 'STRATEGY' },
  { id: 'youtube-producer', cat: 'sns', title: 'AI YouTubeプロデューサー', sub: '全自動台本・構成作成', icon: Clapperboard, plan: 'プレミアム', badge: 'TOP' },
  { id: 'trend-stock', cat: 'sns', title: 'SNSトレンド自動仕入', sub: 'バズ予測 × 楽天商品検索OS', icon: TrendingUp, plan: 'スタンダード', badge: 'NEW' },
  { id: 'youtube-coordinator', cat: 'sns', title: 'YouTube Sync', sub: '動画解析 × 楽天コーデ', icon: Play, plan: 'プレミアム', badge: 'NEW' },
  { id: 'kdp-guide', cat: 'sns', title: 'Kindle出版完全ナビ', sub: '執筆から出版までの一気通貫', icon: BookOpen, plan: '無料', badge: 'BASIC' },
  { id: 'prompt-master', cat: 'sns', title: 'AI画像プロンプトマスター', sub: '究極の画像パーツ工房', icon: Wand2, plan: 'ライト', badge: 'CORE' },

  // 【防犯・資産・ライフ】
  { id: 'scam-defender', cat: 'life', title: 'AI詐欺ディフェンダー', sub: '詐欺・悪意を即座に判定', icon: ShieldCheck, plan: 'プレミアム', badge: 'ULTIMATE' },
  { id: 'money-guard', cat: 'life', title: 'AI家計防衛シミュレーター', sub: '衝動買いの心理的抑止', icon: Wallet, plan: 'スタンダード', badge: 'MASTER' },
  { id: 'disaster-guard', cat: 'life', title: 'AI防災パーソナルガイド', sub: '避難ルート × 備蓄最適化', icon: Shield, plan: 'スタンダード', badge: 'MASTER' },
  { id: 'shopping-stopper', cat: 'life', title: 'AI買い物依存ストッパー', sub: '散財の鎖を断ち切る', icon: ShieldAlert, plan: '無料', badge: 'ULTIMATE' },
  { id: 'buy-smart-nav', cat: 'life', title: '中古・新品比較ナビ', sub: '損得勘定のAI市場判定OS', icon: Scale, plan: '無料', badge: 'NEW' },
  { id: 'price-tracker', cat: 'life', title: '底値監視予測Bot', sub: '価格変動 × AI将来予測OS', icon: LineChart, plan: 'ライト', badge: 'NEW' },

  // 【ビジネス・自動化】
  { id: 'inbox-organizer', cat: 'biz', title: 'Gmail AI Accelerator', sub: '未読ゼロを最速で実現', icon: Mail, plan: 'プレミアム', badge: 'MASTER' },
  { id: 'contact-sync', cat: 'biz', title: 'Contact Sync', sub: '名刺の全自動・登録OS', icon: UserPlus, plan: 'ライト', badge: 'NEW' },
  { id: 'expense-sync', cat: 'biz', title: 'Expense Sync', sub: '経費精算の全自動・記帳OS', icon: Table, plan: 'ライト', badge: 'NEW' },
  { id: 'evidence-manager', cat: 'biz', title: 'エビデンス・マネージャー', sub: 'サブスク実績の証拠管理', icon: Archive, plan: '無料', badge: 'NEW' },
  { id: 'ai-report-generator', cat: 'biz', title: 'AIレポートジェネレーター', sub: '箇条書きからプロ級文書生成', icon: FileText, plan: '無料', badge: 'MASTER' },
  { id: 'ai-sidejob', cat: 'biz', title: 'AI副業スタートダッシュ', sub: '適性診断 × 収益ロードマップ', icon: Briefcase, plan: 'ライト', badge: 'MASTER' },

  // 【人間心理・対人戦略】
  { id: 'ai-konkatsu', cat: 'mind', title: 'AI婚活コーチ', sub: '戦略的成婚支援システム', icon: Heart, plan: 'スタンダード', badge: 'TOP' },
  { id: 'office-politics-graph', cat: 'mind', title: '社内政治 AI相関図', sub: '人間関係の暗部を可視化', icon: Network, plan: '無料', badge: 'HOT' },
  { id: 'interior-coordinator', cat: 'mind', title: 'Interior Sync', sub: '空間分析 × 楽天一括購入OS', icon: Sofa, plan: 'プレミアム', badge: 'NEW' }
]

const CATEGORIES = [
  { id: 'hotel', title: '宿泊・不動産DX', icon: Hotel, color: 'border-emerald-500' },
  { id: 'sns', title: 'SNS・コンテンツ戦略', icon: Share2, color: 'border-orange-500' },
  { id: 'life', title: '防犯・資産・ライフ', icon: ShieldCheck, color: 'border-red-500' },
  { id: 'biz', title: 'ビジネス・自動化', icon: Briefcase, color: 'border-blue-500' },
  { id: 'mind', title: '人間心理・対人戦略', icon: HeartHandshake, color: 'border-pink-500' }
]

function ProductCard({ product }: { product: any }) {
  const Icon = product.icon
  // 全システムモデルバッジの再構築
  const isMaster = product.badge === 'MASTER' || product.badge === 'STRATEGY' || product.badge === 'ULTIMATE' || product.badge === 'TOP'
  
  return (
    <Card className={"h-full bg-[#1a1b23] transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-xl relative " + (isMaster ? 'border-2 border-emerald-500 scale-[1.02]' : 'border-slate-800')}>
      {isMaster && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-6 py-1 rounded-b-xl z-20 uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(16,185,129,0.4)]">
          {product.badge + ' MODEL'}
        </div>
      )}
      <CardContent className="p-8 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={"p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner"}><Icon className="h-8 w-8 text-emerald-400" /></div>
          <Badge className={"bg-slate-800 text-slate-400 border border-white/5 px-3 py-1 font-bold text-[10px] uppercase tracking-widest"}>{product.badge}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-white mb-1 tracking-tight uppercase italic">{product.title}</h3>
          <p className="text-emerald-500 text-sm font-black mb-4 italic uppercase tracking-tighter">{product.sub}</p>
          <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6 line-clamp-3 italic">{product.description || product.sub + 'を実現する、NextraLabs独自のAI戦略エンジン。'}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 mt-auto">
          <Link href={"/products/" + product.id + "/app"} className="block w-full">
            <Button className={"w-full h-16 " + (isMaster ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500' : 'bg-white hover:bg-slate-200') + " text-slate-950 font-black text-lg rounded-2xl shadow-lg transition-all active:scale-95 uppercase italic"}>
              USE THIS ENGINE ➔
            </Button>
          </Link>
          <div className="flex justify-between items-center px-4 py-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{product.plan} PLAN</span>
            {product.plan !== '無料' ? <Lock className="h-3 w-3 text-amber-500/50" /> : <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)
  const [randomFree, setRandomFree] = useState<any[]>([])
  useEffect(() => {
    setMounted(true)
    const free = TOOLS.filter(t => t.plan === '無料')
    setRandomFree([...free].sort(() => 0.5 - Math.random()).slice(0, 3))
  }, [])
  if (!mounted) return null
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-32 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-24 space-y-8">
        <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 px-8 py-2 rounded-full font-black uppercase tracking-[0.4em] text-[10px] animate-pulse shadow-lg">Intelligence HUB v4.0</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-none drop-shadow-2xl">Master Engine <span className="text-emerald-500">Store</span></h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl font-bold leading-relaxed italic border-l-4 border-emerald-500 pl-8 text-left py-4 bg-white/5 rounded-r-3xl">「指示したら、あとは全部やってくれる」<br/>あなたのビジネスと生活をAI武装する、全24の戦略的エンジン。</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 space-y-40">
        <section>
          <div className="flex items-center gap-6 mb-12 border-l-[12px] border-emerald-500 pl-8 py-2">
            <Gift className="w-12 h-12 text-emerald-500 animate-bounce" />
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Free Trial <span className="text-emerald-500">Experience</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{randomFree.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <div className={"flex items-center gap-6 mb-12 border-l-[12px] " + cat.color + " pl-8 py-2"}>
              <cat.icon className="w-12 h-12 text-white" />
              <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">{cat.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{TOOLS.filter(t => t.cat === cat.id).map(p => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        ))}
      </div>
      <div className="text-center opacity-10 mt-40 font-black uppercase tracking-[0.5em] italic text-[10px]">Operational OS • NextraLabs MASTERMODEL • 2026</div>
    </div>
  )
}