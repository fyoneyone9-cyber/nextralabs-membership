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
  Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, Lock, CreditCard, Coins, Sparkles, Archive, UserPlus, Table, Sofa, Play, TrendingUp, LineChart, Scale, Crown
} from 'lucide-react'

// データ定義
const freeTools = [
  { id: 'office-politics-graph', title: '社内政治 AI相関図', subtitle: '人間関係の暗部を可視化', description: '組織図には載らない本当のパワーバランスをAIが暴き出します。派閥争いやキーマンの特定、あなたの社内での立ち位置を数値化・相関図化。', priceNote: '無料', tags: ['組織'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気', isModel: true },
  { id: 'moving-checker', title: 'AI引越し安心チェッカー', subtitle: '治安・物件リスクを徹底分析', description: '住所を入力するだけで、周辺の治安、ハザードマップ、隠れた物件リスクをAIがスコアリング。後悔しない引越しをデータでサポートします。', priceNote: '無料', tags: ['生活'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'マスタ', isModel: true },
  { id: 'buy-smart-nav', title: '中古・新品比較ナビ', subtitle: '損得勘定のAI市場判定OS', description: '欲しい商品名を入れるだけ。市場価格を一括収集し、AIが「今新品と中古どちらを買うべきか」をズバリ判定。', priceNote: '無料', tags: ['節約'], icon: Scale, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW', isModel: true },
  { id: 'evidence-manager', title: 'エビデンス・マネージャー', subtitle: 'サブスク実績の証拠管理', description: 'デスクトップをスキャンし、Shopifyの出品成功画像などの「本物の証拠」のみを選別・永久保存。', priceNote: '無料', tags: ['管理'], icon: Archive, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW', isModel: true },
  { id: 'kdp-guide', title: 'Kindle出版完全ナビ', subtitle: '執筆から出版までの一気通貫', description: '本のネタ出し、目次構成、原稿執筆支援からKDPの複雑な登録作業まで。最短距離で作家デビュー。', priceNote: '無料', tags: ['制作'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '標準', isModel: true },
  { id: 'ai-report-generator', title: 'AIレポートジェネレーター', subtitle: '箇条書きからプロ級文書生成', description: '支離滅裂なメモや箇条書きを、論理的で説得力のあるビジネスレポートへ瞬時に変換。', priceNote: '無料', tags: ['ビジネス'], icon: FileText, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: 'マスタ', isModel: true },
  { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', subtitle: '散財の鎖を断ち切る', description: '特定のキーワードやサイトへの接触を制限し、冷静な判断を促す。依存のメカニズムをAIが理解。', priceNote: '無料', tags: ['節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: '最強', isModel: true },
]

const hotelTools = [
  { id: 'staysee-ai-finder', title: 'AI×ホテルDXシステム【Nextra】', subtitle: '宿泊予約・鍵発行を完全同期', description: '遺失物をAI画像解析でスピード特定。Staysee PMSと連携し、フロント業務を激減させる特化型AI。', priceNote: 'プレミアム', tags: ['B2B'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'マスタ', isModel: true },
  { id: 'comp-price-monitor', title: '競合価格監視', subtitle: '楽天API連携 × 価格最適化OS', description: '周辺宿の販売価格をAIが24時間監視。Stayseeの最適な販売価格を戦略的に提案します。', priceNote: 'プレミアム', tags: ['B2B'], icon: LineChart, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW', isModel: true },
  { id: 'hotel-affiliate', title: 'アフィリエイト連携', subtitle: '宿紹介 × 楽天収益化OS', description: '宿泊者がSNSで宿を紹介する際、バズる紹介文と楽天アフィリエイトリンクをAIが自動生成。', priceNote: 'スタンダード', tags: ['SNS'], icon: Share2, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: 'マスタ', isModel: true },
]

const defenseTools = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・悪意を即座に判定', description: '不審なDM、メールをAIが徹底スキャン。最新の詐欺手口と照らし合わせ、危険性を警告。', priceNote: 'プレミアム', tags: ['防犯'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '最強', isModel: true },
  { id: 'money-guard', title: 'AI家計防衛シミュレーター', subtitle: '衝動買いの心理的抑止', description: '支出を記録するだけでなく、購入前の迷いをAIが客観的に分析し、家計の致命傷を未然に防ぎます。', priceNote: 'スタンダード', tags: ['家計'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'マスタ', isModel: true },
  { id: 'disaster-guard', title: 'AI防災パーソナルガイド', subtitle: '避難ルート × 備蓄最適化', description: 'ハザードマップを読み込み、専用の防災プランをAIが提案。生存確率を最大化するためのガイド。', priceNote: 'スタンダード', tags: ['防災'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'マスタ', isModel: true },
  { id: 'ai-konkatsu', title: 'AI婚活コーチ', subtitle: '戦略的成婚支援システム', description: '現在のステータスから成婚期待度を算出。データに基づいた「次の一手」を提案します。', priceNote: 'スタンダード', tags: ['婚活'], icon: Heart, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: '注目', isModel: true },
]

const bizTools = [
  { id: 'trend-stock', title: 'SNSトレンド自動仕入', subtitle: 'バズ予測 × 楽天商品検索OS', description: 'Google TrendsとSNSを解析。「明日バズる」商品を予測し、楽天の在庫データと即座に同期。', priceNote: 'スタンダード', tags: ['物販'], icon: TrendingUp, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: 'NEW', isModel: true },
  { id: 'contact-sync', title: 'Contact Sync', subtitle: '名刺の全自動・登録OS', description: '名刺をAIスキャンし、名前や連絡先を読み取り。あなたの連絡先へ自動で追加します。', priceNote: 'ライト', tags: ['効率'], icon: UserPlus, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'NEW', isModel: true },
  { id: 'interior-coordinator', title: 'Interior Sync', subtitle: '空間分析 × 楽天一括購入OS', description: 'カメラで部屋を映すとAIがインテリアを分析。調和する家具を楽天からセット提案。', priceNote: 'プレミアム', tags: ['生活'], icon: Sofa, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: 'NEW', isModel: true },
  { id: 'youtube-coordinator', title: 'YouTube Sync', subtitle: '動画解析 × 楽天コーデ', description: 'YouTube動画から服を特定。楽天市場から類似アイテムを即座に提案する特化型エンジン。', priceNote: 'プレミアム', tags: ['ファッション'], icon: Play, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: 'NEW', isModel: true },
  { id: 'price-tracker', title: '底値監視予測Bot', subtitle: '価格変動 × AI将来予測OS', description: '楽天商品のURLからセール時期を秒速予測。買い時を逃さない次世代Bot。', priceNote: 'ライト', tags: ['節約'], icon: LineChart, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'NEW', isModel: true },
  { id: 'expense-sync', title: 'Expense Sync', subtitle: '経費精算の全自動・記帳OS', description: 'レシート画像をAI解析し、スプレッドシートへ自動記帳。事務作業をゼロへ。', priceNote: 'ライト', tags: ['事務'], icon: Table, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'NEW', isModel: true },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: 'トレンド分析 × Shopify連携', description: '流行をAI分析し、売れるデザインを自動生成。Shopify経由で在庫リスクゼロのショップ運営。', priceNote: 'プレミアム', tags: ['EC'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気', isModel: true },
  { id: 'youtube-producer', title: 'AI YouTubeプロデューサー', subtitle: '全自動台本・構成作成', description: '最新トレンドを反映した台本生成、サムネイル設計まで。YouTube運用の全工程を代行。', priceNote: 'プレミアム', tags: ['制作'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目', isModel: true },
  { id: 'prompt-master', title: 'AI画像プロンプトマスター', subtitle: '究極の画像パーツ工房', description: '1000種類以上のパーツを組み合わせてMidjourney等で使える究極の呪文を錬成。', priceNote: 'ライト', tags: ['画像AI'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須', isModel: true },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: '未読ゼロを最速で実現', description: '受信メールをAI解析し仕分け。文脈を汲み取った返信案もワンクリックで生成。', priceNote: 'プレミアム', tags: ['Gmail'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'マスタ', isModel: true },
  { id: 'ai-sidejob', title: 'AI副業スタートダッシュ', subtitle: '適性診断 × 収益化マップ', description: 'スキルに合わせた「稼げるAI副業」を診断。収益化までのステップをロードマップ化。', priceNote: 'ライト', tags: ['副業'], icon: Briefcase, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'マスタ', isModel: true },
]

function ProductCard({ product }: { product: any }) {
  const Icon = product.icon
  return (
    <Card className={"h-full bg-[#1a1b23] transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-xl relative " + (product.isModel ? 'border-2 border-emerald-500 scale-[1.02]' : 'border-slate-800')}>
      {product.isModel && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-b-xl z-20 uppercase tracking-tighter shadow-lg">
          Master Model
        </div>
      )}
      <CardContent className="p-8 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={"p-4 rounded-2xl " + product.bgColor + " " + product.iconColor}><Icon className="h-8 w-8" /></div>
          <Badge className={(product.isModel ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400') + " border-0 px-3 py-1 font-bold text-[10px] uppercase"}>{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4 italic">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 mt-auto">
          <Link href={"/products/" + product.id + "/app"} className="block w-full">
            <Button className={"w-full h-16 " + (product.isModel ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-emerald-500') + " text-slate-950 font-black text-lg rounded-2xl shadow-lg"}>
              このツールを使う
            </Button>
          </Link>
          <div className="flex justify-between items-center px-4 py-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <span className="text-[10px] font-black uppercase text-slate-400">{product.priceNote} PLAN</span>
            {product.priceNote !== '無料' ? <Lock className="h-3 w-3 text-amber-500/50" /> : <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <div className={"flex items-center gap-4 mb-10 border-l-8 " + color + " pl-6 py-2"}>
      <span className="text-orange-500 font-black text-2xl">|</span>
      <h2 className="text-3xl font-bold text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}>
      <Icon className="w-8 h-8 text-white" />
      <h2 className="text-3xl font-bold text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const allTools = [...freeTools, ...hotelTools, ...defenseTools, ...bizTools]
  const todayRecommended = allTools.filter(p => p.isModel).sort(() => 0.5 - Math.random()).slice(0, 3)
  if (!mounted) return null
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-16 space-y-6">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">Catalogue</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">AIツール一覧</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 space-y-32">
        <section><SectionTitle title="本日のおすすめ" color="border-orange-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{todayRecommended.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle title="無料ツール" color="border-emerald-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle title="ホテル・民泊オーナー様向け" color="border-blue-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle title="防犯・ライフ" color="border-red-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle title="ビジネス・制作" color="border-teal-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
      </div>
    </div>
  )
}