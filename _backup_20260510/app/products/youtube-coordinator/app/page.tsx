import { AccessGate } from '@/components/tools/AccessGate'
import YoutubeCoordinatorSystem from '@/components/tools/YoutubeCoordinatorSystem'

export default function Page() {
  return (
    <AccessGate productId="youtube-coordinator">
      <YoutubeCoordinatorSystem />
    </AccessGate>
  )
}
