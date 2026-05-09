import { AccessGate } from '@/components/tools/AccessGate'
import EvidenceManagerSystem from '@/components/tools/EvidenceManagerSystem'

export default function Page() {
  return (
    <AccessGate productId="evidence-manager">
      <EvidenceManagerSystem />
    </AccessGate>
  )
}
