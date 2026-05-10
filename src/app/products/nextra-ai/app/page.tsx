'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const StayseeFinderEngine = dynamic(
  () => import('@/components/tools/StayseeFinderEngine'),
  { ssr: false }
)

/* ══════════ KIOSKモードラッパー ══════════
 * - ヘッダー・フッター非表示（layout-wrappers.tsxで制御）
 * - 全画面固定レイアウト
 * - ページ離脱防止（beforeunload + popstate）
 * - スクリーンスリープ防止（Wake Lock API）
 * - ブラウザバック無視
 * - 操作なし120秒でスタートタブに自動リセット（子コンポーネントにeventで通知）
 ════════════════════════════════════════ */
export default function NextraAiKioskPage() {
  const [exitAttempt, setExitAttempt] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  /* ── スクリーンスリープ防止（Wake Lock API） ── */
  useEffect(() => {
    const acquireWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen')
        }
      } catch { /* 非対応ブラウザは無視 */ }
    }
    acquireWakeLock()

    // 可視状態に戻ったとき再取得
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') acquireWakeLock()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      wakeLockRef.current?.release()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  /* ── ページ離脱防止（リロード・タブ閉じ） ── */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'KIOSKモードを終了しますか？'
      return e.returnValue
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  /* ── ブラウザバック無効（popstate） ── */
  useEffect(() => {
    // 現在のhistoryに1つ積んでおくことで戻れなくする
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
      setExitAttempt(true)
      setTimeout(() => setExitAttempt(false), 3000)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  /* ── キーボードショートカット無効化（F5リロード・Alt+F4等） ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5リロード / Ctrl+R / Ctrl+W / Alt+F4
      if (
        e.key === 'F5' ||
        (e.ctrlKey && (e.key === 'r' || e.key === 'R')) ||
        (e.ctrlKey && (e.key === 'w' || e.key === 'W')) ||
        (e.altKey && e.key === 'F4')
      ) {
        e.preventDefault()
        setExitAttempt(true)
        setTimeout(() => setExitAttempt(false), 3000)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  /* ── コンテキストメニュー無効化 ── */
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', prevent)
    return () => document.removeEventListener('contextmenu', prevent)
  }, [])

  return (
    <div className="relative" style={{ minHeight: '100dvh', background: '#050507' }}>

      {/* ブラウザバック試行時の警告オーバーレイ */}
      {exitAttempt && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
        >
          <div
            className="rounded-2xl p-8 max-w-sm w-full text-center space-y-4"
            style={{ background: '#0d1117', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              🔒
            </div>
            <h3 className="text-base font-semibold text-slate-100">KIOSKモード稼働中</h3>
            <p className="text-sm text-slate-400">
              このページはKIOSKモードで動作しています。<br />
              ページを離れるにはスタッフにお問い合わせください。
            </p>
            <button
              onClick={() => setExitAttempt(false)}
              className="w-full h-11 rounded-xl text-sm font-semibold"
              style={{ background: '#10b981', color: '#fff' }}
            >
              画面に戻る
            </button>
          </div>
        </div>
      )}

      {/* KIOSKアプリ本体 */}
      <StayseeFinderEngine />
    </div>
  )
}
