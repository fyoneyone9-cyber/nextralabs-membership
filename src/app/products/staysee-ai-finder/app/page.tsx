'use client'
import dynamic from 'next/dynamic'

const StayseeFinderEngine = dynamic(
  () => import('@/components/tools/StayseeFinderEngine'),
  { ssr: false }
)

export default function StayseeAiFinderPage() {
  return <StayseeFinderEngine />
}
