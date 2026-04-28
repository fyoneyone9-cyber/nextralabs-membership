import { AccessGate } from '@/components/tools/AccessGate'
import VintageHunter from '@/components/tools/VintageHunter'

export default function VintageHunterAppPage() {
  return (
    <AccessGate productId="vintage-hunter">
      <VintageHunter />
    </AccessGate>
  )
}
