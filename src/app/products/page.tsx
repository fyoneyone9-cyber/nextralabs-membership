import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bot, FileText, ArrowRight, PawPrint, Network, ShieldAlert, Store, Rocket, ClipboardCheck, Heart, ShieldCheck, Wallet, Home, Flame, MessageCircleHeart, Shirt, Shield } from 'lucide-react'

const products = [
  {
    id: 'vintage-hunter',
    title: '古着ハンター',
    subtitle: 'AI搭載メルカリ自動監視ボット',
    description:
      'メルカリの新着出品を24時間自動監視し、AIが「お買い得」と判断した瞬間にDiscordへ通知。寝てる間にお宝古着を見逃さない。',
    price: '¥9,800',
    priceNote: '買い切り・税込',
    tags: ['Python', 'AWS Lambda', 'AI', 'Discord'],
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '販売中',
  },
  {
    id: 'pet-translator',
    title: 'AIペット翻訳モニター',
    subtitle: 'AI搭載ペット感情リアルタイム翻訳システム',
    description:
      '留守中のペットの動きと鳴き声をAIがリアルタイム解析。「寂しがっています」「お腹が空きました」と感情を日本語で翻訳して通知。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['HTML5', 'Web Audio API', 'AI', 'LINE通知'],
    icon: PawPrint,
    color: 'from-violet-500 to-pink-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: '販売中',
  },
  {
    id: 'office-politics-graph',
    title: '社内政治 相関図',
    subtitle: 'Slack × カレンダー関係性可視化ツール',
    description:
      '組織図には載らない「本当の人間関係」を可視化。Slackメンション傾向とカレンダー会議データから、隠れたキーマンやブリッジ役を自動検出するインタラクティブ相関図ツール。',
    price: '無料',
    priceNote: 'アカウント不要',
    tags: ['D3.js', 'PageRank', 'データ分析', '無料サンプル'],
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    status: '🆓 無料',
  },
  {
    id: 'shopping-stopper',
    title: 'AI買い物依存ストッパー',
    subtitle: 'カメラ表情解析 × 衝動買い防止AI',
    description: 'カート画面で「高揚感」を検知するとAIが冷静な判断を促し決済を一定時間ロック。過去の衝動買いデータから後悔する確率を予測。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['TensorFlow.js', 'Canvas API', 'AI', '行動分析'],
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-500',
    status: '新商品',
  },
  {
    id: 'ai-select-shop',
    title: '「在庫ゼロ」AIセレクトショップ',
    subtitle: 'トレンド分析 × AI自動デザイン × オンデマンド出品',
    description:
      'AIがバズワードを分析しTシャツデザインを自動生成。注文時にオンデマンド製造・配送。在庫リスクゼロのAIファッションビジネス。',
    price: '¥9,800',
    priceNote: '買い切り・税込',
    tags: ['AI Design', 'Printful API', 'トレンド分析', 'Shopify'],
    icon: Store,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: '新商品',
  },
  {
    id: 'resignation-assistant',
    title: '退職あんしんAI',
    subtitle: '退職届生成 × 残業代計算 × 完全チェックリスト',
    description:
      'AIが退職届を自動作成、未払い残業代を計算、有給・社保・年金の手続きまで完全ガイド。退職代行サービスの比較や権利Q&Aも搭載。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['退職届AI生成', '残業代計算', 'チェックリスト', '権利Q&A'],
    icon: ClipboardCheck,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '新商品',
  },
  {
    id: 'ai-konkatsu',
    title: 'AI婚活コーチ',
    subtitle: 'プロフィール添削 × メッセージ練習 × 相性診断',
    description:
      'マッチングアプリのプロフィールをAIが添削、メッセージの練習シミュレーター、価値観診断、デートプラン提案、婚活戦略分析まで。あなたの婚活を全力サポート。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['プロフィール添削', 'メッセージ練習', '相性診断', 'デートプラン'],
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: '新商品',
  },
  {
    id: 'scam-defender',
    title: 'AI詐欺ディフェンダー',
    subtitle: '詐欺シミュレーション × 闇バイト判定 × 家族見守り',
    description:
      '詐欺電話シミュレーターで断り方を練習、闇バイト判定チェッカーで危険度を即判定。見守りチェックリストで家族のセキュリティを強化。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['詐欺クイズ', '電話シミュレーター', '闇バイト判定', '家族見守り'],
    icon: ShieldCheck,
    color: 'from-amber-500 to-red-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    status: '新商品',
  },
  {
    id: 'money-guard',
    title: 'AI家計防衛シミュレーター',
    subtitle: '収支トラッカー × 期待値計算 × 依存度チェック',
    description:
      'ギャンブル収支を可視化し、期待値を数学的に解説。「もし貯金してたら」シミュレーター、認知バイアス診断、相談窓口ガイドまで。お金を守る力を手に入れる。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['収支トラッカー', '期待値計算', '依存度チェック', '認知バイアス'],
    icon: Wallet,
    color: 'from-emerald-500 to-amber-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    status: '新商品',
  },
  {
    id: 'moving-checker',
    title: 'AI引っ越し安心チェッカー',
    subtitle: 'エリア安全度 × 騒音リスク × トラブル予防',
    description:
      '物件の「見えないリスク」を事前にスコア化。治安・騒音・物件チェック30項目・トラブル対処テンプレート・引っ越しコスト計算まで。住んでから後悔しないために。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['エリア安全度', '騒音リスク', '30項目チェック', 'トラブル対処'],
    icon: Home,
    color: 'from-blue-500 to-green-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    status: '新商品',
  },
  {
    id: 'buzz-writer',
    title: 'AIバズ文章コーチ',
    subtitle: 'トレンドニュース × テンプレート × 画像生成',
    description:
      '今日のニュースをネタに、自分の言葉でバズらせる。10種類のテンプレート、バズ度診断、投稿画像ジェネレーター、ハッシュタグ辞典、投稿タイミングガイドまで。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['トレンドニュース', 'バズ度診断', '画像生成', 'ハッシュタグ'],
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    status: '新商品',
  },
  {
    id: 'comm-coach',
    title: 'AIコミュニケーション改善コーチ',
    subtitle: '心理学ベース × メッセージ添削 × 自己診断',
    description:
      '心理学理論に基づいてメッセージを添削、コミュスタイルを4タイプ診断、場面別の会話プランナーでスキルアップ。恋愛もビジネスも友人関係も。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['メッセージ添削', 'コミュ診断', '心理学講座', 'NG＆OK集'],
    icon: MessageCircleHeart,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    status: '新商品',
  },
  {
    id: 'closet-coach',
    title: 'AIクローゼット断捨離コーチ',
    subtitle: 'ワードローブ管理 × コスパ分析 × 売却ガイド',
    description:
      '持ってる服のコスパを可視化、断捨離候補をAI判定。売却想定価格＆プラットフォーム比較、コーデ提案まで。クローゼットを最適化。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['クローゼット管理', 'コスパ分析', '断捨離AI', '売却ガイド'],
    icon: Shirt,
    color: 'from-violet-500 to-fuchsia-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    status: '新商品',
  },
  {
    id: 'disaster-guard',
    title: 'AI防災パーソナルガイド',
    subtitle: 'GPS避難所検索 × 家族防災プラン × 気象警報API',
    description:
      '現在地から最寄り避難所を自動検索、家族の避難プランを事前作成、気象庁APIで警報をリアルタイム確認。防災チェックリスト＆知識クイズも搭載。',
    price: '¥4,980',
    priceNote: '買い切り・税込',
    tags: ['GPS', '気象庁API', '防災', '避難所検索'],
    icon: Shield,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    status: '新商品',
  },
]

const comingSoon = [
  {
    title: 'SNSオートポスター',
    description: 'X/Instagram/Threadsへの投稿を一括管理・自動化するツール。',
    icon: Bot,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    title: 'AIレポートジェネレーター',
    description: 'データを投げるだけで分析レポートをAIが自動生成。',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },

]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI ツール
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            ストア
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AIを活用した業務効率化・自動化ツールのソースコードを販売しています。
          <br />
          全ツール使い放題プランならすべて使い放題。単品購入も可能。
        </p>
      </div>

      {/* Products */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          🛒 販売中のツール
        </h2>
        <p className="text-muted-foreground mb-8">
          全ツール使い放題プラン（¥980/月）なら全ツール使い放題 ✨ 単品購入も可能です。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <Card key={product.id} className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${product.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${product.iconColor}`} />
                    </div>
                    <Badge className={product.price === '無料' ? 'bg-blue-500 text-white border-0' : 'bg-green-500 text-white border-0'}>
                      {product.status}
                    </Badge>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors cursor-pointer">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold">{product.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {product.priceNote}
                      </span>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                        >
                          詳細
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Coming Soon */}
      <section>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          🚧 開発中
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comingSoon.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                className="h-full opacity-60 cursor-default"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
