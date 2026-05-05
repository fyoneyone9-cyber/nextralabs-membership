import ClosetCoach from '@/components/tools/ClosetCoach'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="closet-coach">
      <ClosetCoach />
    </AccessGate>
  )
}