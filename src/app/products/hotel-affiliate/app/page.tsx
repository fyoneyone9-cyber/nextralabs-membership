'use client'

import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const HotelAffiliateSystem = dynamic(() => import('@/components/tools/HotelAffiliateSystem').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-pink-500 animate-pulse uppercase tracking-[0.5em]">Initializing Affiliate Master...</div>
})

export default function Page() {
  return (
    <AccessGate productId="hotel-affiliate">
      <HotelAffiliateSystem />
    </AccessGate>
  )
}
