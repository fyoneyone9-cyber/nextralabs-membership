import LocationFinder from '@/components/products/LocationFinder'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}