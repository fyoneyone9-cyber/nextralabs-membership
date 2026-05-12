'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import NewsletterBanner from '@/components/newsletter/NewsletterBanner'

const shouldShowBanner = (pathname: string) => {
  if (pathname === '/products') return false
  if (pathname.startsWith('/products/newsletter')) return false
  if (pathname.endsWith('/app')) return false
  return true
}

export default function ProductsLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      {children}
      {shouldShowBanner(pathname) && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-16">
          <NewsletterBanner variant="compact" />
        </div>
      )}
    </>
  )
}
