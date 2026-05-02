import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'

export const metadata: Metadata = {
  title: '資格試験 AIスケジューラー',
  description: '試験日を入力するだけ。AIが学習計画を自動生成してGoogleカレンダーに一括登録。ITパスポート・基本情報・CompTIA・AWS対応。月額¥980〜。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/exam-scheduler' },
  openGraph: { title: '資格試験 AIスケジューラー | NextraLabs', description: '試験日を入力するだけ。AIが学習計画を自動生成してGoogleカレンダーに一括登録。', url: 'https://membership-site-nextralabos.vercel.app/products/exam-scheduler', type: 'website' },
}
import {
  BookOpen,
  Calendar,
  Rss,
  BrainCircuit,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: Rss,
    title: 'RSSから試験日を自動取得',
    description:
      'IPA・CompTIAなど試験実施団体のRSSフィードから試験日程を自動取得。手動で調べる手間ゼロ。試験日が決まった瞬間から逆算スケジュールが組めます。',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: BrainCircuit,
    title: 'AIが最適な学習計画を生成',
    description:
      'Claude AIが試験の難易度・残り日数・週の学習回数を考慮して、基礎固め→応用演習→まとめ→直前対策の4フェーズに分けた学習スケジュールを自動生成。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Calendar,
    title: 'Googleカレンダーに一括登録',
    description:
      'Googleアカウントと連携するだけで、すべての学習セッションと試験本番日をカレンダーに自動登録。スマホにも即時同期されます。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
]

const supportedExams = [
  { name: 'ITパスポート', org: 'IPA', weeks: 6 },
  { name: '基本情報技術者', org: 'IPA', weeks: 12 },
  { name: '応用情報技術者', org: 'IPA', weeks: 16 },
  { name: 'CompTIA Security+', org: 'CompTIA', weeks: 12 },
  { name: 'AWS Solutions Architect', org: 'AWS', weeks: 10 },
  { name: 'その他RSSあり試験', org: 'カスタム', weeks: '自由設定' },
]

const steps = [
  {
    step: '1',
    title: '試験を選択',
    desc: 'プリセットから選ぶか、RSS URLを入力。複数試験を同時に追加できます。',
    time: '1分',
  },
  {
    step: '2',
    title: 'Googleアカウントを連携',
    desc: 'ボタン1つでGoogleカレンダーと接続。権限はカレンダーへの書き込みのみ。',
    time: '30秒',
  },
  {
    step: '3',
    title: 'スケジュール生成 & 登録',
    desc: 'AIが学習計画を生成し、Googleカレンダーに自動登録。あとは通知に従うだけ。',
    time: '1〜2分',
  },
]

const faqs = [
  {
    q: 'RSSで試験日が取れない場合はどうすればいいですか？',
    a: '手動で試験日を入力するフォームがあります。日付を入力すればそこから逆算してスケジュールを生成します。',
  },
  {
    q: '複数の試験を同時にスケジューリングできますか？',
    a: 'はい。「試験を追加」ボタンで何試験でも追加できます。それぞれ独立したスケジュールがカレンダーに登録されます。',
  },
  {
    q: 'Googleカレンダーのデータはサーバーに保存されますか？',
    a: 'いいえ。GoogleのOAuthトークンはブラウザのセッション内のみで使用し、サーバーには一切保存しません。',
  },
  {
    q: '学習スケジュールを変更したい場合は？',
    a: 'Googleカレンダー上で自由に編集できます。ツール側での変更が必要な場合は再度生成してください（既存イベントは上書きされません）。',
  },
  {
    q: 'AIが生成するスケジュールはどれくらいの精度ですか？',
    a: 'Claude（Anthropic）が試験ごとの標準的な学習ボリュームを考慮してフェーズ分けします。あくまで叩き台として使い、実際の進捗に合わせて調整してください。',
  },
]

const costs = [
  { item: 'RSS取得', cost: '無料', note: '外部APIなし' },
  { item: 'AI生成（Claude）', cost: '試験1件 ¥1〜3', note: '実行時のみ発生' },
  { item: 'Googleカレンダー', cost: '無料', note: 'Google API無料枠内' },
]

