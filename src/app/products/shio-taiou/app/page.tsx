import { AccessGate } from '@/components/tools/AccessGate'
import ShioTaiou from '@/components/tools/ShioTaiou'

export default function Page() {
  return (
    <AccessGate productId="shio-taiou">
      <ShioTaiou />
    </AccessGate>
  )
}
