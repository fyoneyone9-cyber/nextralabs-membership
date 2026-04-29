import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield, Wand2, Briefcase, Clapperboard, Mail, type LucideIcon } from 'lucide-react'

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
    title: '社冁E��治 相関図',
    subtitle: 'Slack ÁEカレンダー関係性可視化チE�Eル',
    description:
      '絁E��図には載らなぁE��本当�E人間関係」を可視化。Slackメンション傾向とカレンダー会議チE�Eタから、E��れたキーマンめE��リチE��役を�E動検�E、E,
    price: '無斁E,
    priceNote: 'アカウント不要E,
    tags: ['D3.js', 'PageRank', 'チE�Eタ刁E��', '無料サンプル'],
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    status: '�E 無斁E,
  },
  {
    id: 'moving-checker',
    title: 'AI引っ越し安忁E��ェチE��ー',
    subtitle: 'エリア安�E度 ÁE騒音リスク ÁEトラブル予防',
    description:
      '物件の「見えなぁE��スク」を事前にスコア化。治安�E騒音・物件チェチE��30頁E��・トラブル対処チE��プレート�E引っ越しコスト計算まで、E,
    price: '無斁E,
    priceNote: '登録不要で今すぐ使える',
    tags: ['エリア安�E度', '騒音リスク', '30頁E��チェチE��', 'トラブル対処'],
    icon: Home,
    color: 'from-blue-500 to-green-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '�E 無斁E,
  },
]

// 🛡�E�E防衛シリーズ  E暮らしを守る
const defenseTools: Product[] = [
  {
    id: 'scam-defender',
    title: 'AI詐欺チE��フェンダー',
    subtitle: '詐欺シミュレーション ÁE闁E��イト判宁EÁE家族見守り',
    description:
      '詐欺電話シミュレーターで断り方を練習、E��バイト判定チェチE��ーで危険度を即判定。見守りチェチE��リストで家族�EセキュリチE��を強化、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['詐欺クイズ', '電話シミュレーター', '闁E��イト判宁E, '家族見守り'],
    icon: ShieldCheck,
    color: 'from-amber-500 to-red-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '人氁E,
  },
  {
    id: 'money-guard',
    title: 'AI家計防衛シミュレーター',
    subtitle: '収支トラチE��ー ÁE期征E��計箁EÁE依存度チェチE��',
    description:
      'ギャンブル収支を可視化し、期征E��を数学皁E��解説。「もし貯金してたら」シミュレーター、認知バイアス診断、相諁E��口ガイドまで、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['収支トラチE��ー', '期征E��計箁E, '依存度チェチE��', '認知バイアス'],
    icon: Wallet,
    color: 'from-emerald-500 to-amber-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: '販売中',
  },
  {
    id: 'disaster-guard',
    title: 'AI防災パ�EソナルガイチE,
    subtitle: 'GPS避難所検索 ÁE家族防災プラン ÁE気象警報API',
    description:
      '現在地から最寁E��避難所を�E動検索、家族�E避難プランを事前作�E、気象庁APIで警報をリアルタイム確認。防災チェチE��リスト！E��識クイズも、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['GPS', '気象庁API', '防災', '避難所検索'],
    icon: Shield,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    status: 'NEW',
  },
  {
    id: 'shopping-stopper',
    title: 'AI買ぁE��依存ストッパ�E',
    subtitle: 'カメラ表惁E��极EÁE衝動買ぁE��止AI',
    description: 'カート画面で「高揚感」を検知するとAIが�E静な判断を俁E��決済を一定時間ロチE��。衝動買ぁE��ータから後悔する確玁E��予測、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['TensorFlow.js', 'Canvas API', 'AI', '行動刁E��'],
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: '販売中',
  },
]

