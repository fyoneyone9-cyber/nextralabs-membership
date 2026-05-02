'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Network,
  GitBranch,
  BarChart3,
  ArrowLeft,
  Shield,
  HelpCircle,
  AlertTriangle,
  Target,
  Users,
  Briefcase,
  Laptop,
  FolderTree,
  FileText,
  ArrowRight,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Network,
    title: 'PageRank でキーマン自動検出',
    description:
      'Google と同じアルゴリズムで「組織図では見えない真の影響力者」を数値化。ランキング表示で一目瞭然。',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: GitBranch,
    title: '部門間のブリッジ役を可視化',
    description:
      '媒介中心性により「部門間の情報ハブ」を検出。誰が組織の縦割りを横断しているかが分かる。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'インタラクティブ相関図',
    description:
      'D3.js フォースグラフでドラッグ・ズーム・クリックハイライト対応。プレゼン資料にも使える高品質な可視化。',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
]

const steps = [
  {
    num: '1',
    title: 'ツールを開く',
    description: 'アカウント不要。「無料で使う」ボタンから即起動',
    time: '1秒',
  },
  {
    num: '2',
    title: 'CSV をアップロード',
    description: 'Slack メンション CSV やカレンダー会議 CSV をドラッグ＆ドロップ',
    time: '1分',
  },
  {
    num: '3',
    title: '分析結果を確認',
    description: '相関図・キーマンランキング・ブリッジ役が自動表示',
    time: '即時',
  },
]

