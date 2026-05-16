import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AI婚活スケジューラー | NextraLabs【婚活AI・お見合い管理ツール】',
  description: 'AIが婚活スケジュール・お見合い日程・プロフィール改善をトータルサポート。結婚相談所・マッチングアプリ活動を効率化。月額980円から。',
  keywords: ['婚活 AI', 'お見合い 管理', '婚活スケジュール', '結婚相談所 AI', 'マッチングアプリ 効率化', '婚活 ツール'],
  openGraph: {
    title: 'AI婚活スケジューラー | NextraLabs',
    description: 'AIが婚活・お見合いをトータルサポート。成婚率アップ。',
    url: `${BASE}/products/konkatsu-scheduler`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI婚活スケジューラー | NextraLabs', description: 'AIが婚活・お見合いをトータルサポート' },
  alternates: { canonical: `${BASE}/products/konkatsu-scheduler` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AI婚活スケジューラー', item: `${BASE}/products/konkatsu-scheduler` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI婚活スケジューラー',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIが婚活スケジュール・お見合い日程・プロフィール改善をトータルサポートするツール。',
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
