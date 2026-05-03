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
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, Ticket, BookOpen, type LucideIcon } from 'lucide-react'

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

// 🛡️ 防衛シリーズ — 暮らしを守る
const defenseTools: Product[] = [
  {
    id: 'scam-defender',
    title: 'AI詐欺ディフェンダー',
    subtitle: '詐欺メール判定 × 闇バイト判定 × 詐欺シミュレーション × 家族見守り',
    description:
      '不審メールをAIで即判定、闇バイト判定チェッカーで危険度スコア化、詐欺電話シミュレーターで断り方を練習。7つの機能で家族を守る。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['詐欺メールAI判定', '闇バイト判定', '詐欺クイズ', '家族見守り'],
    icon: ShieldCheck,
    color: 'from-amber-500 to-red-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '人気',
  },
  {
    id: 'money-guard',
    title: 'AI家計防衛シミュレーター',
    subtitle: '収支トラッカー × 期待値計算 × 依存度チェック',
    description:
      'ギャンブル収支を可視化し、期待値を数学的に解説。「もし貯金してたら」シミュレーター、認知バイアス診断、相談窓口ガイドまで。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['収支トラッカー', '期待値計算', '依存度チェック', '認知バイアス'],
    icon: Wallet,
    color: 'from-emerald-500 to-amber-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: 'NEW',
  },
  {
    id: 'disaster-guard',
    title: 'AI防災パーソナルガイド',
    subtitle: 'GPS避難所検索 × 家族防災プラン × 気象警報API',
    description:
      '現在地から最寄り避難所を自動検索、家族の避難プランを事前作成、気象庁APIで警報をリアルタイム確認。防災チェックリスト＆知識クイズも。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['GPS', '気象庁API', '防災', '避難所検索'],
    icon: Shield,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    status: 'NEW',
  },
  {
    id: 'shopping-stopper',
    title: 'AI買い物依存ストッパー',
    subtitle: 'カメラ表情解析 × 衝動買い防止AI',
    description: 'カート画面で「高揚感」を検知するとAIが冷静な判断を促し決済を一定時間ロック。衝動買いデータから後悔する確率を予測。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['TensorFlow.js', 'Canvas API', 'AI', '行動分析'],
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: 'NEW',
  },
]

// 💬 コミュニケーション — 人間関係を磨く
const commTools: Product[] = [
  {
    id: 'comm-coach',
    title: 'AIコミュニケーション改善コーチ',
    subtitle: '心理学ベース × メッセージ添削 × 自己診断',
    description:
      '心理学理論に基づいてメッセージを添削、コミュスタイルを4タイプ診断、場面別の会話プランナーでスキルアップ。恋愛もビジネスも友人関係も。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['メッセージ添削', 'コミュ診断', '心理学講座', 'NG＆OK集'],
    icon: MessageCircleHeart,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: 'NEW',
  },
  {
    id: 'ai-konkatsu',
    title: 'AI婚活コーチ',
    subtitle: 'プロフィール添削 × メッセージ練習 × 相性診断',
    description:
      'マッチングアプリのプロフィールをAIが添削、メッセージの練習シミュレーター、価値観診断、デートプラン提案、婚活戦略分析まで。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['プロフィール添削', 'メッセージ練習', '相性診断', 'デートプラン'],
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: 'NEW',
  },
  {
    id: 'buzz-writer',
    title: 'AIバズ文章コーチ',
    subtitle: 'トレンドニュース × テンプレート × 画像生成',
    description:
      '今日のニュースをネタに、自分の言葉でバズらせる。10種類のテンプレート、バズ度診断、投稿画像ジェネレーター、ハッシュタグ辞典。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['トレンドニュース', 'バズ度診断', '画像生成', 'ハッシュタグ'],
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: 'NEW',
  },
  {
    id: 'shio-taiou',
    title: '塩対応代行AI',
    subtitle: '義実家・親戚・上司からの重い連絡を角が立たずに断る',
    description:
      '6つのシチュエーション×3段階のトーンで最適な断り文を一瞬生成。既読タイミング提案とプロのコツ付き。完全オフライン。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['返信生成', '既読タイミング', 'テンプレート', '人間関係'],
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: 'NEW',
  },
]

