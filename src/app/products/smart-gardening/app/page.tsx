import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import SmartGardening from '@/components/tools/SmartGardening'

export default function Page() {
  return (
    <AccessGate productId="smart-gardening">
      <SmartGardening />
    </AccessGate>
  )
}
