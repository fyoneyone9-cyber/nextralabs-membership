import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { DebugPanel } from '@/components/tools/DebugPanel'
import { HeaderWrapper, FooterWrapper } from '@/components/layout-wrappers'
import ExternalLinkGuard from '@/components/ExternalLinkGuard'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
import { Suspense } from 'react'

// Genspark Claw と同じフォントスタック: Inter (英字) + Noto Sans JP (日本語)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

const BASE_URL = 'https://nextralab.jp'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  verification: {
    google: 'google9fc5715d83add922',
  },
  title: {
    default: 'NextraLabs | 日本最大級AIツール使い放題メンバーシップ【月額980円〜】',
    template: '%s | NextraLabs',
  },
  description:
    'NextraLabs（ネクストララボ）は、Gemini 2.5 Flash搭載の最新AIツール30種類以上が使い放題の日本最大級AIメンバーシップ。家計防衛・詐欺対策・Kindle出版・副業支援まで、月額980円から始められます。今すぐ無料登録。',
  keywords: [
    'NextraLabs',
    'ネクストララボ',
    'AIツール使い放題',
    'AIメンバーシップ',
    'AI副業',
    'AI資格対策',
    'Gemini 2.5 Flash',
    'MASTERMODEL',
    'Ninja3',
    '日本最大級AIツール',
    'AIサービス月額',
    'AI家計防衛',
    'AI詐欺対策',
    'Kindle出版AI',
    'NextraLabs登録',
  ],
  authors: [{ name: 'NextraLabs', url: BASE_URL }],
  creator: 'NextraLabs (Ninja3)',
  publisher: 'NextraLabs',
  category: 'AIツール・サブスクリプション',
  manifest: '/manifest.json',
  alternates: {
    canonical: BASE_URL,
    languages: { 'ja-JP': BASE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: BASE_URL,
    title: 'NextraLabs | 日本最大級AIツール使い放題メンバーシップ【月額980円〜】',
    description:
      '30種類以上のAIツールが月額980円で使い放題。Gemini 2.5 Flash搭載のMASTERMODEL品質。無料プランあり。今すぐ登録。',
    siteName: 'NextraLabs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NextraLabs - 日本最大級AIツール使い放題メンバーシップ',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@NextraLabs',
    creator: '@NextraLabs',
    title: 'NextraLabs | 日本最大級AIツール使い放題メンバーシップ',
    description: 'Gemini 2.5 Flash搭載の最新AIツール30種類以上が月額980円で使い放題。無料プランあり。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// 構造化データ: Organization + WebSite + SoftwareApplication
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NextraLabs',
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  description: '日本最大級のAIツール使い放題メンバーシップ。Gemini 2.5 Flash搭載、30種類以上のAIツールが月額980円から。',
  sameAs: [
    'https://twitter.com/NextraLabs',
    'https://www.youtube.com/@marriage_road',
    'https://nextralab.jp',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: '日本語',
  },
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NextraLabs',
  url: BASE_URL,
  description: '日本最大級のAIツール使い放題メンバーシップ',
  inLanguage: 'ja-JP',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const jsonLdSoftwareApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'NextraLabs AIツールプラットフォーム',
  operatingSystem: 'Web',
  applicationCategory: 'ProductivityApplication',
  offers: [
    {
      '@type': 'Offer',
      name: '無料プラン',
      price: '0',
      priceCurrency: 'JPY',
    },
    {
      '@type': 'Offer',
      name: 'ライトプラン',
      price: '980',
      priceCurrency: 'JPY',
      billingIncrement: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'スタンダードプラン',
      price: '1980',
      priceCurrency: 'JPY',
      billingIncrement: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'プレミアムプラン',
      price: '2980',
      priceCurrency: 'JPY',
      billingIncrement: 'P1M',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1200',
    bestRating: '5',
    worstRating: '1',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="dark" style={{ backgroundColor: '#050507', colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        {/* 構造化データ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        {/* パフォーマンス最適化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
        {/* canonical はページ個別に設定 */}
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans min-h-screen bg-[#050507] text-slate-200 dark antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-[#050507]">
            <Suspense fallback={null}><PageViewTracker /></Suspense>
            <HeaderWrapper />
            <div className="flex-1">{children}</div>
            <FooterWrapper />
            <DebugPanel data={{}} />
            <ExternalLinkGuard />
          </div>
        </Providers>
      </body>
    </html>
  )
}
