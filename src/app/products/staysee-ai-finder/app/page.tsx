import StayseeFinderEngine from '@/components/products/StayseeFinderEngine'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="staysee-ai-finder">
      <StayseeFinderEngine />
    </AccessGate>
  )
}
