import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'Kindle出版完全ナビ | NextraLabs【KDP・電子書籍出版AIツール】',
  description: 'KDP（Kindle Direct Publishing）での電子書籍出版をAIが完全サポート。ネタ出し・目次設計・原稿執筆・表紙生成・出版手続きまで一気通貫。月額980円から。',
  keywords: ['Kindle出版 AI', 'KDP 電子書籍', 'Kindle Direct Publishing', '電子書籍 出版 ツール', 'AI 本 執筆', 'Kindle 副業'],
  openGraph: {
    title: 'Kindle出版完全ナビ | NextraLabs',
    description: 'KDP電子書籍出版をAIが完全サポート。ネタ出しから出版まで。',
    url: `${BASE}/products/kdp-guide`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Kindle出版完全ナビ | NextraLabs', description: 'KDP電子書籍出版をAIが完全サポート' },
  alternates: { canonical: `${BASE}/products/kdp-guide` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'Kindle出版完全ナビ', item: `${BASE}/products/kdp-guide` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kindle出版完全ナビ',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'KDP（Kindle Direct Publishing）での電子書籍出版をAIが完全サポート。ネタ出しから出版まで一気通貫。',
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
