import { AccessGate } from '@/components/tools/AccessGate'
import { ClosetCoach } from '@/components/tools/ClosetCoach'

export const metadata = {
  title: 'AIクローゼット断捨離コーチ | NextraLabs',
}

export default function ClosetCoachAppPage() {
  return (
    <AccessGate productId="closet-coach">
      <ClosetCoach />
    </AccessGate>
  )
}
