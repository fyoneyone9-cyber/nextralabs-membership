'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const DmsEngine = dynamic(() => import('@/components/dms/DmsEngine'), { ssr: false });

export default function DmsPage() {
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('dms_session')
    if (!session) {
      router.push('/dms/login')
    } else {
      setIsAuth(true)
    }
  }, [router])

  if (!isAuth) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Authenticating...</p>
      </div>
    </div>
  )

  return (
    <div className="no-global-layout">
      <DmsEngine />
    </div>
  )
}