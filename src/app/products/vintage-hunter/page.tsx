import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  Search,
  Brain,
  Bell,
  CheckCircle2,
  ArrowLeft,
  ShoppingCart,
  Zap,
  Server,
  Code2,
  Settings,
  FolderTree,
  HelpCircle,
  AlertTriangle,
  Target,
  TrendingDown,
  Users,
  Shirt,
  Laptop,
  ChevronRight,
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'メルカリ新着を自動巡回',
    description:
      '指定ブランドの新着出品を定期スクレイピング。見逃しゼロ。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Brain,
    title: 'AIスコアリングで"お宝"自動判定',
    description:
      '過去の相場データと比較し、割安度・レア度をスコアリング。ノイズを排除して本当に価値ある出品だけを抽出。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Bell,
    title: 'Discord にリアルタイム通知',
    description:
      'スコアが閾値を超えた出品を即座にWebhook通知。商品画像・価格・スコア・リンク付き。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
]

const techStack = [
  { category: '言語', value: 'Python 3.11+' },
  { category: 'スクレイピング', value: 'requests + BeautifulSoup4' },
  { category: 'AI分析', value: 'カスタムスコアリングエンジン' },
  { category: 'データベース', value: 'Amazon DynamoDB' },
  { category: '通知', value: 'Discord Webhook（Embed対応）' },
  { category: 'インフラ', value: 'AWS Lambda + EventBridge' },
  { category: 'IaC', value: 'AWS CDK（TypeScript）' },
  { category: '設定管理', value: 'YAML ベース' },
]

const brands = [
  'Supreme',
  'NIKE Vintage',
  'Stüssy',
  'KAPITAL',
  'UNDERCOVER',
  'Needles',
  'Patagonia',
  'THE NORTH FACE',
]

const setupSteps = [
  {
    step: '1',
    title: 'config.yaml を編集',
    desc: 'ブランド名とDiscord Webhook URLを記入',
    time: '5分',
  },
  {
    step: '2',
    title: '依存関係をインストール',
    desc: 'pip install -r requirements.txt',
    time: '2分',
  },
  {
    step: '3',
    title: 'AWS にデプロイ',
    desc: 'cdk deploy で24時間稼働開始',
    time: '10分',
  },
]

const targets = [
  {
    icon: Shirt,
    title: '古着転売ヤー・バイヤー',
    description:
      '仕入れの自動化でリサーチ時間を90%削減。相場より安い出品を誰よりも早くキャッチ。',
  },
  {
    icon: Users,
    title: 'ヴィンテージコレクター',
    description:
      '探している一点モノが出品された瞬間に通知。レアピースとの出会いを逃さない。',
  },
  {
    icon: Laptop,
    title: 'エンジニア × ファッション好き',
    description:
      'AWS Lambda + DynamoDB の実践的な学習教材として。ポートフォリオにも最適。',
  },
]

const faqs = [
  {
    q: 'プログラミング初心者でも使えますか？',
    a: 'Pythonの基礎（pip installが打てる、ファイルを編集できる程度）があれば大丈夫です。セットアップガイドはスクショ付きで解説しています。',
  },
  {
    q: 'Windows / Mac / Linux どれで動きますか？',
    a: 'すべてのOSで動作します。本番環境はAWS Lambda上で動くため、OSに依存しません。',
  },
  {
    q: 'メルカリ以外にも対応していますか？',
    a: '現時点ではメルカリのみ。スクレイパーはモジュール化されているので、他サイト対応の拡張は比較的容易です。',
  },
  {
    q: '監視間隔はどのくらいに設定できますか？',
    a: 'config.yamlで自由に設定可能。推奨は15〜30分間隔。最短1分まで設定できます。',
  },
  {
    q: '購入後のアップデートはありますか？',
    a: '重大なバグ修正は無償提供。機能追加アップデートは今後有料オプションとして提供予定です。',
  },
]

const costs = [
  {
    item: 'AWS Lambda',
    cost: '$0〜$5',
    note: '月100万リクエストまで無料枠',
  },
  { item: 'DynamoDB', cost: '$0〜$5', note: '25GBまで無料枠' },
  { item: 'EventBridge', cost: '$0', note: '無料' },
  { item: 'Discord Webhook', cost: '$0', note: '完全無料' },
]

const fileTree = [
  { path: 'src/', files: ['handler.py', 'scraper.py', 'analyzer.py', 'price_engine.py', 'notifier.py', 'db.py', 'config_loader.py'] },
  { path: 'scripts/', files: ['run_local.py', 'seed_prices.py', 'test_notify.py'] },
  { path: 'tests/', files: ['test_scraper.py', 'test_price_engine.py'] },
  { path: 'cdk/lib/', files: ['vintage-hunter-stack.ts'] },
  { path: '(root)', files: ['config.yaml', 'requirements.txt', 'README.md', 'SETUP_GUIDE.md'] },
]

