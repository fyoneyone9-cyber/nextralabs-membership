import ShioTaiou from '@/components/products/ShioTaiou'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="shio-taiou">
      <ShioTaiou />
    </AccessGate>
  )
}