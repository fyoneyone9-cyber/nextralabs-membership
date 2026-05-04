import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs',
  description: 'NextraLabsの全てのAIツール。使いやすさを追求したラインナップ。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string;
}

// ==================== ALL PRODUCTS (INDIVIDUAL CATEGORIES) ====================
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係をAIが視覚化', description: '組織図に載らない本当の関係を分析。キーマンを一瞬で見抜くツール。', priceNote: '無料', tags: ['分析', '無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気' },
  { id: 'moving-checker', title: '引っ越し安心AI', subtitle: '治安・騒音スコア', description: '物件の「見えないリスク」をAIが数値化。後悔しない引っ越しを。', priceNote: '無料', tags: ['治安', '不動産'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '定番' },
  { id: 'sns-auto-poster', title: 'SNS投稿生成', subtitle: '投稿・ハッシュタグ自動化', description: 'トピックから投稿文を一瞬で生成。複数SNSの運用を劇的に楽にします。', priceNote: '無料', tags: ['SNS', '自動化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '無料' },
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
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '投稿素材の全自動生成', description: '文字起こしから台本、サムネイルまで。動画制作を完全に一本道化。', priceNote: 'プレミアム', tags: ['動画', 'YouTube'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/40 transition-all duration-300 rounded-[2rem] overflow-hidden group shadow-xl">
      <CardContent className="p-8 flex flex-col h-full text-left">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform`}>
            <Icon className="h-8 w-8" />
          </div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-3 py-1 font-bold text-xs uppercase">{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4 italic">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Plan: {product.priceNote}</span>
          </div>
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/btn">
              <span>このツールを使う</span>
              <Rocket className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </Button>
          </Link>
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
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-20 space-y-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">Catalogue</Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">AIを、日常のパートナーに。</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">業務や暮らしを劇的に効率化する、NextraLabs自慢のAIツール群。</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        <section>
          <SectionTitle emoji="🆓" title="無料ツール" color="border-emerald-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🏨" title="ホテル・民泊オーナー様向け" color="border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <SectionTitle emoji="🛡️" title="防衛シリーズ" color="border-red-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        {/* 🛍️ BUSINESS (INDEPENDENT) */}
        <section>
          <SectionTitle emoji="🛍️" title="ビジネス・副業" color="border-teal-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        {/* 🎨 CREATIVE (INDEPENDENT) */}
        <section>
          <SectionTitle emoji="🎨" title="クリエイティブ" color="border-purple-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{creativeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    </div>
  )
}
