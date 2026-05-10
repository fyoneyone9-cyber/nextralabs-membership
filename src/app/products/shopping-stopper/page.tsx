import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'

export const metadata: Metadata = {
  title: 'AI買い物依存ストッパー | 衝動買いを止めるAI心理カウンセラー | NextraLabs',
  description: '「これ買っていい？」をAIに相談するだけ。衝動買いリスクスコア・心理的購買動機分析・クールダウン提案で無駄遣いを撲滅。借金体質改善にも。完全無料。',
  keywords: ['衝動買い防止','買い物依存AI','節約AI','浪費防止アプリ','買い物心理AI','無駄遣い防止','家計節約AI','購買判定AI','節約アドバイスAI','NextraLabs節約'],
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/shopping-stopper' },
  openGraph: { title: 'AI買い物依存ストッパー | 衝動買いを止めるAI心理カウンセラー | NextraLabs', description: '「これ買っていい？」をAIに相談するだけ。衝動買いリスクスコア・心理的購買動機分析・クールダウン提案で無駄遣いを撲滅。借金体質改善にも。完全無料。', url: 'https://membership-site-nextralabos.vercel.app/products/shopping-stopper', type: 'website' },
}
import {
  Camera,
  Timer,
  TrendingDown,
  ArrowLeft,
  Code2,
  FolderTree,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  ShoppingCart,
  Brain,
  Smartphone,
  ShieldAlert,
  BarChart3,
  Lock,
} from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'カメラで表情リアルタイム解析',
    description:
      'TensorFlow.jsで顔の微表情を検出。眉の角度、口角、瞬き頻度から「興奮度」を0-100%で数値化。買い物中の高揚感をリアルタイムで可視化。',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Timer,
    title: '衝動買いロックタイマー',
    description:
      '高揚感スコアが閾値を超えると3時間の冷却タイマーが発動。カウントダウン中は「本当に必要？」を自問自答。深呼吸エクササイズで冷静さを取り戻す。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: TrendingDown,
    title: '購入履歴分析 & 後悔予測',
    description:
      '過去の購入データからAIが「後悔する確率」を算出。「先月のXXXは結局2回しか使ってません」と冷静なフィードバックで衝動買いを抑止。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: 'カメラ制御', value: 'MediaDevices API (getUserMedia)' },
  { category: '表情解析', value: 'Canvas ピクセル解析 + ヒューリスティクス' },
  { category: 'データ可視化', value: 'Canvas API (チャート描画)' },
  { category: 'データ保存', value: 'localStorage (サーバー不要)' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: '設計', value: 'ダークモードUI（レスポンシブ対応）' },
]

const setupSteps = [
  {
    step: '1',
    title: 'ツールを起動',
    desc: '購入後、ダッシュボードからワンクリックで起動',
    time: '1秒',
  },
  {
    step: '2',
    title: 'カメラを許可',
    desc: 'ブラウザのカメラアクセスを許可してモニタリング開始',
    time: 'ワンクリック',
  },
  {
    step: '3',
    title: '買い物前にチェック',
    desc: 'カートに入れる前にツールを開いて自分の興奮度を確認',
    time: '30秒',
  },
]

const targets = [
  {
    icon: ShoppingCart,
    title: '衝動買いに悩む方',
    description:
      'ネットショッピングで「ポチッ」が止まらない方に。AIが客観的に高揚感を検知して冷却期間を設けることで、不要な買い物を防止。',
  },
  {
    icon: Brain,
    title: '節約・家計管理したい方',
    description:
      '購入履歴を分析して「後悔する確率」を提示。データに基づいた賢い買い物習慣を身につけられる。',
  },
  {
    icon: Smartphone,
    title: 'エンジニア × 行動経済学',
    description:
      'MediaDevices API + Canvas ピクセル解析の実践的な学習教材。行動経済学の知見をテクノロジーで実装するユニークなポートフォリオに。',
  },
]

const faqs = [
  {
    q: 'カメラ映像はサーバーに送信されますか？',
    a: 'いいえ。すべての解析はブラウザ内で完結します。映像データは一切外部に送信されません。プライバシーを完全に保護します。',
  },
  {
    q: 'ロックタイマー中に本当に決済できないのですか？',
    a: 'このツールは物理的に決済をブロックするものではなく、心理的な冷却期間を提供するツールです。カウントダウン中に冷静に考える時間を作ります。',
  },
  {
    q: 'スマホからも使えますか？',
    a: 'はい。レスポンシブ対応済みで、スマホのブラウザからカメラにアクセスして利用できます。',
  },
  {
    q: 'データはどこに保存されますか？',
    a: 'すべてのデータはブラウザのlocalStorageに保存されます。サーバーには一切送信されません。設定からJSONエクスポート/インポートも可能です。',
  },
  {
    q: '購入後のアップデートはありますか？',
    a: '重大なバグ修正は無償提供。感情分析エンジンの精度向上アップデートは今後有料オプションとして提供予定です。',
  },
]

