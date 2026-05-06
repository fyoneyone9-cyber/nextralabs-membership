import ShoppingStopper from '@/components/products/ShoppingStopper'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="shopping-stopper">
      <ShoppingStopper />
    </AccessGate>
  )
}