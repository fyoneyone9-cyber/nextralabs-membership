import LocationFinder from '@/components/tools/LocationFinder'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}