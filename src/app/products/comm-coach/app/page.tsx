import CommCoach from '@/components/products/CommCoach'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="comm-coach">
      <CommCoach />
    </AccessGate>
  )
}