import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'AI詐欺ディフェンダー | 詐欺メール・闇バイト・電話詐欺をAIが即判定 | NextraLabs',
  description: '不審なメール・SNS・電話の詐欺を貼り付けるだけでAI即判定。闇バイト判定・詐欺電話シミュレーター・家族見守りチェックリスト付き。特殊詐欺・フィッシング対策に。月額¥1,980。',
  keywords: [
    '詐欺判定AI','フィッシング判定','闇バイト判定','詐欺メール','電話詐欺',
    'オレオレ詐欺','還付金詐欺','特殊詐欺対策','詐欺対策アプリ','家族見守り'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/scam-defender' },
  openGraph: {
    title: 'AI詐欺ディフェンダー | 詐欺メール・闇バイト・電話詐欺をAIが即判定 | NextraLabs',
    description: '不審なメール・SNS・電話の詐欺を貼り付けるだけでAI即判定。闇バイト判定・詐欺電話シミュレーター・家族見守りチェックリスト付き。月額¥1,980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/scam-defender',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI詐欺ディフェンダー' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI詐欺ディフェンダー | 詐欺メール・闇バイト・電話詐欺をAIが即判定',
    description: '不審なメール・SNS・電話をAIが即判定。闇バイト・特殊詐欺・フィッシング対策。月額¥1,980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  Phone,
  Search,
  AlertTriangle,
  CheckSquare,
  MessageSquare,
  Siren,
  Users,
  UserCheck,
  Eye,
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: '詐欺パターン検知クイズ',
    description:
      '実際に報告された詐欺事例をベースに「これは詐欺？安全？」を判定するトレーニング。正解率でスコアを表示。家族で一緒にやれば防犯意識がグッと上がる。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Phone,
    title: '詐欺電話シミュレーター',
    description:
      'AIが「オレオレ詐欺」「還付金詐欺」「架空請求」「闇バイト勧誘」を再現。実際の会話パターンで断り方を練習。「こう言われたらこう返す」を体で覚える。',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: CheckSquare,
    title: '家族見守りチェックリスト',
    description:
      '親・祖父母のスマホセキュリティ設定を一つずつ確認。迷惑電話フィルタ、二段階認証、SNS設定、通知設定まで。次の帰省時にチェックリストを見ながら設定。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Eye,
    title: '最新詐欺手口データベース',
    description:
      '警察庁・国民生活センターの公開情報をもとに、最新の詐欺パターンを分類して一覧表示。「今この手口が流行っている」がひと目でわかる。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Siren,
    title: '緊急通報ガイド',
    description:
      '「詐欺に遭った」「怪しい電話が来た」→ やるべきことをステップバイステップでガイド。警察(#9110)・消費者ホットライン(188)・振り込め詐欺救済法の手続きまで。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: MessageSquare,
    title: '闇バイト判定チェッカー',
    description:
      'SNSやメッセージで見かけた「高額バイト」の募集文を貼り付けるだけ。AIが「闇バイトの可能性あり」「安全」を判定し、危険なキーワードをハイライト表示。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: '詐欺メールAI判定',
    description:
      '届いた不審なメールを貼り付けるだけでAI用判定プロンプトを自動生成。ワンクリックでGemini・ChatGPT・Claudeに送って詐欺かどうか瞬時に判定。APIコスト0円。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: '詐欺判定', value: 'キーワード分析 + パターンマッチング' },
  { category: 'クイズ', value: '警察庁公開事例ベースの問題DB' },
  { category: 'データ保存', value: 'localStorage（完全ローカル処理）' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: 'セキュリティ', value: 'サーバー送信なし・完全クライアント側処理' },
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
    title: '家族で体験',
    desc: '詐欺クイズやシミュレーターを一緒にやって防犯意識UP',
    time: '10分',
  },
  {
    step: '3',
    title: 'チェックリスト実行',
    desc: '親のスマホ設定を確認・改善して詐欺をブロック',
    time: '30分',
  },
]

const targets = [
  {
    icon: Users,
    title: '離れて暮らす親が心配な方',
    description:
      '高齢の親御さんが一人暮らし、or 実家から離れている方に。次の帰省時にチェックリストを使ってセキュリティ設定を一緒に確認。詐欺クイズで楽しみながら防犯教育。',
  },
  {
    icon: UserCheck,
    title: '若い世代（闇バイト対策）',
    description:
      'SNSで「高額バイト」「即日現金」の誘いを見かけることが増えた方に。闇バイト判定チェッカーで安全性を確認。知らないうちに犯罪に加担するリスクを防止。',
  },
  {
    icon: Shield,
    title: '企業の研修担当者',
    description:
      '社員向けセキュリティ研修の教材としても活用可能。詐欺パターンクイズで実践的なトレーニング。スコア機能で理解度も確認できる。',
  },
]

