'use client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '物件一覧|NextraLabs DMS',
  robots: { index: false, follow: false },
}


import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DmsPropertiesPage() {
  const router = useRouter()
  useEffect(() => {
    // DMSメインにリダイレクトし、プロパティタブを開く
    // またはDmsEngineのコンポーネントを直接呼ぶ
    router.replace('/dms?tab=property')
  }, [router])
  return <div className="min-h-screen bg-white" />
}
