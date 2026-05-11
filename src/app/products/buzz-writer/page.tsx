import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'

export const metadata: Metadata = {
  title: 'AIバズライター（Buzz Writer）| バズるブログ記事・SNS投稿を一発生成',
  description: 'キーワードを入力するだけでSEO最適化済みのブログ記事・SNS投稿をAIが自動生成。Googleで上位表示されるコンテンツを最短5分で作成。NextraLabs会員限定。',
  keywords: ["AIライター","ブログ自動生成","SEOコンテンツAI","SNS投稿AI","バズるAI記事"],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/buzz-writer',
  },
  openGraph: {
    title: 'AIバズライター（Buzz Writer）| バズるブログ記事・SNS投稿を一発生成 | NextraLabs',
    description: 'キーワードを入力するだけでSEO最適化済みのブログ記事・SNS投稿をAIが自動生成。Googleで上位表示されるコンテンツを最短5分で作成。NextraLabs会員限定。',
    url: 'https://membership-site-nextralabos.vercel.app/products/buzz-writer',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AIバズライター（Buzz Writer）| バズるブログ記事・SNS投稿を一発生成' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIバズライター（Buzz Writer）| バズるブログ記事・SNS投稿を一発生成',
    description: 'キーワードを入力するだけでSEO最適化済みのブログ記事・SNS投稿をAIが自動生成。Googleで上位表示されるコンテンツを最短5分で作成。NextraLabs会員限定。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}
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
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Flame,
    title: 'バズ度診断',
    description:
      '下書きを入力すると、文字数・ハッシュタグ数・感情スコア・フック度・読みやすさを分析。改善提案付きで投稿前にブラッシュアップ。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Hash,
    title: 'ハッシュタグ辞典',
    description:
      'ジャンル別（ビジネス/副業/AI/ライフハック/育児/健康/料理/旅行）の定番＆トレンドハッシュタグ集。コピーボタンで一発挿入。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Image,
    title: '投稿画像ジェネレーター',
    description:
      '「名言風カード」「データ図解」「比較表」をブラウザ内で生成。自分の文章を入れてPNG/JPEGでダウンロード。画像付き投稿はエンゲージメント2〜3倍。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-red-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />ツール一覧に戻る
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">🔥 新商品</Badge>
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
              <div className="bg-gradient-to-br from-emerald-500/20 to-red-500/20 rounded-2xl p-8 border border-emerald-500/10">
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
                    <div className="bg-emerald-500/10 rounded-lg p-3">
                      <div className="text-xs text-emerald-400 mb-1">📝 生成した投稿文</div>
                      <div className="text-sm">「AI規制法案が通過。でもちょっと待って。本当に規制すべきは…」</div>
                      <div className="flex gap-1 mt-2">
                        <span className="text-xs bg-emerald-500/20 text-blue-400 px-2 py-0.5 rounded">#AI規制</span>
                        <span className="text-xs bg-emerald-500/20 text-blue-400 px-2 py-0.5 rounded">#テクノロジー</span>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-3">
                      <div className="text-xs text-emerald-400 mb-1">🔥 バズ度スコア</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-400">87点</span>
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
                  <div className="w-16 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"><t.icon className="h-8 w-8 text-emerald-500" /></div>
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
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 文章術本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E6%96%87%E7%AB%A0%E8%A1%93%20%E3%83%A9%E3%82%A4%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
        >
          Amazonで見る →
        </a>
      </div>

      {/* ── 口コミ ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に使ったユーザーの感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '仲村 詩織', role: 'ブロガー・30代', location: '東京都', text: 'ブログのPVが伸び悩んでいたときに使い始めました。タイトルの付け方とファーストビューの改善をアドバイスしてもらったら、翌週からPVが1.5倍になりました。文章力に自信がなくてもバズる記事が書けます。', tag: 'アフィリエイトブログ' },
              { name: '春日 健一', role: 'Webライター・フリーランス', location: '大阪府', text: 'クライアントへの納品品質を上げたくて使っています。SEOとUXを両立した文章構成を提案してくれて、クライアントのサイトの順位が上がりました。単価交渉の際の実績として使えています。', tag: 'Webライター' },
              { name: '矢崎 真澄', role: 'EC事業者', location: '神奈川県', text: '商品説明文を書くのが苦手でした。商品の特徴を箇条書きで入力するだけで購買意欲を高める文章にしてくれます。カート追加率が改善してROASが上がりました。', tag: 'EC商品ライティング' },
              { name: '桐島 俊', role: 'SNS担当・会社員', location: '愛知県', text: 'Twitter/Xの投稿文がなかなかバズらなくて悩んでいました。バズりやすい構造と感情訴求のポイントを教えてくれて、フォロワーが2ヶ月で3倍になりました。会社のアカウントでもその手法を使っています。', tag: 'SNS運用担当' },
              { name: '有田 美紀', role: 'note作家', location: '福岡県', text: 'noteで有料記事を売りたいけど導入文で離脱されていました。読者を引き込む冒頭文の型を教えてもらってから購読率が2倍になりました。文章の型を知るだけでこんなに変わるんだと驚きました。', tag: 'note有料記事' },
              { name: '滝沢 修平', role: '広告代理店勤務', location: '東京都', text: 'コピーライティングの仕事でアイデアが枯渇したときの壁打ち相手として使っています。ターゲットと商品を入力するだけでキャッチコピー候補を10案出してくれます。プレゼン前夜の強い味方です。', tag: 'コピーライター' },
            ].map((r, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 space-y-4 flex flex-col transition-all">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{r.role} · {r.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