export default function VintageHunterPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
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
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                🔍 ソースコード販売
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                古着ハンター
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                AI搭載メルカリ自動監視ボット
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                寝てる間にお宝古着を見逃さない。
                <br />
                メルカリの新着出品を24時間自動監視し、AIが
                <span className="text-foreground font-medium">
                  「これはお買い得」
                </span>
                と判断した瞬間にDiscordへ通知。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ToolLaunchButton productId="vintage-hunter" />
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

            {/* Discord Notification Preview */}
            <div className="relative">
              <div className="bg-[#36393f] rounded-xl p-5 shadow-2xl border border-[#40444b]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                    VH
                  </div>
                  <span className="text-[#fff] font-semibold text-sm">
                    Vintage Hunter
                  </span>
                  <Badge className="bg-[#5865f2] text-white text-[10px] border-0 px-1.5 py-0">
                    BOT
                  </Badge>
                  <span className="text-[#72767d] text-xs ml-auto">
                    今日 03:24
                  </span>
                </div>
                <div className="bg-[#2f3136] rounded-lg border-l-4 border-amber-500 p-4">
                  <div className="text-amber-400 font-bold text-sm mb-2">
                    🔥 お買い得品を発見！
                  </div>
                  <div className="text-[#dcddde] text-sm mb-1">
                    <span className="text-[#72767d]">ブランド:</span> Supreme
                  </div>
                  <div className="text-[#dcddde] text-sm mb-1">
                    <span className="text-[#72767d]">商品:</span> 90s Box Logo
                    Tee Navy L
                  </div>
                  <div className="text-[#dcddde] text-sm mb-1">
                    <span className="text-[#72767d]">価格:</span>{' '}
                    <span className="text-green-400 font-bold">¥8,500</span>
                    <span className="text-[#72767d] ml-2">
                      (相場: ¥18,000)
                    </span>
                  </div>
                  <div className="text-[#dcddde] text-sm mb-3">
                    <span className="text-[#72767d]">スコア:</span> ★★★★★{' '}
                    <span className="text-amber-400">(95/100)</span>
                  </div>
                  <div className="text-[#00aff4] text-xs hover:underline cursor-pointer">
                    📎 メルカリで見る →
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                リアルタイム通知
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">何ができるか</h2>
          <p className="text-muted-foreground text-center mb-12">
            3つのコア機能でお宝古着を自動発見
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            セットアップはたったの3ステップ
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Pythonの基礎知識があれば、購入から稼働まで30分以内
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
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
      <section className="py-16 bg-muted/30">
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

      {/* File Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            含まれるもの
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            計20+ファイル — プロダクションレディなコード一式
          </p>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="font-mono text-sm space-y-3">
                  {fileTree.map((dir) => (
                    <div key={dir.path}>
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <FolderTree className="h-4 w-4" />
                        {dir.path}
                      </div>
                      {dir.files.map((f) => (
                        <div
                          key={f}
                          className="ml-6 flex items-center gap-2 text-muted-foreground"
                        >
                          <Code2 className="h-3 w-3" />
                          {f}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            対応ブランド（デフォルト8ブランド）
          </h2>
          <p className="text-muted-foreground mb-8">
            config.yaml にブランド名を追加するだけで無制限に拡張可能
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-6">
            {brands.map((b) => (
              <Badge
                key={b}
                variant="outline"
                className="text-sm px-4 py-2"
              >
                {b}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            🔧 ISSEY MIYAKE, visvim, Levi&apos;s 501xx... 何でも追加できます
          </p>
        </div>
      </section>

      {/* Cost */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">月額運用コスト</h2>
          <p className="text-muted-foreground text-center mb-12">
            AWS無料枠内ならほぼ $0 で運用可能
          </p>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-0">
                {costs.map((c, i) => (
                  <div
                    key={c.item}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i < costs.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <span className="text-sm font-medium">{c.item}</span>
                    <div className="text-right">
                      <span className="font-bold text-green-500">
                        {c.cost}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {c.note}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between px-6 py-4 bg-muted/50">
                  <span className="font-bold">合計</span>
                  <span className="font-bold text-lg text-green-500">
                    $0〜$10/月
                  </span>
                </div>
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
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Icon className="h-7 w-7 text-primary" />
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
                    <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                本ツールはメルカリの非公式スクレイピングを行います。利用規約に抵触する可能性があるため、ご利用は自己責任でお願いします。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                自動購入機能は含まれません。監視・通知のみです。
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
            24時間365日稼働する
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              自動仕入れアシスタント
            </span>
          </h2>
          <p className="text-muted-foreground mb-2">
            古着1着分の仕入れ値で手に入ります。
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            月に1着でもお買い得品を見つければ、すぐに元が取れます。
          </p>
          <div className="flex flex-col items-center gap-4">
            <ToolLaunchButton productId="vintage-hunter" className="text-xl px-12 py-6 shadow-lg" />
            <Link href="/pricing">
              <Button size="lg" className="text-xl px-12 py-6 shadow-lg">プランを見る →</Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              スタンダードプラン（¥980/月）で全ツール使い放題
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
