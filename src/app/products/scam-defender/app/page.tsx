import ScamDefender from '@/components/tools/ScamDefender'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="scam-defender">
      <ScamDefender />
    </AccessGate>
  )
}