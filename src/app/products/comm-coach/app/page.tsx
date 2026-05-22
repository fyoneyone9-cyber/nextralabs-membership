import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import CommCoach from '@/components/tools/CommCoach'

export default function CommCoachAppPage() {
  return (
    <AccessGate productId="comm-coach">
      <CommCoach />
    </AccessGate>
  )
}
