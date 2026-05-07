import YoutubeProducer from '@/components/tools/YoutubeProducer'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="youtube-producer">
      <YoutubeProducer />
    </AccessGate>
  )
}
