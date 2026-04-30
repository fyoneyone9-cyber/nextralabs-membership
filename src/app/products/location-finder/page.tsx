import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'

export const metadata = {
  title: 'YouTuber撮影場所特定AI | NextraLabs',
  description: 'YouTube動画のサムネイルをVision AIで解析し、撮影場所をGoogle Maps上にピンポイント特定します。',
}

export default function LocationFinderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
            <MapPin className="w-3 h-3 mr-1" /> ロケーション解析シリーズ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            YouTuber撮影場所特定AI
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            YouTube URL を貼るだけ → サムネイルをAIが解析 → Google Mapsにピン表示
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Gemini Vision × Google Maps で撮影スポットをピンポイント特定
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products/location-finder/app">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">今すぐ使う →</Button>
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
          <h2 className="text-xl font-bold text-center mb-6">3ステップで完了</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            {[
              { num: '①', icon: '🔗', label: 'URL入力' },
              { num: '②', icon: '🤖', label: 'AI解析' },
              { num: '③', icon: '📍', label: 'マップ表示' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-card border rounded-xl px-6 py-4 text-center min-w-[120px]">
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
            { icon: '🖼️', title: 'サムネイル3枚解析', desc: '高画質・標準・中画質の3パターンのサムネイルをまとめてAIに送り、複数アングルから場所を推定します。' },
            { icon: '🤖', title: 'Gemini Vision解析', desc: '建物の外観・看板・地形・文字情報などの視覚的要素を総合的に分析。特定根拠も表示します。' },
            { icon: '📍', title: 'Google Mapsピン表示', desc: 'Geocoding + Places APIで座標を特定。Google Mapsに直接ピンを立てて表示します。' },
            { icon: '📊', title: '信頼度表示', desc: 'AIが「高・中・低」で信頼度を自己評価。根拠の明確さを事前に把握できます。' },
          ].map((f, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Caution */}
      <section className="bg-yellow-500/5 border-y border-yellow-500/20 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            ⚠️ ご利用上の注意
          </h2>
          <ul className="space-y-2">
            {[
              '本ツールの解析結果はAIによる推定であり、必ずしも正確ではありません。',
              '他者のプライバシー侵害・ストーキング・嫌がらせ目的での使用は固く禁止されています。',
              '公開されているYouTube動画のサムネイルのみを解析対象とします。',
              '1日1回の利用制限があります（APIコスト管理のため）。',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">料金</h2>
          <Card className="border-violet-500/30 inline-block">
            <CardContent className="pt-8 pb-8 text-center">
              <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">プレミアムプラン限定</Badge>
              <div className="text-3xl font-bold mb-2">¥1,980<span className="text-base font-normal text-muted-foreground">/月</span></div>
              <p className="text-muted-foreground mb-6">プレミアム全ツールが使い放題</p>
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
            { q: '非公開・限定公開動画は解析できますか？', a: 'サムネイルが公開されていない動画は解析できません。公開動画のみ対応しています。' },
            { q: '精度はどのくらいですか？', a: '看板・ランドマーク・建物の特徴が映っている場合は高精度（市区町村〜番地レベル）で特定できます。屋内や特徴のない場所は精度が下がります。' },
            { q: 'なぜ1日1回制限ですか？', a: 'Gemini Vision APIの利用コストを適切に管理するためです。ご理解ください。' },
            { q: '解析結果は保存されますか？', a: '解析結果はページを離れると消えます。必要な情報はスクリーンショット等で保存してください。' },
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
