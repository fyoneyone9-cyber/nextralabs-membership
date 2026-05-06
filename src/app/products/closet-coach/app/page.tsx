import ClosetCoach from '@/components/products/ClosetCoach'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="closet-coach">
      <ClosetCoach />
    </AccessGate>
  )
}