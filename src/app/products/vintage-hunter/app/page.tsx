import VintageHunter from '@/components/tools/VintageHunter'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="vintage-hunter">
      <VintageHunter />
    </AccessGate>
  )
}