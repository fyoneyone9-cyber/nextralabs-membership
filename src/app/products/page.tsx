'use client'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, ArrowRight, Network, Store, 
  ClipboardCheck, Heart, ShieldCheck, Wallet, Home, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Building2, Hotel, Lock, CreditCard, Sparkles, Archive, UserPlus, Table, Sofa, Play, TrendingUp, LineChart, Scale, Crown, Gift, HeartHandshake, Star, Brain, Repeat, ShieldAlert, Utensils
} from 'lucide-react'

const TOOLS = [
  { id: 'universal-converter', cat: 'compress', title: '究極AIマルチコンバーター', sub: '動画・画像・PDFへの変換圧縮', icon: Repeat, plan: 'ライト' },
  { id: 'staysee-ai-finder', cat: 'hotel', title: 'Staysee AI Finder', sub: '宿泊予約と鍵発行を完全同期', icon: Building2, plan: 'プレミアム' },
  { id: 'hotel-affiliate', cat: 'hotel', title: 'アフィリエイト連携', sub: '宿泊紹介と楽天収益化OS', icon: Network, plan: 'スタンダード' },
  { id: 'comp-price-monitor', cat: 'hotel', title: '競合価格監視', sub: '楽天API連携と価格最適化OS', icon: LineChart, plan: 'プレミアム' },
  { id: 'moving-checker', cat: 'hotel', title: 'AI引越し安心チェッカー', sub: '治安と物件リスクを徹底解析', icon: Home, plan: '無料' },
  { id: 'sns-auto-poster', cat: 'sns', title: 'AI SNSオートポスター', sub: 'バズを量産するマルチSNS生成', icon: Share2, plan: 'ライト' },
  { id: 'ai-select-shop', cat: 'sns', title: 'AIセレクトショップ', sub: 'トレンド解析とShopify連携', icon: Store, plan: 'プレミアム' },
  { id: 'youtube-producer', cat: 'sns', title: 'AI YouTubeプロデューサー', sub: '全自動台本・構成作成', icon: Clapperboard, plan: 'プレミアム' },
  { id: 'trend-stock', cat: 'sns', title: 'Trend Stock', sub: 'バズ予測 × 楽天商品検索OS', icon: TrendingUp, plan: 'スタンダード', isHot: true },
  { id: 'youtube-coordinator', cat: 'sns', title: 'YouTube AI Sync', sub: '動画解析と楽天コーチ', icon: Play, plan: 'プレミアム' },
  { id: 'kdp-guide', cat: 'edu', title: 'Kindle出版完全ナビ', sub: '執筆から出版までの一気通貫', icon: BookOpen, plan: '無料' },
  { id: 'kindle-factory', cat: 'biz', title: 'Kindle AI ファクトリー', sub: 'AI解析でKDP入稿可能な原稿を自動生成', icon: Crown, plan: 'プレミアム' },
  { id: 'prompt-master', cat: 'biz', title: 'AI画像プロンプトマスター', sub: '究極 of 究極の画像パーツ工房', icon: Wand2, plan: 'ライト' },
  { id: 'scam-defender', cat: 'life', title: 'AI詐欺ディフェンダー', sub: '詐欺・悪意を即座に判定', icon: ShieldCheck, plan: 'プレミアム' },
  { id: 'money-guard', cat: 'life', title: 'AI家計防衛シミュレーター', sub: '衝動買いの心理的阻止', icon: Wallet, plan: 'スタンダード' },
  { id: 'loan-advisor', cat: 'life', title: 'AI借金完済・おまとめ診断', sub: '借金の一本化と完済への最短ルート', icon: CreditCard, plan: '無料' },
  { id: 'disaster-guard', cat: 'life', title: 'AI防災パーソナルガイド', sub: '避難ルートと備蓄最適化', icon: Shield, plan: 'スタンダード' },
  { id: 'shopping-stopper', cat: 'life', title: 'AI買い物依存ストッパー', sub: '散財の鎖を断ち切る', icon: ShieldAlert, plan: '無料' },
  { id: 'buy-smart-nav', cat: 'life', title: '中古・新品AI比較ナビ', sub: '損得勘定とAI市場判定OS', icon: Scale, plan: '無料' },
  { id: 'price-tracker', cat: 'life', title: '底値監視AI予測', sub: '価格変動とAI未来予測OS', icon: LineChart, plan: 'ライト' },
  { id: 'inbox-organizer', cat: 'biz', title: 'Gmail AI Accelerator', sub: '未読ゼロを最速で実現', icon: Mail, plan: 'プレミアム' },
  { id: 'contact-sync', cat: 'biz', title: 'Contact AI Sync', sub: '名刺の全自動登録OS', icon: UserPlus, plan: 'ライト' },
  { id: 'expense-sync', cat: 'biz', title: 'Expense AI Sync', sub: '経費精算の全自動記帳OS', icon: Table, plan: 'ライト' },
  { id: 'evidence-manager', cat: 'biz', title: 'エビデンスAIマネージャー', sub: 'サブスク実績の証拠管理', icon: Archive, plan: '無料' },
  { id: 'ai-report-generator', cat: 'biz', title: 'AIレポートジェネレーター', sub: '箇条書きからプロ級文書生成', icon: FileText, plan: '無料' },
  { id: 'ai-sidejob', cat: 'biz', title: 'AI副業スタートダッシュ', sub: '適性診断と収益ロードマップ', icon: Briefcase, plan: 'ライト' },
  { id: 'ai-konkatsu', cat: 'mind', title: 'AI婚活コーチ', sub: '戦略的結婚支援システム', icon: Heart, plan: 'スタンダード' },
  { id: 'office-politics-graph', cat: 'mind', title: '社内政治 AI相関図', sub: '人間関係の暗部を可視化', icon: Network, plan: '無料' },
  { id: 'interior-coordinator', cat: 'mind', title: 'Interior AI Sync', sub: '空間解析と楽天一括購入OS', icon: Sofa, plan: 'プレミアム' },
  { id: 'ai-recipe', cat: 'life', title: 'AIレシピ献立コーチ', sub: '冷蔵庫の残り物と栄養最適化', icon: Utensils, plan: '無料' },
  { id: 'exam-scheduler', cat: 'edu', title: '資格試験AIスケジューラー', sub: '試験日から逆算して学習計画を自動生成', icon: ClipboardCheck, plan: 'スタンダード' },
  { id: 'ai-exam-generator', cat: 'edu', title: 'AI問題生成 & 苦手分析', sub: '予想問題を無限生成と弱点ポイント可視化', icon: Brain, plan: 'プレミアム' },
  { id: 'location-finder', cat: 'hotel', title: 'AIロケーションファインダー', sub: '出店・移住の最適地をデータ分析', icon: MapPin, plan: 'スタンダード' },
  { id: 'smart-gardening', cat: 'life', title: 'AIスマートガーデニング', sub: '植物の声を聴く育成アドバイザー', icon: Sprout, plan: 'スタンダード' },
  { id: 'ticket-scout', cat: 'life', title: 'AIチケットスカウト', sub: '争奪戦に勝つための先行情報収集', icon: Ticket, plan: 'スタンダード' }
]

