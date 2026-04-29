import { AccessGate } from '@/components/tools/AccessGate'
import { YoutubeProducer } from '@/components/tools/YoutubeProducer'

export const metadata = {
  title: 'AI YouTubeプロデューサー | NextraLabs',
}

export default function YoutubeProducerAppPage() {
  return (
    <AccessGate productId="youtube-producer">
      <YoutubeProducer />
    </AccessGate>
  )
}
