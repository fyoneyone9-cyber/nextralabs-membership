import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'NextraAI | NextraLabs【ホテル予約AI・宿泊施設DXツール】',
  description: 'NextraAIはホテル・旅館の予約管理・顧客対応・DX化をAIで自動化。宿泊施設の業務効率化と収益最大化を実現。月額980円から。',
  keywords: ['ホテル予約 AI', '宿泊施設 DX', 'ホテル 業務効率化', '旅館 AI', 'NextraAI', '宿泊 自動化 AI'],
  openGraph: {
    title: 'NextraAI | NextraLabs',
    description: 'ホテル・旅館の予約管理・顧客対応をAIで自動化。宿泊DX実現。',
    url: `${BASE}/products/nextra-ai`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'NextraAI | NextraLabs', description: 'ホテル・旅館の予約管理をAIで自動化' },
  alternates: { canonical: `${BASE}/products/nextra-ai` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'NextraAI', item: `${BASE}/products/nextra-ai` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'NextraAI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'ホテル・旅館の予約管理・顧客対応・DX化をAIで自動化し、宿泊施設の業務効率化を実現するツール。',
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
