import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: '在庫ゼロ AIセレクトショップ',
  description: 'AIがバズワードを分析しTシャツデザインを自動生成。注文時にオンデマンド製造・配送。在庫リスクゼロのAIファッション副業。月額¥1,980。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-select-shop' },
  openGraph: { title: '在庫ゼロ AIセレクトショップ | NextraLabs', description: 'AIがバズワードを分析しTシャツデザインを自動生成。注文時にオンデマンド製造・配送。在庫リスクゼロのAIファッション副業。', url: 'https://membership-site-nextralabos.vercel.app/products/ai-select-shop', type: 'website' },
}

import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Flame,
  Palette,
  Package,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Laptop,
} from 'lucide-react'

const features = [
  {
    icon: Flame,
    title: 'トレンドAI分析エンジン',
    description:
      'SNSのバズワード、検索トレンド、季節イベントをリアルタイム分析。「今日売れるデザイン」をAIが自動提案。',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Palette,
    title: 'AIデザイン自動生成',
    description:
      'トレンドキーワードからTシャツデザインをAI生成。フォント、配色、レイアウトまで全自動。ワンクリックでカスタマイズも可能。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Package,
    title: '在庫ゼロ自動出品',
    description:
      '注文が入った瞬間にPrintfulが製造・配送。在庫リスクゼロ、初期費用ゼロ。Shopify連携でストア運営も自動化。',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'React + TypeScript + Tailwind CSS' },
  { category: 'トレンド分析', value: 'SNS API + 検索トレンドAPI' },
  { category: 'デザイン生成', value: 'Canvas API + AIスタイルエンジン' },
  { category: 'プリント製造', value: 'Printful API（オンデマンド）' },
  { category: 'ストア連携', value: 'Shopify Storefront API' },
  { category: 'データ管理', value: 'localStorage + JSON エクスポート' },
  { category: 'UI', value: 'ダークモード・レスポンシブ対応' },
  { category: '依存関係', value: 'ゼロ外部依存・完全スタンドアロン' },
]

const setupSteps = [
  {
    step: '1',
    title: 'トレンドを分析',
    desc: 'AIが今日のバズワード・検索トレンドを自動取得',
    time: 'ワンクリック',
  },
  {
    step: '2',
    title: 'デザインを生成',
    desc: 'キーワード × スタイル × カラーを選んでAI生成',
    time: '10秒',
  },
  {
    step: '3',
    title: '自動で出品',
    desc: 'Printful + Shopifyで在庫ゼロのストアが完成',
    time: 'ワンクリック',
  },
]

const targets = [
  {
    icon: TrendingUp,
    title: '副業・スモールビジネス',
    description:
      '在庫リスクゼロでファッションビジネスを始めたい人に。初期投資ほぼゼロで、トレンドに乗ったデザインを次々と出品。',
  },
  {
    icon: ShoppingBag,
    title: 'ECストア運営者',
    description:
      '既存のShopifyストアにオリジナルTシャツラインを追加。AIがデザインを生成し、Printfulが製造・配送を代行。',
  },
  {
    icon: Laptop,
    title: 'クリエイター × エンジニア',
    description:
      'Canvas API + Printful API の実践的な学習教材として。ポートフォリオにAI × ECの実装例を追加。',
  },
]

const faqs = [
  {
    q: 'デザインのクオリティは大丈夫ですか？',
    a: 'AI生成デザインはあくまでベース。ツール上でスタイル・配色・レイアウトを自由にカスタマイズでき、プレビューで確認してから出品できます。',
  },
  {
    q: 'Printfulの費用はどれくらいですか？',
    a: 'Tシャツ1枚あたり約¥1,200〜（素材・色により変動）。売れた分だけ課金されるので在庫リスクはゼロです。',
  },
  {
    q: 'Shopifyアカウントは必要ですか？',
    a: 'ツール単体でもデザイン生成・管理は可能です。実際に販売する場合はShopify（月額約$39〜）とPrintfulの連携が必要です。',
  },
  {
    q: 'トレンドデータはリアルタイムですか？',
    a: 'ツール内のトレンドデータはシミュレーションです。実際のSNS API（X API等）やGoogle Trendsとの連携ガイドを同梱しています。',
  },
  {
    q: '海外販売にも対応していますか？',
    a: 'Printful + Shopifyの組み合わせで世界中に配送可能。多言語ストアの構築ガイドも付属しています。',
  },
  {
    q: '購入後のサポートはありますか？',
    a: '導入ガイド・カスタマイズガイド・API連携ガイドを同梱。重大なバグ修正は無償提供します。',
  },
]

const tags = ['AI Design', 'Printful API', 'トレンド分析', 'Shopify']

