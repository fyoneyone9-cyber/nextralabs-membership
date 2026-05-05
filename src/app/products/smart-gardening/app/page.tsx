import SmartGardening from '@/components/tools/SmartGardening'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="smart-gardening">
      <SmartGardening />
    </AccessGate>
  )
}