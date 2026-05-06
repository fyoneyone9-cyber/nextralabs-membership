import OfficePoliticsGraph from '@/components/products/OfficePoliticsGraph'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="office-politics-graph">
      <OfficePoliticsGraph />
    </AccessGate>
  )
}