const CATEGORIES = [
  { id: 'compress', title: 'AI圧縮・変換ツール', icon: Zap, color: 'border-emerald-500' },
  { id: 'hotel', title: '宿泊・不動産DX', icon: Hotel, color: 'border-emerald-500' },
  { id: 'sns', title: 'SNS・コンテンツ戦略', icon: Share2, color: 'border-orange-500' },
  { id: 'life', title: '防犯・資産・ライフ', icon: ShieldCheck, color: 'border-red-500' },
  { id: 'edu', title: '学習・自己研鑽', icon: BookOpen, color: 'border-purple-500' },
  { id: 'biz', title: 'ビジネス・自動化', icon: Briefcase, color: 'border-blue-500' },
  { id: 'mind', title: '人間心理・対人戦略', icon: HeartHandshake, color: 'border-pink-500' }
]

function ProductCard({ product, isFav, onToggleFav }: {
  product: typeof TOOLS[0]
  isFav: boolean
  onToggleFav: (e: React.MouseEvent, id: string) => void
}) {
  const planLabelMap: Record<string, string> = { '無料': 'FREE', 'ライト': 'LIGHT', 'スタンダード': 'STANDARD', 'プレミアム': 'MASTER' }
  const displayBadge = planLabelMap[product.plan] || 'BASIC'
  const planBadgeColors: Record<string, string> = {
    '無料': 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    'ライト': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'スタンダード': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'プレミアム': 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  }
  const badgeClass = "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border " + (planBadgeColors[product.plan] || planBadgeColors['無料'])

  return (
    <Card className="h-full bg-[#13141f] transition-all duration-300 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-xl relative border-2 border-emerald-500 shadow-emerald-500/10 hover:border-emerald-400">
      <button
        onClick={e => onToggleFav(e, product.id)}
        className={`absolute top-4 right-4 z-20 p-1.5 rounded-xl transition-all ${
          isFav ? 'text-amber-400' : 'text-slate-700 opacity-0 group-hover:opacity-100 hover:text-amber-400'
        }`}
      >
        <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      <CardContent className="p-5 md:p-6 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10"><product.icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" /></div>
          <Badge className="bg-slate-950/50 text-slate-500 border border-white/10 px-2 py-0.5 font-bold text-[8px] md:text-[9px] uppercase tracking-widest mr-7">{displayBadge}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-black text-white mb-1 tracking-tight flex items-center gap-2">
            <div className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </div>
            {product.title}
          </h3>
          {product.isHot && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-[8px] mb-2 animate-bounce">
              🔥 急上昇トレンド
            </Badge>
          )}
          <p className="text-emerald-300 text-[10px] md:text-xs font-bold mb-2 italic">{product.sub}</p>
          <p className="text-white text-[10px] md:text-[11px] leading-relaxed mb-4 line-clamp-2 italic">{product.sub}を実現するソリューション。</p>
        </div>
        <div className="pt-4 border-t border-white/5 flex flex-col gap-2.5 mt-auto">
          <Link href={"/products/" + product.id} className="block w-full">
            <Button className="w-full h-10 md:h-12 bg-emerald-600 hover:bg-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-slate-950 font-black text-sm md:text-base rounded-xl shadow-lg uppercase tracking-tighter">このツールを起動</Button>
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

function ProductsList() {
  const [mounted, setMounted] = useState(false)
  const [randomFree, setRandomFree] = useState<typeof TOOLS>([])
  const [pickupTools, setPickupTools] = useState<typeof TOOLS>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setMounted(true)
    setRandomFree(TOOLS.filter(t => t.plan === '無料').sort(() => 0.5 - Math.random()).slice(0, 3))
    setPickupTools([...TOOLS].sort(() => 0.5 - Math.random()).slice(0, 3))

    const loadFavs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('user_favorites').select('tool_id').eq('user_id', user.id)
      if (data) setFavorites(data.map((r: any) => r.tool_id))
    }
    loadFavs()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 pt-10 md:pt-16 text-center mb-10 md:mb-16 space-y-3">
        <Badge variant="outline" className="px-3 py-0.5 text-[8px] md:text-[10px] font-black text-emerald-400 border-emerald-500/40 uppercase tracking-[0.2em]">Master Catalogue</Badge>
        <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">AI ツールストア</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 space-y-8 md:space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-4 border-l-[6px] border-orange-500 pl-4 md:pl-6 py-0.5">
            <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-orange-500" />
            <h2 className="text-lg md:text-2xl font-black text-white italic uppercase">ピックアップ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{pickupTools.map(p => <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={() => {}} />)}</div>
        </section>
        <section>
          <div className="flex items-center gap-3 mb-4 border-l-[6px] border-emerald-500 pl-4 md:pl-6 py-0.5">
            <Gift className="w-5 h-5 md:w-8 md:h-8 text-emerald-500" />
            <h2 className="text-lg md:text-2xl font-black text-white italic uppercase">無料トライアル</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{randomFree.map(p => <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={() => {}} />)}</div>
        </section>
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <div className={"flex items-center gap-3 mb-4 border-l-[6px] md:border-l-8 " + cat.color + " pl-4 md:pl-6 py-0.5"}>
              <cat.icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
              <h2 className="text-lg md:text-2xl font-black text-white italic uppercase">{cat.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{TOOLS.filter(t => t.cat === cat.id).map(p => <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={() => {}} />)}</div>
          </section>
        ))}
      </div>
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.3em] italic text-[8px]">Nextra Labs 2026</div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-emerald-500 font-bold p-10">Loading...</div>}>
      <ProductsList />
    </Suspense>
  )
}