export default function ShoppingStopperPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI買い物依存ストッパー',
    description: '「これ買っていい？」をAIに相談するだけ。衝動買いリスクスコア・心理的購買動機分析・クールダウン提案で無駄遣いを撲滅。',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/shopping-stopper',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/5" />
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
              <Badge className="mb-4 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                🛑 新商品
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                AI買い物依存ストッパー
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                カメラ表情解析 × 衝動買い防止AIツール
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                カート画面で「高揚感」を検知すると、AIが冷静な判断を促し決済を一定時間ロック。
                <br />
                過去の衝動買いを提示して
                <span className="text-foreground font-medium">
                  後悔を未然に防止
                </span>
                。データに基づいた賢い買い物習慣を。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ToolLaunchButton productId="shopping-stopper" />
                <Link href="/pricing">
                  <Button size="lg" className="text-lg px-8">プランを見る →</Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    詳しく見る
                  </Button>
                </a>
              </div>
            </div>

            {/* Shopping Stopper Preview */}
            <div className="relative">
              <div className="bg-[#0a0a0f] rounded-xl p-5 shadow-2xl border border-[#2a2a3a]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🛑</span>
                  <span className="text-white font-semibold text-sm">
                    買い物依存ストッパー
                  </span>
                </div>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">😤</div>
                  <div className="text-red-400 font-bold text-lg">高揚感検知！</div>
                  <div className="text-gray-400 text-xs mb-3">興奮度: 82%</div>
                </div>
                <div className="bg-[#12121a] rounded-lg border border-red-500/30 p-4 mb-3">
                  <div className="text-sm text-gray-200 leading-relaxed">
                    ⚠️ 「ちょっと待って！興奮状態で<br />買い物すると後悔しやすいです」
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#1a1a25] rounded-lg p-2 border border-[#2a2a3a]">
                    <span className="text-gray-400">🔥 興奮度</span>
                    <div className="text-red-400 font-bold">82%</div>
                    <div className="h-1 bg-[#2a2a3a] rounded mt-1">
                      <div className="h-full bg-red-500 rounded" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div className="bg-[#1a1a25] rounded-lg p-2 border border-[#2a2a3a]">
                    <span className="text-gray-400">⏱️ 冷却</span>
                    <div className="text-emerald-400 font-bold">2:59:41</div>
                    <div className="h-1 bg-[#2a2a3a] rounded mt-1">
                      <div className="h-full bg-emerald-400 rounded" style={{ width: '99%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center text-gray-500 text-xs">
                  💰 今月の節約額: ¥23,400 ┃ 🧠 後悔防止率: 73%
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                🛑 ロック発動中
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">仕組み</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              { emoji: '📷', name: 'カメラで顔を撮影', detail: 'リアルタイム映像解析' },
              { emoji: '📊', name: '興奮度を数値化', detail: '0〜100%スコア' },
              { emoji: '🛑', name: '閾値超えでロック', detail: '冷却タイマー発動' },
              { emoji: '🧘', name: '冷静になる時間', detail: '深呼吸エクササイズ' },
              { emoji: '🧠', name: '後悔確率を予測', detail: '過去データから算出' },
              { emoji: '💰', name: '賢い判断', detail: '節約額を可視化' },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 bg-card border rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">何ができるか</h2>
          <p className="text-muted-foreground text-center mb-12">
            3つのコア機能で衝動買いを科学的に防止
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
                    <p className="text-sm text-muted-foreground">
                      {f.description}
                    </p>
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
            セットアップはたったの3ステップ
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            購入後すぐに使える。複雑な設定は一切不要
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-2xl font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {s.desc}
                </p>
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

      {/* Target */}
      <section className="py-16 bg-muted/30">
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
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 mb-4">
                      <Icon className="h-7 w-7 text-red-500" />
                    </div>
                    <h3 className="font-bold mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            よくある質問
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-7">
                    {faq.a}
                  </p>
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
                カメラの使用にはブラウザの許可が必要です。映像データは一切外部に送信されません。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                興奮度の解析はAIによる推測であり、医学的な診断ではありません。買い物依存症が深刻な場合は専門家にご相談ください。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                ロック機能は物理的な決済ブロックではなく、心理的な冷却期間を提供するものです。
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
            衝動買いに
            <br />
            <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              科学的にストップをかける
            </span>
          </h2>
          <p className="text-muted-foreground mb-2">
            月に1回の衝動買いを防ぐだけで元が取れます。
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            カメラ解析はブラウザ内完結・データは端末保存・プライバシー完全保護。
          </p>
          <div className="flex flex-col items-center gap-4">
            <ToolLaunchButton productId="shopping-stopper" className="text-xl px-12 py-6 shadow-lg" />
            <Link href="/pricing">
              <Button size="lg" className="text-xl px-12 py-6 shadow-lg">プランを見る →</Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              スタンダードプラン（¥980/月）で全ツール使い放題
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. 完全無料で使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい、AI買い物依存ストッパーは完全無料でご利用いただけます。NextraLabsへの登録も不要です。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 衝動買いリスクスコアはどのように計算されますか？</p>
              <p className="text-slate-400 text-sm">A. 購入しようとしている商品の必要性・価格・購入頻度・感情状態などをAIが分析し、0〜100のスコアで衝動買いリスクを数値化します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 借金体質の改善にも使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい。衝動買いを繰り返すことで借金が増えるパターンを分析し、クールダウン提案や代替行動を提示することで、無駄遣いの根本改善をサポートします。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 個人情報やクレジットカード情報は必要ですか？</p>
              <p className="text-slate-400 text-sm">A. 不要です。「何を買おうとしているか」だけをAIに伝えるだけで診断できます。個人を特定する情報は一切必要ありません。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 家族や子どもの衝動買い防止にも使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい。家族全員で活用いただけます。子どものゲーム課金や衝動的なネットショッピングを防ぐ家計管理ツールとしても効果的です。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 節約・ミニマリスト本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E7%AF%80%E7%B4%84%20%E3%83%9F%E3%83%8B%E3%83%9E%E3%83%AA%E3%82%B9%E3%83%88&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
        >
          Amazonで見る →
        </a>
      </div>
    </div>
  )
}
