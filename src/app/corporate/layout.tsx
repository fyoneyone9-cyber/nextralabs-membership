import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '会社概要・運営者情報 | NextraLabs【AIツール使い放題メンバーシップ】',
  description: 'NextraLabs（ネクストララボ）の会社概要。運営：米山文貴（Ninja3）。AIツール使い放題プラットフォームの事業内容・理念・連絡先情報を掲載。',
  keywords: ['NextraLabs 会社概要', 'ネクストララボ 運営者', 'Ninja3', '米山文貴', 'NextraLabs 運営会社'],
  openGraph: {
    title: '会社概要 | NextraLabs',
    description: 'NextraLabsの会社概要・運営者情報。AIツール使い放題の運営元。',
    url: 'https://nextralab.jp/corporate',
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: { card: 'summary', title: '会社概要 | NextraLabs', description: 'NextraLabsの運営者情報' },
  alternates: { canonical: 'https://nextralab.jp/corporate' },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://nextralab.jp' },
    { '@type': 'ListItem', position: 2, name: '会社概要', item: 'https://nextralab.jp/corporate' },
  ],
}

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  )
}
