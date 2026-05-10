import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'

export const metadata: Metadata = {
  title: 'AIペット通訳士（Pet Translator）| 愛犬・愛猫の気持ちをAIが解読',
  description: '愛犬・愛猫の行動・鳴き声・表情をAIが分析して気持ちを翻訳。健康状態のチェックや行動改善アドバイスも。ペットとの絆が深まるNextraLabs無料ツール。',
  keywords: ["AIペット翻訳","犬の気持ちAI","猫の気持ちAI","ペット行動分析","AIペット通訳"],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/pet-translator',
  },
  openGraph: {
    title: 'AIペット通訳士（Pet Translator）| 愛犬・愛猫の気持ちをAIが解読 | NextraLabs',
    description: '愛犬・愛猫の行動・鳴き声・表情をAIが分析して気持ちを翻訳。健康状態のチェックや行動改善アドバイスも。ペットとの絆が深まるNextraLabs無料ツール。',
    url: 'https://membership-site-nextralabos.vercel.app/products/pet-translator',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AIペット通訳士（Pet Translator）| 愛犬・愛猫の気持ちをAIが解読' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIペット通訳士（Pet Translator）| 愛犬・愛猫の気持ちをAIが解読',
    description: '愛犬・愛猫の行動・鳴き声・表情をAIが分析して気持ちを翻訳。健康状態のチェックや行動改善アドバイスも。ペットとの絆が深まるNextraLabs無料ツール。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
},
import {
  Camera,
  Volume2,
  MessageCircle,
  ArrowLeft,
  ShoppingCart,
  Code2,
  FolderTree,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  Heart,
  Stethoscope,
  Laptop,
  Smartphone,
  Wifi,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'カメラ映像からリアルタイム動き検出',
    description:
      'Webカメラの映像をフレーム差分解析でリアルタイム処理。ペットの動きレベルを0〜100%で常時計測。寝てるか、走り回ってるか、じっとしてるかを正確に把握。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Volume2,
    title: '鳴き声・音声のAI周波数解析',
    description:
      'マイクから拾った音声を周波数帯域ごとに解析。低音の唸り、中音のゴロゴロ、高音の鳴き声を分離し、感情推定の精度を大幅に向上。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: MessageCircle,
    title: '感情を日本語で言語化＆通知',
    description:
      '「寂しい」「お腹空いた」「幸せ」など7種類の感情をAIが判定。自然な日本語メッセージに翻訳してブラウザ通知やLINE・Telegramでお届け。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'HTML5 + CSS3 + Vanilla JS' },
  { category: 'カメラ制御', value: 'MediaDevices API (getUserMedia)' },
  { category: '音声解析', value: 'Web Audio API (AnalyserNode + FFT)' },
  { category: '動き検出', value: 'Canvas フレーム差分解析' },
  { category: '感情推定', value: 'マルチファクタースコアリングエンジン' },
  { category: '通知', value: 'Web Notifications API' },
  { category: 'デザイン', value: 'ダークモードUI（レスポンシブ対応）' },
  { category: '依存関係', value: 'なし（ゼロ依存・単一HTMLファイル）' },
]

const petTypes = [
  '🐱 猫',
  '🐕 犬',
  '🐦 鳥',
  '🐹 ハムスター',
  '🐰 うさぎ',
]

const emotions = [
  { emoji: '😴', name: 'おやすみ中', condition: '動き極小 + 音声なし' },
  { emoji: '😸', name: '幸せ', condition: '適度な動き + 中音域の音' },
  { emoji: '😿', name: '寂しい', condition: '動き少 + 断続的な鳴き声' },
  { emoji: '🍽️', name: 'お腹空いた', condition: '食事時間帯 + 動き + 鳴き声' },
  { emoji: '🙀', name: '不安', condition: '不規則な動き + 高音の鳴き声' },
  { emoji: '😼', name: '遊びたい', condition: '大きな動き + 音声少' },
  { emoji: '😾', name: '警戒中', condition: '大きな動き + 大きな音 + 低音' },
]

