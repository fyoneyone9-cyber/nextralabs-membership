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
  description: 'NextraLabsの全てのAIツール。22種類以上の強力なAIを一本道UIで提供。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string;
}

// ==================== 🛠️ 憲法順守：全22ツール完全復活リスト ====================
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の可視化', description: '組織図に載らない本当の関係をAIが分析。', priceNote: '無料', tags: ['分析', '無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気' },
  { id: 'moving-checker', title: '引っ越し安心AI', subtitle: '治安・騒音スコア', description: '物件のリスクをAIが数値化。後悔しない引っ越しを。', priceNote: '無料', tags: ['治安', '不動産'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '無料' },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'マルチSNS投稿生成', description: 'トピックから投稿文を自動生成。ハッシュタグ案も。', priceNote: '無料', tags: ['SNS', '自動化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '無料' },
  { id: 'kdp-guide', title: 'Kindle出版ナビ', subtitle: '出版ステップガイド', description: 'KDPアカウント設定から出版申請まで、迷わず完了。', priceNote: '無料', tags: ['副業', 'Kindle'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '無料' },
  { id: 'ai-report-generator', title: 'AIレポート作成', subtitle: 'ビジネス文書自動化', description: '箇条書きからプロ級のレポートを生成。', priceNote: '無料', tags: ['事務', '効率化'], icon: FileText, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: '無料' },
]

const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像解析 × 宿泊者照合', description: '忘れ物を撮影しAIが持ち主を特定。フロント業務を激減。', priceNote: 'プレミアム', tags: ['B2B', 'Staysee'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺判定', description: '不審な連絡をAIが即判定。家族を守ります。', priceNote: 'プレミアム', tags: ['防犯', '家族'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
  { id: 'money-guard', title: 'AI家計防衛', subtitle: '依存防止', description: '収支を分析。認知バイアスを診断します。', priceNote: 'スタンダード', tags: ['家計', '数学'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
  { id: 'disaster-guard', title: 'AI防災ガイド', subtitle: '避難所 × 警報', description: '現在地の避難所を検索、防災プランを提案。', priceNote: 'スタンダード', tags: ['防災', 'GPS'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'NEW' },
  { id: 'shopping-stopper', title: '買い物依存防止', subtitle: '表情解析AI', description: '冷静な判断を促し、後悔する確率を予測。', priceNote: 'スタンダード', tags: ['節約', 'メンタル'], icon: ShieldAlert, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', status: 'NEW' },
]

const bizTools: Product[] = [
  { id: 'vintage-hunter', title: '古着ハンター', subtitle: 'メルカリ監視', description: '24時間監視しお宝品を即通知。', priceNote: 'プレミアム', tags: ['副業', '監視'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強' },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: '在庫ゼロ物販', description: 'トレンドからデザイン・出品まで。', priceNote: 'プレミアム', tags: ['物販', 'Shopify'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気' },
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '全自動動画制作', description: '文字起こしから台本、サムネイルまで。', priceNote: 'プレミアム', tags: ['動画', 'YouTube'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
  { id: 'prompt-master', title: 'AIプロンプト', subtitle: '英語変換', description: '日本語のイメージを高品質な英語へ。', priceNote: 'ライト', tags: ['画像AI', '変換'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/30 transition-all duration-300 rounded-[2rem] overflow-hidden group shadow-xl">
      <CardContent className="p-8 flex flex-col h-full text-left">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${product.bgColor} ${product.iconColor} group-hover:scale-110 transition-transform shadow-inner`}><Icon className="h-8 w-8" /></div>
          <Badge className="bg-slate-800 text-slate-400 border-0 px-3 py-1 font-bold text-[10px] uppercase">{product.status}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.title}</h3>
          <p className="text-emerald-400 text-sm font-medium mb-4 italic">{product.subtitle}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{product.description}</p>
        </div>
        <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 mt-auto">
          <Link href={`/products/${product.id}/app`} className="block w-full">
            <Button className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2 group/btn">
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
      <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-20 text-center mb-16 space-y-6">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">Catalogue</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">AIを、日常のパートナーに。</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">全22種類のNextraLabs AIツール。機能はそのまま、一本道UIで使いやすく。</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
        <section>
          <SectionTitle emoji="🆓" title="無料ツール体験" color="border-emerald-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
        <section>
          <SectionTitle emoji="🏨" title="ホテル・民泊オーナー様向け" color="border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
        <section>
          <SectionTitle emoji="🛡️" title="防衛・ライフ" color="border-red-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
        <section>
          <SectionTitle emoji="🛍️" title="ビジネス・クリエイティブ" color="border-teal-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    </div>
  )
}
