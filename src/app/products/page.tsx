import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'AIツール一覧',
  description: 'NextraLabsの全てのAIツール。',
}

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon } from 'lucide-react'

interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  priceNote: string
  tags: string[]
  icon: LucideIcon
  bgColor: string
  iconColor: string
  status: string
}

// ==================== ALL PRODUCTS (RESTORED) ====================
const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像解析 × 宿泊者照合', description: '忘れ物を撮影しAIが持ち主を特定。フロント業務を劇的に効率化します。', priceNote: 'プレミアム', tags: ['B2B', 'Staysee'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'HOT' },
]

const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の可視化', description: '組織図に載らない本当の関係をAIが分析。キーマンを見抜きます。', priceNote: '無料', tags: ['分析', 'PageRank'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'FREE' },
  { id: 'moving-checker', title: '引っ越し安心チェッカー', subtitle: '治安・騒音スコア表示', description: '物件のリスクをAIが数値化。後悔しない引っ越しをサポート。', priceNote: '無料', tags: ['治安', '騒音'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: 'FREE' },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'マルチSNS投稿生成', description: 'トピックから投稿文を自動生成。ハッシュタグ案も。', priceNote: '無料', tags: ['SNS', '自動化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'FREE' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・闇バイト判定', description: '不審な連絡をAIが即判定。最新の詐欺手口から家族を守ります。', priceNote: 'プレミアム', tags: ['防犯', '家族'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: 'SAFE' },
  { id: 'money-guard', title: 'AI家計防衛シミュレーター', subtitle: 'ギャンブル依存防止', description: '収支を数学的に分析し依存を予防。認知バイアスを診断します。', priceNote: 'スタンダード', tags: ['家計', '数学'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
  { id: 'disaster-guard', title: 'AI防災ガイド', subtitle: 'GPS避難所 × 警報', description: '現在地の避難所を検索、家族の避難プランをAIが提案。', priceNote: 'スタンダード', tags: ['防災', 'GPS'], icon: Shield, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: 'NEW' },
]

const commTools: Product[] = [
  { id: 'comm-coach', title: 'AIコミュニケーション', subtitle: '心理学ベースの添削', description: 'メッセージを心理学で分析。人間関係をスムーズにします。', priceNote: 'ライト', tags: ['心理学', '添削'], icon: MessageCircleHeart, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: 'NEW' },
  { id: 'ai-konkatsu', title: 'AI婚活コーチ', subtitle: 'プロフィール添削', description: '魅力的なプロフィールを作成。相性診断とメッセージ練習も。', priceNote: 'ライト', tags: ['婚活', '添削'], icon: Heart, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: 'NEW' },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: '古着お買い得ハンター', subtitle: 'メルカリ自動監視', description: '24時間監視しお買い得品をAIが即座にDiscordへ通知。', priceNote: 'プレミアム', tags: ['副業', '監視'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'BEST' },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: '在庫ゼロの物販', description: 'トレンドからTシャツを自動デザイン・ショップへ出品。', priceNote: 'プレミアム', tags: ['物販', 'Shopify'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: 'NEW' },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: 'Inbox Zeroを実現', description: '受信メールを自動分類し返信案を生成。ゴミ箱も自動整理。', priceNote: 'プレミアム', tags: ['Gmail', '効率化'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'NEW' },
]

const creativeTools: Product[] = [
  { id: 'prompt-master', title: 'AIプロンプトマスター', subtitle: '高品質な英語プロンプト', description: '日本語のアイデアを最高の画像生成用プロンプトへ変換。', priceNote: 'ライト', tags: ['画像AI', 'Midjourney'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: 'NEW' },
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '台本 ➔ 画像 ➔ BGM', description: '文字起こしから動画投稿に必要な素材を全自動生成。', priceNote: 'プレミアム', tags: ['動画制作', 'SEO'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: 'NEW' },
]

// ==================== Component ====================
function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/40 transition-all duration-300 rounded-[2.5rem] overflow-hidden group shadow-2xl">
      <CardContent className="p-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className={`p-5 rounded-[1.5rem] ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
            <Icon className="h-10 w-10" />
          </div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-4 py-1 font-bold text-xs uppercase tracking-widest">{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-bold mb-4 italic tracking-wide">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">{product.description}</p>
        </div>
        <div className="pt-8 border-t border-slate-800/50 flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Subscription</span>
            <span className="text-sm font-black text-slate-300 tracking-tighter">{product.priceNote}</span>
          </div>
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className="w-full h-20 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group/btn">
              <span>ツールを起動</span>
              <Rocket className="h-6 w-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ emoji, title, color }: { emoji: string; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-5 mb-12 border-l-8 ${color} pl-8 py-2`}>
      <span className="text-4xl">{emoji}</span>
      <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 pt-24 relative">
        <div className="text-center mb-28 space-y-6">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-emerald-500/10">NextraLabs Catalogue</Badge>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">THE<br/>POWER OF AI.</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-xl leading-relaxed font-medium">心理学的に洗練された空間で、<br/>業務に革新をもたらす最強のツールを見つけ出す。</p>
        </div>

        <section className="mb-32">
          <SectionTitle emoji="🏨" title="Hotel & Minpaku" color="border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotelTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-32">
          <SectionTitle emoji="🆓" title="Free Experience" color="border-emerald-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {freeTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-32">
          <SectionTitle emoji="🛡️" title="Defense Series" color="border-red-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {defenseTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-32">
          <SectionTitle emoji="🛍️" title="Business & Sidejob" color="border-teal-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {bizTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-32">
          <SectionTitle emoji="🎨" title="Creative Suite" color="border-purple-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {creativeTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
