import { AccessGate } from '@/components/tools/AccessGate'
import { LocationFinder } from '@/components/tools/LocationFinder'

export const metadata = {
  title: 'YouTuber撮影場所特定AI | NextraLabs',
}

export default function LocationFinderAppPage() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}
