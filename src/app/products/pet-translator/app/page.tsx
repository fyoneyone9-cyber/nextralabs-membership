import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import PetTranslator from '@/components/tools/PetTranslator'

export default function Page() {
  return (
    <AccessGate productId="pet-translator">
      <PetTranslator />
    </AccessGate>
  )
}

