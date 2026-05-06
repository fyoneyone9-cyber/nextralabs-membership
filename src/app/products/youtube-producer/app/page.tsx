import YoutubeProducer from '@/components/products/YoutubeProducer'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="youtube-producer">
      <YoutubeProducer />
    </AccessGate>
  )
}