export default function AISelectShopPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ツール一覧に戻る
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                🏪 新商品
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                「在庫ゼロ」AIセレクトショップ
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                トレンド分析 × AI自動デザイン × オンデマンド出品
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                AIが今日バズっているワードを分析し、Tシャツのデザインを自動生成して即出品。
                <br />
                売れた瞬間に製造・配送。
                <span className="text-foreground font-medium">
                  在庫リスクゼロのAIファッションビジネス。
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ToolLaunchButton productId="ai-select-shop" />
                <Link href="/pricing">
                  <Button size="lg" className="text-lg px-8">プレミアムプランを見る →</Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    詳しく見る
                  </Button>
                </a>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className="bg-[#0a0a0f] rounded-xl p-5 shadow-2xl border border-[#2a2a3a]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🏪</span>
                  <span className="text-white font-semibold text-sm">
                    AIセレクトショップ
                  </span>
                  <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">
                    LIVE
                  </Badge>
                </div>

                {/* Trend preview */}
                <div className="bg-[#12121a] rounded-lg border border-[#2a2a3a] p-3 mb-3">
                  <div className="text-xs text-gray-400 mb-2">🔥 今日のトレンド</div>
                  <div className="space-y-1.5">
                    {['サイバーパンク', 'Y2K', '推し活', '猫ミーム', 'レトロ'].map((kw, i) => (
                      <div key={kw} className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-mono w-4">#{i + 1}</span>
                        <span className="text-white text-xs flex-1">{kw}</span>
                        <div className="w-16 h-1.5 bg-[#2a2a3a] rounded">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded"
                            style={{ width: `${95 - i * 12}%` }}
                          />
                        </div>
                        <span className="text-emerald-400 text-[10px]">↑</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* T-shirt preview */}
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-[#1a1a25] rounded-lg p-3 border border-[#2a2a3a]">
                    <div className="text-2xl mb-1">👕</div>
                    <span className="text-gray-400">デザイン</span>
                    <div className="text-white font-bold">24</div>
                  </div>
                  <div className="bg-[#1a1a25] rounded-lg p-3 border border-[#2a2a3a]">
                    <span className="text-gray-400">売上</span>
                    <div className="text-emerald-400 font-bold">¥182K</div>
                  </div>
                  <div className="bg-[#1a1a25] rounded-lg p-3 border border-[#2a2a3a]">
                    <span className="text-gray-400">利益率</span>
                    <div className="text-teal-400 font-bold">67%</div>
                  </div>
                </div>

                <div className="mt-3 text-center text-gray-500 text-xs">
                  🤖 AI分析中 ┃ 📦 在庫ゼロ運営 ┃ 💰 自動出品
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                🛒 Shopify連携済み
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">使用技術・キーワード</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-base px-5 py-2.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">何ができるか</h2>
          <p className="text-muted-foreground text-center mb-12">
            3つのコア機能で在庫ゼロのAIファッションビジネスを実現
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card
                  key={f.title}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} mb-4`}
                    >
                      <Icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            たった3ステップで始められる
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            AIがトレンドからデザイン、出品まで自動化
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-2xl font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{s.desc}</p>
                <Badge variant="secondary">{s.time}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">技術スタック</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-0">
                {techStack.map((t, i) => (
                  <div
                    key={t.category}
                    className={`flex items-center justify-between px-6 py-3 ${
                      i < techStack.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <span className="text-sm text-muted-foreground font-medium">
                      {t.category}
                    </span>
                    <span className="text-sm font-medium">{t.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">ビジネスフロー</h2>
          <p className="text-muted-foreground text-center mb-12">
            あなたがやるのはデザインの承認だけ
          </p>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { icon: '🔥', step: 'AIがトレンドワードを自動取得・スコアリング' },
                    { icon: '🎨', step: 'トップキーワードからTシャツデザインをAI生成' },
                    { icon: '👀', step: 'プレビューで確認 → ワンクリックで出品' },
                    { icon: '🛒', step: 'Shopifyストアに自動掲載' },
                    { icon: '📦', step: '注文が入るとPrintfulが製造・発送' },
                    { icon: '💰', step: '利益が自動的に積み上がる' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-500">STEP {i + 1}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-sm">{item.step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            こんな人におすすめ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targets.map((t) => {
              const Icon = t.icon
              return (
                <Card key={t.title} className="border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
                      <Icon className="h-7 w-7 text-emerald-500" />
                    </div>
                    <h3 className="font-bold mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            よくある質問
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-7">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Caution */}
      <section className="py-12 bg-destructive/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              注意事項
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                実際の販売にはShopifyアカウント（有料）とPrintfulアカウント（無料）が必要です。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                ツール内のトレンドデータはシミュレーションです。実際のAPI連携は別途セットアップが必要です。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                AIが生成するデザインの商用利用については各プラットフォームの規約をご確認ください。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                デジタルコンテンツのため、購入後の返品・返金はお受けできません。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            在庫ゼロで始める
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              AIファッションビジネス
            </span>
          </h2>
          <p className="text-muted-foreground mb-2">
            トレンド分析からデザイン生成、出品まですべてAIが自動化。
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            在庫リスクゼロ・初期費用ゼロ・AIが24時間稼働。
          </p>
          <div className="flex flex-col items-center gap-4">
            <ToolLaunchButton productId="ai-select-shop" className="text-xl px-12 py-6 shadow-lg" />
            <Link href="/pricing">
              <Button className="text-xl px-12 py-6">プレミアムプラン（¥1,980/月）→</Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              プレミアムプラン限定ツール
            </p>
          </div>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 ファッションをAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E3%82%BB%E3%83%AC%E3%82%AF%E3%83%88%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%E3%83%95%E3%82%A1%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
        >
          Amazonで見る →
        </a>
      </div>
    </div>
  )
}
