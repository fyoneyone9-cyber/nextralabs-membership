import { AccessGate } from '@/components/tools/AccessGate'
import { KindleFactory } from '@/components/tools/KindleFactory'

export default function KindleFactoryAppPage() {
  return (
    <AccessGate productId="kindle-factory">
      <KindleFactory />
    </AccessGate>
  )
}
