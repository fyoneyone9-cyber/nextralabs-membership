import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google' // 🚀 プロ推奨フォント
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// 🎨 Noto Sans JP をサイト全体に適用
const notoPlain = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  verification: {
    google: 'P-zm2rdcV0kWAXrKxANacp5a5hbx8tkjlPeclNkiLlg',
  },
  title: { default: 'NextraLabs | AIツール使い放題メンバーシップ — 月額¥980〜', template: '%s | NextraLabs' },
  description: 'NextraLabsは月額¥980から使えるAIツールのメンバーシップです。20以上のAIツールが使い放題。',
  manifest: '/manifest.json',
  metadataBase: new URL('https://membership-site-nextralabos.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoPlain.className}>
        <Providers>
          <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