const faqs = [
  {
    q: 'AI判定の精度はどのくらいですか？',
    a: '詐欺キーワードのパターンマッチングと実際の詐欺事例データベースをもとに判定します。判定精度の目安は80〜90%ですが、最終的な判断はご自身でお願いします。不明点は警察（#9110）にご相談ください。',
  },
  {
    q: '無料版はありますか？',
    a: '一部の機能（詐欺クイズの体験版）は無料でお試しいただけます。全機能（闇バイト判定・詐欺電話シミュレーター・家族見守りチェックリスト）はプレミアムプラン（¥1,980/月）でご利用いただけます。',
  },
  {
    q: '入力した個人情報は外部に送信されますか？',
    a: 'いいえ。すべての処理はブラウザ内で完結します。貼り付けたメール文・チャット内容・個人情報は一切外部サーバーに送信されません。完全ローカル処理です。',
  },
  {
    q: '最新の詐欺手口に対応していますか？',
    a: '警察庁・国民生活センターの公開情報をもとに代表的なパターンを収録しています。AIの判定ロジックは定期的にアップデート予定です。最新情報は各機関の公式サイトもご確認ください。',
  },
  {
    q: '初めて使う場合、どこから始めればいいですか？',
    a: 'まずは「詐欺クイズ」から始めることをおすすめします。実際の詐欺事例を学びながら判定力が身につきます。次に「詐欺電話シミュレーター」で断り方を練習し、「家族見守りチェックリスト」で身近な方のセキュリティを確認してください。',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'AI詐欺ディフェンダー',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
      description: '不審なメール・SNS・電話の詐欺をAIが即判定。闇バイト判定・詐欺電話シミュレーター・家族見守りチェックリスト付き。特殊詐欺・フィッシング対策。',
      url: 'https://membership-site-nextralabos.vercel.app/products/scam-defender',
      offers: {
        '@type': 'Offer',
        price: '1980',
        priceCurrency: 'JPY',
        name: 'プレミアムプラン',
      },
      publisher: {
        '@type': 'Organization',
        name: 'NextraLabs',
        url: 'https://membership-site-nextralabos.vercel.app',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
}

export default function ScamDefenderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-red-500/5" />
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
                  新商品
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  AI詐欺ディフェンダー
                </h1>
                <p className="text-xl text-muted-foreground mb-2">
                  詐欺メール判定 × 闇バイト判定 × 詐欺シミュレーション × 家族見守り
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  高齢の親を狙う詐欺電話、SNSの闇バイト勧誘。
                  <br />
                  AIが詐欺パターンを再現し、
                  <span className="text-foreground font-medium">
                    「断り方」を体で覚える
                  </span>
                  。家族全員の防犯力を底上げ。
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="text-sm py-1">
                    詐欺クイズ
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    電話シミュレーター
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    闇バイト判定
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    完全ローカル処理
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="text-lg px-8">プランを見る →</Button>
                  </Link>
                  <ToolLaunchButton productId="scam-defender" />
                </div>

                <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    データ送信なし
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    即日利用可能
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-500/20 to-red-500/20 rounded-2xl p-8 border border-emerald-500/10">
                  <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground ml-2">
                        AI詐欺ディフェンダー
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-red-500/10 rounded-lg p-3">
                        <div className="text-xs text-red-400 mb-1">詐欺シミュレーション</div>
                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground">「もしもし、○○だけど…」</p>
                          <p className="text-muted-foreground">「事故を起こしちゃって、示談金が…」</p>
                          <p className="text-green-400 font-medium">→ 「名前と所属を教えてください。折り返します」</p>
                        </div>
                      </div>
                      <div className="bg-emerald-500/10 rounded-lg p-3">
                        <div className="text-xs text-emerald-400 mb-1">闇バイト判定</div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">「<span className="text-red-400 font-bold">即日現金</span>」「<span className="text-red-400 font-bold">簡単作業</span>」「<span className="text-red-400 font-bold">身分証不要</span>」</p>
                          <p className="text-red-400 font-bold mt-1">危険度: 95% — 闇バイトの可能性が極めて高い</p>
                        </div>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <div className="text-xs text-green-400 mb-1">見守りチェック</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2"><span className="text-green-400">✓</span> <span className="text-muted-foreground">迷惑電話フィルタ設定済み</span></div>
                          <div className="flex items-center gap-2"><span className="text-green-400">✓</span> <span className="text-muted-foreground">二段階認証ON</span></div>
                          <div className="flex items-center gap-2"><span className="text-yellow-400">○</span> <span className="text-muted-foreground">留守番電話メッセージ確認</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-8 bg-red-500/5 border-t border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-red-500">441億円</div>
                <div className="text-sm text-muted-foreground">特殊詐欺被害額(2024年)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-500">19,033件</div>
                <div className="text-sm text-muted-foreground">年間認知件数</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-500">78%</div>
                <div className="text-sm text-muted-foreground">被害者の65歳以上率</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-500">増加中</div>
                <div className="text-sm text-muted-foreground">SNS型闇バイト勧誘</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              7つの機能で家族を詐欺から守る
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              「知っている」だけで防げる詐欺がある。
              AIで詐欺パターンを学び、家族全員の防犯力を上げよう。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((f, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.bg} mb-4`}
                    >
                      <f.icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Setup Steps */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              3ステップで防犯力アップ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {setupSteps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-emerald-500">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  <Badge variant="outline" className="mt-3">
                    {s.time}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              こんな方におすすめ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {targets.map((t, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <t.icon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              <Code2 className="inline h-8 w-8 mr-2" />
              技術スタック
            </h2>
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {techStack.map((t, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium">{t.category}</span>
                        <span className="text-sm text-muted-foreground">{t.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">料金</h2>
            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <Badge className="mb-4 bg-emerald-600">プレミアムプラン限定</Badge>
                  <div className="text-3xl font-bold mb-2">¥1,980<span className="text-base font-normal text-muted-foreground">/月</span></div>
                  <p className="text-muted-foreground mb-6">プレミアム全ツール使い放題</p>
                  <Link href="/pricing">
                    <Button className="w-full">プランを見る →</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              <HelpCircle className="inline h-8 w-8 mr-2" />
              よくある質問
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 mt-8">
              {faqs.map((f, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f.q}
                    </h3>
                    <p className="text-sm text-muted-foreground pl-7">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Amazon アソシエイト */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">セキュリティグッズをAmazonでチェック</p>
          <a
            href="https://www.amazon.co.jp/s?k=%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3%20%E8%A9%90%E6%AC%BA%E5%AF%BE%E7%AD%96&tag=nextralabs-22"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
          >
            Amazonで見る →
          </a>
        </div>
      </div>
    </>
  )
}
