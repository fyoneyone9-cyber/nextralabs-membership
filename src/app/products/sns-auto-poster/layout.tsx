import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AI SNS自動ポスター | NextraLabs【X・Instagram・Threads自動投稿ツール】',
  description: 'X（Twitter）・Instagram・ThreadsにAIが自動投稿するSNSマーケティングツール。投稿内容・最適時間・ハッシュタグをAIが自動生成。月額980円のライトプランから利用可能。',
  keywords: ['SNS 自動投稿', 'X Twitter 自動投稿 AI', 'Instagram 自動投稿', 'SNS マーケティング ツール', 'AI SNS', 'ソーシャルメディア 自動化'],
  openGraph: {
    title: 'AI SNS自動ポスター | NextraLabs',
    description: 'X・Instagram・ThreadsをAIが自動投稿。月額980円から。',
    url: `${BASE}/products/sns-auto-poster`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI SNS自動ポスター | NextraLabs', description: 'X・Instagram・ThreadsをAIが自動投稿' },
  alternates: { canonical: `${BASE}/products/sns-auto-poster` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AIツール', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AI SNS自動ポスター', item: `${BASE}/products/sns-auto-poster` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI SNS自動ポスター',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY', description: 'ライトプラン月額' },
  description: 'X・Instagram・ThreadsをAIが自動投稿。最適な投稿時間・ハッシュタグ・内容をAIが生成。',
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
