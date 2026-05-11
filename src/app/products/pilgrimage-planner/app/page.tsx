'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const PilgrimagePlanner = dynamic(
  () => import('@/components/tools/PilgrimagePlanner'),
  { ssr: false }
)

export default function PilgrimagePlannerPage() {
  const router = useRouter()

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <AccessGate productId="pilgrimage-planner">
      <PilgrimagePlanner />
    </AccessGate>
  )
}

