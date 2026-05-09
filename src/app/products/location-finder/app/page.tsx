import { AccessGate } from '@/components/tools/AccessGate'
import LocationFinder from '@/components/tools/LocationFinder'

export default function Page() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}
