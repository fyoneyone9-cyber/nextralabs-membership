import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'

import { Shield, Clock, MessageSquare, Zap, CheckCircle2, ArrowLeft, Brain, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る',
  description: '迷惑な勧誘・しつこいLINE・断りにくい頼まれごとをスマートに断る文章をAIが生成。角が立たず・後腐れなし・でも確実に断れる魔法の言葉。',
  keywords: ["AI塩対応","断り方AI","迷惑対応AI","人間関係断り文句","LINEブロック文章AI"],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/shio-taiou',
  },
  openGraph: {
    title: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る | NextraLabs',
    description: '迷惑な勧誘・しつこいLINE・断りにくい頼まれごとをスマートに断る文章をAIが生成。角が立たず・後腐れなし・でも確実に断れる魔法の言葉。',
    url: 'https://membership-site-nextralabos.vercel.app/products/shio-taiou',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る',
    description: '迷惑な勧誘・しつこいLINE・断りにくい頼まれごとをスマートに断る文章をAIが生成。角が立たず・後腐れなし・でも確実に断れる魔法の言葉。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

const features = [
  { icon: MessageSquare, title: '6つのシチュエーション', description: '訪問要求・法事・お金の無心・生活干渉・子供の催促・その他、あらゆる「断りたい」場面に対応。' },
  { icon: Shield, title: '3段階のトーン調整', description: 'やんわり→しっかり→鉄壁。関係性を壊さない絶妙なラインを自動で調整。' },
  { icon: Clock, title: '既読タイミング提案', description: 'いつ既読にして、いつ返信するか。心理学に基づいた最適なタイミングを提案。' },
  { icon: Brain, title: 'プロのコツ付き', description: '人間関係のプロが使うテクニックを返信と一緒に伝授。次回以降も応用できる。' },
  { icon: Users, title: '5つの関係性対応', description: '義父母・親戚・上司・近所・その他。相手との関係に合わせた適切な距離感で。' },
  { icon: Zap, title: 'ワンタップ生成', description: '選んで押すだけ。AIが一瞬で返信文を生成。コピーしてそのまま送信。' },
]

export default function ShioTaiouPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            ツール一覧に戻る
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">🧂 スタンダードプラン</Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">塩対応代行AI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            義実家・親戚からの重い連絡に、角が立たないが絶対に断る返信を一瞬で生成。既読タイミングまで計算する防衛ツール。
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="outline">💬 テンプレート方式</Badge>
            <Badge variant="outline">🔒 API不要・完全オフライン</Badge>
            <Badge variant="outline">📋 コピー→送信</Badge>
          </div>

          <div className="flex flex-wrap gap-4">
            <ToolLaunchButton productId="shio-taiou" />
            <Link href="/pricing">
              <Button variant="outline" size="lg">プランを見る</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">機能一覧</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-6">
                  <f.icon className="h-8 w-8 text-emerald-500 mb-3" />
                  <h3 className="font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">こんな時に使える</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              '「今度の日曜、孫の顔見せに来なさいよ」',
              '「法事があるから必ず来てね」',
              '「ちょっとお金貸してくれない？」',
              '「あなたたちの教育方針、おかしいんじゃない？」',
              '「そろそろ子供は？結婚は？」',
              '「町内会の役員、今年はお宅の番よ」',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">料金</h2>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <Badge className="mb-4">スタンダードプラン対応</Badge>
              <div className="text-3xl font-bold mb-2">¥980<span className="text-base font-normal text-muted-foreground">/月</span></div>
              <p className="text-muted-foreground mb-6">スタンダードプランで利用可能</p>
              <Link href="/pricing">
                <Button className="w-full">プランを見る →</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Amazon アソシエイト */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 コミュニケーション本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E3%82%B3%E3%83%9F%E3%83%A5%E3%83%8B%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%20%E8%A9%B1%E3%81%97%E6%96%B9&tag=nextralabs-22"
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
