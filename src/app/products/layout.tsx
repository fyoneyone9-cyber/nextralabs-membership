import React from 'react'

// /products 配下はバナーなし（一覧・TOPページのみで表示）
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
