import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DebugPanel } from '@/components/tools/DebugPanel'
import { InstallPWA } from '@/components/tools/InstallPWA'

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
  title: { default: 'NextraLabs | AIツール使い放題メンバーシップ', template: '%s | NextraLabs' },
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
    <html lang="ja" suppressHydrationWarning>
      <body className={notoPlain.className}>
        <Providers>
          <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* 🐞 復活：全ページ・全システム共通のステルス・デバッガー 🐾 */}
            <DebugPanel data={null} toolId="global_system" />
            <InstallPWA />
          </div>
        </Providers>
      </body>
    </html>
  )
}
