import { AccessGate } from '@/components/tools/AccessGate'
import AISelectShop from '@/components/tools/AISelectShop'

export default function AISelectShopAppPage() {
  return (
    <AccessGate productId="ai-select-shop">
      <AISelectShop />
    </AccessGate>
  )
}
