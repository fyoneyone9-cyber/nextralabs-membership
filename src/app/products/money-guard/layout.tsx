import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AI家計防衛 | NextraLabs【節約・支出管理AIツール】',
  description: 'AIが家計を自動分析し、無駄な支出を検出・節約プランを提案。家計簿不要で月々の支出を最適化。月額980円のライトプランから利用可能。',
  keywords: ['AI 家計 節約', '支出 管理 AI', '家計防衛 ツール', '節約 アプリ AI', '家計簿 AI', '生活費 削減'],
  openGraph: {
    title: 'AI家計防衛 | NextraLabs',
    description: 'AIが家計を自動分析し節約プランを提案。家計簿不要。',
    url: `${BASE}/products/money-guard`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI家計防衛 | NextraLabs', description: 'AIが家計を自動分析し節約プランを提案' },
  alternates: { canonical: `${BASE}/products/money-guard` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AI家計防衛', item: `${BASE}/products/money-guard` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI家計防衛',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIが家計を自動分析し、無駄な支出を検出・節約プランを提案する家計管理ツール。',
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
