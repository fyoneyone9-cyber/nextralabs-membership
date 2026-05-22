import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import { LoanAdvisor } from '@/components/tools/LoanAdvisor'

export default function Page() {
  return (
    <AccessGate productId="loan-advisor">
      <LoanAdvisor />
    </AccessGate>
  )
}