// 💬 コミュニケーション  E人間関係を磨ぁEconst commTools: Product[] = [
  {
    id: 'comm-coach',
    title: 'AIコミュニケーション改喁E��ーチE,
    subtitle: '忁E��学ベ�Eス ÁEメチE��ージ添剁EÁE自己診断',
    description:
      '忁E��学琁E��に基づぁE��メチE��ージを添削、コミュスタイルめEタイプ診断、場面別の会話プランナ�EでスキルアチE�E。恋愛もビジネスも友人関係も、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['メチE��ージ添剁E, 'コミュ診断', '忁E��学講座', 'NG�E�EK雁E],
    icon: MessageCircleHeart,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: '販売中',
  },
  {
    id: 'ai-konkatsu',
    title: 'AI婚活コーチE,
    subtitle: 'プロフィール添剁EÁEメチE��ージ練翁EÁE相性診断',
    description:
      'マッチングアプリのプロフィールをAIが添削、メチE��ージの練習シミュレーター、価値観診断、デート�Eラン提案、婚活戦略刁E��まで、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['プロフィール添剁E, 'メチE��ージ練翁E, '相性診断', 'チE�Eト�Eラン'],
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: '販売中',
  },
  {
    id: 'buzz-writer',
    title: 'AIバズ斁E��コーチE,
    subtitle: 'トレンドニュース ÁEチE��プレーチEÁE画像生戁E,
    description:
      '今日のニュースをネタに、�E刁E�E言葉でバズらせる、E0種類�EチE��プレート、バズ度診断、投稿画像ジェネレーター、ハチE��ュタグ辞�E、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['トレンドニュース', 'バズ度診断', '画像生戁E, 'ハッシュタグ'],
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: '販売中',
  },
]

// 🏢 キャリア・ライチE E人生�E転機をサポ�EチEconst lifeTools: Product[] = [
  {
    id: 'resignation-assistant',
    title: '退職あんしんAI',
    subtitle: '退職届生戁EÁE残業代計箁EÁE完�EチェチE��リスチE,
    description:
      'AIが退職届を自動作�E、未払い残業代を計算、有給・社保�E年金�E手続きまで完�Eガイド。退職代行サービスの比輁E��権利Q&Aも搭載、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['退職届AI生�E', '残業代計箁E, 'チェチE��リスチE, '権利Q&A'],
    icon: ClipboardCheck,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '販売中',
  },
  {
    id: 'closet-coach',
    title: 'AIクローゼチE��断捨離コーチE,
    subtitle: 'ワードローブ管琁EÁEコスパ�E极EÁE売却ガイチE,
    description:
      '持ってる服のコスパを可視化、断捨離候補をAI判定。売却想定価格�E�E�EラチE��フォーム比輁E��コーチE��案まで。クローゼチE��を最適化、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['クローゼチE��管琁E, 'コスパ�E极E, '断捨離AI', '売却ガイチE],
    icon: Shirt,
    color: 'from-violet-500 to-fuchsia-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: '販売中',
  },
]

