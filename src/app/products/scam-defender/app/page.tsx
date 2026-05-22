import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import ScamDefender from '@/components/tools/ScamDefender'

export default function Page() {
  return (
    <AccessGate productId="scam-defender">
      <ScamDefender />
    </AccessGate>
  )
}
