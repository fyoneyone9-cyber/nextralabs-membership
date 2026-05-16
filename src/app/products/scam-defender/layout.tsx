import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AI詐欺対策 | NextraLabs【フィッシング・詐欺検出AIツール】',
  description: 'AIがフィッシング詐欺・悪質サイト・不審メールをリアルタイム検出。詐欺被害ゼロを目指す安全対策ツール。月額980円のライトプランから利用可能。',
  keywords: ['AI 詐欺対策', 'フィッシング 検出', '詐欺 防止 ツール', '不審メール 判定', 'サイバー詐欺 対策', 'AI セキュリティ'],
  openGraph: {
    title: 'AI詐欺対策 | NextraLabs',
    description: 'AIがフィッシング・詐欺をリアルタイム検出。被害ゼロへ。',
    url: `${BASE}/products/scam-defender`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI詐欺対策 | NextraLabs', description: 'AIがフィッシング・詐欺をリアルタイム検出' },
  alternates: { canonical: `${BASE}/products/scam-defender` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AI詐欺対策', item: `${BASE}/products/scam-defender` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI詐欺対策',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIがフィッシング詐欺・悪質サイト・不審メールをリアルタイム検出する詐欺対策ツール。',
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
