import { AccessGate } from '@/components/tools/AccessGate'
import { LocationFinder } from '@/components/tools/LocationFinder'

export const metadata = {
  title: 'AI Location Scout | NextraLabs',
}

export default function LocationFinderAppPage() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}
