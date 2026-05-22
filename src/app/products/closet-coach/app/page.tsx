import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import ClosetCoach from '@/components/tools/ClosetCoach'

export default function ClosetCoachAppPage() {
  return (
    <AccessGate productId="closet-coach">
      <ClosetCoach />
    </AccessGate>
  )
}
