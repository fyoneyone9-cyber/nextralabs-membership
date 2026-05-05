import CommCoach from '@/components/tools/CommCoach'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="comm-coach">
      <CommCoach />
    </AccessGate>
  )
}