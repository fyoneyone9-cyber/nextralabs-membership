import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'SNSオートポスター',
  description: 'トピックを入力するだけでTwitter・Instagram・Facebook・LinkedIn向けの投稿文を自動生成。ハッシュタグ提案付き。無料。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/sns-auto-poster' },
  openGraph: { title: 'SNSオートポスター | NextraLabs', description: 'トピックを入力するだけでTwitter・Instagram・Facebook・LinkedIn向けの投稿文を自動生成。ハッシュタグ提案付き。', url: 'https://membership-site-nextralabos.vercel.app/products/sns-auto-poster', type: 'website' },
}

import {
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  Share2,
  Hash,
  Copy,
  Palette,
  BarChart3,
  Zap,
  Globe,
  MessageSquare,
  Briefcase,
  Users,
  Megaphone,
} from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: '4プラットフォーム同時生成',
    description:
      'Twitter/X、Instagram、Facebook、LinkedInの4つのSNS向け投稿文を一度に自動生成。各プラットフォームの特性に最適化されたテキストを出力。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Palette,
    title: 'トーンセレクター',
    description:
      'カジュアル・ビジネス・楽しいの3つのトーンから選択。ターゲット層やブランドイメージに合わせた文体で投稿文を生成。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Hash,
    title: 'ハッシュタグ自動提案',
    description:
      'トピックに関連するハッシュタグを各プラットフォームに最適な数だけ自動生成。Instagram向けには多め、Twitter向けには厳選して提案。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BarChart3,
    title: '文字数カウント表示',
    description:
      '各プラットフォームの文字数制限に対するリアルタイムカウント表示。制限を超えた場合は警告表示で安心。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Copy,
    title: 'ワンクリックコピー',
    description:
      '生成された投稿文とハッシュタグをワンクリックでクリップボードにコピー。そのままSNSに貼り付けるだけで投稿完了。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Zap,
    title: '完全クライアント処理',
    description:
      'すべての生成処理はブラウザ内で完了。サーバーへのデータ送信は一切なし。プライバシーを完全に保護。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: '生成ロジック', value: 'テンプレートベース × パターンマッチング' },
  { category: 'ハッシュタグ', value: 'キーワード解析 + プラットフォーム最適化' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: 'セキュリティ', value: 'サーバー送信なし・完全クライアント側処理' },
]

const setupSteps = [
  { step: '1', title: 'トピックを入力', desc: '投稿したいテーマや内容を入力', time: '10秒' },
  { step: '2', title: 'トーンを選択', desc: 'カジュアル / ビジネス / 楽しい から選択', time: '3秒' },
  { step: '3', title: 'コピー＆投稿', desc: '生成された投稿をコピーしてSNSに貼り付け', time: '即時' },
]

const targets = [
  {
    icon: Megaphone,
    title: 'SNSマーケティング担当者',
    description: '複数プラットフォームへの同時投稿が必要な方。コンテンツ作成時間を大幅に短縮。',
  },
  {
    icon: Briefcase,
    title: '個人事業主・フリーランス',
    description: 'ビジネスの情報発信をもっと手軽に。プロフェッショナルな投稿文を簡単作成。',
  },
  {
    icon: Users,
    title: 'SNS初心者',
    description: '何を書けばいいか分からない方も安心。トピックを入れるだけで投稿文が完成。',
  },
]

const faqs = [
  { q: 'APIキーや外部サービスの登録は必要ですか？', a: 'いいえ。すべてブラウザ内で処理されるため、外部サービスへの登録やAPIキーは一切不要です。すぐにご利用いただけます。' },
  { q: '生成された投稿はそのまま使えますか？', a: 'はい。各プラットフォームの特性に合わせた文体で生成されるので、コピー＆ペーストでそのまま投稿できます。もちろん、お好みに合わせて微調整も可能です。' },
  { q: 'データはどこかに保存されますか？', a: '入力データも生成結果もサーバーには一切送信されません。すべてブラウザ内で完結するため、プライバシーは完全に保護されます。' },
  { q: '対応しているSNSプラットフォームは？', a: 'Twitter/X、Instagram、Facebook、LinkedInの4プラットフォームに対応しています。各プラットフォームの文字数制限やハッシュタグの最適数も考慮されています。' },
]

