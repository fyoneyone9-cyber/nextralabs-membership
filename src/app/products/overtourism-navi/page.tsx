import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'オーバーツーリズム緩和ナビ | 混雑分散AIで観光地の人流を最適化',
  description: '観光地が限界混雑に達した瞬間、AIがユーザーへ「今すぐ行ける隠れ名所＋周辺飲食クーポン」を提示。混雑を分散しながら地域消費を最大化する自治体・観光協会向けDXシステム。',
  keywords: ['オーバーツーリズム', '観光公害', '人流分散', '混雑ナビ', 'インバウンドDX', '観光DX', '自治体AI', 'Google Maps API'],
  alternates: {
    canonical: 'https://nextralab.jp/products/overtourism-navi',
  },
  openGraph: {
    title: 'オーバーツーリズム緩和ナビ | NextraLabs',
    description: '混雑を分散しながら地域消費を最大化。観光地・自治体・観光協会向けAI人流分散ナビ。',
    url: 'https://nextralab.jp/products/overtourism-navi',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'オーバーツーリズム緩和ナビ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'オーバーツーリズム緩和ナビ | NextraLabs',
    description: '観光地が限界混雑に達した瞬間、AIが隠れ名所＋クーポンを提示。自治体・観光協会向けDX。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const OvertourismNaviLP = dynamic(() => import('@/components/tools/OvertourismNaviLP'), { ssr: false })

export default function Page() {
  return <OvertourismNaviLP />
}
