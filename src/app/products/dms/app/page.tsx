'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DmsRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dms/login')
  }, [router])

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Redirecting to DMS...</p>
      </div>
    </div>
  )
}
