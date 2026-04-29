import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  Flame,
  Pencil,
  Hash,
  Image,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Zap,
  Newspaper,
} from 'lucide-react'

const features = [
  {
    icon: Newspaper,
    title: '今日のトレンドニュース',
    description:
      '主要ニュース・トレンドトピックを毎回取得。ニュースを「ネタ元」にして、自分の切り口で投稿文を組み立てる。時事ネタ×自分の意見=バズの王道パターン。',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Pencil,
    title: 'バズ投稿テンプレート',
    description:
      '「共感型」「問題提起型」「体験談型」「データ提示型」「逆張り型」など10パターン。ニュースや自分のネタを穴埋めで入れるだけでプロ級の投稿文に。',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Flame,
    title: 'バズ度診断',
    description:
      '下書きを入力すると、文字数・ハッシュタグ数・感情スコア・フック度・読みやすさを分析。改善提案付きで投稿前にブラッシュアップ。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Hash,
    title: 'ハッシュタグ辞典',
    description:
      'ジャンル別（ビジネス/副業/AI/ライフハック/育児/健康/料理/旅行）の定番＆トレンドハッシュタグ集。コピーボタンで一発挿入。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Image,
    title: '投稿画像ジェネレーター',
    description:
      '「名言風カード」「データ図解」「比較表」をブラウザ内で生成。自分の文章を入れてPNG/JPEGでダウンロード。画像付き投稿はエンゲージメント2〜3倍。',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: '投稿タイミングガイド',
    description:
      '曜日×時間帯のエンゲージメント傾向マップ。ペルソナに合わせた最適投稿タイミングを提案。「この投稿は火曜12時が最適」。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: 'ニュース取得', value: 'サーバーサイドAPI (リアルタイム)' },
  { category: '画像生成', value: 'Canvas API (ブラウザ内生成)' },
  { category: 'テンプレート', value: '10パターン × ペルソナ別最適化' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: 'セキュリティ', value: '下書きデータはローカル保存のみ' },
]

const targets = [
  {
    icon: TrendingUp,
    title: 'SNSでフォロワーを増やしたい方',
    description: 'バズるテンプレートと投稿タイミングで、効率的にフォロワーを増やす。闇雲に投稿する時代は終わり。',
  },
  {
    icon: Users,
    title: '副業・ビジネスの集客に使いたい方',
    description: 'SNSからの集客導線を作りたい方に。ペルソナ設定で「刺さる投稿」を量産。',
  },
  {
    icon: Zap,
    title: '毎日の投稿ネタに困っている方',
    description: '今日のニュースから投稿ネタを自動提案。「何を書けばいいかわからない」を解消。',
  },
]

const faqs = [
  { q: '他人の投稿をコピーするツールですか？', a: 'いいえ。このツールは「自分の言葉でバズらせる」ためのツールです。ニュースをネタ元にしつつ、自分の意見・体験をテンプレートに入れて投稿文を作成します。他人の投稿をコピーする機能はありません。' },
  { q: 'X(Twitter)以外でも使えますか？', a: 'はい。生成された投稿文はInstagram、Threads、note、Facebookなど、どのSNSでも使えます。ハッシュタグもプラットフォーム別に対応しています。' },
  { q: 'ニュースは自動で取得されますか？', a: 'はい。ツールを開くたびに最新のトレンドニュースを取得します。ジャンルを選んでフィルタリングも可能です。' },
  { q: '画像生成にAIを使いますか？', a: 'ブラウザ内のCanvas APIで生成するため、外部AIサービスは使いません。テキストを入力するだけで、見栄えの良い画像カードが作れます。' },
  { q: '投稿の自動送信はできますか？', a: 'いいえ。投稿文と画像を生成するまでがこのツールの範囲です。実際の投稿はご自身で各SNSから行ってください。これはスパム防止のための設計です。' },
]

export default function BuzzWriterPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />ツール一覧に戻る
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">🔥 新商品</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AIバズ文章コーチ</h1>
              <p className="text-xl text-muted-foreground mb-2">トレンドニュース × テンプレート × 画像生成</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                今日のニュースをネタに、<span className="text-foreground font-medium">自分の言葉でバズらせる。</span>
                <br />10種類のテンプレート、バズ度診断、投稿画像生成まで。SNS発信の最強コーチ。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">📰 トレンドニュース</Badge>
                <Badge variant="outline" className="text-sm py-1">📝 10テンプレ</Badge>
                <Badge variant="outline" className="text-sm py-1">🖼️ 画像生成</Badge>
                <Badge variant="outline" className="text-sm py-1">#️⃣ ハッシュタグ</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <ToolLaunchButton productId="buzz-writer" />
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />自動投稿なし</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">AIバズ文章コーチ</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-500/10 rounded-lg p-3">
                      <div className="text-xs text-red-400 mb-1">📰 今日のトレンド</div>
                      <div className="text-sm font-medium">AI規制法案が国会通過</div>
                      <div className="text-xs text-muted-foreground mt-1">→ テンプレ「問題提起型」で自分の意見を…</div>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-3">
                      <div className="text-xs text-orange-400 mb-1">📝 生成した投稿文</div>
                      <div className="text-sm">「AI規制法案が通過。でもちょっと待って。本当に規制すべきは…」</div>
                      <div className="flex gap-1 mt-2">
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">#AI規制</span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">#テクノロジー</span>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 rounded-lg p-3">
                      <div className="text-xs text-amber-400 mb-1">🔥 バズ度スコア</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-amber-400">87点</span>
                        <span className="text-xs text-muted-foreground">フック度◎ / 文字数◎ / 感情◎</span>
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
          <h2 className="text-3xl font-bold text-center mb-4">6つの機能でSNSを制する</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">パクツイではなく、自分の言葉でバズらせる。プロのSNSコンサルのノウハウをAIで再現。</p>
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

      {/* Target */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">こんな方におすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targets.map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4"><t.icon className="h-8 w-8 text-orange-500" /></div>
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
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <Badge className="mb-4">スタンダードプラン対応</Badge>
                <div className="text-3xl font-bold mb-2">¥980<span className="text-base font-normal text-muted-foreground">/月</span></div>
                <p className="text-muted-foreground mb-6">全ツール使い放題</p>
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
          <h2 className="text-3xl font-bold text-center mb-4"><HelpCircle className="inline h-8 w-8 mr-2" />よくある質問</h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>
    </div>
  )
}
