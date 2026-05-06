import SmartGardening from '@/components/products/SmartGardening'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="smart-gardening">
      <SmartGardening />
    </AccessGate>
  )
}