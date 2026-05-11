'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Video } from 'lucide-react'

const CallsEngine = dynamic(() => import('@/components/dms/CallsEngine'), { ssr: false })

export default function CallsPage() {
  const [isAuth, setIsAuth] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('dms_session')
    if (!session) {
      router.push('/dms/login')
    } else {
      setIsAuth(true)
    }
    setChecking(false)
  }, [router])

  if (checking) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: '#050507' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
        <Video size={24} style={{ color: '#10b981' }} />
      </div>
      <p className="text-sm text-slate-500">通話管理を読み込んでいます...</p>
      <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  )

  if (!isAuth) return null

  return <div className="no-global-layout"><CallsEngine /></div>
}