// 🛍�E�Eビジネス・副業  EAIで稼ぁEconst bizTools: Product[] = [
  {
    id: 'vintage-hunter',
    title: '古着ハンター',
    subtitle: 'AI搭載メルカリ自動監視�EチE��',
    description:
      'メルカリの新着出品を24時間自動監視し、AIが「お買ぁE��」と判断した瞬間にDiscordへ通知。寝てる間にお宝古着を見送E��なぁE��E,
    price: '¥9,800',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['Python', 'AWS Lambda', 'AI', 'Discord'],
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '販売中',
  },
  {
    id: 'ai-select-shop',
    title: '「在庫ゼロ」AIセレクトショチE�E',
    subtitle: 'トレンド�E极EÁEAI自動デザイン ÁEオンチE�Eンド�E品E,
    description:
      'AIがバズワードを刁E��しTシャチE��ザインを�E動生成。注斁E��にオンチE�Eンド製造・配送。在庫リスクゼロのAIファチE��ョンビジネス、E,
    price: '¥9,800',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['AI Design', 'Printful API', 'トレンド�E极E, 'Shopify'],
    icon: Store,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: '販売中',
  },
  {
    id: 'ai-sidejob',
    title: 'AI副業スタートダチE��ュ',
    subtitle: '13カチE��リ ÁE適性診断 ÁEロード�EチE�E ÁE収益シミュレーター',
    description:
      'AI副業の「何から始めれ�EぁE���E�」から「月10丁E�E達�E」まで完�Eサポ�Eト、E0+のAIチE�Eル辞�E、テンプレート集、活動ログ搭載、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['13カチE��リ', '適性診断', 'チE��プレーチE, '収益計箁E],
    icon: Briefcase,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: 'NEW',
  },
  {
    id: 'inbox-organizer',
    title: 'Gmail AI Accelerator',
    subtitle: 'Gmail連携 ÁE自動�E顁EÁEAI返信 ÁEゴミ箱整琁E,
    description:
      'GmailとワンクリチE��接続。受信メールを緊急×重要で自動�E類、AIが返信斁E��生�E、不要メールはワンクリチE��でゴミ箱へ、E刁E��Inbox Zero、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['Gmail連携', 'AI返信', '自動�E顁E, 'Inbox Zero'],
    icon: Mail,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
    status: 'NEW',
  },
]