// 🏢 キャリア・ライフ — 人生の転機をサポート
const lifeTools: Product[] = [
  {
    id: 'resignation-assistant',
    title: '退職あんしんAI',
    subtitle: '退職届生成 × 残業代計算 × 完全チェックリスト',
    description:
      'AIが退職届を自動作成、未払い残業代を計算、有給・社保・年金の手続きまで完全ガイド。退職代行サービスの比較や権利Q&Aも搭載。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['退職届AI生成', '残業代計算', 'チェックリスト', '権利Q&A'],
    icon: ClipboardCheck,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
  {
    id: 'exam-scheduler',
    title: '資格試験 AIスケジューラー',
    subtitle: 'RSS試験日取得 × AI学習計画生成 × Googleカレンダー自動登録',
    description:
      '試験日をRSSから自動取得し、AIが基礎固め→応用演習→直前対策の学習スケジュールを生成。ワンクリックでGoogleカレンダーに一括登録。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['RSS', 'Claude AI', 'Google Calendar', 'IPA/CompTIA'],
    icon: BookOpen,
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
  {
    id: 'closet-coach',
    title: 'AIクローゼット断捨離コーチ',
    subtitle: 'ワードローブ管理 × コスパ分析 × 売却ガイド',
    description:
      '持ってる服のコスパを可視化、断捨離候補をAI判定。売却想定価格＆プラットフォーム比較、コーデ提案まで。クローゼットを最適化。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['クローゼット管理', 'コスパ分析', '断捨離AI', '売却ガイド'],
    icon: Shirt,
    color: 'from-violet-500 to-fuchsia-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: 'NEW',
  },
]

// 🛍️ ビジネス・副業 — AIで稼ぐ
const bizTools: Product[] = [
  {
    id: 'vintage-hunter',
    title: 'AI古着お買い得ハンター',
    subtitle: 'AI搭載メルカリ自動監視ボット',
    description:
      'メルカリの新着出品を24時間自動監視し、AIが「お買い得」と判断した瞬間にDiscordへ通知。寝てる間にお宝古着を見逃さない。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['Python', 'AWS Lambda', 'AI', 'Discord'],
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: 'NEW',
  },
  {
    id: 'ai-select-shop',
    title: '「在庫ゼロ」AIセレクトショップ',
    subtitle: 'トレンド分析 × AI自動デザイン × オンデマンド出品',
    description:
      'AIがバズワードを分析しTシャツデザインを自動生成。注文時にオンデマンド製造・配送。在庫リスクゼロのAIファッションビジネス。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['AI Design', 'Printful API', 'トレンド分析', 'Shopify'],
    icon: Store,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: 'NEW',
  },
  {
    id: 'ai-sidejob',
    title: 'AI副業スタートダッシュ',
    subtitle: '13カテゴリ × 適性診断 × ロードマップ × 収益シミュレーター',
    description:
      'AI副業の「何から始めればいい？」から「月10万円達成」まで完全サポート。50+のAIツール辞典、テンプレート集、活動ログ搭載。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['13カテゴリ', '適性診断', 'テンプレート', '収益計算'],
    icon: Briefcase,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: 'NEW',
  },
  {
    id: 'inbox-organizer',
    title: 'Gmail AI Accelerator',
    subtitle: 'Gmail連携 × 自動分類 × AI返信 × ゴミ箱整理',
    description:
      'Gmailとワンクリック接続。受信メールを緊急×重要で自動分類、AIが返信文を生成、不要メールはワンクリックでゴミ箱へ。3分でInbox Zero。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['Gmail連携', 'AI返信', '自動分類', 'Inbox Zero'],
    icon: Mail,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
    status: 'NEW',
  },
]

// 🎨 クリエイティブ — AIで創作を加速
const creativeTools: Product[] = [
  {
    id: 'prompt-master',
    title: 'AI画像プロンプトマスター',
    subtitle: '26カテゴリ × 日本語→英語変換 × パラメータ辞典',
    description:
      '日本語で入力するだけで画像生成AI用の最適プロンプトを自動生成。Midjourney/DALL-E/Stable Diffusion対応。200+テンプレート搭載。',
    price: '¥480/月',
    priceNote: 'ライトプラン',
    tags: ['26カテゴリ', 'プロンプト生成', 'テンプレート', '画像AI'],
    icon: Wand2,
    color: 'from-purple-500 to-fuchsia-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    status: 'NEW',
  },
  {
    id: 'youtube-producer',
    title: 'AI YouTubeプロデューサー',
    subtitle: '文字起こし→台本→人物画像→サムネイル→タイトル→BGM',
    description:
      '動画・音声・テキストを取り込んで6ステップでYouTube投稿素材を全自動生成。10ジャンル対応の台本、AI人物イラスト、サムネイル、SEOタイトル、BGM作曲。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['6ステップ', '10ジャンル', '文字起こし', 'サムネイル'],
    icon: Clapperboard,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: 'NEW',
  },
]

// 🐾 エンタメ・趣味
const funTools: Product[] = [
  {
    id: 'location-finder',
    title: 'AI Location Scout',
    subtitle: 'YouTube URLを貼るだけ → Gemini AIが解析 → Google Mapsにピン表示',
    description:
      'YouTube URLを貼るだけで、サムネイル3枚をGemini AIが解析し、撮影場所をGoogle Mapsにピンポイント表示。建物・看板・地形から場所を推定。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['Gemini Vision', 'Google Maps', '場所特定', '1日1回'],
    icon: MapPin,
    color: 'from-blue-500 to-violet-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: 'NEW',
  },
  {
    id: 'ticket-scout',
    title: 'Ticket Scout',
    subtitle: 'e+ / ローチケ / チケットぴあ 一括検索 → 発売日をカレンダーに自動登録',
    description:
      'アーティスト名を入力するだけで3大チケットサイトを横断検索。チケット発売日・発売時刻をGoogle Calendarに自動登録し、リマインダーまで設定。',
    price: '¥980/月',
    priceNote: 'スタンダードプラン',
    tags: ['e+', 'ローチケ', 'チケットぴあ', 'Google Calendar'],
    icon: Ticket,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: 'NEW',
  },

  {
    id: 'pet-translator',
    title: 'AIペット翻訳モニター',
    subtitle: 'AI搭載ペット感情リアルタイム翻訳システム',
    description:
      '留守中のペットの動きと鳴き声をAIがリアルタイム解析。「寂しがっています」「お腹が空きました」と感情を日本語で翻訳して通知。',
    price: '¥1,980/月',
    priceNote: 'プレミアムプラン',
    tags: ['HTML5', 'Web Audio API', 'AI', 'LINE通知'],
    icon: PawPrint,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: 'NEW',
  },
]

// ==================== Section Component ====================
interface SectionProps {
  emoji: string
  title: string
  subtitle: string
  accentColor: string
  products: Product[]
}

function ProductSection({ emoji, title, subtitle, accentColor, products }: SectionProps) {
  if (products.length === 0) return null
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${accentColor}`}>
          {products.length}ツール
        </span>
      </div>
      <p className="text-muted-foreground mb-6 ml-10">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// ==================== Product Card ====================
function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${product.bgColor}`}>
            <Icon className={`h-6 w-6 ${product.iconColor}`} />
          </div>
          <Badge className={
            product.status === '🆓 無料' ? 'bg-blue-500 text-white border-0' :
            product.status === 'NEW' ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white border-0' :
            product.status === '人気' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0' :
            'bg-green-500 text-white border-0'
          }>
            {product.status}
          </Badge>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3">{product.subtitle}</p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{product.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t mt-auto">
          <div>
            {product.priceNote === '無料' ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/40 shadow-sm">
                🆓 無料
              </span>
            ) : product.priceNote === 'プレミアムプラン' ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/40 shadow-sm">
                👑 プレミアム
              </span>
            ) : product.priceNote === 'ライトプラン' ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/40 shadow-sm">
                ⚡ ライト
              </span>
            ) : product.priceNote === 'スタンダードプラン' ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-2 ring-sky-500/40 shadow-sm">
                ⚡ スタンダード
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-muted text-muted-foreground ring-2 ring-border shadow-sm">
                {product.priceNote}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}/app`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 transition-opacity"
            >
              <Rocket className="h-3 w-3" />
              使う
            </Link>
            <Link href={`/products/${product.id}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                詳細
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Coming Soon ====================
const comingSoon: { title: string; description: string; icon: any; color: string; bgColor: string; iconColor: string }[] = []

