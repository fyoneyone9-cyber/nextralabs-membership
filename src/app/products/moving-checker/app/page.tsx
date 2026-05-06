import MovingChecker from '@/components/products/MovingChecker'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="moving-checker">
      <MovingChecker />
    </AccessGate>
  )
}