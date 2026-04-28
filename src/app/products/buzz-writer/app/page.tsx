import { AccessGate } from '@/components/tools/AccessGate'
import BuzzWriter from '@/components/tools/BuzzWriter'

export default function BuzzWriterAppPage() {
  return (
    <AccessGate productId="buzz-writer">
      <BuzzWriter />
    </AccessGate>
  )
}
