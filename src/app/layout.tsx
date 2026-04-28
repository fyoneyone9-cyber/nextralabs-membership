import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextraLabs AI Tool Store - AIツールで業務を自動化',
  description: 'AIを活用した業務効率化・自動化ツールを月額¥980で使い放題。古着ハンター、AIペット翻訳、社内政治相関図など。',
  metadataBase: new URL('https://membership-site-nextralabos.vercel.app'),
  openGraph: {
    title: 'NextraLabs — AIツールで業務を自動化',
    description: '古着ハンター・AIペット翻訳・社内政治相関図。3つのAIツールを月額¥980で使い放題。',
    url: 'https://membership-site-nextralabos.vercel.app',
    siteName: 'NextraLabs AI Tool Store',
    images: [
      {
        url: '/og-image.png',
        width: 1462,
        height: 768,
        alt: 'NextraLabs AI Tool Store',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextraLabs — AIツールで業務を自動化',
    description: '古着ハンター・AIペット翻訳・社内政治相関図。月額¥980で使い放題。',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
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
