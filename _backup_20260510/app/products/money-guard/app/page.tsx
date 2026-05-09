import { AccessGate } from '@/components/tools/AccessGate'
import MoneyGuard from '@/components/tools/MoneyGuard'

export default function Page() {
  return (
    <AccessGate productId="money-guard">
      <MoneyGuard />
    </AccessGate>
  )
}
