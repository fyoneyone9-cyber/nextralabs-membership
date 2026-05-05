import KdpGuide from '@/components/tools/KdpGuide'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="kdp-guide">
      <KdpGuide />
    </AccessGate>
  )
}