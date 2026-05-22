import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import AiRecipeScope from '@/components/tools/AiRecipeScope'

export default function Page() {
  return (
    <AccessGate productId="ai-recipe">
      <AiRecipeScope />
    </AccessGate>
  )
}
