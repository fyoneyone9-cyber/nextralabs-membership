import { AccessGate } from '@/components/tools/AccessGate'
import CommCoach from '@/components/tools/CommCoach'

export default function CommCoachAppPage() {
  return (
    <AccessGate productId="comm-coach">
      <CommCoach />
    </AccessGate>
  )
}
