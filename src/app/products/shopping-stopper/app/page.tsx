import ShoppingStopper from '@/components/tools/ShoppingStopper'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="shopping-stopper">
      <ShoppingStopper />
    </AccessGate>
  )
}