// 🎨 クリエイチE��チE EAIで創作を加送Econst creativeTools: Product[] = [
  {
    id: 'prompt-master',
    title: 'AI画像�Eロンプトマスター',
    subtitle: '26カチE��リ ÁE日本語�E英語変換 ÁEパラメータ辞�E',
    description:
      '日本語で入力するだけで画像生成AI用の最適プロンプトを�E動生成、Eidjourney/DALL-E/Stable Diffusion対応、E00+チE��プレート搭載、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['26カチE��リ', 'プロンプト生�E', 'チE��プレーチE, '画像AI'],
    icon: Wand2,
    color: 'from-purple-500 to-fuchsia-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    status: 'NEW',
  },
  {
    id: 'youtube-producer',
    title: 'AI YouTubeプロチE��ーサー',
    subtitle: '斁E��起こし→台本→人物画像�Eサムネイル→タイトル→BGM',
    description:
      '動画・音声・チE��ストを取り込んで6スチE��プでYouTube投稿素材を全自動生成、E0ジャンル対応�E台本、AI人物イラスト、サムネイル、SEOタイトル、BGM作曲、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['6スチE��チE, '10ジャンル', '斁E��起こし', 'サムネイル'],
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
    id: 'pet-translator',
    title: 'AIペット翻訳モニター',
    subtitle: 'AI搭載�EチE��感情リアルタイム翻訳シスチE��',
    description:
      '留守中のペット�E動きと鳴き声をAIがリアルタイム解析。「寂しがってぁE��す」「お腹が空きました」と感情を日本語で翻訳して通知、E,
    price: '¥4,980',
    priceNote: '買ぁE�Eり�E税込',
    tags: ['HTML5', 'Web Audio API', 'AI', 'LINE通知'],
    icon: PawPrint,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: '販売中',
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
          {products.length}チE�Eル
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${product.bgColor}`}>
            <Icon className={`h-6 w-6 ${product.iconColor}`} />
          </div>
          <Badge className={
            product.status === '�E 無斁E ? 'bg-blue-500 text-white border-0' :
            product.status === 'NEW' ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white border-0' :
            product.status === '人氁E ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0' :
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

        <div className="flex items-end justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold">{product.price}</span>
            <span className="text-xs text-muted-foreground ml-1">{product.priceNote}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}/app`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 transition-opacity"
            >
              <Rocket className="h-3 w-3" />
              使ぁE            </Link>
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
const comingSoon = [
  {
    title: 'SNSオート�Eスター',
    description: 'X/Instagram/Threadsへの投稿を一括管琁E�E自動化するチE�Eル、E,
    icon: Bot,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    title: 'AIレポ�Eトジェネレーター',
    description: 'チE�Eタを投げるだけで刁E��レポ�EトをAIが�E動生成、E,
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
]

// ==================== Page ====================
export default function ProductsPage() {
  const totalTools = freeTools.length + defenseTools.length + commTools.length + lifeTools.length + bizTools.length + creativeTools.length + funTools.length

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI チE�Eル
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            ストア
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          AIを活用した業務効玁E��・自動化チE�Eルを販売してぁE��す、E          <br />
          全チE�Eル使ぁE��題�Eラン�E�¥980/月）なら�EチE�Eル使ぁE��顁E✨
        </p>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{totalTools}</span>
            <span className="text-muted-foreground">チE�Eル</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl text-blue-500">1</span>
            <span className="text-muted-foreground">無料サンプル</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-2xl text-emerald-500">6</span>
            <span className="text-muted-foreground">ジャンル</span>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <a href="#free" className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">�E 無料体騁E/a>
        <a href="#defense" className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors">🛡�E�E防衛シリーズ</a>
        <a href="#comm" className="px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-colors">💬 コミュニケーション</a>
        <a href="#life" className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">🏢 キャリア・ライチE/a>
        <a href="#biz" className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">🛍�E�Eビジネス・副業</a>
        <a href="#creative" className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors">🎨 クリエイチE��チE/a>
        <a href="#fun" className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">🐾 エンタメ・趣味</a>
      </div>

      {/* FREE */}
      <div id="free">
        <ProductSection
          emoji="�E"
          title="無料で体騁E
          subtitle="アカウント不要�Eすぐ使えるサンプルチE�Eル"
          accentColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          products={freeTools}
        />
      </div>

      {/* DEFENSE SERIES */}
      <div id="defense">
        <ProductSection
          emoji="🛡�E�E
          title="防衛シリーズ"
          subtitle="詐欺・お��・住まぁE�E災害…暮らしのリスクからあなたを守る"
          accentColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          products={defenseTools}
        />
      </div>

      {/* COMMUNICATION */}
      <div id="comm">
        <ProductSection
          emoji="💬"
          title="コミュニケーション"
          subtitle="恋�E・婚活・SNS…人間関係�Eスキルを磨ぁE
          accentColor="bg-pink-500/10 text-pink-600 dark:text-pink-400"
          products={commTools}
        />
      </div>

      {/* CAREER & LIFE */}
      <div id="life">
        <ProductSection
          emoji="🏢"
          title="キャリア・ライチE
          subtitle="退職・断捨離…人生�E転機をAIがサポ�EチE
          accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          products={lifeTools}
        />
      </div>

      {/* BUSINESS */}
      <div id="biz">
        <ProductSection
          emoji="🛍�E�E
          title="ビジネス・副業"
          subtitle="AIを使って効玁E��く稼ぁE
          accentColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          products={bizTools}
        />
      </div>

      {/* CREATIVE */}
      <div id="creative">
        <ProductSection
          emoji="🎨"
          title="クリエイチE��チE
          subtitle="画像生成AI・チE��イン…創作を加速すめE
          accentColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          products={creativeTools}
        />
      </div>

      {/* FUN */}
      <div id="fun">
        <ProductSection
          emoji="🐾"
          title="エンタメ・趣味"
          subtitle="AIで毎日をちめE��と楽しく"
          accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          products={funTools}
        />
      </div>

      {/* Plan CTA */}
      <div className="my-16 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">全チE�Eル使ぁE��題�Eラン</h2>
        <p className="text-muted-foreground mb-4">月顁E<span className="text-3xl font-bold text-amber-500">¥980</span> で{totalTools}チE�Eルすべてが使ぁE��顁E/p>
        <p className="text-sm text-muted-foreground mb-6">1チE�Eル買ぁE��り圧倒的にお征E✨ ぁE��でも解約OK</p>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-bold hover:opacity-90">
            プランを見る ↁE          </Button>
        </Link>
      </div>

      {/* Coming Soon */}
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
    </div>
  )
}