const setupSteps = [
  {
    step: '1',
    title: 'index.html を開く',
    desc: 'ダウンロードしたファイルをブラウザにドラッグ＆ドロップ',
    time: '1分',
  },
  {
    step: '2',
    title: 'ペット情報を設定',
    desc: 'ペットの種類（猫・犬・鳥・ハムスター・うさぎ）と名前を選択',
    time: '1分',
  },
  {
    step: '3',
    title: 'モニタリング開始',
    desc: 'ボタンを押してカメラ・マイクを許可するだけ',
    time: 'ワンクリック',
  },
]

const targets = [
  {
    icon: Heart,
    title: 'ペットオーナー・共働き家庭',
    description:
      '留守中のペットが心配な方に。外出先からペットの感情をリアルタイムで確認。安心して仕事に集中できる。',
  },
  {
    icon: Stethoscope,
    title: 'ペットシッター・動物病院',
    description:
      '預かりペットの状態を遠隔で可視化。飼い主への報告もデータ付きで信頼度アップ。',
  },
  {
    icon: Laptop,
    title: 'エンジニア × ペット好き',
    description:
      'Web Audio API + Canvas + MediaDevices の実践的な学習教材。WebRTC拡張でIoTポートフォリオにも最適。',
  },
]

const faqs = [
  {
    q: 'プログラミング知識がなくても使えますか？',
    a: 'はい。HTMLファイルをブラウザで開くだけで動作します。インストールもサーバーも不要です。',
  },
  {
    q: 'スマホからも使えますか？',
    a: 'はい。レスポンシブ対応済みで、スマホのブラウザからカメラ・マイクにアクセスして利用できます。',
  },
  {
    q: '猫と犬以外のペットにも対応していますか？',
    a: 'デフォルトで猫・犬・鳥・ハムスター・うさぎの5種に対応。カスタマイズガイドに従えば、どんなペットでも追加可能です。',
  },
  {
    q: '外出先から見られますか？',
    a: 'ローカル実行の場合は同じネットワーク内のみ。VPSやCloudflare Tunnelを使えば外出先からも確認可能です（デプロイガイド付き）。',
  },
  {
    q: '通知はどこに届きますか？',
    a: '標準でブラウザのプッシュ通知に対応。同梱のLINE Notify / Telegram Bot拡張モジュールを使えば、スマホに直接通知を送れます。',
  },
  {
    q: '購入後のアップデートはありますか？',
    a: '重大なバグ修正は無償提供。AI感情エンジンの精度向上アップデートは今後有料オプションとして提供予定です。',
  },
]

const costs = [
  { item: 'ホスティング', cost: '$0', note: 'ローカル実行なら不要' },
  { item: 'Vercel / Netlify', cost: '$0', note: '静的サイトホスティング無料枠' },
  { item: 'LINE Notify', cost: '$0', note: '無料API' },
  { item: 'Telegram Bot', cost: '$0', note: '無料' },
]

const fileTree = [
  { path: '(root)', files: ['index.html', 'server.js', 'README.md', 'CUSTOMIZATION.md'] },
  { path: 'docs/', files: ['EMOTION_ENGINE.md', 'LINE_NOTIFY.md', 'DEPLOY_GUIDE.md'] },
  { path: 'extensions/', files: ['line-notify.js', 'telegram-bot.js', 'data-export.js'] },
]

