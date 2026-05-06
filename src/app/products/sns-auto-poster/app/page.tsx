import SnsAutoPoster from '@/components/products/SnsAutoPoster'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="sns-auto-poster">
      <SnsAutoPoster />
    </AccessGate>
  )
}