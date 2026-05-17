import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AIバズライター | NextraLabs【バイラルコンテンツ・ブログ記事生成ツール】',
  description: 'AIがバズるブログ記事・SNS投稿・バイラルコンテンツを自動生成。SEO最適化・読者を引きつけるコピーをAIが作成。月額980円から。',
  keywords: ['AI ライター', 'ブログ記事 自動生成', 'バイラル コンテンツ', 'SEO 記事 AI', 'コンテンツ マーケティング AI', 'AI バズ'],
  openGraph: {
    title: 'AIバズライター | NextraLabs',
    description: 'AIがバズるブログ記事・SNS投稿を自動生成。SEO最適化。',
    url: `${BASE}/products/buzz-writer`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AIバズライター | NextraLabs', description: 'AIがバズるブログ記事・SNS投稿を自動生成' },
  alternates: { canonical: `${BASE}/products/buzz-writer` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AIバズライター', item: `${BASE}/products/buzz-writer` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AIバズライター',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIがバズるブログ記事・SNS投稿・バイラルコンテンツを自動生成。SEO最適化対応。',
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
