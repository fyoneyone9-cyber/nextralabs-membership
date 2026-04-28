'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PurchaseButton } from '@/components/PurchaseButton'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  Network,
  Crown,
  GitBranch,
  BarChart3,
  ArrowLeft,
  ShoppingCart,
  Shield,
  Globe,
  FileJson,
  Upload,
  Download,
  MousePointerClick,
  HelpCircle,
  AlertTriangle,
  Target,
  Users,
  Briefcase,
  Laptop,
  ChevronRight,
  FolderTree,
  Image as ImageIcon,
  FileText,
  File,
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
    title: 'index.html をブラウザで開く',
    description: 'サーバー不要。ダブルクリックで起動',
    time: '1分',
  },
  {
    num: '2',
    title: 'CSV をドラッグ＆ドロップ',
    description: 'Slack メンション CSV とカレンダー会議 CSV をアップロード',
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
  { label: 'フロントエンド', value: '単一 HTML ファイル（外部依存なし）' },
  { label: 'データ入力', value: 'CSV ドラッグ＆ドロップ' },
  { label: 'エクスポート', value: 'PNG 画像 / JSON データ' },
  { label: '対応ブラウザ', value: 'Chrome, Firefox, Safari, Edge' },
  { label: 'プライバシー', value: '完全ローカル処理（サーバー通信なし）' },
  { label: 'データソース', value: 'Slack API + Google Calendar API' },
]

const fileTree = [
  {
    folder: '(root)',
    files: ['index.html', 'README.md', 'LICENSE'],
  },
  {
    folder: 'sample-data/',
    files: ['slack_mentions.csv', 'calendar_meetings.csv'],
  },
  {
    folder: 'screenshots/',
    files: ['main.png', 'highlight.png'],
  },
]

const faq = [
  {
    q: 'プログラミング知識は必要ですか？',
    a: '不要です。HTML ファイルをブラウザで開いて CSV をドラッグ＆ドロップするだけで使えます。Slack API / Calendar API からのデータ取得には多少の技術知識が必要です。',
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
    a: 'CSV フォーマット（from, to, count）に合わせれば、Teams のチャットログや社内 SNS のデータなど何でも可視化できます。',
  },
  {
    q: '購入後のアップデートはありますか？',
    a: '重大なバグ修正は無償提供。機能追加は今後有料オプションとして提供予定です。',
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
      'ネットワーク分析・グラフ可視化の実践的なサンプルコードとして。ポートフォリオにも。',
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
            <Badge variant="secondary" className="text-xs">
              🕸️ ソースコード販売
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              社内政治 相関図
            </h1>
            <p className="text-lg text-gray-400">
              Slack × カレンダー関係性可視化ツール
            </p>
            <p className="text-gray-500 leading-relaxed">
              組織図には載らない「本当の人間関係」を可視化。
              <br />
              Slack メンション傾向とカレンダー会議データから、隠れたキーマンやブリッジ役を自動検出するインタラクティブ相関図ツール。
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ToolLaunchButton productId="office-politics-graph" />
              <PurchaseButton
                productId="office-politics-graph"
                label="¥4,980 で購入する"
                size="lg"
                className="gap-2"
              />
              <Link href="#features">
                <Button variant="outline" size="lg">
                  詳しく見る
                </Button>
              </Link>
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
            <div className="absolute -bottom-2 right-4 text-xs text-gray-600">
              インタラクティブ分析
            </div>
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
              <Card
                key={i}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}
                  >
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-white font-semibold">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Setup Steps */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              セットアップはたったの3ステップ
            </h2>
            <p className="text-gray-400">
              プログラミング不要。ブラウザで開いて CSV を入れるだけ
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <Card
                key={i}
                className="bg-gray-900/50 border-gray-800 text-center"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto">
                    {s.num}
                  </div>
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {s.time}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
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

        {/* File Tree */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">含まれるもの</h2>
            <p className="text-gray-400">
              計8ファイル — ブラウザで開くだけのシンプル構成
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {fileTree.map((group, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                    <FolderTree className="w-4 h-4" />
                    {group.folder}
                  </div>
                  {group.files.map((f, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-gray-400 text-sm pl-4"
                    >
                      <FileText className="w-3 h-3" />
                      {f}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
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

        {/* Notices */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            注意事項
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              デジタルコンテンツのため、購入後の返品・返金はお受けできません。
            </li>
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              個人利用・社内利用・商用利用 OK。再配布・転売は禁止です。
            </li>
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              Slack / Google Calendar からのデータ取得は利用者ご自身で行っていただく必要があります。
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold text-white">
            組織図では見えない
            <br />
            本当の人間関係を可視化する
          </h2>
          <p className="text-gray-400">
            データドリブンな組織分析をブラウザだけで。
          </p>
          <p className="text-gray-500 text-sm">
            完全ローカル処理で社内データも安心。
          </p>
          <div className="flex flex-col items-center gap-3">
            <ToolLaunchButton productId="office-politics-graph" className="text-base px-8 py-6" />
            <PurchaseButton
              productId="office-politics-graph"
              label="¥4,980（税込）で購入する"
              size="lg"
              className="gap-2 text-base px-8 py-6"
            />
            <p className="text-gray-500 text-xs">
              買い切り・ソースコード完全所有・商用利用OK
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
