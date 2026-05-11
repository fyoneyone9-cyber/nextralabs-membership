'use client'
import { AccessGate } from '@/components/tools/AccessGate'
import dynamic from 'next/dynamic'

const InboxOrganizer = dynamic(() => import('@/components/tools/InboxOrganizer'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function Page() {
  return (
    <AccessGate productId="inbox-organizer">
      <InboxOrganizer />
    </AccessGate>
  )
}

