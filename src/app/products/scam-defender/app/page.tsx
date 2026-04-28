import { AccessGate } from '@/components/tools/AccessGate'
import ScamDefender from '@/components/tools/ScamDefender'

export default function ScamDefenderAppPage() {
  return (
    <AccessGate productId="scam-defender">
      <ScamDefender />
    </AccessGate>
  )
}
