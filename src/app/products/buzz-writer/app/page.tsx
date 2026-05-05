import BuzzWriter from '@/components/tools/BuzzWriter'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="buzz-writer">
      <BuzzWriter />
    </AccessGate>
  )
}