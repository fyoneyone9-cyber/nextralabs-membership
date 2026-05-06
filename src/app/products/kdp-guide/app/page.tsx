import KdpGuide from '@/components/products/KdpGuide'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="kdp-guide">
      <KdpGuide />
    </AccessGate>
  )
}