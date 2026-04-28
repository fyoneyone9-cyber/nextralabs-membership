import { AccessGate } from '@/components/tools/AccessGate'
import MovingChecker from '@/components/tools/MovingChecker'

export default function MovingCheckerAppPage() {
  return (
    <AccessGate productId="moving-checker">
      <MovingChecker />
    </AccessGate>
  )
}
