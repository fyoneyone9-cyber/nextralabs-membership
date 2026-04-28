import { AccessGate } from '@/components/tools/AccessGate'
import MoneyGuard from '@/components/tools/MoneyGuard'

export default function MoneyGuardAppPage() {
  return (
    <AccessGate productId="money-guard">
      <MoneyGuard />
    </AccessGate>
  )
}
