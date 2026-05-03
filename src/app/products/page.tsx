import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'AIツール一覧',
  description: '資格試験スケジューラー・AIペット翻訳・古着ハンターなど20以上のAIツール。月額¥980のスタンダードプランまたは¥1,980のプレミアムプランで全て使い放題。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products' },
  openGraph: { title: 'AIツール一覧 | NextraLabs', description: '20以上のAIツールが月額¥980〜使い放題。', url: 'https://membership-site-nextralabos.vercel.app/products', type: 'website' },
}
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, Sprout, Zap, Droplets, Utensils, type LucideIcon } from 'lucide-react'

// ==================== Product Type ====================
interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  price: string
  priceNote: string
  tags: string[]
  icon: LucideIcon
  color: string
  bgColor: string
  iconColor: string
  status: string
}

// ==================== Product Data ====================
const freeTools: Product[] = [
  {
    id: 'office-politics-graph',
    title: '社内政治 相関図',
    subtitle: 'Slack × カレンダー関係性可視化ツール',
    description:
      '組織図には載らない「本当の人間関係」を可視化。Slackメンション傾向とカレンダー会議データから、隠れたキーマンやブリッジ役を自動検出。',
    price: '無料',
    priceNote: '無料',
    tags: ['D3.js', 'PageRank', 'データ分析', '無料サンプル'],
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    status: '🆓 無料',
  },
  {
    id: 'moving-checker',
    title: 'AI引っ越し安心チェッカー',
    subtitle: 'エリア安全度 × 騒音リスク × トラブル予防',
    description:
      '物件の「見えないリスク」を事前にスコア化。治安・騒音・物件チェック30項目・トラブル対処テンプレート・引っ越しコスト計算まで。',
    price: '無料',
    priceNote: '無料',
    tags: ['エリア安全度', '騒音リスク', '30項目チェック', 'トラブル対処'],
    icon: Home,
    color: 'from-blue-500 to-green-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '🆓 無料',
  },
  {
    id: 'sns-auto-poster',
    title: 'SNSオートポスター',
    subtitle: 'AI × マルチプラットフォームSNS投稿生成',
    description:
      'トピックを入力するだけで、Twitter・Instagram・Facebook・LinkedIn向けの投稿文を自動生成。ハッシュタグ提案付き。',
    price: '無料',
    priceNote: '無料',
    tags: ['SNS', 'マーケティング', 'コピーライティング', '無料'],
    icon: Share2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '🆓 無料',
  },
  {
    id: 'kdp-guide',
    title: 'Kindle出版手順ナビ',
    subtitle: 'Amazon Kindle出版を迷わず完了 — ステップ式ガイド',
    description:
      'KDPアカウント設定から原稿作成・価格設定・出版申請まで、チェックリスト形式で一歩ずつ進められる。個人出版デビューをサポート。',
    price: '無料',
    priceNote: '無料',
    tags: ['Kindle出版', '電子書籍', 'KDP', '副業'],
    icon: BookOpen,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: '🆓 無料',
  },
  {
    id: 'ai-report-generator',
    title: 'AIレポートジェネレーター',
    subtitle: '箇条書き → ビジネスレポート自動生成',
    description:
      '箇条書きのメモからプロフェッショナルなビジネスレポートを自動生成。週次報告・月次報告・プロジェクト報告に対応。',
    price: '無料',
    priceNote: '無料',
    tags: ['レポート', 'ビジネス文書', '自動生成', '無料'],
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-500',
    status: '🆓 無料',
  },
]

const defenseTools: Product[] = [
  {
    id: 'scam-defender',
    title: 'AI詐欺ディフェンダー',
    subtitle: '詐欺メール判定 × 家族見守り',
    description: '不審メールをAIで即判定。最新の詐欺手口から家族を守る守護神。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['詐欺判定', '家族見守り', 'セキュリティ'],
    icon: ShieldCheck,
    color: 'from-amber-500 to-red-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '人気',
  },
  {
    id: 'money-guard',
    title: 'AI家計防衛シミュレーター',
    subtitle: '収支トラッカー × 期待値計算',
    description: 'ギャンブル収支や日常の無駄遣いを可視化。将来の資産をAIが予測。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['資産形成', '期待値計算'],
    icon: Wallet,
    color: 'from-emerald-500 to-amber-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: 'NEW',
  },
  {
    id: 'disaster-guard',
    title: 'AI防災パーソナルガイド',
    subtitle: 'GPS避難所検索 × 防災プラン',
    description: '現在地から最寄り避難所を検索。家族を守るための防災計画をAIが立案。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['防災', 'GPS連動'],
    icon: Shield,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    status: 'NEW',
  },
  {
    id: 'shopping-stopper',
    title: 'AI買い物依存ストッパー',
    subtitle: '衝動買い防止AI',
    description: '高揚感を検知して冷静な判断を促す、買い過ぎ防止のアシスタント。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['行動分析', '節約'],
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: 'NEW',
  },
]

