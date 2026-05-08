'use client'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export function HeaderWrapper() {
  const pathname = usePathname()
  const isDms = pathname?.startsWith('/dms')
  const isStayseeApp = pathname?.startsWith('/products/staysee-ai-finder/app')
  
  if (isDms || isStayseeApp) return null
  return <Header />
}

export function FooterWrapper() {
  const pathname = usePathname()
  const isDms = pathname?.startsWith('/dms')
  const isStayseeApp = pathname?.startsWith('/products/staysee-ai-finder/app')
  
  if (isDms || isStayseeApp) return null
  return <Footer />
}
