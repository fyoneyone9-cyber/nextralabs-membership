'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// DmsEngine を lock-list タブで開く
const DmsEngine = dynamic(() => import('@/components/dms/DmsEngine'), { ssr: false })

export default function LockListPage() {
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('dms_session')
    if (!session) {
      router.push('/dms/login')
    } else {
      // URLにタブパラメータを仕込んでDmsEngineに lock-list タブを開かせる
      if (!window.location.search.includes('tab=')) {
        router.replace('/dms/lock-list?tab=lock-list')
      }
      setIsAuth(true)
    }
  }, [router])

  if (!isAuth) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-semibold text-xs tracking-widest">Authenticating...</p>
      </div>
    </div>
  )

  return (
    <div className="no-global-layout">
      <DmsEngine />
    </div>
  )
}
