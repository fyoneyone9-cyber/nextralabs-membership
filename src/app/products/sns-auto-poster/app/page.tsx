import SnsAutoPoster from '@/components/tools/SnsAutoPoster'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="sns-auto-poster">
      <SnsAutoPoster />
    </AccessGate>
  )
}