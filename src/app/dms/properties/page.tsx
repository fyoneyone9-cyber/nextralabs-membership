'use client'
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
