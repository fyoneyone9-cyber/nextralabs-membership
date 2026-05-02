import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  BookOpen,
  CheckSquare,
  Zap,
  Globe,
  DollarSign,
  PenLine,
  UserCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'KDP出版ナビ | NextraLabs',
  description: 'Amazon Kindle出版（KDP）の手順をステップ形式でガイド。アカウント設定から原稿作成・価格設定・出版申請まで迷わず進められる。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/kdp-guide' },
  openGraph: {
    title: 'KDP出版ナビ | NextraLabs',
    description: 'Amazon Kindle出版（KDP）の手順をステップ形式でガイド。アカウント設定から出版申請まで迷わず進められる。',
    url: 'https://membership-site-nextralabos.vercel.app/products/kdp-guide',
    type: 'website',
  },
}

const features = [
  {
    icon: CheckSquare,
    title: 'ステップ式チェックリスト',
    description: '全4ステップ（アカウント設定→原稿作成→本の登録→出版申請）をチェックリスト形式でガイド。全項目を確認してから次へ進めるので抜け漏れゼロ。',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: BookOpen,
    title: '原稿・表紙の作り方ガイド',
    description: 'Word/EPUB形式の原稿作成方法、推奨解像度の表紙画像、Kindle Previewerでのプレビュー確認まで丁寧に解説。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: DollarSign,
    title: '価格・ロイヤリティの最適化',
    description: '70%ロイヤリティを得るための価格帯（250〜1,250円）やKDPセレクトのメリットをその場で確認しながら設定できる。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: UserCheck,
    title: 'マイナンバー税務設定サポート',
    description: '米国源泉徴収を30%→0%にするマイナンバー入力の重要性を強調表示。初心者が見落としがちな税務設定も確実にカバー。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: PenLine,
    title: '本の詳細・コンテンツ登録ガイド',
    description: 'タイトル・著者名・内容紹介・キーワード（最大7つ）、ファイルアップロード、プレビュー確認まで、KDPの管理画面に沿った順番で解説。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Zap,
    title: '完全無料・登録不要',
    description: 'ブラウザだけで動作。外部サービスへの登録やAPIキーは不要。プライバシーも完全に保護。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: 'UI', value: 'Tailwind CSS（ダークテーマ）' },
  { category: 'データ保存', value: 'ブラウザ内ステート管理（サーバー送信なし）' },
  { category: 'セキュリティ', value: '完全クライアント側処理' },
]

const setupSteps = [
  { step: '1', title: 'ステップを開く', desc: 'チェックリストに沿ってKDPアカウントを設定', time: '10分' },
  { step: '2', title: '原稿・表紙を準備', desc: 'ガイドを見ながら出版データを作成', time: '任意' },
  { step: '3', title: '申請して完了', desc: '全チェックを終えたら出版ボタンを押すだけ', time: '即時' },
]

const targets = [
  {
    icon: BookOpen,
    title: '初めて電子書籍を出版する方',
    description: 'KDPの登録から申請まで、何をすればいいか分からない方でも迷わず進められます。',
  },
  {
    icon: Globe,
    title: '副業・収益化を目指す方',
    description: 'Kindle出版は初期費用0円で世界中に販売できる副業。ロイヤリティ最大化のコツも解説。',
  },
  {
    icon: UserCheck,
    title: 'ビジネス・専門知識を持つ方',
    description: '専門スキルを電子書籍として出版し、パッシブインカムに変えたい方の最初の一歩をサポート。',
  },
]

const faqs = [
  {
    q: 'KDPへの登録は無料ですか？',
    a: 'はい。KDP（Kindle Direct Publishing）への登録は完全無料です。出版後、売上のロイヤリティ（35%または70%）を受け取る仕組みです。',
  },
  {
    q: 'このツールを使えば本が出版できますか？',
    a: '本ツールはKDP出版の手順をガイドするチェックリストです。原稿の作成や実際のKDP登録作業はご自身で行う必要があります。ただし、手順通りに進めることで迷いなく完了できます。',
  },
  {
    q: 'マイナンバーの入力は必須ですか？',
    a: '必須ではありませんが、入力しないと米国での源泉徴収が30%かかります。マイナンバーを入力すると0%になるため、売上に直結する重要な設定です。',
  },
  {
    q: '出版後すぐにAmazonで購入できますか？',
    a: '出版申請後、通常24〜72時間の審査期間があります。審査完了のメールが届いた後、Amazon各国のストアに自動的に掲載されます。',
  },
]

export default function KdpGuidePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
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
              <Badge className="mb-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
                📗 無料ツール
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">KDP出版ナビ</h1>
              <p className="text-xl text-muted-foreground mb-2">Amazon Kindle出版を迷わず完了 — ステップ式ガイド</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                KDPアカウント設定から原稿作成・価格設定・出版申請まで、
                <span className="text-foreground font-medium">チェックリスト形式で一歩ずつ進められる。</span>
                <br />個人出版デビューをサポートします。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">📋 4ステップ形式</Badge>
                <Badge variant="outline" className="text-sm py-1">💰 ロイヤリティ最適化</Badge>
                <Badge variant="outline" className="text-sm py-1">🌍 世界販売対応</Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 登録不要</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/products/kdp-guide/app">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8">
                    🆓 無料で使う
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />登録不要</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl p-8 border border-orange-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">KDP出版ナビ</span>
                  </div>
                  <div className="space-y-2">
                    {['KDPアカウントの初期設定', '出版データの作成', '本の登録・出版申請', '出版申請'].map((label, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                          i === 0
                            ? 'bg-orange-500/20 text-orange-300 font-semibold'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            i === 0 ? 'bg-orange-600 text-white' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {i + 1}
                        </span>
                        {label}
                      </div>
                    ))}
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-muted/50 text-muted-foreground">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-muted text-muted-foreground">
                        🎉
                      </span>
                      完了！
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">6つのポイントでKDP出版をサポート</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            チェックリストに沿って進めるだけで、初めてでも確実に出版申請まで完了できます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.bg} mb-4`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">3ステップで出版完了</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-500">{s.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                <Badge variant="outline" className="mt-3">{s.time}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">こんな方におすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targets.map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                    <t.icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            <Code2 className="inline h-8 w-8 mr-2" />技術スタック
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
            <Card className="border-green-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  無料ツール
                </Badge>
                <div className="text-5xl font-bold mb-2">¥0</div>
                <p className="text-muted-foreground mb-6">登録不要で今すぐ使えます</p>
                <Link href="/products/kdp-guide/app">
                  <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    🆓 無料で使う
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-4">
                  他の有料ツールも使うなら → 全ツール使い放題プラン（¥980/月）
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            <HelpCircle className="inline h-8 w-8 mr-2" />よくある質問
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    {f.q}
                  </h3>
                  <p className="text-sm text-muted-foreground pl-7">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
