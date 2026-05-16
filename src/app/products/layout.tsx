import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIツール一覧・全製品ラインナップ | NextraLabs【30種類以上が使い放題】',
  description: 'NextraLabsが提供するAIツール全ラインナップ。SNS自動化・Kindle出版・婚活AI・資格対策・家計防衛・詐欺対策など30種類以上のAIツールが月額980円から。Gemini 2.5 Flash搭載。',
  keywords: ['NextraLabs ツール一覧', 'AIツール 種類', 'AI 副業 ツール', 'AI 婚活 ツール', 'AI 資格対策', 'AI 家計防衛', 'AIサービス 月額 使い放題'],
  openGraph: {
    title: 'AIツール全ラインナップ | NextraLabs',
    description: '30種類以上のAIツールが月額980円から。SNS自動化・Kindle出版・婚活AIなど。',
    url: 'https://nextralab.jp/products',
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AIツール一覧 | NextraLabs', description: '30種類以上のAIツールが月額980円から使い放題' },
  alternates: { canonical: 'https://nextralab.jp/products' },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'NextraLabs AIツール一覧',
  description: '30種類以上のAIツールが月額980円から',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'AI SNS自動ポスター', url: 'https://nextralab.jp/products/sns-auto-poster' },
    { '@type': 'ListItem', position: 2, name: 'Kindle出版完全ナビ', url: 'https://nextralab.jp/products/kdp-guide' },
    { '@type': 'ListItem', position: 3, name: 'AI詐欺対策', url: 'https://nextralab.jp/products/scam-defender' },
    { '@type': 'ListItem', position: 4, name: 'AI家計防衛', url: 'https://nextralab.jp/products/money-guard' },
    { '@type': 'ListItem', position: 5, name: 'AI婚活スケジューラー', url: 'https://nextralab.jp/products/konkatsu-scheduler' },
  ],
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://nextralab.jp' },
    { '@type': 'ListItem', position: 2, name: 'AIツール一覧', item: 'https://nextralab.jp/products' },
  ],
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  )
}
