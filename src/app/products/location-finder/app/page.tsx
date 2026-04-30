import { AccessGate } from '@/components/tools/AccessGate'
import { LocationFinder } from '@/components/tools/LocationFinder'

export const metadata = {
  title: 'YouTuber謦ｮ蠖ｱ蝣ｴ謇迚ｹ螳哂I | NextraLabs',
}

export default function LocationFinderAppPage() {
  return (
    <AccessGate productId="location-finder">
      <LocationFinder />
    </AccessGate>
  )
}

