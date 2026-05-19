'use client'
import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const NostalgicRecomApp = dynamic(() => import('@/components/tools/NostalgicRecomApp'), { ssr: false })

export default function Page() {
  return (
    <AccessGate productId="nostalgic-recom">
      <NostalgicRecomApp />
    </AccessGate>
  )
}
