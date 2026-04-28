import { AccessGate } from '@/components/tools/AccessGate'
import OfficePoliticsGraph from '@/components/tools/OfficePoliticsGraph'

export default function OfficePoliticsGraphAppPage() {
  return (
    <AccessGate productId="office-politics-graph">
      <OfficePoliticsGraph />
    </AccessGate>
  )
}
