import BuzzWriter from '@/components/products/BuzzWriter'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="buzz-writer">
      <BuzzWriter />
    </AccessGate>
  )
}