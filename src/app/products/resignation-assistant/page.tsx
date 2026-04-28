import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PurchaseButton } from '@/components/PurchaseButton'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  FileText,
  Calculator,
  CheckSquare,
  ArrowLeft,
  Code2,
  FolderTree,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  Briefcase,
  Scale,
  AlertTriangle,
  Heart,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: '退職届テンプレート自動生成',
    description:
      'あなたの状況（正社員/契約/パート、退職理由、退職希望日）を入力するだけで、法的に正しい退職届・退職願をAIが自動作成。内容証明郵便用のフォーマットにも対応。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Calculator,
    title: '未払い残業代シミュレーター',
    description:
      '月給・勤務時間・残業時間を入力すると、未払い残業代の概算金額をAIが自動計算。割増賃金（25%/35%/50%）も正確に反映。請求書のテンプレートも生成。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: CheckSquare,
    title: '退職完全チェックリスト',
    description:
      '有給消化、社保切替（国保/任意継続）、年金手続き、退職金確認、離職票取得、失業保険申請まで。やるべきことを時系列で完全ガイド。進捗管理もできる。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Scale,
    title: '退職代行サービス比較',
    description:
      '弁護士型・労働組合型・民間型の3タイプを徹底比較。料金・対応範囲・リスクを一覧表示。あなたの状況に最適なサービスをAIがレコメンド。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Shield,
    title: '権利チェッカー',
    description:
      '「有給は何日残ってる？」「退職金はもらえる？」「競業避止義務は有効？」など、退職時に気になる権利をQ&A形式でAIが回答。労働基準法に基づいた正確な情報を提供。',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Clock,
    title: '退職スケジュールプランナー',
    description:
      '退職希望日から逆算して、いつまでに何をすべきかをカレンダー形式で自動生成。上司への報告、引継ぎ、各種届出のベストタイミングを提案。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: '退職届生成', value: 'AIテンプレートエンジン + PDF出力' },
  { category: '残業代計算', value: '労働基準法準拠ロジック' },
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
    title: '状況を入力',
    desc: '雇用形態、勤務年数、退職理由を簡単入力',
    time: '2分',
  },
  {
    step: '3',
    title: 'AIが全て生成',
    desc: '退職届、残業代計算、チェックリスト、スケジュールを一括生成',
    time: '10秒',
  },
]

const targets = [
  {
    icon: Briefcase,
    title: '退職を考えている方',
    description:
      '「辞めたいけど何から始めれば…」という方に。退職届の書き方から有給消化、社保切替まで、やるべきことを全てガイド。もう迷わない。',
  },
  {
    icon: AlertTriangle,
    title: 'ブラック企業で悩む方',
    description:
      '未払い残業代の計算、退職代行サービスの比較、権利の確認まで。法的に正しい知識で武装して、安全に退職を進められる。',
  },
  {
    icon: Heart,
    title: '円満退職したい方',
    description:
      '退職スケジュールプランナーで、引継ぎ期間や上司への報告タイミングを最適化。感謝を伝えながらスムーズに退職できる。',
  },
]

const faqs = [
  {
    q: '入力した個人情報はサーバーに送信されますか？',
    a: 'いいえ。すべての処理はブラウザ内で完結します。会社名、給与情報、個人情報は一切外部に送信されません。完全にプライバシーが保護されます。',
  },
  {
    q: '退職届をこのツールで直接送ることはできますか？',
    a: 'いいえ。このツールは退職届のテンプレート生成までを行います。実際の提出はご自身で行っていただきます（手渡し、郵送、退職代行サービス経由など）。',
  },
  {
    q: '未払い残業代の計算は正確ですか？',
    a: '労働基準法に基づいた計算ロジックを使用していますが、あくまで概算です。正確な金額は社労士や弁護士にご確認ください。請求の参考値としてご活用いただけます。',
  },
  {
    q: '退職代行サービスを直接申し込めますか？',
    a: 'いいえ。このツールは比較情報の提供のみを行います。実際の申し込みは各サービスのサイトで直接お手続きください。',
  },
  {
    q: 'パート・アルバイトでも使えますか？',
    a: 'はい。正社員、契約社員、パート、アルバイトすべての雇用形態に対応しています。それぞれに適した退職届テンプレートとチェックリストを生成します。',
  },
]

