import { AccessGate } from '@/components/tools/AccessGate'
import InteriorCoordinatorSystem from '@/components/tools/InteriorCoordinatorSystem'

export default function Page() {
  return (
    <AccessGate productId="interior-coordinator">
      <InteriorCoordinatorSystem />
    </AccessGate>
  )
}