export default function PetTranslatorPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-pink-500/5" />
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
                🐾 ソースコード販売
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                AIペット翻訳モニター
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                AI搭載ペット感情リアルタイム翻訳システム
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                留守中のペットが今どんな気持ちか、AIがリアルタイムで翻訳。
                <br />
                カメラとマイクでペットの動きと鳴き声を解析し、
                <span className="text-foreground font-medium">
                  「寂しがっています」「お腹が空きました」
                </span>
                と感情を言語化して通知。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ToolLaunchButton productId="pet-translator" />
                <Link href="/pricing">
                  <Button size="lg">プランを見る →</Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    詳しく見る
                  </Button>
                </a>
              </div>
            </div>

            {/* Pet Emotion Preview */}
            <div className="relative">
              <div className="bg-[#0a0a0f] rounded-xl p-5 shadow-2xl border border-[#2a2a3a]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🐾</span>
                  <span className="text-white font-semibold text-sm">
                    ペット翻訳モニター
                  </span>
                </div>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">😿</div>
                  <div className="text-white font-bold text-lg">寂しい</div>
                  <div className="text-gray-400 text-xs mb-3">猫の感情分析</div>
                </div>
                <div className="bg-[#12121a] rounded-lg border border-[#2a2a3a] p-4 mb-3">
                  <div className="text-sm text-gray-200 leading-relaxed">
                    🐾 「飼い主さん、早く帰ってきて…<br />ここにひとりは寂しいよ」
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#1a1a25] rounded-lg p-2 border border-[#2a2a3a]">
                    <span className="text-gray-400">⚡ 動き</span>
                    <div className="text-white font-bold">8%</div>
                    <div className="h-1 bg-[#2a2a3a] rounded mt-1">
                      <div className="h-full bg-emerald-400 rounded" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                  <div className="bg-[#1a1a25] rounded-lg p-2 border border-[#2a2a3a]">
                    <span className="text-gray-400">🔊 音</span>
                    <div className="text-white font-bold">-38 dB</div>
                    <div className="h-1 bg-[#2a2a3a] rounded mt-1">
                      <div className="h-full bg-blue-400 rounded" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center text-gray-500 text-xs">
                  🧠 AI信頼度: 87% ┃ 🕐 14:32:05
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                🔔 LINE通知を送信
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotions */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">検出する感情（7種）</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {emotions.map((e) => (
              <div
                key={e.name}
                className="flex items-center gap-2 bg-card border rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="text-2xl">{e.emoji}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.condition}</div>
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
            3つのコア機能でペットの気持ちをリアルタイム翻訳
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
            プログラミング知識不要。ダウンロードして開くだけ
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
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

      {/* File Structure */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            含まれるもの
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            計10ファイル — ゼロ依存・すぐに動くコード一式
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

      {/* Pet Types */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            対応ペット（デフォルト5種）
          </h2>
          <p className="text-muted-foreground mb-8">
            感情データベースを編集するだけで無制限に拡張可能
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-6">
            {petTypes.map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="text-base px-5 py-2.5"
              >
                {p}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            🔧 フェレット、爬虫類、魚… カスタマイズガイドで何でも追加できます
          </p>
        </div>
      </section>

      {/* Cost */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">月額運用コスト</h2>
          <p className="text-muted-foreground text-center mb-12">
            完全無料で運用可能
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
                    $0/月
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="py-16">
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
      <section className="py-16 bg-muted/30">
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
                カメラとマイクの使用にはブラウザの許可が必要です。
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                感情推定はAIによる推測であり、獣医学的な診断ではありません。ペットの健康に不安がある場合は動物病院にご相談ください。
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
            留守中のペットの気持ちが
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent">
              わかるようになる
            </span>
          </h2>
          <p className="text-muted-foreground mb-2">
            お気に入りのおやつ1回分の価格で、ペットとの絆がもっと深まります。
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            サーバー不要・ゼロ依存・プログラミング知識不要。
          </p>
          <div className="flex flex-col items-center gap-4">
            <ToolLaunchButton productId="pet-translator" className="text-xl px-12 py-6 shadow-lg" />
            <Link href="/pricing">
              <Button className="text-xl px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white">プレミアムプラン（¥1,980/月）→</Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              プレミアムプラン限定ツール
            </p>
          </div>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 ペットグッズをAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E3%83%9A%E3%83%83%E3%83%88%20%E7%8C%AB%20%E7%8A%AC&tag=nextralabs-22"
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
