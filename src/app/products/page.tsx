import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, Building2, Hotel, Key, type LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIツール一覧',
  description: 'NextraLabsの全てのAIツール。20種類以上の強力なAIが使い放題。',
}

interface Product {
  id: string; title: string; subtitle: string; description: string; priceNote: string; tags: string[]; icon: LucideIcon; bgColor: string; iconColor: string; status: string;
}

// 🆓 FREE TOOLS (1ST PRIORITY)
const freeTools: Product[] = [
  { id: 'office-politics-graph', title: '社内政治 相関図', subtitle: '人間関係の可視化', description: '組織図に載らない本当の関係をAIが分析。キーマンを見抜くツール。', priceNote: '無料', tags: ['分析', '無料'], icon: Network, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: '人気' },
  { id: 'moving-checker', title: '引っ越し安心チェッカー', subtitle: '治安・騒音スコア', description: '物件の「見えないリスク」をAIが数値化。後悔しない引っ越しを。', priceNote: '無料', tags: ['治安', '不動産'], icon: Home, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', status: '定番' },
  { id: 'sns-auto-poster', title: 'SNSオートポスター', subtitle: 'マルチ投稿文生成', description: 'トピックから投稿文とハッシュタグを自動生成。効率的なSNS運用を。', priceNote: '無料', tags: ['SNS', '自動化'], icon: Share2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '無料' },
  { id: 'kdp-guide', title: 'Kindle出版ナビ', subtitle: '電子書籍出版ガイド', description: 'KDPアカウント設定から出版申請まで、ステップ式で迷わず完了。', priceNote: '無料', tags: ['副業', 'Kindle'], icon: BookOpen, bgColor: 'bg-orange-500/10', iconColor: 'text-orange-400', status: '無料' },
]

// 🏨 HOTEL & MINPAKU
const hotelTools: Product[] = [
  { id: 'staysee-ai-finder', title: 'Staysee AI Finder', subtitle: '画像解析 × 宿泊者照合', description: '忘れ物を撮影してAIが持ち主を特定。フロントの電話対応を激減させます。', priceNote: 'プレミアム', tags: ['B2B', 'ホテルDX'], icon: Building2, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '新着' },
]

// 🛡️ DEFENSE & LIFE
const defenseTools: Product[] = [
  { id: 'scam-defender', title: 'AI詐欺ディフェンダー', subtitle: '詐欺・闇バイト判定', description: '不審な連絡をAIが即判定。最新の詐欺手口から家族を守ります。', priceNote: 'プレミアム', tags: ['防犯', '安心'], icon: ShieldCheck, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
  { id: 'money-guard', title: 'AI家計防衛', subtitle: '依存防止シミュレーター', description: '収支を数学的に分析し、ギャンブル依存や認知バイアスを診断。', priceNote: 'スタンダード', tags: ['家計', '数学'], icon: Wallet, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: 'NEW' },
  { id: 'disaster-guard', title: 'AI防災ガイド', subtitle: '避難所検索 × 防災プラン', description: '現在地から避難所を検索。家族に最適な防災プランを提案します。', priceNote: 'スタンダード', tags: ['防災', 'GPS'], icon: Shield, bgColor: 'bg-sky-500/10', iconColor: 'text-sky-400', status: 'NEW' },
  { id: 'resignation-assistant', title: '退職あんしんAI', subtitle: '退職届・権利Q&A', description: 'AIが退職届を自動生成。残業代計算や法的な権利も完全サポート。', priceNote: 'ライト', tags: ['キャリア', '法律'], icon: ClipboardCheck, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400', status: '安心' },
]

// 🛍️ BUSINESS & CREATIVE
const bizTools: Product[] = [
  { id: 'vintage-hunter', title: '古着お買い得ハンター', subtitle: 'メルカリ自動監視', description: 'お宝品をAIが24時間監視。見つけ次第Discordへ通知します。', priceNote: 'プレミアム', tags: ['副業', '監視'], icon: Search, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', status: '最強' },
  { id: 'ai-select-shop', title: 'AIセレクトショップ', subtitle: '在庫ゼロの物販', description: 'トレンドからTシャツを自動デザイン。そのままShopify出品まで完遂。', priceNote: 'プレミアム', tags: ['物販', '一本道UI'], icon: Store, bgColor: 'bg-teal-500/10', iconColor: 'text-teal-400', status: '人気' },
  { id: 'inbox-organizer', title: 'Gmail AI Accelerator', subtitle: 'Inbox Zeroを実現', description: '受信メールを自動分類・返信案生成。受信トレイを瞬時に整理。', priceNote: 'プレミアム', tags: ['Gmail', '効率化'], icon: Mail, bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400', status: 'NEW' },
  { id: 'ai-sidejob', title: 'AI副業スタートダッシュ', subtitle: '適性診断 × ロードマップ', description: 'あなたに最適なAI副業を診断。月10万達成までの道を完全ガイド。', priceNote: 'ライト', tags: ['副業', '診断'], icon: Briefcase, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', status: 'NEW' },
  { id: 'prompt-master', title: 'AIプロンプトマスター', subtitle: '画像生成AIプロンプト', description: '日本語のイメージを高品質な英語プロンプトへ。画像制作が捗ります。', priceNote: 'ライト', tags: ['画像AI', '変換'], icon: Wand2, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-400', status: '必須' },
  { id: 'youtube-producer', title: 'AI YouTube', subtitle: '投稿素材の全自動生成', description: '文字起こしから台本、サムネイル案まで。制作を一本道で。', priceNote: 'プレミアム', tags: ['動画', '一本道UI'], icon: Clapperboard, bgColor: 'bg-red-500/10', iconColor: 'text-red-400', status: '注目' },
]

// 🐾 FUN & ENTERTAINMENT
const funTools: Product[] = [
  { id: 'location-finder', title: 'AI Location Scout', subtitle: '動画の場所を特定', description: 'YouTube URLから撮影場所を特定。Google Mapsにピン表示します。', priceNote: 'プレミアム', tags: ['旅行', '調査'], icon: MapPin, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-400', status: '驚き' },
  { id: 'pet-translator', title: 'AIペット翻訳', subtitle: '鳴き声リアルタイム解析', description: '留守中のペットの声を解析し、感情を日本語で通知します。', priceNote: 'プレミアム', tags: ['エンタメ', '癒し'], icon: PawPrint, bgColor: 'bg-pink-500/10', iconColor: 'text-pink-400', status: 'NEW' },
  { id: 'smart-gardening', title: 'AI万能スコープ', subtitle: '視覚解析 × 環境データ', description: 'カメラで対象を捉えるだけで、AIが周辺環境と視覚情報を統合分析。', priceNote: 'プレミアム', tags: ['調査', '万能'], icon: Zap, bgColor: 'bg-yellow-500/10', iconColor: 'text-yellow-400', status: '万能' },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full bg-[#1a1b23] border-slate-800 hover:border-emerald-500/30 transition-all duration-300 rounded-[2.5rem] overflow-hidden group shadow-xl">
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
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">AIを、日常のパートナーに。</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">全20種類以上のNextraLabs AIツール。無料からプロ仕様まで網羅。</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-emerald-500 pl-6"><h2 className="text-3xl font-bold text-white italic uppercase tracking-tighter">🆓 無料ツール</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{freeTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-blue-500 pl-6"><h2 className="text-3xl font-bold text-white italic uppercase tracking-tighter">🏨 ホテル・民泊オーナー様向け</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hotelTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-red-500 pl-6"><h2 className="text-3xl font-bold text-white italic uppercase tracking-tighter">🛡️ 防衛・ライフ</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{defenseTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-teal-500 pl-6"><h2 className="text-3xl font-bold text-white italic uppercase tracking-tighter">🛍️ ビジネス・クリエイティブ</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{bizTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8 border-l-4 border-pink-500 pl-6"><h2 className="text-3xl font-bold text-white italic uppercase tracking-tighter">🐾 エンタメ・趣味</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{funTools.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    </div>
  )
}
