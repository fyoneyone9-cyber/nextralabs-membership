import ShioTaiou from '@/components/tools/ShioTaiou'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="shio-taiou">
      <ShioTaiou />
    </AccessGate>
  )
}