const commTools: Product[] = [
  {
    id: 'comm-coach',
    title: 'AIコミュニケーション改善コーチ',
    subtitle: '心理学ベース × メッセージ添削',
    description: 'メッセージを心理学的に添削。相手に好印象を与える会話術をAIが指導。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['メッセージ添削', '心理学'],
    icon: MessageCircleHeart,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: 'NEW',
  },
  {
    id: 'ai-konkatsu',
    title: 'AI婚活コーチ',
    subtitle: 'プロフィール添削 × 相性診断',
    description: 'マッチングアプリの成約率を最大化。魅力的なプロフと会話をAIが作成。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['婚活', 'プロフィール添削'],
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: 'NEW',
  },
  {
    id: 'buzz-writer',
    title: 'AIバズ文章コーチ',
    subtitle: 'トレンド解析 × 文章生成',
    description: 'SNSでバズる文章をAIが伝授。ハッシュタグから構成まで全自動。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['SNS', 'ライティング'],
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: 'NEW',
  },
  {
    id: 'shio-taiou',
    title: '塩対応代行AI',
    subtitle: '角が立たない断り文生成',
    description: '重い連絡を自然に断る文章を生成。既読スルーのタイミングも提案。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['人間関係', 'テンプレート'],
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: 'NEW',
  },
]

