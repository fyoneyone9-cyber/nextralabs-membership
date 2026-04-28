import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PurchaseButton } from '@/components/PurchaseButton'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  TrendingDown,
  Calculator,
  Brain,
  PiggyBank,
  HeartPulse,
  BarChart3,
  Users,
  UserCheck,
  Wallet,
} from 'lucide-react'

const features = [
  {
    icon: TrendingDown,
    title: 'ギャンブル収支トラッカー',
    description:
      '賭けた額・当たった額を記録するだけで、累計損益をリアルタイムで可視化。グラフで「実は毎月○万円負けている」という事実を冷静に突きつける。目を背けていた現実と向き合える。',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Calculator,
    title: '期待値計算機',
    description:
      '競馬・競艇・宝くじ・パチンコ・スロット。各ギャンブルの「期待値」を数学的に解説。「10,000円賭けると平均7,500円しか返ってこない」をビジュアルで理解。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Brain,
    title: 'ギャンブル依存度セルフチェック',
    description:
      'WHO推奨のスクリーニングテスト（SOGS準拠）をベースに、20問の質問で依存度を5段階で判定。結果に応じた具体的なアドバイスと相談先を案内。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: PiggyBank,
    title: '「もし貯金してたら」シミュレーター',
    description:
      '月々のギャンブル支出額と期間を入力すると、「もし全額貯金していたら」「投資信託に回していたら」いくらになっていたかを計算。失った金額の重みを実感。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: BarChart3,
    title: '認知バイアス診断',
    description:
      'ギャンブラーが陥りやすい12の認知バイアス（ギャンブラーの誤謬、ニアミス効果、サンクコスト錯誤…）をクイズ形式で解説。自分がどのバイアスに弱いかを可視化。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: HeartPulse,
    title: '相談窓口ガイド',
    description:
      'ギャンブル依存症の相談ダイヤル（0120-977-556）、GA（ギャンブラーズ・アノニマス）、各都道府県の相談窓口をワンタップで確認。家族向けの相談先も。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: '収支管理', value: 'localStorage + Canvas チャート' },
  { category: '依存度判定', value: 'SOGS準拠スクリーニングロジック' },
  { category: 'シミュレーション', value: '複利計算 + インフレ調整' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: 'セキュリティ', value: 'サーバー送信なし・完全クライアント側処理' },
]

const setupSteps = [
  { step: '1', title: 'ツールを起動', desc: '購入後、ダッシュボードからワンクリックで起動', time: '1秒' },
  { step: '2', title: '収支を入力', desc: '直近の賭け額と結果を入力するだけ', time: '2分' },
  { step: '3', title: '現実を直視', desc: 'グラフとシミュレーションで「失ったお金」を可視化', time: '即時' },
]

const targets = [
  {
    icon: Users,
    title: 'ギャンブルをやめたい方',
    description: '「やめたいけどやめられない」方に。収支を記録し、期待値を理解し、依存度をチェック。数字で冷静に自分と向き合える。',
  },
  {
    icon: Wallet,
    title: '家計を立て直したい方',
    description: '「もし貯金してたら」シミュレーターで、失ったお金の重みを実感。家計改善の第一歩を踏み出せる。',
  },
  {
    icon: UserCheck,
    title: '家族がギャンブルに悩んでいる方',
    description: '相談窓口ガイドで適切な支援先を見つけられる。依存度チェックを一緒にやることで、本人の気づきを促すきっかけに。',
  },
]

const faqs = [
  { q: '入力した収支データはどこに保存されますか？', a: 'すべてブラウザのlocalStorageに保存されます。サーバーには一切送信されません。ブラウザを変えるとデータは引き継がれませんが、エクスポート機能で保存可能です。' },
  { q: 'ギャンブルの攻略法を教えてくれるツールですか？', a: 'いいえ。このツールは「ギャンブルで勝つ方法」ではなく「ギャンブルの数学的な不利さを理解し、お金を守る」ためのツールです。' },
  { q: '依存度チェックの結果は正確ですか？', a: 'WHO推奨のスクリーニングテスト（SOGS）を参考にしていますが、医学的な診断ではありません。結果に不安がある場合は、必ず専門の医療機関にご相談ください。' },
  { q: '家族に見せても大丈夫ですか？', a: 'はい。むしろ家族と一緒に使うことをおすすめします。「もし貯金してたら」シミュレーターや期待値計算機は、会話のきっかけになります。' },
  { q: '未成年でも使えますか？', a: 'はい。予防教育として活用できます。期待値の概念や認知バイアスの理解は、将来のギャンブル問題を予防する効果があります。' },
]

export default function MoneyGuardPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />ツール一覧に戻る
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">💰 新商品</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AI家計防衛シミュレーター</h1>
              <p className="text-xl text-muted-foreground mb-2">収支トラッカー × 期待値計算 × 依存度チェック</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                ギャンブルに使ったお金、<span className="text-foreground font-medium">もし全額貯金していたら今いくら？</span>
                <br />AIが収支を可視化し、期待値を解説し、認知バイアスを指摘。数字の力で「お金を守る力」を手に入れる。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">📊 収支トラッカー</Badge>
                <Badge variant="outline" className="text-sm py-1">🧮 期待値計算機</Badge>
                <Badge variant="outline" className="text-sm py-1">🧠 依存度チェック</Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 完全ローカル処理</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <PurchaseButton productId="money-guard" />
                <ToolLaunchButton productId="money-guard" />
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />データ送信なし</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500/20 to-amber-500/20 rounded-2xl p-8 border border-emerald-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">AI家計防衛シミュレーター</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-500/10 rounded-lg p-3">
                      <div className="text-xs text-red-400 mb-1">📊 今月の収支</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">累計損益</span>
                        <span className="text-2xl font-bold text-red-400">-¥127,500</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-700/50 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '73%' }} />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>投入: ¥175,000</span><span>回収: ¥47,500</span>
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <div className="text-xs text-green-400 mb-1">💰 もし貯金してたら…</div>
                      <div className="text-2xl font-bold text-green-400">¥2,100,000</div>
                      <div className="text-xs text-muted-foreground">月5万円 × 3年6ヶ月（投資信託なら+¥340,000）</div>
                    </div>
                    <div className="bg-amber-500/10 rounded-lg p-3">
                      <div className="text-xs text-amber-400 mb-1">🧮 競馬の期待値</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-amber-400">約75%</span>
                        <span className="text-xs text-muted-foreground">→ 10,000円賭けると平均7,500円しか返らない</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-red-500/5 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><div className="text-3xl font-bold text-red-500">320万人</div><div className="text-sm text-muted-foreground">推定ギャンブル依存症者</div></div>
            <div><div className="text-3xl font-bold text-amber-500">5.6兆円</div><div className="text-sm text-muted-foreground">公営競技年間売上</div></div>
            <div><div className="text-3xl font-bold text-orange-500">75%</div><div className="text-sm text-muted-foreground">競馬の還元率</div></div>
            <div><div className="text-3xl font-bold text-purple-500">46%</div><div className="text-sm text-muted-foreground">宝くじの還元率</div></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">6つの機能でお金を守る</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">「攻略法」ではなく「守り方」を教えるツール。数字で冷静に、自分のお金と向き合おう。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.bg} mb-4`}><f.icon className={`h-6 w-6 ${f.color}`} /></div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">3ステップで家計防衛開始</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-emerald-500">{s.step}</span></div>
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
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"><t.icon className="h-8 w-8 text-emerald-500" /></div>
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
          <h2 className="text-3xl font-bold text-center mb-4"><Code2 className="inline h-8 w-8 mr-2" />技術スタック</h2>
          <div className="max-w-2xl mx-auto">
            <Card><CardContent className="pt-6"><div className="space-y-3">{techStack.map((t, i) => (<div key={i} className="flex items-center justify-between py-2 border-b last:border-0"><span className="text-sm font-medium">{t.category}</span><span className="text-sm text-muted-foreground">{t.value}</span></div>))}</div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">料金</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-emerald-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">買い切り</Badge>
                <div className="text-5xl font-bold mb-2">¥4,980<span className="text-lg font-normal text-muted-foreground">（税込）</span></div>
                <p className="text-muted-foreground mb-6">一度の購入でずっと使える</p>
                <PurchaseButton productId="money-guard" />
                <p className="text-xs text-muted-foreground mt-4">プレミアムプラン（¥980/月）なら全ツール使い放題</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><HelpCircle className="inline h-8 w-8 mr-2" />よくある質問</h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>
    </div>
  )
}
