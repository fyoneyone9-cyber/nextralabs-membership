'use client'
import { AccessGate } from '@/components/tools/AccessGate'
import dynamic from 'next/dynamic'

const BuySmartNavSystem = dynamic(() => import('@/components/tools/BuySmartNavSystem'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function Page() {
  return (
    <AccessGate productId="buy-smart-nav">
      <BuySmartNavSystem />
    </AccessGate>
  )
}

