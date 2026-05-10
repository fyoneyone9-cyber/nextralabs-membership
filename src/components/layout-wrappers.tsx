'use client'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// ヘッダー・フッターを非表示にするパス
const NO_CHROME_PATHS = [
  '/dms',
  '/products/staysee-ai-finder/app',
  '/products/nextra-ai/app',  // KIOSKモード
]

function isNoChrome(pathname: string | null) {
  if (!pathname) return false
  return NO_CHROME_PATHS.some(p => pathname.startsWith(p))
}

export function HeaderWrapper() {
  const pathname = usePathname()
  if (isNoChrome(pathname)) return null
  return <Header />
}

export function FooterWrapper() {
  const pathname = usePathname()
  if (isNoChrome(pathname)) return null
  return <Footer />
}
