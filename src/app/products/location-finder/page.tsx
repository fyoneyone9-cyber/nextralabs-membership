import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'

export const metadata: Metadata = {
  title: 'AI Location Finder | 条件から最適な場所・物件・エリアをAIが瞬時に発見 | NextraLabs',
  description: '「静かで家賃7万以下・駅徒歩10分」など条件を入力するだけ。AIが最適エリア・物件候補・周辺環境スコアをリアルタイム分析。引越し・移住・開業場所探しに。月額¥980。',
  keywords: ['場所探しAI','物件AI','引越しエリア診断','住みやすい街AI','開業場所AI','移住先AI','エリア分析AI','物件探しAI','住まい選びAI','NextraLabsロケーション'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://nextralab.jp/products/location-finder' },
  openGraph: {
    title: 'AI Location Finder | 条件から最適な場所・物件・エリアをAIが瞬時に発見 | NextraLabs',
    description: '「静かで家賃7万以下・駅徒歩10分」など条件を入力するだけ。AIが最適エリア・物件候補・周辺環境スコアをリアルタイム分析。引越し・移住・開業場所探しに。月額¥980。',
    url: 'https://nextralab.jp/products/location-finder',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AI Location Finder | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Location Finder | 条件から最適な場所・物件・エリアをAIが瞬時に発見 | NextraLabs',
    description: '条件を入力するだけ。AIが最適エリア・物件候補・周辺環境スコアをリアルタイム分析。月額¥980。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const faqItems = [
  {
    q: '対応エリアはどこですか？',
    a: '現在は日本全国47都道府県に対応しています。主要都市圏（東京・大阪・名古屋・福岡・札幌）は詳細なエリア分析が可能です。海外エリアへの対応も順次拡大予定です。',
  },
  {
    q: 'AIの分析精度はどのくらいですか？',
    a: 'Gemini Vision × Google Maps APIを組み合わせ、治安スコア・交通アクセス・生活利便性・騒音レベルなど複数指標を統合分析します。実際の居住者データや口コミも参照し、高精度なエリアマッチングを実現しています。',
  },
  {
    q: '賃貸だけでなく売買物件も対応していますか？',
    a: 'はい、賃貸・売買・事務所・店舗など用途に合わせた条件設定が可能です。予算・広さ・駅距離・築年数などの条件を組み合わせて最適エリアを絞り込みます。',
  },
  {
    q: '開業場所探しにも使えますか？',
    a: 'はい、店舗・オフィス・クリニックなど開業場所の選定にも対応しています。競合店の密度・ターゲット層の人口動態・交通量・駐車場の有無などビジネス視点の分析項目も搭載しています。',
  },
  {
    q: '無料トライアルはありますか？',
    a: 'FREEプランで基本的なエリア検索機能をお試しいただけます。月額¥980のスタンダードプランにアップグレードすると、詳細スコア分析・複数エリア比較・Google Maps連携など全機能が利用可能になります。',
  },
]

export default function LocationFinderPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'AI Location Finder',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: 'https://nextralab.jp/products/location-finder',
        description: '条件を入力するだけ。AIが最適エリア・物件候補・周辺環境スコアをリアルタイム分析。引越し・移住・開業場所探しに。',
        offers: {
          '@type': 'Offer',
          price: '980',
          priceCurrency: 'JPY',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '980', priceCurrency: 'JPY', unitText: '月' },
        },
        provider: { '@type': 'Organization', name: 'NextraLabs', url: 'https://nextralab.jp' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-blue-400 border-emerald-500/20">
            <MapPin className="w-3 h-3 mr-1" /> ロケーション解析シリーズ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-emerald-500 bg-clip-text text-transparent">
            AI Location Scout
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            YouTube URL を貼るだけ → サムネイルをAIが解析 → Google Mapsにピン表示
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Gemini Vision × Google Maps で撮影スポットをピンポイント特定
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products/location-finder/app">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">今すぐ使う →</Button>
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
              { num: '①', label: 'URL入力' },
              { num: '②', label: 'AI解析' },
              { num: '③', label: 'マップ表示' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-card border rounded-xl px-6 py-4 text-center min-w-[120px]">
                  <div className="text-xs text-muted-foreground">{s.num}</div>
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
            { title: 'サムネイル3枚解析', desc: '高画質・標準・中画質の3パターンのサムネイルをまとめてAIに送り、複数アングルから場所を推定します。' },
            { title: 'Gemini Vision解析', desc: '建物の外観・看板・地形・文字情報などの視覚的要素を総合的に分析。特定根拠も表示します。' },
            { title: 'Google Mapsピン表示', desc: 'Geocoding + Places APIで座標を特定。Google Mapsに直接ピンを立てて表示します。' },
            { title: '信頼度表示', desc: 'AIが「高・中・低」で信頼度を自己評価。根拠の明確さを事前に把握できます。' },
          ].map((f, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Caution */}
      <section className="bg-yellow-500/5 border-y border-yellow-500/20 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-4">
            ご利用上の注意
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
          <Card className="border-emerald-500/30 inline-block">
            <CardContent className="pt-8 pb-8 text-center">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">プレミアムプラン限定</Badge>
              <div className="text-3xl font-bold mb-2">¥1,980<span className="text-base font-normal text-muted-foreground">/月</span></div>
              <p className="text-muted-foreground mb-6">プレミアム全ツールが使い放題</p>
              <Link href="/pricing">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">プレミアムプランを見る →</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
        <div className="space-y-4">
          {faqItems.map((faq, i) => (
            <div key={i} className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-2">Q. {faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <AffiliateBanner toolId="location-finder" />
    </div>
  )
}
