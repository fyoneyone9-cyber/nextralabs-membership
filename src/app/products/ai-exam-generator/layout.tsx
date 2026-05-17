import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AI模擬試験ジェネレーター | NextraLabs【資格対策・問題生成AIツール】',
  description: 'AIが資格試験の模擬問題を自動生成。CompTIA・宅建・FP・漢検など各種資格に対応。弱点分析・反復学習で合格率アップ。月額980円から。',
  keywords: ['AI 模擬試験', '資格対策 AI', '問題生成 AI', '試験勉強 ツール', 'CompTIA AI', '資格 合格 AI'],
  openGraph: {
    title: 'AI模擬試験ジェネレーター | NextraLabs',
    description: 'AIが各種資格の模擬問題を自動生成。弱点分析で合格率アップ。',
    url: `${BASE}/products/ai-exam-generator`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI模擬試験ジェネレーター | NextraLabs', description: 'AIが各種資格の模擬問題を自動生成' },
  alternates: { canonical: `${BASE}/products/ai-exam-generator` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AI模擬試験ジェネレーター', item: `${BASE}/products/ai-exam-generator` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI模擬試験ジェネレーター',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'AIが資格試験の模擬問題を自動生成し、弱点分析・反復学習で合格率を高めるツール。',
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
