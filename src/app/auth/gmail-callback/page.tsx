'use client'
import { useEffect } from 'react'

// Gmail OAuth コールバックページ
// アクセストークンをlocalStorageに保存してリダイレクト元に戻る
export default function GmailCallbackPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    const state = hash.get('state') // Base64エンコードされたreturn URL

    if (token) {
      localStorage.setItem('nextra_google_token', token)
    }

    // stateにreturn URLが含まれている場合はそこに戻る
    let returnUrl = '/dashboard'
    if (state) {
      try {
        const decoded = decodeURIComponent(atob(state))
        if (decoded.startsWith('/')) returnUrl = decoded
      } catch {
        // ignore
      }
    }

    window.location.replace(returnUrl)
  }, [])

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Gmail認証中... ダッシュボードに戻ります</p>
      </div>
    </div>
  )
}
