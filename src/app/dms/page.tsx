'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import HotelPage from '@/components/tools/StayseeFinderEngine'

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

  if (!isAuth) return <div className="min-h-screen bg-[#050507]" />

  return (
    <div className="min-h-screen bg-[#050507]">
      <HotelPage />
    </div>
  )
}