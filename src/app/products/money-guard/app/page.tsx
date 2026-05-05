import MoneyGuard from '@/components/tools/MoneyGuard'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="money-guard">
      <MoneyGuard />
    </AccessGate>
  )
}