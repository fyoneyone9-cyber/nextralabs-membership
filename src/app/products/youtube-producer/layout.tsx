import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AIYouTubeプロデューサー | NextraLabs【チャンネル戦略・動画企画AIツール】',
  description: 'AIがYouTubeチャンネル戦略・動画企画・タイトル最適化・サムネイル提案をサポート。再生数・登録者数を最大化する。月額980円から。',
  keywords: ['YouTube AI', 'YouTubeチャンネル 戦略', '動画企画 AI', 'YouTube SEO', 'チャンネル成長 ツール', 'AI YouTube プロデューサー'],
  openGraph: {
    title: 'AIYouTubeプロデューサー | NextraLabs',
    description: 'AIがYouTubeチャンネル戦略・動画企画をサポート。再生数アップ。',
    url: `${BASE}/products/youtube-producer`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AIYouTubeプロデューサー | NextraLabs', description: 'AIがYouTubeチャンネル戦略・動画企画をサポート' },
  alternates: { canonical: `${BASE}/products/youtube-producer` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AIYouTubeプロデューサー', item: `${BASE}/products/youtube-producer` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AIYouTubeプロデューサー',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIがYouTubeチャンネル戦略・動画企画・タイトル最適化・サムネイル提案をサポートするツール。',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {children}
    </>
  )
}
