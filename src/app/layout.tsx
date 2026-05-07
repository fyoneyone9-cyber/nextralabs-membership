import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  verification: {
    google: 'google9fc5715d83add922',
  },
  title: { default: 'NextraLabs | AIツール使いたい放題メンバーシップ', template: '%s | NextraLabs' },
  description: 'NextraLabsは月額¥980から使えるAIツールのメンバーシップです。',
  manifest: '/manifest.json',
  metadataBase: new URL('https://membership-site-nextralabos.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" style={{ backgroundColor: '#050507' }} suppressHydrationWarning>
      <body className={inter.className + " min-h-screen bg-[#050507] text-slate-200 antialiased"}>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-[#050507]">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
