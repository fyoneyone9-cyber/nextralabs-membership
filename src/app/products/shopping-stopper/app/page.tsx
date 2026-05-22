import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import ShoppingStopper from '@/components/tools/ShoppingStopper'

export default function Page() {
  return (
    <AccessGate productId="shopping-stopper">
      <ShoppingStopper />
    </AccessGate>
  )
}