export default function SnsAutoPosterPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />ツール一覧に戻る
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">📱 無料ツール</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">SNSオートポスター</h1>
              <p className="text-xl text-muted-foreground mb-2">AI × マルチプラットフォームSNS投稿生成</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                トピックを入力するだけで、<span className="text-foreground font-medium">4つのSNSプラットフォーム向けの投稿文を自動生成。</span>
                <br />ハッシュタグ提案・文字数カウント付きで、すぐに投稿できます。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">🌐 4プラットフォーム対応</Badge>
                <Badge variant="outline" className="text-sm py-1">🎨 トーン切替</Badge>
                <Badge variant="outline" className="text-sm py-1">#️⃣ ハッシュタグ自動</Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 完全ローカル処理</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/products/sns-auto-poster/app">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8">🆓 無料で使う</Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />登録不要</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">SNSオートポスター</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-sky-500/10 rounded-lg p-3">
                      <div className="text-xs text-sky-400 mb-1">🐦 Twitter / X</div>
                      <p className="text-sm text-muted-foreground">AIを使った業務効率化について調べてみたんだけど、めっちゃ面白い！🔥</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-1">
                          <span className="text-xs bg-sky-500/20 px-1.5 py-0.5 rounded">#AI</span>
                          <span className="text-xs bg-sky-500/20 px-1.5 py-0.5 rounded">#効率化</span>
                        </div>
                        <span className="text-xs text-muted-foreground">120/280</span>
                      </div>
                    </div>
                    <div className="bg-pink-500/10 rounded-lg p-3">
                      <div className="text-xs text-pink-400 mb-1">📸 Instagram</div>
                      <p className="text-sm text-muted-foreground">✨ AI × 業務効率化 ✨ 最近ハマってるのがコレ！</p>
                      <div className="flex gap-1 mt-2">
                        <span className="text-xs bg-pink-500/20 px-1.5 py-0.5 rounded">#instagood</span>
                        <span className="text-xs bg-pink-500/20 px-1.5 py-0.5 rounded">#AI活用</span>
                      </div>
                    </div>
                    <div className="bg-blue-600/10 rounded-lg p-3">
                      <div className="text-xs text-blue-400 mb-1">💼 LinkedIn</div>
                      <p className="text-sm text-muted-foreground">AI活用について、最新の知見を共有させていただきます。</p>
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
          <h2 className="text-3xl font-bold text-center mb-4">6つの機能でSNS運用を効率化</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">トピックを入力するだけで、各プラットフォームに最適化された投稿文を自動生成。</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">3ステップで投稿完了</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-blue-500">{s.step}</span></div>
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
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4"><t.icon className="h-8 w-8 text-blue-500" /></div>
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
            <Card className="border-green-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">無料ツール</Badge>
                <div className="text-5xl font-bold mb-2">¥0</div>
                <p className="text-muted-foreground mb-6">登録不要で今すぐ使えます</p>
                <Link href="/products/sns-auto-poster/app">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">🆓 無料で使う</Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-4">他の有料ツールも使うなら → 全ツール使い放題プラン（¥980/月）</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Affiliate: Amazon Prime */}
      <section className="py-10 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-muted/40 border rounded-2xl p-6">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">PR・アフィリエイト</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">🎬 SNS投稿を自動化したら、空いた時間で映画を</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  「バック・トゥ・ザ・フューチャー」で世界を魅了したマイケル・J・フォックスのドキュメンタリー。SNS疲れを感じたら、スクリーンを切り替えてみては。
                  <br />
                  <span className="text-xs text-muted-foreground/70">Amazon Prime Video でお試し視聴できます</span>
                </p>
              </div>
              <a
                href="https://amzn.to/4d19hCq"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
              >
                Prime で観る →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><HelpCircle className="inline h-8 w-8 mr-2" />よくある質問</h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>
    </div>
  )
}
