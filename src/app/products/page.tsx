'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Zap, Star, Crown, Shield, TrendingUp, Share2, ShieldCheck, Mail, Briefcase, Wallet, Building2, Youtube, User, HeartHandshake, Sofa, Network, LayoutGrid, Sparkles, Gift, Search, Scale, UserPlus, Table, Clapperboard, Wand2, ShieldAlert, Play, Hotel, Lock, Camera, UserCheck } from 'lucide-react'

const TOOLS = [
  { id: 'staysee-ai-finder', cat: 'hotel', title: 'AI×ホテルDXシステム【Nextra】', sub: '宿泊予約・鍵発行を完全同期', icon: Building2, plan: 'プレミアム' },
  { id: 'comp-price-monitor', cat: 'hotel', title: '競合AI価格監視', sub: '楽天API連携 × 価格最適化OS', icon: LineChart, plan: 'プレミアム' },
  { id: 'hotel-affiliate', cat: 'hotel', title: 'アフィリエイトAI連携', sub: '宿紹介 × 楽天収益化OS', icon: Network, plan: 'スタンダード' },
  { id: 'moving-checker', cat: 'hotel', title: 'AI引越し安心チェッカー', sub: '治安・物件リスクを徹底分析', icon: Home, plan: '無料' },
  { id: 'sns-auto-poster', cat: 'sns', title: 'AI SNSオートポスター', sub: 'バズを量産するマルチSNS生成', icon: Share2, plan: 'ライト' },
  { id: 'ai-select-shop', cat: 'sns', title: 'AIセレクトショップ', sub: 'トレンド分析 × Shopify連携', icon: Store, plan: 'プレミアム' },
  { id: 'youtube-producer', cat: 'sns', title: 'AI YouTubeプロデューサー', sub: '全自動台本・構成作成', icon: Clapperboard, plan: 'プレミアム' },
  { id: 'trend-stock', cat: 'sns', title: 'SNSトレンドAI分析', sub: 'バズ予測 × 楽天商品検索OS', icon: TrendingUp, plan: 'スタンダード' },
  { id: 'youtube-coordinator', cat: 'sns', title: 'YouTube AI Sync', sub: '動画解析 × 楽天コーデ', icon: Play, plan: 'プレミアム' },
  { id: 'kdp-guide', cat: 'sns', title: 'Kindle出版AI完全ナビ', sub: '執筆から出版までの一気通貫', icon: BookOpen, plan: '無料' },
  { id: 'prompt-master', cat: 'sns', title: 'AI画像プロンプトマスター', sub: '究極の画像パーツ工房', icon: Wand2, plan: 'ライト' },
  { id: 'scam-defender', cat: 'life', title: 'AI詐欺ディフェンダー', sub: '詐欺・悪意を即座に判定', icon: ShieldCheck, plan: 'プレミアム' },
  { id: 'money-guard', cat: 'life', title: 'AI家計防衛シミュレーター', sub: '衝動買いの心理的抑止', icon: Wallet, plan: 'スタンダード' },
  { id: 'disaster-guard', cat: 'life', title: 'AI防災パーソナルガイド', sub: '避難ルート × 備蓄最適化', icon: Shield, plan: 'スタンダード' },
  { id: 'shopping-stopper', cat: 'life', title: 'AI買い物依存ストッパー', sub: '散財の鎖を断ち切る', icon: ShieldAlert, plan: '無料' },
  { id: 'buy-smart-nav', cat: 'life', title: '中古・新品AI比較ナビ', sub: '損得勘定のAI市場判定OS', icon: Scale, plan: '無料' },
  { id: 'price-tracker', cat: 'life', title: '底値監視AI予測', sub: '価格変動 × AI将来予測OS', icon: LineChart, plan: 'ライト' },
  { id: 'inbox-organizer', cat: 'biz', title: 'Gmail AI Accelerator', sub: '未読ゼロを最速で実現', icon: Mail, plan: 'プレミアム' },
  { id: 'contact-sync', cat: 'biz', title: 'Contact Sync', sub: '名刺の全自動・登録OS', icon: UserPlus, plan: 'ライト' },
  { id: 'expense-sync', cat: 'biz', title: 'Expense AI Sync', sub: '経費精算の全自動・記帳OS', icon: Table, plan: 'ライト' },
  { id: 'evidence-manager', cat: 'biz', title: 'エビデンス・マネージャー', sub: 'サブスク実績の証拠管理', icon: Archive, plan: '無料' },
  { id: 'ai-report-generator', cat: 'biz', title: 'AIレポートジェネレーター', sub: '箇条書きからプロ級文書生成', icon: FileText, plan: '無料' },
  { id: 'ai-sidejob', cat: 'biz', title: 'AI副業スタートダッシュ', sub: '適性診断 × 収益ロードマップ', icon: Briefcase, plan: 'ライト' },
  { id: 'ai-konkatsu', cat: 'mind', title: 'AI婚活コーチ', sub: '戦略的成婚支援システム', icon: Heart, plan: 'スタンダード' },
  { id: 'office-politics-graph', cat: 'mind', title: '社内政治 AI相関図', sub: '人間関係の暗部を可視化', icon: Network, plan: '無料' },
  { id: 'interior-coordinator', cat: 'mind', title: 'Interior Sync', sub: '空間分析 × 楽天一括購入OS', icon: Sofa, plan: 'プレミアム' }
]

