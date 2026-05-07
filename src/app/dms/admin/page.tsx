'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const DmsAdminEngine = dynamic(() => import('@/components/dms/DmsAdminEngine'), { ssr: false });

export default function DmsAdminPage() {
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('dms_session')
    if (!session || !session.includes('f.yoneyone9@gmail.com')) {
      router.push('/dms/login')
    } else {
      setIsAuth(true)
    }
  }, [router])

  if (!isAuth) return <div className="min-h-screen bg-[#f1f5f9]" />

  return <DmsAdminEngine />
}