const techStack = [
  { label: '可視化エンジン', value: 'D3.js v7（Force-Directed Graph）' },
  { label: '分析アルゴリズム', value: 'PageRank + 媒介中心性（BFS）' },
  { label: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { label: 'データ入力', value: 'CSV ドラッグ＆ドロップ / 手動入力' },
  { label: 'エクスポート', value: 'PNG 画像 / JSON データ' },
  { label: 'プライバシー', value: '完全ローカル処理（サーバー通信なし）' },
]

const faq = [
  {
    q: 'なぜ無料なんですか？',
    a: 'NextraLabs の全13ツールの品質を知っていただくための無料サンプルです。気に入ったら他のツールや全ツール使い放題プランもぜひご検討ください。',
  },
  {
    q: 'アカウント登録は必要ですか？',
    a: 'いいえ。アカウント不要で誰でもすぐに使えます。',
  },
  {
    q: 'データは外部に送信されますか？',
    a: 'いいえ。すべてブラウザ内でローカル処理されます。サーバーへの通信は一切ありません。社内ネットワーク内でも安心してご利用いただけます。',
  },
  {
    q: '何人規模まで対応していますか？',
    a: '100人程度まで快適に動作します。それ以上の場合はフィルター機能で表示を絞ることで対応可能です。',
  },
  {
    q: 'Slack / Calendar 以外のデータも使えますか？',
    a: 'CSV フォーマット（from, to, weight）に合わせれば、Teams のチャットログや社内 SNS のデータなど何でも可視化できます。',
  },
]

const audiences = [
  {
    icon: Briefcase,
    title: 'マネージャー・人事担当',
    description:
      '組織の隠れた人間関係を定量的に把握。異動・チーム編成の判断材料に。',
  },
  {
    icon: Target,
    title: '経営企画・組織開発',
    description:
      '部門間コラボレーションの実態を可視化。サイロ化の発見と改善に活用。',
  },
  {
    icon: Laptop,
    title: 'エンジニア・データアナリスト',
    description:
      'ネットワーク分析・グラフ可視化の実践的なサンプルとして。',
  },
]

export default function OfficePoliticsGraphPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-24">
        {/* Back Link */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ツール一覧に戻る
          </Link>
        </div>

        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-sm px-3 py-1">
                🆓 無料で使える
              </Badge>
              <Badge variant="secondary" className="text-xs">
                🕸️ サンプルツール
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              社内政治 相関図
            </h1>
            <p className="text-lg text-gray-400">
              Slack × カレンダー関係性可視化ツール
            </p>
            <p className="text-gray-500 leading-relaxed">
              組織図には載らない「本当の人間関係」を可視化。
              Slackメンション傾向とカレンダー会議データから、隠れたキーマンやブリッジ役を自動検出するインタラクティブ相関図ツール。
            </p>

            {/* Free CTA */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                <span className="font-bold text-green-400">完全無料 — アカウント不要</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                NextraLabs のツール品質を体験していただくための無料サンプルです。会員登録なしで今すぐ使えます。
              </p>
              <Link href="/products/office-politics-graph/app">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full md:w-auto">
                  <Network className="w-5 h-5" />
                  無料で使ってみる
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                データ送信なし
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                アカウント不要
              </span>
            </div>
          </div>

          {/* Demo Preview Card */}
          <div className="relative">
            <Card className="bg-gray-900/80 border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      OPG
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        Office Politics Graph
                      </div>
                      <div className="text-gray-500 text-xs">ANALYZER</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">FREE</Badge>
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-yellow-400 text-sm font-medium">
                    👑 キーマンランキング
                  </div>
                  <div className="text-gray-300 text-sm">
                    &quot;1位: 清水直人&quot;
                  </div>
                  <div className="text-gray-300 text-sm">
                    &quot;PageRank: 8.2% — 全方位にパイプ&quot;
                  </div>
                  <div className="text-gray-300 text-sm">
                    &quot;接続数: 12 / 媒介中心性: 89%&quot;
                  </div>
                  <div className="text-gray-300 text-sm">
                    &quot;部門: 経営企画&quot;
                  </div>
                  <div className="text-indigo-400 text-sm mt-2 cursor-pointer">
                    📊 グラフで確認する →
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">何ができるか</h2>
            <p className="text-gray-400">
              3つのコア機能で組織の隠れた関係性を可視化
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} href="/products/office-politics-graph/app" className="group">
                <Card className="bg-gray-900/50 border-gray-800 hover:border-indigo-500/50 transition-colors h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}>
                        <f.icon className={`w-6 h-6 ${f.color}`} />
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-white font-semibold">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Setup Steps — 一本道フロー */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">使い方</h2>
            <p className="text-gray-400">
              アカウント登録不要。3ステップで相関図が完成
            </p>
          </div>

          {/* STEP 1 */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">1</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">CSVファイルを準備する</h3>
                  <p className="text-gray-400 text-sm">以下のフォーマットで3列のCSVを用意してください</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs shrink-0">1〜2分</Badge>
              </div>

              {/* CSV フォーマット説明 */}
              <div className="bg-gray-950 rounded-xl p-5 space-y-3 border border-gray-800">
                <p className="text-gray-300 text-sm font-medium">📋 CSVフォーマット（1行目はヘッダー必須）</p>
                <div className="overflow-x-auto">
                  <table className="text-sm w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-800">
                        <th className="text-indigo-400 pb-2 pr-8">列名</th>
                        <th className="text-indigo-400 pb-2 pr-8">意味</th>
                        <th className="text-indigo-400 pb-2">例</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-400 space-y-1">
                      <tr>
                        <td className="py-1.5 pr-8 font-mono text-yellow-400">from</td>
                        <td className="pr-8">メッセージ送信者 / 会議招集者</td>
                        <td className="font-mono">田中部長</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-8 font-mono text-yellow-400">to</td>
                        <td className="pr-8">メッセージ受信者 / 参加者</td>
                        <td className="font-mono">鈴木課長</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-8 font-mono text-yellow-400">weight</td>
                        <td className="pr-8">やり取り回数・強度（数値）</td>
                        <td className="font-mono">5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300">
                  <p className="text-gray-500 mb-1"># サンプル</p>
                  <p>from,to,weight</p>
                  <p>田中部長,鈴木課長,5</p>
                  <p>鈴木課長,山田主任,6</p>
                  <p>清水,伊藤,4</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="/samples/office-politics-sample.csv"
                    download
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    サンプルCSVをダウンロード
                  </a>
                  <p className="text-gray-500 text-xs self-center">← これを編集して使うのが一番早いです</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" />Slackのメンション集計CSV</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" />Googleカレンダーの会議参加者CSV</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" />手動で作った関係性メモCSV</span>
              </div>
            </CardContent>
          </Card>

          {/* STEP 2 */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">2</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">ツールにCSVをアップロード</h3>
                  <p className="text-gray-400 text-sm">ドラッグ＆ドロップまたはファイル選択でOK</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs shrink-0">即時</Badge>
              </div>
              <div className="bg-gray-950 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center space-y-2">
                <Upload className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-gray-400 text-sm">CSVファイルをここにドロップ</p>
                <p className="text-gray-600 text-xs">（実際のツール画面のイメージ）</p>
              </div>
              <p className="text-gray-500 text-xs">※ データはすべてブラウザ内で処理されます。外部サーバーへの送信は一切ありません。</p>
            </CardContent>
          </Card>

          {/* STEP 3 */}
          <Card className="bg-gray-900/50 border-indigo-500/30 border">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">3</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">相関図・分析結果を確認</h3>
                  <p className="text-gray-400 text-sm">キーマンランキング・ブリッジ役・インタラクティブグラフが自動表示</p>
                </div>
                <Badge className="ml-auto text-xs shrink-0 bg-green-500/20 text-green-400 border-green-500/30">完了</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-gray-950 rounded-lg p-3">
                  <p className="text-yellow-400 font-bold mb-1">👑 キーマン</p>
                  <p className="text-gray-400 text-xs">PageRankで自動検出</p>
                </div>
                <div className="bg-gray-950 rounded-lg p-3">
                  <p className="text-purple-400 font-bold mb-1">🌉 ブリッジ役</p>
                  <p className="text-gray-400 text-xs">部門間ハブを可視化</p>
                </div>
                <div className="bg-gray-950 rounded-lg p-3">
                  <p className="text-indigo-400 font-bold mb-1">🕸️ 相関図</p>
                  <p className="text-gray-400 text-xs">ドラッグ・ズーム対応</p>
                </div>
              </div>
              <div className="pt-2">
                <Link href="/products/office-politics-graph/app">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Network className="w-5 h-5" />
                    無料で使ってみる（アカウント不要）
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tech Stack */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">
            技術スタック
          </h2>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800">
                {techStack.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-6 py-4"
                  >
                    <span className="text-gray-400 text-sm">{t.label}</span>
                    <span className="text-white text-sm font-medium">
                      {t.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Target Audience */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">
            こんな人におすすめ
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <Card
                key={i}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <a.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-white font-semibold">{a.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {a.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Other tools upsell */}
        <section className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              🚀 他にも13のAIツールが使い放題
            </h2>
            <p className="text-gray-400 mb-6">
              このツールが気に入ったら、全ツール使い放題プラン（¥980/月）で全ツールをお試しください。
              <br />
              詐欺対策・買い物管理・婚活・退職・文章力アップなど、生活を守る＆改善するツールが揃っています。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/products">
                <Button variant="outline" size="lg" className="gap-2">
                  ツール一覧を見る
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  全ツール使い放題プランを見る
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">
            よくある質問
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    {item.q}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold text-white">
            組織図では見えない
            <br />
            本当の人間関係を可視化する
          </h2>
          <p className="text-gray-400">
            データドリブンな組織分析をブラウザだけで。完全無料。
          </p>
          <Link href="/products/office-politics-graph/app">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 text-base px-8 py-6">
              <Network className="w-5 h-5" />
              無料で使ってみる
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-gray-600 text-xs">
            アカウント登録不要・データ送信なし・完全ブラウザ処理
          </p>
        </section>
      </div>

      {/* Amazon アソシエイト */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 職場・人間関係本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E8%81%B7%E5%A0%B4%20%E4%BA%BA%E9%96%93%E9%96%A2%E4%BF%82&tag=nextralabs-22"
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
