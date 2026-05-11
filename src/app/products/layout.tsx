'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import NewsletterBanner from '@/components/newsletter/NewsletterBanner'

// /products 配下の全ページに適用されるレイアウト
// ツールページのフッターにメルマガ登録バナーを自動挿入
// 除外: /products（一覧）, /products/newsletter（登録ページ自身）
const EXCLUDE_PATHS = ['/products', '/products/newsletter', '/products/newsletter/admin']

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showBanner = !EXCLUDE_PATHS.includes(pathname)

  return (
    <>
      {children}
      {showBanner && (
        <div className="pb-16">
          <NewsletterBanner variant="full" />
        </div>
      )}
    </>
  )
}
