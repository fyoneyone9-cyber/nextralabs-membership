import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { DebugPanel } from '@/components/tools/DebugPanel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  verification: {
    google: 'google9fc5715d83add922',
  },
  title: { 
    default: 'NextraLabs | 日本最大級のAIツール使い放題メンバーシップ - MASTERMODEL', 
    template: '%s | NextraLabs - 日本一のAIツールプラットフォーム' 
  },
  description: '【2026年決定版】NextraLabs（ネクストララボ）は、Gemini 2.5 Flash搭載の最新AIツール22種類が使い放題。家計防衛、断捨離、婚活、IT資格対策まで、あなたの人生をAIが劇的に効率化します。月額980円から。',
  keywords: ['NextraLabs', 'ネクストララボ', 'AIツール使い放題', 'AI副業', 'AI資格対策', 'Gemini 2.5 Flash', 'MASTERMODEL', 'Ninja3'],
  manifest: '/manifest.json',
  metadataBase: new URL('https://membership-site-nextralabos.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://membership-site-nextralabos.vercel.app',
    title: 'NextraLabs | 日本一のAIツール使い放題メンバーシップ',
    description: '人生を豊かにする22種類のAIツールがここに集結。MASTERMODEL品質のAI体験を。',
    siteName: 'NextraLabs',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextraLabs | 日本一のAIツール使い放題メンバーシップ',
    description: 'Gemini 2.5 Flash搭載の最新AIツールが月額980円で使い放題。',
    images: ['/og-image.jpg'],
    creator: '@NextraLabs',
  },
}

import { HeaderWrapper, FooterWrapper } from '@/components/layout-wrappers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="dark" style={{ backgroundColor: '#050507', colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={inter.className + " min-h-screen bg-[#050507] text-slate-200 dark antialiased"}>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-[#050507]">
            <HeaderWrapper />
            <div className="flex-1">{children}</div>
            <FooterWrapper />
            <DebugPanel data={{}} />
          </div>
        </Providers>
      </body>
    </html>
  )
}

