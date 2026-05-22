import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import BuzzWriter from '@/components/tools/BuzzWriter'

export default function BuzzWriterAppPage() {
  return (
    <AccessGate productId="buzz-writer">
      <BuzzWriter />
    </AccessGate>
  )
}
