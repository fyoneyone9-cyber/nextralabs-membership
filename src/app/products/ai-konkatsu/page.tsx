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
  Heart,
  MessageCircle,
  Camera,
  MapPin,
  BarChart3,
  Sparkles,
  Shield,
  Clock,
  Users,
  UserCheck,
  Lightbulb,
  ExternalLink,
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'プロフィール添削AI',
    description:
      '自己紹介文を入力するだけで、マッチング率が上がる表現にAIがリライト。「趣味は映画鑑賞」→「休日は隠れた名画を探すのが楽しみ。最近のお気に入りは…」のように具体性と魅力をプラス。',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: MessageCircle,
    title: 'メッセージ練習シミュレーター',
    description:
      'AIが相手役になって初回メッセージ〜デート誘いまでの会話を練習。「この返しはちょっと重いかも」「もう少しカジュアルに」など、リアルタイムでフィードバック。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: BarChart3,
    title: '相性診断・理想の相手像分析',
    description:
      '価値観・ライフスタイル・結婚観の30問に答えると、AIがあなたの「理想の相手像」を言語化。マッチングアプリの検索条件設定にそのまま使える。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Camera,
    title: '写真選定アドバイス',
    description:
      '手持ちの写真をアップロードすると、どの写真がプロフィールに最適かAIが分析。「笑顔が自然」「背景が良い」「明るさ調整推奨」などポイント別にスコアリング。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: MapPin,
    title: 'デートプランAI',
    description:
      'エリア・予算・相手の趣味・季節を入力すると、最適なデートプランを3パターン提案。「初デート向け」「2回目以降」「記念日」などシーン別に対応。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Lightbulb,
    title: '婚活戦略コーチ',
    description:
      '活動状況（マッチ数、デート数、交際率）を入力すると、AIが改善ポイントを分析。「プロフィール写真の変更」「メッセージの返信速度」など具体的なアクションプランを提示。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: 'AI会話', value: 'ルールベース + テンプレートエンジン' },
  { category: '相性診断', value: '多次元ベクトル分析アルゴリズム' },
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
    title: '機能を選択',
    desc: 'プロフィール添削、メッセージ練習、相性診断など使いたい機能を選ぶ',
    time: 'ワンクリック',
  },
  {
    step: '3',
    title: 'AIがサポート',
    desc: 'あなたの入力に合わせてAIが最適なアドバイスを提供',
    time: '即時',
  },
]

const targets = [
  {
    icon: Users,
    title: 'マッチングアプリ初心者',
    description:
      '「プロフィールに何を書けばいいかわからない」「最初のメッセージで毎回既読スルー…」そんな方に。AIが成功パターンを教えてくれる。',
  },
  {
    icon: UserCheck,
    title: '婚活中でなかなか成果が出ない方',
    description:
      '活動はしてるけど、なかなかマッチしない・デートに繋がらない方に。AIが客観的に改善ポイントを分析し、具体的なアクションプランを提示。',
  },
  {
    icon: Heart,
    title: '本気で結婚を考えている方',
    description:
      '相性診断で自分の価値観を深掘りし、理想の相手像を明確化。結婚相談所との併用もおすすめ。プロのカウンセラーに相談したい方はマレッジロードジャパンへ。',
  },
]

const faqs = [
  {
    q: '入力した情報はサーバーに送信されますか？',
    a: 'いいえ。すべての処理はブラウザ内で完結します。プロフィール内容、写真、会話内容は一切外部に送信されません。完全にプライバシーが保護されます。',
  },
  {
    q: 'マッチングアプリのアカウントと連携しますか？',
    a: 'いいえ。このツールは単体で動作します。マッチングアプリとの連携や自動操作は一切行いません。AIが提案したテキストをご自身でコピー＆ペーストしてお使いください。',
  },
  {
    q: 'どのマッチングアプリに対応していますか？',
    a: '特定のアプリに依存しません。Pairs、Omiai、with、Tinder、マリッシュなど、どのアプリでも使えるアドバイスを提供します。',
  },
  {
    q: '結婚相談所と併用できますか？',
    a: 'もちろんです。プロフィール添削やメッセージ練習は結婚相談所での活動にも活用できます。より本格的なサポートが必要な方は、マレッジロードジャパン（https://www.marriage-road.jp/）にご相談ください。',
  },
  {
    q: '写真選定で使った画像はどうなりますか？',
    a: 'ブラウザ内で解析するだけで、サーバーには一切アップロードされません。ページを閉じると解析データも消えます。',
  },
]

