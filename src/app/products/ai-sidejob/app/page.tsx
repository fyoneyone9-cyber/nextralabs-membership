'use client'

import { AccessGate } from '@/components/tools/AccessGate'
import { AiSidejob } from '@/components/tools/AiSidejob'

export default function AiSidejobAppPage() {
  return (
    <AccessGate productId="ai-sidejob">
      <AiSidejob />
    </AccessGate>
  )
}
