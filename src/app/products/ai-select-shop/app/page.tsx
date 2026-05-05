import AISelectShop from '@/components/tools/AISelectShop'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-select-shop">
      <AISelectShop />
    </AccessGate>
  )
}