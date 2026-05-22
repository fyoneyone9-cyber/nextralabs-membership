import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import MovingChecker from '@/components/tools/MovingChecker'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="moving-checker">
      <MovingChecker />
    </AccessGate>
  )
}
