'use client'

import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const CompPriceMonitorSystem = dynamic(() => import('@/components/tools/CompPriceMonitorSystem').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-blue-500 animate-pulse uppercase tracking-[0.5em]">Initializing Revenue Node...</div>
})

export default function Page() {
  return (
    <AccessGate productId="comp-price-monitor">
      <CompPriceMonitorSystem />
    </AccessGate>
  )
}
