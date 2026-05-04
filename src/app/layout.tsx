import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: { default: 'NextraLabs | AIツール使い放題メンバーシップ — 月額¥980〜', template: '%s | NextraLabs' },
  description: 'NextraLabsは月額¥980から使えるAIツールのメンバーシップです。資格試験スケジューラー・AIペット翻訳・古着ハンターなど20以上のAIツールが使い放題。業務効率化・副業・エンタメまで。',
  manifest: '/manifest.json',
  keywords: ['AIツール', 'メンバーシップ', '月額980円', '業務効率化', '副業AI', '資格試験', 'スケジューラー', 'ペット翻訳', 'AI自動化', 'NextraLabs'],
  metadataBase: new URL('https://membership-site-nextralabos.vercel.app'),
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NextraLabs',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    title: 'NextraLabs | AIツール使い放題メンバーシップ',
    description: '月額¥980〜。資格試験スケジューラー・AIペット翻訳・古着ハンターなど20以上のAIツールが使い放題。',
    url: 'https://membership-site-nextralabos.vercel.app',
    siteName: 'NextraLabs',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NextraLabs AIツールメンバーシップ' }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'NextraLabs | AIツール使い放題', description: '月額¥980〜。20以上のAIツールが使い放題。', images: ['/og-image.png'] },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "NextraLabs",
          "url": "https://membership-site-nextralabos.vercel.app",
          "description": "AIツール使い放題メンバーシップ 月額¥980〜",
          "potentialAction": { "@type": "SearchAction", "target": "https://membership-site-nextralabos.vercel.app/products?q={search_term_string}", "query-input": "required name=search_term_string" }
        }) }} />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
