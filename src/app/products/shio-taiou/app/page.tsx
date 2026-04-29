import { AccessGate } from '@/components/tools/AccessGate'
import ShioTaiou from '@/components/tools/ShioTaiou'

export default function ShioTaiouApp() {
  return (
    <AccessGate productId="shio-taiou">
      <ShioTaiou />
    </AccessGate>
  )
}
