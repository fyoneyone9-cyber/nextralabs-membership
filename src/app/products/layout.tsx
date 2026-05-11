'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import NewsletterBanner from '@/components/newsletter/NewsletterBanner'

// バナーを表示しないパス:
// - /products（一覧）→ 独自のcompactバナーあり
// - /products/newsletter（登録ページ自身・管理画面）
// - /app で終わるパス（ツール本体）
// LPページ（/products/[tool]）→ 表示する
const shouldShowBanner = (pathname: string) => {
  if (pathname === '/products') return false
  if (pathname.startsWith('/products/newsletter')) return false
  if (pathname.endsWith('/app')) return false
  return true
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
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
