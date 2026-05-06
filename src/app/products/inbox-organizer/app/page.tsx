'use client'

import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const InboxOrganizer = dynamic(() => import('@/components/tools/InboxOrganizer').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-blue-500 animate-pulse uppercase tracking-[0.5em]">Initializing Inbox Master...</div>
})

export default function Page() {
  return (
    <AccessGate productId="inbox-organizer">
      <InboxOrganizer />
    </AccessGate>
  )
}
