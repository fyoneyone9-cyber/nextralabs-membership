import MovingChecker from '@/components/tools/MovingChecker'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="moving-checker">
      <MovingChecker />
    </AccessGate>
  )
}