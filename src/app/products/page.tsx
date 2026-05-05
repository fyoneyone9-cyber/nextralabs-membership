import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, 
  ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, 
  Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon, Lock, CreditCard, Coins, Sparkles 
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: 'NextraLabsの全てのAIツール。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string; isModel?: boolean;
}

// モデル化したツールには isModel: true を付与
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の可視化', description: '組織図に載らない本当の関係をAI解析。', priceNote: '無料', tags: ['無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気', isModel: true },
  { id: 'moving-checker', title: 'AI引越し安心チェッカー', subtitle: '治安・物件リスク分析', description: '住居のリスクをAI解析・スコアリング。', priceNote: '無料', tags: ['無料'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '注目', isModel: true },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'マルチSNS投稿作成', description: 'トピックから投稿内容を自動生成します。', priceNote: '無料', tags: ['SNS'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '標準' },
  { id: 'kdp-guide', title: 'Kindle出版完全ナビ', subtitle: '電子書籍出版ガイド', description: 'KDPアカウント設定から出版申請まで完結。', priceNote: '無料', tags: ['教育'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '標準', isModel: true },
  { id: 'ai-report-generator', title: 'AIレポートジェネレーター', subtitle: 'ビジネス文書作成', description: '箇条書きからプロ級のレポートを生成。', priceNote: '無料', tags: ['事務'], icon: FileText, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: '標準' },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像検索 × 忘れ物照合', description: '遺失物をAI画像解析でスピード特定。', priceNote: 'プレミアム', tags: ['B2B'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺判定', description: '不審な連絡をAIが即座に診断。', priceNote: 'プレミアム', tags: ['防犯'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '最強' },
  { id: 'money-guard', title: 'AI家計防衛シミュレーター', subtitle: '散財防止', description: '支出を分析。認知バイアスを撃退。', priceNote: 'スタンダード', tags: ['家計'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
  { id: 'disaster-guard', title: 'AI防災パーソナルガイド', subtitle: '避難所検索 × 備蓄', description: '現在地の危険度を把握し、防災プランを。', priceNote: 'スタンダード', tags: ['防災'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'NEW' },
  { id: 'shopping-stopper', title: 'AI買い物依存ストッパー', subtitle: '抑止AI', description: '冷静な判断を促し、散財を抑止。', priceNote: 'スタンダード', tags: ['節約'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: 'NEW' },
  { id: 'ai-konkatsu', title: 'AI婚活コーチ', subtitle: '戦略的成婚支援', description: '成婚期待度を算出し、次の一手を提案。', priceNote: 'スタンダード', tags: ['恋愛'], icon: Heart, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: '注目', isModel: true },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: 'AI古着ハンター', subtitle: 'メルカリ監視', description: '24時間監視し、お宝商品を即通知。', priceNote: 'プレミアム', tags: ['物販'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強' },
  { id: 'ai-select-shop', title: '「在庫ゼロ」AIセレクトショップ', subtitle: 'トレンド分析 × 自動デザイン', description: 'デザイン案を自動生成しShopify出品まで。', priceNote: 'プレミアム', tags: ['EC'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気' },
  { id: 'youtube-producer', title: 'AI YouTubeプロデューサー', subtitle: '全自動動画制作', description: '文字起こしから台本、サムネイルまで。', priceNote: 'プレミアム', tags: ['動画'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目', isModel: true },
  { id: 'prompt-master', title: 'AI画像プロンプトマスター', subtitle: '画像生成パーツ工房', description: 'パーツを組み合わせて究極の呪文を錬成。', priceNote: 'ライト', tags: ['画像AI'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須', isModel: true },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: 'Inbox Zero', description: '受信メールを自動仕分け・返信案生成。', priceNote: 'プレミアム', tags: ['Gmail'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'NEW' },
  { id: 'ai-sidejob', title: 'AI副業スタートダッシュ', subtitle: '適性診断 × ロードマップ', description: 'あなたに最適なAI副業を完全ガイド。', priceNote: 'ライト', tags: ['副業'], icon: Briefcase, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className={`h-full bg-[#1a1b23] transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-xl relative ${product.isModel ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/10 scale-[1.02]' : 'border-slate-800 hover:border-emerald-500/30'}`}>
      {product.isModel && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-b-xl z-20 uppercase tracking-tighter shadow-lg">
          Master Model
        </div>
      )}
      <CardContent className="p-8 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform shadow-inner`}><Icon className="h-8 w-8" /></div>
          <Badge className={`${product.isModel ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'} border-0 px-3 py-1 font-bold text-[10px] uppercase`}>{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4 italic">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 mt-auto">
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className={`w-full h-16 ${product.isModel ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500' : 'bg-emerald-500 hover:bg-emerald-400'} text-slate-950 font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group/btn`}>
              <span>このツールを使う</span>
              <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Plan: {product.priceNote}</span>
            {product.priceNote !== '無料' && <Lock className="h-3 w-3 text-slate-600" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ emoji, title, color }: { emoji: string; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-4 mb-10 border-l-8 ${color} pl-6 py-2`}>
      <span className="text-3xl">{emoji}</span>
      <h2 className="text-3xl font-bold text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-16 space-y-6">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">Catalogue</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">AIツール一覧</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">全22種類のNextraLabs AIツール。機能を絞り、直感的なUIで使いやすく設計されています。</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
        <section><SectionTitle emoji="🎁" title="無料ツール" color="border-emerald-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="🏨" title="オーナー様向け" color="border-blue-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="🛡️" title="防犯・ライフ" color="border-red-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        <section><SectionTitle emoji="💼" title="ビジネス・制作" color="border-teal-500" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
      </div>
    </div>
  )
}
