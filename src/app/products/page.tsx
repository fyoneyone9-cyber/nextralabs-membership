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

// ==================== PRODUCT DATA ====================
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の可視化', description: '組織図に載らない本当の関係をAIが分析。キーマンを見抜くツール。', priceNote: '無料', tags: ['分析', '無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気' },
  { id: 'moving-checker', title: '引っ越し安心チェッカー', subtitle: '治安・騒音スコア', description: '物件の「見えないリスク」をAIが数値化。後悔しない引っ越しを。', priceNote: '無料', tags: ['治安', '不動産'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '無料' },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'マルチ投稿文生成', description: 'トピックから投稿文とハッシュタグを自動生成。マーケ担当者必見。', priceNote: '無料', tags: ['SNS', '自動化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '無料' },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像解析 × 宿泊者照合', description: '忘れ物を撮影してAIが持ち主を特定。フロントの電話対応を劇的に減らします。', priceNote: 'プレミアム', tags: ['B2B', 'ホテルDX'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・闇バイト判定', description: '不審な連絡をAIが即判定。最新の詐欺手口から家族を守ります。', priceNote: 'プレミアム', tags: ['防犯', '安心'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
  { id: 'money-guard', title: 'AI家計防衛', subtitle: '依存防止シミュレーター', description: 'ギャンブル収支を数学的に分析。認知バイアスから家計を守ります。', priceNote: 'スタンダード', tags: ['家計', '数学'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: '古着お買い得ハンター', subtitle: 'メルカリ自動監視', description: 'お宝品をAIが24時間監視。見つけ次第Discordへ通知します。', priceNote: 'プレミアム', tags: ['副業', '監視'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強' },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: '在庫ゼロの物販', description: 'トレンドからTシャツを自動デザイン。そのまま出品まで完遂。', priceNote: 'プレミアム', tags: ['物販', 'Shopify'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気' },
]

const creativeTools: Product[] = [
  { id: 'prompt-master', title: 'AIプロンプトマスター', subtitle: '画像生成AIプロンプト', description: '日本語のイメージを高品質な英語プロンプトへ。画像制作が捗ります。', priceNote: 'ライト', tags: ['画像AI', '変換'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: 'NEW' },
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '投稿素材の全自動生成', description: '文字起こしから台本、サムネイル案まで。制作を一本道で。', priceNote: 'プレミアム', tags: ['動画', 'YouTube'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: 'NEW' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/30 transition-all duration-300 rounded-[2rem] overflow-hidden group shadow-xl">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform`}>
            <Icon className="h-8 w-8" />
          </div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-3 py-1 font-bold">{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4 italic">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4">
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

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-20 space-y-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">Catalogue</Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">AIツールを、<br/>もっと身近に。</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">日常や業務を劇的に効率化する、NextraLabsのAIツール群。</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-emerald-500 pl-6"><h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">🆓 無料ツール</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-blue-500 pl-6"><h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">🏨 ホテル・民泊オーナー様向け</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-red-500 pl-6"><h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">🛡️ 防衛シリーズ</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-teal-500 pl-6"><h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">🛍️ ビジネス・副業</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-purple-500 pl-6"><h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">🎨 クリエイティブ</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{creativeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    </div>
  )
}
