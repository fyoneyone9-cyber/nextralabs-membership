import { AccessGate } from '@/components/tools/AccessGate'
import ShoppingStopper from '@/components/tools/ShoppingStopper'

export default function ShoppingStopperAppPage() {
  return (
    <AccessGate productId="shopping-stopper">
      <ShoppingStopper />
    </AccessGate>
  )
}
