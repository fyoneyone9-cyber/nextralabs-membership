'use client'
import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const TravelConcierge = dynamic(
  () => import('@/components/tools/TravelConcierge'),
  { ssr: false }
)

export default function TravelConciergePage() {
  return (
    <AccessGate productId="travel-concierge">
      <TravelConcierge />
    </AccessGate>
  )
}