// ==================== Page ====================
export default function ProductsPage() {
  const totalTools = freeTools.length + defenseTools.length + commTools.length + lifeTools.length + bizTools.length + creativeTools.length + funTools.length

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          サブスクAI ツール
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            一覧
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          ¥480〜4つのプランで提供。無料ツールはアカウント不要。
        </p>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{totalTools}</span>
            <span className="text-muted-foreground">ツール</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl text-blue-500">{freeTools.length}</span>
            <span className="text-muted-foreground">無料ツール</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl text-violet-500">7</span>
            <span className="text-muted-foreground">プレミアム</span>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <a href="#free" className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">🆓 無料体験</a>
        <a href="#defense" className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors">🛡️ 防衛シリーズ</a>
        <a href="#comm" className="px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-colors">💬 コミュニケーション</a>
        <a href="#life" className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">🏢 キャリア・ライフ</a>
        <a href="#biz" className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">🛍️ ビジネス・副業</a>
        <a href="#creative" className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors">🎨 クリエイティブ</a>
        <a href="#fun" className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">🐾 エンタメ・趣味</a>
      </div>

      {/* FREE */}
      <div id="free">
        <ProductSection
          emoji="🆓"
          title="無料ツール"
          subtitle="アカウント不要・今すぐ使える無料AIツール"
          accentColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          products={freeTools}
        />
      </div>

      {/* DEFENSE SERIES */}
      <div id="defense">
        <ProductSection
          emoji="🛡️"
          title="防衛シリーズ"
          subtitle="詐欺・お金・住まい・災害…暮らしのリスクからあなたを守る"
          accentColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          products={defenseTools}
        />
      </div>

      {/* COMMUNICATION */}
      <div id="comm">
        <ProductSection
          emoji="💬"
          title="コミュニケーション"
          subtitle="恋愛・婚活・SNS…人間関係のスキルを磨く"
          accentColor="bg-pink-500/10 text-pink-600 dark:text-pink-400"
          products={commTools}
        />
      </div>

      {/* CAREER & LIFE */}
      <div id="life">
        <ProductSection
          emoji="🏢"
          title="キャリア・ライフ"
          subtitle="退職・断捨離…人生の転機をAIがサポート"
          accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          products={lifeTools}
        />
      </div>

      {/* BUSINESS */}
      <div id="biz">
        <ProductSection
          emoji="🛍️"
          title="ビジネス・副業"
          subtitle="AIを使って効率よく稼ぐ"
          accentColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          products={bizTools}
        />
      </div>

      {/* CREATIVE */}
      <div id="creative">
        <ProductSection
          emoji="🎨"
          title="クリエイティブ"
          subtitle="画像生成AI・デザイン…創作を加速する"
          accentColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          products={creativeTools}
        />
      </div>

      {/* FUN */}
      <div id="fun">
        <ProductSection
          emoji="🐾"
          title="エンタメ・趣味"
          subtitle="AIで毎日をちょっと楽しく"
          accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          products={funTools}
        />
      </div>

      {/* Plan CTA */}
      <div className="my-16 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">4つのプランで全ツール解放</h2>
        <div className="flex flex-wrap gap-4 justify-center items-center mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-cyan-400 font-bold text-sm">ライト</span>
            <span className="text-2xl font-bold text-cyan-400">¥480</span>
            <span className="text-muted-foreground text-xs">/月</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sky-400 font-bold text-sm">スタンダード</span>
            <span className="text-2xl font-bold text-sky-400">¥980</span>
            <span className="text-muted-foreground text-xs">/月</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-baseline gap-1">
            <span className="text-violet-400 font-bold text-sm">プレミアム</span>
            <span className="text-2xl font-bold text-violet-400">¥1,980</span>
            <span className="text-muted-foreground text-xs">/月（全{totalTools}ツール）</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">いつでも解約OK ✨ 無料ツールはアカウント不要</p>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-bold hover:opacity-90">
            プランを見る →
          </Button>
        </Link>
      </div>

      {/* Coming Soon — 空なら非表示 */}
      {comingSoon.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            🚧 開発中
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoon.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="h-full opacity-60 cursor-default">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bgColor}`}>
                        <Icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
