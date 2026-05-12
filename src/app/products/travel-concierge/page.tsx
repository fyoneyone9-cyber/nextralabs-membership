import { Metadata } from 'next'
import Link from 'next/link'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'

export const metadata: Metadata = {
  title: 'AI旅行コンシェルジュ | 楽天トラベル×Google Maps×Gemini AIで旅程を自動生成 | NextraLabs',
  description:
    '目的地・日程・予算を入力するだけ。楽天トラベルで宿を自動検索、Google Maps周辺スポットを収集し、Gemini AIが完全オリジナル旅行プランを生成。月額¥980のスタンダードプランで利用可能。',
  keywords: [
    'AI旅行計画','楽天トラベルAPI','旅行プラン自動生成','Google Maps観光スポット',
    'Gemini AI旅行','旅行コンシェルジュ','日程自動作成','旅行ItineraryAI',
    '旅行予算計算','NextraLabs旅行','AI旅行','旅程自動生成','Google Maps観光'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://nextralab.jp/products/travel-concierge',
  },
  openGraph: {
    title: 'AI旅行コンシェルジュ | 楽天トラベル×Google Maps×Gemini AIで旅程を自動生成',
    description:
      '目的地・日程・予算を入力するだけ。楽天トラベルで宿を、Google Mapsで観光地を自動取得し、Gemini AIがオリジナル旅程を生成。月額¥980〜。',
    url: 'https://nextralab.jp/products/travel-concierge',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [
      {
        url: 'https://nextralab.jp/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI旅行コンシェルジュ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI旅行コンシェルジュ | 楽天トラベル×Google Maps×Gemini AI',
    description: '目的地・日程・予算を入力するだけでGemini AIが完全旅程を自動生成。月額¥980〜。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const FEATURES = [
  {
    icon: '🏨',
    title: '楽天トラベルで宿を自動取得',
    desc: '予算・チェックイン日・人数に合わせて楽天トラベルから最安値ホテルをリアルタイム検索。',
  },
  {
    icon: '📍',
    title: 'Google Mapsで観光地を収集',
    desc: '目的地周辺の観光スポット・グルメ・温泉などをカテゴリ別に最大8件取得。評価・場所情報付き。',
  },
  {
    icon: '✈️',
    title: 'Gemini AIが旅程を完全生成',
    desc: '取得した宿・観光地データをもとに、日程・テーマに合わせた完全オリジナル旅程プランを出力。',
  },
  {
    icon: '💰',
    title: '概算予算も自動算出',
    desc: '交通費・宿泊費・食費・観光費の目安をAIが推定。旅行前の予算計画に活用できます。',
  },
]

const STEPS = [
  { num: '01', label: '目的地・日程を入力', desc: '行き先・チェックイン/アウト日・人数・予算・テーマを設定' },
  { num: '02', label: '宿と観光地を自動収集', desc: '楽天トラベルとGoogle Mapsが並列でリアルデータを取得' },
  { num: '03', label: 'AI旅程を受け取る', desc: 'Gemini 2.5 Flashが10〜20秒で完全旅程を生成' },
]

const FAQS = [
  {
    q: '対応エリアはどこですか？',
    a: '日本国内全エリアに対応しています。楽天トラベルで宿泊施設が登録されているエリアであれば、ほぼすべての都道府県・観光地で旅程生成が可能です。',
  },
  {
    q: '生成される旅程の精度はどのくらいですか？',
    a: 'Gemini 2.5 Flashが楽天トラベルのリアルデータとGoogle Mapsの口コミ情報をもとに生成するため、実用的な旅程が出力されます。ただし実際の営業時間・混雑状況は事前確認をおすすめします。',
  },
  {
    q: '料金はどのくらいかかりますか？',
    a: 'スタンダードプラン（¥980/月）以上でご利用いただけます。1日5回まで旅程生成が可能です。',
  },
  {
    q: 'Googleカレンダーと連携できますか？',
    a: '現在v1.3で「過去旅程の保存・再利用」機能、v2.0以降でカレンダー連携を計画しています。最新のロードマップはページ下部でご確認ください。',
  },
  {
    q: 'API制限はありますか？',
    a: 'スタンダードプランで1日5回まで旅程生成が利用できます。プレミアムプランでは上限が大幅に緩和されます。楽天トラベルAPIおよびGoogle Places APIの呼び出し制限内で動作します。',
  },
]

export default function TravelConciergeLP() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'AI旅行コンシェルジュ',
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Web',
        description: '目的地・日程・予算を入力するだけ。楽天トラベルで宿を自動検索、Google Maps周辺スポットを収集し、Gemini AIが完全オリジナル旅行プランを生成。',
        url: 'https://nextralab.jp/products/travel-concierge',
        offers: {
          '@type': 'Offer',
          price: '980',
          priceCurrency: 'JPY',
          name: 'スタンダードプラン',
        },
        publisher: {
          '@type': 'Organization',
          name: 'NextraLabs',
          url: 'https://nextralab.jp',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif", color: '#f1f5f9' }}>
      <AffiliateBanner toolId="travel-concierge" />
    </>
  )
}
