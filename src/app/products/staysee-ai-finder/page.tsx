'use client'
import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const StayseeFinderLP = dynamic(() => import('@/components/tools/StayseeFinderLP'), { ssr: false })

export default function Page() {
  return (
    <AccessGate productId="staysee-ai-finder">
      <div className="min-h-screen bg-[#050507]">
        <StayseeFinderLP />
      </div>
    </AccessGate>
  )
}
