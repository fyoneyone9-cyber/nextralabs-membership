import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, Ticket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ticket Scout',
  description: 'e+・ローチケ・チケットぴあを一括検索。チケット発売日をGoogleカレンダーに自動登録しリマインダーも設定。月額¥980。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/ticket-scout' },
  openGraph: { title: 'Ticket Scout | NextraLabs', description: 'e+・ローチケ・チケットぴあを一括検索。チケット発売日をGoogleカレンダーに自動登録しリマインダーも設定。', url: 'https://membership-site-nextralabos.vercel.app/products/ticket-scout', type: 'website' },
}



export default function TicketScoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            <Ticket className="w-3 h-3 mr-1" /> ライブ・チケット支援
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
            Ticket Scout
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            アーティスト名を入力 → 3サイト一括検索 → 発売日をカレンダーに自動登録
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            e+ / ローチケ / チケットぴあ を横断検索。もうチケット発売を見逃さない。
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products/ticket-scout/app">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">今すぐ使う →</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">プレミアムプラン（¥1,980/月）</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-center mb-6">3ステップで発売日をカレンダーに</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            {[
              { num: '①', icon: '🎤', label: 'アーティスト入力' },
              { num: '②', icon: '🔍', label: '3サイト一括検索' },
              { num: '③', icon: '📅', label: 'カレンダー自動登録' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-card border rounded-xl px-6 py-4 text-center min-w-[130px]">
                  <div className="text-xs text-muted-foreground">{s.num}</div>
                  <div className="text-3xl">{s.icon}</div>
                  <div className="text-xs font-medium mt-1">{s.label}</div>
                </div>
                {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">機能詳細</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🎫', title: '3サイト横断検索', desc: 'e+・ローチケ・チケットぴあを同時に検索。サイトごとに選択してOK。' },
            { icon: '📅', title: 'Google Calendar自動登録', desc: 'チケット発売日・発売時刻をGoogleカレンダーに自動登録。リマインダーも設定されます。' },
            { icon: '⏰', title: '発売1時間前・10分前通知', desc: 'カレンダー登録時にリマインダーを自動設定。発売を見逃しません。' },
            { icon: '🔄', title: '何度でも検索OK', desc: 'API消費なしのスクレイピング方式のため、利用制限なし。複数アーティストを連続検索できます。' },
          ].map((f, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sites */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">対応チケットサイト</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'e+', desc: 'イープラス', color: 'border-blue-500/30 bg-blue-500/5' },
              { name: 'ローチケ', desc: 'ローソンチケット', color: 'border-pink-500/30 bg-pink-500/5' },
              { name: 'チケットぴあ', desc: 'Ticket Pia', color: 'border-orange-500/30 bg-orange-500/5' },
            ].map((site, i) => (
              <div key={i} className={`border rounded-xl p-5 text-center ${site.color}`}>
                <div className="text-xl font-bold mb-1">{site.name}</div>
                <div className="text-xs text-muted-foreground">{site.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">料金</h2>
          <Card className="border-violet-500/30 inline-block">
            <CardContent className="pt-8 pb-8 text-center">
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">スタンダードプラン以上</Badge>
              <div className="text-3xl font-bold mb-2">¥980<span className="text-base font-normal text-muted-foreground">/月</span></div>
              <p className="text-muted-foreground mb-6">スタンダード・プレミアム両プランで利用可能</p>
              <Link href="/pricing">
                <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">プレミアムプランを見る →</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: 'Google Calendarに登録するには？', a: 'ツール内の「Googleで連携」ボタンからOAuth認証を行ってください。初回のみ承認が必要です。' },
            { q: '発売日が「未定」になっています', a: 'まだ発売日が発表されていない公演は未定と表示されます。発売日が確定してから再検索してください。' },
            { q: '複数のアーティストを登録できますか？', a: 'はい。アーティスト名を変えて何度でも検索・登録できます。利用制限はありません。' },
            { q: 'チケットの自動購入はできますか？', a: '自動購入には対応していません。発売日の把握・カレンダー登録までをサポートするツールです。' },
          ].map((faq, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-2">Q. {faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