const lifeTools: Product[] = [
  {
    id: 'resignation-assistant',
    title: '退職あんしんAI',
    subtitle: '退職届生成 × チェックリスト',
    description: 'AIが退職届を作成。社保や年金の手続きを完全ガイド。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['退職サポート', 'キャリア'],
    icon: ClipboardCheck,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
  {
    id: 'exam-scheduler',
    title: '資格試験 AIスケジューラー',
    subtitle: 'Googleカレンダー自動登録',
    description: 'RSSから試験日を取得し、最適な学習計画を自動で生成・登録。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['学習計画', 'カレンダー連携'],
    icon: BookOpen,
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
  {
    id: 'closet-coach',
    title: 'AIクローゼット断捨離コーチ',
    subtitle: '服のコスパ解析 × 断捨離',
    description: '持っている服を可視化し、コスパの低い服をAIが判定。売却もガイド。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['断捨離', 'クローゼット'],
    icon: Shirt,
    color: 'from-violet-500 to-fuchsia-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: 'NEW',
  },
]

const bizTools: Product[] = [
  {
    id: 'vintage-hunter',
    title: 'AI古着お買い得ハンター',
    subtitle: 'メルカリ自動監視ボット',
    description: 'お宝古着を24時間AIが監視しDiscordへ通知。仕入れを自動化。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['物販', 'Discord通知'],
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: 'NEW',
  },
  {
    id: 'ai-select-shop',
    title: '「在庫ゼロ」AIセレクトショップ',
    subtitle: 'AI自動デザイン × EC出品',
    description: 'AIがバズワードからTシャツを自動デザイン。注文時にオンデマンド製造。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['AIデザイン', 'Shopify連携'],
    icon: Store,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: 'NEW',
  },
  {
    id: 'ai-sidejob',
    title: 'AI副業スタートダッシュ',
    subtitle: '適性診断 × ロードマップ',
    description: '13カテゴリから最適なAI副業を提案。収益化までを完全ガイド。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['副業', '適性診断'],
    icon: Briefcase,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: 'NEW',
  },
  {
    id: 'inbox-organizer',
    title: 'Gmail AI Accelerator',
    subtitle: 'Gmail自動整理 × AI返信',
    description: '受信メールをAIが自動分類。不要メールは一括でゴミ箱へ。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['Gmail連携', '時短'],
    icon: Mail,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
    status: 'NEW',
  },
]

const creativeTools: Product[] = [
  {
    id: 'prompt-master',
    title: 'AI画像プロンプトマスター',
    subtitle: '26カテゴリ × パラメータ辞典',
    description: '日本語入力でMidjourney等の最強プロンプトを自動生成。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['画像AI', 'プロンプト生成'],
    icon: Wand2,
    color: 'from-purple-500 to-fuchsia-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    status: 'NEW',
  },
  {
    id: 'youtube-producer',
    title: 'AI YouTubeプロデューサー',
    subtitle: '台本 → 画像 → サムネ全自動',
    description: 'YouTube投稿素材を6ステップで全自動生成。台本からBGMまで。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['YouTube', '自動生成'],
    icon: Clapperboard,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: 'NEW',
  },
]

const funTools: Product[] = [
  {
    id: 'location-finder',
    title: 'AI Location Scout',
    subtitle: '動画から場所を特定',
    description: 'YouTube URLから撮影場所をAIが特定し地図にピンを表示。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['場所特定', 'Gemini Vision'],
    icon: MapPin,
    color: 'from-blue-500 to-violet-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
  {
    id: 'ticket-scout',
    title: 'Ticket Scout',
    subtitle: 'チケット一括検索 × カレンダー',
    description: '3大サイトを横断検索。発売日をカレンダーに自動登録。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['チケット', 'カレンダー連携'],
    icon: Ticket,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: 'NEW',
  },
  {
    id: 'pet-translator',
    title: 'AIペット翻訳モニター',
    subtitle: 'ペット感情リアルタイム翻訳',
    description: '留守中のペットの感情を日本語に翻訳。LINEで通知。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['ペット', '感情分析'],
    icon: PawPrint,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: 'NEW',
  },
]

// 🛠️ 作成中ジャンル — 全プラン利用不可
const developmentTools: Product[] = [
  {
    id: 'smart-gardening',
    title: 'AIリアルタイム・スコープ',
    subtitle: '視覚解析 × 位置情報 × 環境データ',
    description: 'カメラで対象を捉えるだけでAIが周辺環境と視覚情報を統合分析。※現在、仕様調整中のため利用できません。',
    price: '非公開',
    priceNote: '作成中',
    tags: ['万能診断', '画像解析', '作成中'],
    icon: Zap,
    color: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-500/10',
    iconColor: 'text-slate-500',
    status: '🚧 開発中',
  },
  {
    id: 'ai-recipe',
    title: 'AIレシピ・スコープ',
    subtitle: '冷蔵庫スキャン × YouTube連動',
    description: '残り物の写真を撮るだけでAIがレシピと動画を提案。※現在、仕様調整中のため利用できません。',
    price: '非公開',
    priceNote: '作成中',
    tags: ['レシピ', '画像解析', '作成中'],
    icon: Utensils,
    color: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-500/10',
    iconColor: 'text-slate-500',
    status: '🚧 開発中',
  },
]

// ==================== Section Component ====================
function ProductSection({ emoji, title, subtitle, accentColor, products }: any) {
  if (products.length === 0) return null
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${accentColor}`}>{products.length}ツール</span>
      </div>
      <p className="text-muted-foreground mb-6 ml-10">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  const isDev = product.status.includes('🚧')

  return (
    <Card className={`h-full bg-slate-900/50 border-slate-800 transition-all duration-300 group ${isDev ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-slate-700 hover:bg-slate-900'}`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${product.bgColor}`}>
            <Icon className={`h-6 w-6 ${product.iconColor}`} />
          </div>
          <Badge className="bg-slate-800 text-slate-200 border-slate-700 font-bold">{product.status}</Badge>
        </div>

        <h3 className="text-xl font-bold mb-1 text-white">{product.title}</h3>
        <p className="text-xs text-slate-400 mb-3">{product.subtitle}</p>
        <p className="text-sm text-slate-300 mb-4 line-clamp-3">{product.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.map((tag) => (<Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-400 text-[10px] border-none">#{tag}</Badge>))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
          <span className="text-sm font-bold text-slate-400">{product.priceNote}</span>
          {!isDev && (
            <Link href={`/products/${product.id}/app`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold">使う <Rocket className="ml-1 h-3 w-3" /></Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
  const totalTools = freeTools.length + defenseTools.length + commTools.length + lifeTools.length + bizTools.length + creativeTools.length + funTools.length
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-4 text-center tracking-tighter uppercase italic">AI Tools Collection</h1>
        <p className="text-center text-slate-400 mb-16">NextraLabsが贈る、未来を切り拓くAIコレクション</p>

        <div id="free"><ProductSection emoji="🆓" title="無料ツール" subtitle="今すぐ使える無料AI" accentColor="bg-blue-500/10 text-blue-400" products={freeTools} /></div>
        <div id="defense"><ProductSection emoji="🛡️" title="防衛シリーズ" subtitle="リスクからあなたを守る" accentColor="bg-amber-500/10 text-amber-400" products={defenseTools} /></div>
        <div id="comm"><ProductSection emoji="💬" title="コミュニケーション" subtitle="人間関係を磨く" accentColor="bg-pink-500/10 text-pink-400" products={commTools} /></div>
        <div id="life"><ProductSection emoji="🏢" title="キャリア・ライフ" subtitle="人生の転機をサポート" accentColor="bg-violet-500/10 text-violet-400" products={lifeTools} /></div>
        <div id="biz"><ProductSection emoji="🛍️" title="ビジネス・副業" subtitle="AIを使って効率よく稼ぐ" accentColor="bg-emerald-500/10 text-emerald-400" products={bizTools} /></div>
        <div id="creative"><ProductSection emoji="🎨" title="クリエイティブ" subtitle="創作を加速する" accentColor="bg-purple-500/10 text-purple-400" products={creativeTools} /></div>
        <div id="fun"><ProductSection emoji="🐾" title="エンタメ・趣味" subtitle="AIで毎日を楽しく" accentColor="bg-violet-500/10 text-violet-400" products={funTools} /></div>
        
        {/* 作成中セクション */}
        <div id="dev" className="mt-20 border-t border-slate-900 pt-10 opacity-50 grayscale">
          <ProductSection emoji="🚧" title="作成中" subtitle="現在開発中の最新ツール（全プラン利用不可）" accentColor="bg-slate-500/10 text-slate-400" products={developmentTools} />
        </div>
      </div>
    </div>
  )
}
