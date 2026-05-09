import { AccessGate } from '@/components/tools/AccessGate'
import TrendStockSystem from '@/components/tools/TrendStockSystem'

export default function Page() {
  return (
    <AccessGate productId="trend-stock">
      <TrendStockSystem />
    </AccessGate>
  )
}
