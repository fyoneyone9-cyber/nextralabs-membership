import { Metadata } from 'next'
import TravelConcierge from '@/components/tools/TravelConcierge'

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

export default function TravelConciergeLP() {
  return <TravelConcierge />
}
