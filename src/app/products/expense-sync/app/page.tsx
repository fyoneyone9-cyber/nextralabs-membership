import { AccessGate } from '@/components/tools/AccessGate'
import ExpenseSyncSystem from '@/components/tools/ExpenseSyncSystem'

export default function Page() {
  return (
    <AccessGate productId="expense-sync">
      <ExpenseSyncSystem />
    </AccessGate>
  )
}
