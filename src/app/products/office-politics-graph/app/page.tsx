import OfficePoliticsGraph from '@/components/tools/OfficePoliticsGraph'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="office-politics-graph">
      <OfficePoliticsGraph />
    </AccessGate>
  )
}