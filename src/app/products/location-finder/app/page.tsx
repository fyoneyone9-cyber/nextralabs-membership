import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import LocationFinder from '@/components/tools/LocationFinder'

export default function Page() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}