const CATEGORIES = [
  { id: 'hotel', title: '宿泊・不動産DX', icon: Hotel, color: 'border-emerald-500' },
  { id: 'sns', title: 'SNS・コンテンツ戦略', icon: Share2, color: 'border-orange-500' },
  { id: 'life', title: '防犯・資産・ライフ', icon: ShieldCheck, color: 'border-red-500' },
  { id: 'biz', title: 'ビジネス・自動化', icon: Briefcase, color: 'border-blue-500' },
  { id: 'mind', title: '人間心理・対人戦略', icon: HeartHandshake, color: 'border-pink-500' }
]

function ProductCard({ product }: { product: any }) {
  const planLabelMap: any = { '無料': 'FREE', 'ライト': 'LIGHT', 'スタンダード': 'STANDARD', 'プレミアム': 'MASTER' }
  const displayBadge = planLabelMap[product.plan] || 'BASIC'
  const planBadgeColors: any = {
    '無料': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    'ライト': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'スタンダード': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'プレミアム': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  }
  const badgeClass = "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border " + (planBadgeColors[product.plan] || planBadgeColors['無料'])

  return (
    <Card className="h-full bg-[#13141f] transition-all duration-300 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-xl relative border-2 border-emerald-500 shadow-emerald-500/10 hover:border-emerald-400">
      <CardContent className="p-5 md:p-6 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10"><product.icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" /></div>
          <Badge className="bg-slate-950/50 text-slate-500 border border-white/10 px-2 py-0.5 font-bold text-[8px] md:text-[9px] uppercase tracking-widest">{displayBadge}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-black text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-500 text-[10px] md:text-xs font-bold mb-2 italic">{product.sub}</p>
          <p className="text-slate-400 text-[10px] md:text-[11px] leading-relaxed mb-4 line-clamp-2 italic">{product.description || product.sub + 'を実現する、NextraLabs独自のAI戦略エンジン。'}</p>
        </div>
        <div className="pt-4 border-t border-white/5 flex flex-col gap-2.5 mt-auto">
          <Link href={"/products/" + product.id + "/app"} className="block w-full">
            <Button className="w-full h-10 md:h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg">このツールを起動</Button>
          </Link>
          <div className="flex justify-between items-center px-2 py-1 bg-black/40 rounded-lg border border-white/5">
            <span className={badgeClass}>{product.plan} プラン</span>
            {product.plan !== '無料' ? <Lock className="h-2.5 w-2.5 text-amber-500/30" /> : <Sparkles className="h-2.5 w-2.5 text-emerald-400/50" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)
  const [randomFree, setRandomFree] = useState([])
  const [pickupTools, setPickupTools] = useState([])
  useEffect(() => {
    setMounted(true)
    setRandomFree(TOOLS.filter(t => t.plan === '無料').sort(() => 0.5 - Math.random()).slice(0, 3))
    setPickupTools([...TOOLS].sort(() => 0.5 - Math.random()).slice(0, 3))
  }, [])
  if (!mounted) return null
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-10 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto px-4 pt-10 md:pt-16 text-center mb-10 md:mb-16 space-y-3">
        <Badge variant="outline" className="px-3 py-0.5 text-[8px] md:text-[10px] font-black text-emerald-500 border-emerald-500/20 uppercase tracking-[0.2em]">Master Catalogue</Badge>
        <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">AI ツールストア</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-[10px] md:text-sm font-bold italic leading-relaxed">ビジネスと生活をAI武装する、全24の戦略的エンジン。</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <section><div className="flex items-center gap-3 mb-4 border-l-[6px] border-orange-500 pl-4 py-0.5"><Sparkles className="w-5 h-5 text-orange-500" /><h2 className="text-lg md:text-2xl font-black text-white italic uppercase">ピックアップ</h2></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{pickupTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><div className="flex items-center gap-3 mb-4 border-l-[6px] border-emerald-500 pl-4 py-0.5"><Gift className="w-5 h-5 text-emerald-500" /><h2 className="text-lg md:text-2xl font-black text-white italic uppercase">無料トライアル</h2></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{randomFree.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <div className={"flex items-center gap-3 mb-4 border-l-[6px] " + cat.color + " pl-4 py-0.5"}><cat.icon className="w-5 h-5 text-white" /><h2 className="text-lg md:text-2xl font-black text-white italic uppercase">{cat.title}</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{TOOLS.filter(t => t.cat === cat.id).map(p => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        ))}
      </div>
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.3em] italic text-[8px]">NextraLabs 2026</div>
    </div>
  )
}
