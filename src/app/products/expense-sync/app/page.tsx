import { AccessGate } from '@/components/products/AccessGate'
import ExpenseSyncSystem from '@/components/products/ExpenseSyncSystem'

export default function Page() {
  return (
    <AccessGate productId="expense-sync">
      <ExpenseSyncSystem />
    </AccessGate>
  )
}