export default function ExamSchedulerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
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
              <Badge className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                📚 AI学習サポート
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                資格試験 AIスケジューラー
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                試験日から逆算。AI が最適な学習計画を自動生成
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                試験日をRSSから自動取得し、AIが
                <span className="text-foreground font-medium">
                  基礎固め・応用演習・直前対策
                </span>
                の4フェーズに分けた学習スケジュールを生成。
                そのままGoogleカレンダーに一括登録できます。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ToolLaunchButton productId="exam-scheduler" />
                <Link href="/pricing">
                  <Button size="lg">プランを見る →</Button>
                </Link>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className="bg-[#0a0a0f] rounded-xl p-5 shadow-2xl border border-[#2a2a3a]">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold text-sm">資格試験 AIスケジューラー</span>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { phase: '基礎固め', period: '〜6週前', color: 'bg-blue-500' },
                    { phase: '応用演習', period: '6週〜2週前', color: 'bg-purple-500' },
                    { phase: 'まとめ', period: '2週〜1週前', color: 'bg-orange-500' },
                    { phase: '直前対策', period: '1週前〜', color: 'bg-red-500' },
                  ].map((p) => (
                    <div key={p.phase} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${p.color} shrink-0`} />
                      <div className="flex-1 bg-[#1a1a25] rounded px-3 py-1.5 border border-[#2a2a3a]">
                        <span className="text-white text-xs font-medium">{p.phase}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{p.period}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-center">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <div className="text-green-400 text-xs font-bold">48件のイベントをカレンダーに登録しました</div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                📅 カレンダー自動登録
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Exams */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">対応試験（プリセット）</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {supportedExams.map((e) => (
              <div
                key={e.name}
                className="flex items-center gap-2 bg-card border rounded-xl px-4 py-3 shadow-sm"
              >
                <Target className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.org} · {e.weeks}週間前〜</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            🔧 RSS URLを入力すればどんな試験にも対応できます
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">3つのステップが全自動</h2>
          <p className="text-muted-foreground text-center mb-12">
            RSS取得 → AI生成 → カレンダー登録がワンクリック
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} mb-4`}>
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

      {/* Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">使い方</h2>
          <p className="text-muted-foreground text-center mb-12">最短3分でカレンダーに学習計画が入ります</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{s.desc}</p>
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {s.time}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">コスト</h2>
          <p className="text-muted-foreground text-center mb-12">ほぼ無料で使えます</p>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-0">
                {costs.map((c, i) => (
                  <div
                    key={c.item}
                    className={`flex items-center justify-between px-6 py-4 ${i < costs.length - 1 ? 'border-b' : ''}`}
                  >
                    <span className="text-sm font-medium">{c.item}</span>
                    <div className="text-right">
                      <span className="font-bold text-green-500">{c.cost}</span>
                      <span className="text-xs text-muted-foreground ml-2">{c.note}</span>
                    </div>
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
          <h2 className="text-3xl font-bold text-center mb-12">こんな人におすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: TrendingUp, title: 'キャリアアップを目指す社会人', desc: '仕事しながら資格勉強。限られた時間を最大限に活かしたい方に。スキマ時間に合わせた現実的なスケジュールを組みます。' },
              { icon: Target, title: '複数資格を同時に取りたい人', desc: 'ITパスポート→基本情報→応用情報を連続して取得したい方。試験が重ならないよう複数スケジュールを同時管理できます。' },
              { icon: BookOpen, title: '三日坊主になりがちな人', desc: 'カレンダーに入れることで「やらない言い訳」をなくす。Googleカレンダーのリマインダーが毎回背中を押してくれます。' },
            ].map((t) => {
              const Icon = t.icon
              return (
                <Card key={t.title} className="border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                試験日はRSSの内容に依存します。実際の試験日は必ず公式サイトで確認してください。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                AIが生成するスケジュールはあくまで目安です。実際の学習進捗に合わせて調整してください。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                スケジュール生成時にAnthropicのAPIを使用します（試験1件あたり¥1〜3程度）。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            「いつか勉強しよう」を
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              今日から始める計画に変える
            </span>
          </h2>
          <p className="text-muted-foreground mb-8">
            3分でGoogleカレンダーに学習スケジュールが入ります。
          </p>
          <div className="flex flex-col items-center gap-4">
            <ToolLaunchButton productId="exam-scheduler" className="text-xl px-12 py-6 shadow-lg" />
            <Link href="/pricing">
              <Button className="text-xl px-12 py-6 bg-blue-500 hover:bg-blue-600 text-white">
                スタンダードプラン（¥980/月）→
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">スタンダードプラン（¥980/月）限定ツール</p>
          </div>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 資格・勉強本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E5%8B%89%E5%BC%B7%E6%B3%95%20%E8%B3%87%E6%A0%BC&tag=nextralabs-22"
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
