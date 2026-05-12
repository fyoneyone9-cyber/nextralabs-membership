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
    canonical: 'https://nextralab.jp/products/shio-taiou',
  },
  openGraph: {
    title: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る | NextraLabs',
    description: '迷惑な勧誘・しつこいLINE・断りにくい頼まれごとをスマートに断る文章をAIが生成。角が立たず・後腐れなし・でも確実に断れる魔法の言葉。',
    url: 'https://nextralab.jp/products/shio-taiou',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る',
    description: '迷惑な勧誘・しつこいLINE・断りにくい頼まれごとをスマートに断る文章をAIが生成。角が立たず・後腐れなし・でも確実に断れる魔法の言葉。',
    images: ['https://nextralab.jp/og-image.png'],
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

      {/* Amazon アフィリエイト */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 truncate">🛒 コミュニケーション本をAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=%E3%82%B3%E3%83%9F%E3%83%A5%E3%83%8B%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%20%E8%A9%B1%E3%81%97%E6%96%B9&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-amber-400 transition-colors"
        >
          <span className="text-amber-500/60 font-bold text-[10px]">Amazon</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
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
              { name: '蛯原 淳', role: '会社員・30代', location: '東京都', text: '上司への愚痴を誰かに聞いてほしくて使いました。共感もせず解決策も出さない塩対応がなぜか逆にスッキリしました。友達に愚痴るより気楽で、次の日も普通に仕事に行けました。不思議なツールです。', tag: 'ストレス発散' },
              { name: '下田 美緒', role: '大学生・20代', location: '大阪府', text: '失恋した後に使ってみました。そうですか、他にどうぞみたいな塩対応に逆にツボって笑えました。泣いてたのに気づいたら笑っていて、笑うって大事だなと実感しました。', tag: '失恋後の気分転換' },
              { name: '平野 哲', role: 'フリーランス・40代', location: '神奈川県', text: '仕事の愚痴を言いたいけど身近な人に言いにくくて。徹底的に塩対応してくれるのでじゃあもう愚痴るのやめようってなります。自分の思考を整理する逆説的なツールとして使っています。', tag: '思考整理' },
              { name: '武田 亜梨沙', role: '主婦・30代', location: '愛知県', text: '毎日育児で追い詰められているときに使いました。どんなに大変さを訴えても塩対応されると逆に自分を肯定できました。面白いアプローチの癒しツールです。', tag: '育児ストレス発散' },
              { name: '三好 巌', role: '営業職・50代', location: '福岡県', text: '仕事で叱られた日の夜に愚痴ったら以上ですって返ってきて爆笑しました。変に慰められるより清々しくて、翌朝スッキリ起きられました。笑えるストレス発散ツールとして重宝しています。', tag: '笑えるストレス発散' },
              { name: '金子 彩奈', role: 'IT企業勤務・20代', location: '東京都', text: '同僚に勧めてもらって半信半疑で使いました。ずっと塩対応し続けるAIの一貫性がむしろ信頼できて、変な共感よりずっとマシだと気づきました。チームで使ってみんなで笑えるので職場のアイスブレイクにもなっています。', tag: '職場アイスブレイク' },
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
