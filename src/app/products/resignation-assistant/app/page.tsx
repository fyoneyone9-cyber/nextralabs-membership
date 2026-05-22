import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿import { AccessGate } from '@/components/tools/AccessGate'
import ResignationAssistant from '@/components/tools/ResignationAssistant'

export default function ResignationAssistantAppPage() {
  return (
    <AccessGate productId="resignation-assistant">
      <ResignationAssistant />
    </AccessGate>
  )
}
