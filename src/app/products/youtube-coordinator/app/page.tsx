import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIアプリ|NextraLabs',
  robots: { index: false, follow: false },
}

﻿'use client'
import { AccessGate } from '@/components/tools/AccessGate'
import dynamic from 'next/dynamic'

const YoutubeCoordinatorSystem = dynamic(() => import('@/components/tools/YoutubeCoordinatorSystem'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function YoutubeCoordinatorAppPage() {
  return (
    <AccessGate productId="youtube-coordinator">
      <YoutubeCoordinatorSystem />
    </AccessGate>
  )
}

