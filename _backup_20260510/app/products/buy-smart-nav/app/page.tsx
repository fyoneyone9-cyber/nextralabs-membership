import { AccessGate } from '@/components/tools/AccessGate'
import BuySmartNavSystem from '@/components/tools/BuySmartNavSystem'

export default function Page() {
  return (
    <AccessGate productId="buy-smart-nav">
      <BuySmartNavSystem />
    </AccessGate>
  )
}
