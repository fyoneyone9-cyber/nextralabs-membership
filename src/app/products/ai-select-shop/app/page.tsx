import AISelectShop from '@/components/products/AISelectShop'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-select-shop">
      <AISelectShop />
    </AccessGate>
  )
}