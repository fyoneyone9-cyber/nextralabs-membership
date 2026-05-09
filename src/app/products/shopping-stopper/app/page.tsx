import { AccessGate } from '@/components/tools/AccessGate'
import ShoppingStopper from '@/components/tools/ShoppingStopper'

export default function Page() {
  return (
    <AccessGate productId="shopping-stopper">
      <ShoppingStopper />
    </AccessGate>
  )
}
