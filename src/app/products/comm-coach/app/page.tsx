import { AccessGate } from '@/components/AccessGate'
import { CommCoach } from '@/components/tools/CommCoach'

export const metadata = {
  title: 'AIコミュニケーション改善コーチ | NextraLabs',
}

export default function CommCoachAppPage() {
  return (
    <AccessGate productId="comm-coach">
      <CommCoach />
    </AccessGate>
  )
}
