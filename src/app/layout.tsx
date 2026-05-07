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
    google: 'google9fc5715d83add922',
  },
  title: { default: 'NextraLabs | AI繝・・繝ｫ菴ｿ縺・叛鬘後Γ繝ｳ繝舌・繧ｷ繝・・', template: '%s | NextraLabs' },
  description: 'NextraLabs縺ｯ譛磯｡債･980縺九ｉ菴ｿ縺医ｋAI繝・・繝ｫ縺ｮ繝｡繝ｳ繝舌・繧ｷ繝・・縺ｧ縺吶・,
  manifest: '/manifest.json',
  metadataBase: new URL('https://membership-site-nextralabos.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" style="background-color: #050507;" suppressHydrationWarning>
      <body className={notoPlain.className}>
        <Providers>
          <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* 裾 蠕ｩ豢ｻ・壼・繝壹・繧ｸ繝ｻ蜈ｨ繧ｷ繧ｹ繝・Β蜈ｱ騾壹・繧ｹ繝・Ν繧ｹ繝ｻ繝・ヰ繝・ぎ繝ｼ 誓 */}
            <DebugPanel data={null} toolId="global_system" />
            <InstallPWA />
          </div>
        </Providers>
      </body>
    </html>
  )
}
