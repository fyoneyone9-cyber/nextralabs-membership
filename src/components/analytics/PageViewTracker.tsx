'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * 全ページのPVを /api/analytics/pageview に非同期POSTで記録する。
 * layout.tsx に1回だけ置けばOK。パスが変わるたびに自動送信。
 */
export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTracked = useRef<string>('')

  useEffect(() => {
    const path = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
    if (path === lastTracked.current) return
    lastTracked.current = path

    // fire-and-forget（エラーはサイレント）
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => {})
  }, [pathname, searchParams])

  return null
}
