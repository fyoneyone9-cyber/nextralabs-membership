'use client'
import dynamic from 'next/dynamic'

// SSR無効でCallsEngineを直接レンダリング
// 認証チェックはCallsEngine内部で行う（localStorage）
const CallsEngine = dynamic(() => import('@/components/dms/CallsEngine'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050507' }}>
      <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  ),
})

export default function CallsPage() {
  return <div className="no-global-layout"><CallsEngine /></div>
}
