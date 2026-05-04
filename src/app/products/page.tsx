import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: '文字が大きく使いやすい、最強のAIツール・ラインナップ。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string;
}

// ==================== DATA (SAME AS BEFORE) ====================
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係をAIが視覚化', description: '組織図に載らない本当の関係を分析。キーマンを一瞬で見抜きます。', priceNote: '無料', tags: ['分析', '無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気' },
  { id: 'moving-checker', title: '引っ越し安心AI', subtitle: '治安・騒音を数値化', description: '物件の「見えないリスク」をスコア表示。失敗しない住まい選びを。', priceNote: '無料', tags: ['治安', '不動産'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '定番' },
  { id: 'sns-auto-poster', title: 'SNS投稿生成', subtitle: '投稿・ハッシュタグ自動化', description: 'トピックから投稿文を一瞬で生成。複数SNSの運用を劇的に楽にします。', priceNote: '無料', tags: ['SNS', '効率化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '無料' },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像解析で忘れ物特定', description: '拾得物を撮影して持ち主を自動特定。ホテルのフロント業務を革命的に変えます。', priceNote: 'プレミアム', tags: ['B2B', 'ホテルDX'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺判定', subtitle: '家族を守る防犯AI', description: '不審なメールや闇バイト勧誘を即判定。最新の詐欺から身を守ります。', priceNote: 'プレミアム', tags: ['防犯', '安心'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: '古着ハンター', subtitle: 'メルカリ自動監視', description: '24時間監視しお宝品をAIが即通知。副業のスピードを最大化。', priceNote: 'プレミアム', tags: ['副業', '監視'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強' },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: '在庫ゼロの物販AI', description: 'トレンドからデザイン生成・出品まで。物販ビジネスを一本道で。', priceNote: 'プレミアム', tags: ['物販', 'Shopify'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気' },
]

const creativeTools: Product[] = [
  { id: 'prompt-master', title: 'AIプロンプト', subtitle: '画像生成用英語変換', description: '日本語のイメージを最高の英語プロンプトへ。AIアートの質が爆上がり。', priceNote: 'ライト', tags: ['画像AI', '変換'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須' },
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '動画素材の全自動生成', description: '文字起こしから台本、サムネイルまで。動画制作を完全に一本道化。', priceNote: 'プレミアム', tags: ['動画', 'YouTube'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/40 transition-all duration-300 rounded-[2.5rem] overflow-hidden group shadow-2xl">
      <CardContent className="p-12 flex flex-col h-full"> {/* Paddingを12に拡大 */}
        <div className="flex items-start justify-between mb-8">
          <div className={`p-6 rounded-[2rem] ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
            <Icon className="h-12 w-12" /> {/* アイコンを拡大 */}
          </div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-5 py-2 font-black text-sm uppercase tracking-widest">{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-3xl font-black text-white mb-3 tracking-tighter leading-tight">{product.title}</h3>
          <p className="text-emerald-400 text-lg font-bold mb-6 italic tracking-tight">{product.subtitle}</p>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">{product.description}</p>
        </div>
        <div className="pt-10 border-t border-slate-800/50 flex flex-col gap-8">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">Plan: {product.priceNote}</span>
          </div>
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className="w-full h-24 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-2xl rounded-3xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group/btn border-b-8 border-emerald-700">
              <span>このツールを使う</span>
              <Rocket className="h-8 w-8 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ emoji, title, color }: { emoji: string; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-6 mb-16 border-l-[12px] ${color} pl-10 py-4`}>
      <span className="text-5xl">{emoji}</span>
      <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-40 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 pt-32 relative">
        <div className="text-center mb-32 space-y-8">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-8 py-2 rounded-full font-black uppercase tracking-[0.3em] text-sm shadow-xl">AI Tools Suite</Badge>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tightest leading-none">MAX<br/>SPEED.</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-2xl leading-relaxed font-bold">迷いなく、最速で成果を出す。<br/>全ツール「一本道UI」へ刷新完了。</p>
        </div>

        <section className="mb-40">
          <SectionTitle emoji="🆓" title="Free AI" color="border-emerald-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {freeTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-40">
          <SectionTitle emoji="🏨" title="B2B Suite" color="border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {hotelTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-40">
          <SectionTitle emoji="🛡️" title="Defense" color="border-red-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {defenseTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-40">
          <SectionTitle emoji="🛍️" title="Business" color="border-teal-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {bizTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mb-40">
          <SectionTitle emoji="🎨" title="Creative" color="border-purple-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {creativeTools.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
