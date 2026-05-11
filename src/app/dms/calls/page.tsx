'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const CallsEngine = dynamic(() => import('@/components/dms/CallsEngine'), { ssr: false })

export default function CallsPage() {
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
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  )

  return <div className="no-global-layout"><CallsEngine /></div>
}