export default function AiKonkatsuPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5" />
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
              <Badge className="mb-4 bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20">
                💕 新商品
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                AI婚活コーチ
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                プロフィール添削 × メッセージ練習 × 相性診断
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                マッチング率を上げるプロフィールをAIが添削。
                <br />
                初回メッセージの練習、相性診断、デートプラン提案まで。
                <span className="text-foreground font-medium">
                  あなたの婚活をAIが全力サポート
                </span>
                。
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">
                  ✏️ プロフィール添削
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  💬 メッセージ練習
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  📊 相性診断
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  🔒 完全ローカル処理
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4">
                <PurchaseButton productId="ai-konkatsu" />
                <ToolLaunchButton productId="ai-konkatsu" />
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
              <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl p-8 border border-pink-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">
                      AI婚活コーチ
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-pink-500/10 rounded-lg p-3">
                      <div className="text-xs text-pink-400 mb-1">✏️ プロフィール添削</div>
                      <div className="text-sm">
                        <p className="text-muted-foreground line-through">趣味は映画鑑賞です。</p>
                        <p className="text-foreground mt-1">→ 休日は隠れた名作映画を探すのが楽しみ。最近は韓国映画にハマってます🎬 おすすめがあれば教えてください！</p>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3">
                      <div className="text-xs text-purple-400 mb-1">📊 相性スコア</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-700/50 rounded-full h-3">
                          <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full" style={{ width: '87%' }} />
                        </div>
                        <span className="text-xl font-bold text-pink-400">87%</span>
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-3">
                      <div className="text-xs text-cyan-400 mb-1">🗓️ デートプラン</div>
                      <div className="text-sm text-muted-foreground">
                        <p>📍 横浜みなとみらい・赤レンガ倉庫</p>
                        <p>☕ カフェでゆっくり → 🚶 海沿い散歩 → 🍽️ イタリアン</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marriage Road Japan Banner */}
      <section className="py-8 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-2">
              本格的なサポートが必要な方へ
            </p>
            <h3 className="text-lg font-bold mb-3">
              💒 結婚相談所 マレッジロードジャパン
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              AI婚活コーチの開発者が運営する結婚相談所。プロのカウンセラーが1対1であなたの婚活を徹底サポートします。
            </p>
            <a
              href="https://www.marriage-road.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
            >
              マレッジロードジャパン公式サイト
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            6つの機能であなたの婚活を全力サポート
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            プロフィール作成からデートプランまで。
            AIがあなたの魅力を最大限に引き出します。
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
            3ステップで婚活力アップ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-500">
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
                  <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                    <t.icon className="h-8 w-8 text-pink-500" />
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
            <Card className="border-pink-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20">
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
                <PurchaseButton productId="ai-konkatsu" />
                <p className="text-xs text-muted-foreground mt-4">
                  プレミアムプラン（¥980/月）なら全ツール使い放題
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA - Marriage Road Japan */}
      <section className="py-12 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-t">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-3">
            💒 AIだけでは物足りない方へ
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            結婚相談所マレッジロードジャパンでは、プロのカウンセラーが
            あなたの婚活を1対1で徹底サポート。AIツールとの併用で最強の婚活体制を。
          </p>
          <a
            href="https://www.marriage-road.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-lg transition-colors"
          >
            💒 マレッジロードジャパン公式サイト
            <ExternalLink className="h-5 w-5" />
          </a>
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
                    <ChevronRight className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
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