export default function ResignationAssistantPage() {
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
                📝 新商品
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                退職あんしんAI
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                退職届生成 × 残業代計算 × 完全チェックリスト
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                「辞めたいけど何から始めれば…」を完全解決。
                <br />
                AIが退職届を自動作成、未払い残業代を計算、
                <span className="text-foreground font-medium">
                  有給・社保・年金の手続きまで完全ガイド
                </span>
                。あなたの退職を安心サポート。
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">
                  📝 退職届AI生成
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  💰 残業代シミュレーター
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  ✅ 完全チェックリスト
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  🔒 完全ローカル処理
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4">
                <PurchaseButton productId="resignation-assistant" />
                <ToolLaunchButton productId="resignation-assistant" />
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
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">
                      退職あんしんAI
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <div className="text-xs text-blue-400 mb-1">📝 退職届プレビュー</div>
                      <div className="text-sm font-mono">
                        <p className="text-right text-muted-foreground">令和8年5月1日</p>
                        <p className="text-muted-foreground">株式会社○○○ 代表取締役社長 殿</p>
                        <p className="mt-2 font-bold text-foreground">退 職 届</p>
                        <p className="text-xs text-muted-foreground mt-1">このたび一身上の都合により...</p>
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <div className="text-xs text-green-400 mb-1">💰 未払い残業代</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">概算請求額</span>
                        <span className="text-xl font-bold text-green-400">¥487,500</span>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3">
                      <div className="text-xs text-purple-400 mb-1">✅ 退職チェックリスト</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2"><span className="text-green-400">✓</span> <span className="text-muted-foreground">退職届の作成</span></div>
                        <div className="flex items-center gap-2"><span className="text-green-400">✓</span> <span className="text-muted-foreground">有給残日数の確認</span></div>
                        <div className="flex items-center gap-2"><span className="text-yellow-400">○</span> <span className="text-muted-foreground">健康保険の切替手続き</span></div>
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">□</span> <span className="text-muted-foreground">離職票の受取</span></div>
                      </div>
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
          <h2 className="text-3xl font-bold text-center mb-4">
            6つの機能で退職を完全サポート
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            法的に安全な範囲で、退職に必要な準備を全てAIがアシスト。
            あなたは一つずつ確認して実行するだけ。
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

      {/* Important Notice */}
      <section className="py-12 bg-amber-500/5 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-2">⚠️ 重要なお知らせ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  このツールは退職準備の<strong className="text-foreground">情報提供・テンプレート生成</strong>を行うものです。
                  法律相談、退職届の代理提出、未払い残業代の代理請求は行いません。
                  これらが必要な場合は、弁護士・社労士・退職代行サービスにご相談ください。
                  生成されるテンプレートや計算結果はあくまで参考値です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            3ステップで退職準備完了
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-500">
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
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <t.icon className="h-8 w-8 text-blue-500" />
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
          <p className="text-center text-muted-foreground mb-8">
            モダンなWeb技術で構築された安全なツール
          </p>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {techStack.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm font-medium">{t.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {t.value}
                      </span>
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
            <Card className="border-blue-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  買い切り
                </Badge>
                <div className="text-5xl font-bold mb-2">
                  ¥4,980
                  <span className="text-lg font-normal text-muted-foreground">
                    （税込）
                  </span>
                </div>
                <p className="text-muted-foreground mb-6">
                  一度の購入でずっと使える
                </p>
                <PurchaseButton productId="resignation-assistant" />
                <p className="text-xs text-muted-foreground mt-4">
                  全ツール使い放題プラン（¥980/月）なら全ツール使い放題
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
            <HelpCircle className="inline h-8 w-8 mr-2" />
            よくある質問
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
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
