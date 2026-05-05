import StayseeFinderEngine from '@/components/tools/StayseeFinderEngine'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="staysee-ai-finder">
      <StayseeFinderEngine />
    </AccessGate>
  )
}