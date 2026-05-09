import { AccessGate } from '@/components/tools/AccessGate'
import SmartGardening from '@/components/tools/SmartGardening'

export default function Page() {
  return (
    <AccessGate productId="smart-gardening">
      <SmartGardening />
    </AccessGate>
  )
}
