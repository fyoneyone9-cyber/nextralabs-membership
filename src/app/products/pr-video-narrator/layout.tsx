import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'PRビデオナレーター | NextraLabs【AI動画ナレーション・プロモーション動画作成】',
  description: 'AIが商品・サービスのPR動画にプロ品質のナレーションを自動生成。音声合成・スクリプト作成・動画編集補助まで対応。月額980円から。',
  keywords: ['AI ナレーション', 'PR動画 AI', '動画 音声合成', 'プロモーション動画 AI', 'AI TTS 動画', 'ビデオ ナレーション ツール'],
  openGraph: {
    title: 'PRビデオナレーター | NextraLabs',
    description: 'AIがPR動画にプロ品質のナレーションを自動生成。',
    url: `${BASE}/products/pr-video-narrator`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'PRビデオナレーター | NextraLabs', description: 'AIがPR動画にプロ品質のナレーションを自動生成' },
  alternates: { canonical: `${BASE}/products/pr-video-narrator` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'PRビデオナレーター', item: `${BASE}/products/pr-video-narrator` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PRビデオナレーター',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIが商品・サービスのPR動画にプロ品質のナレーションを自動生成するツール。',
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
