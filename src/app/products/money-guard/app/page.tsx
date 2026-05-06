import MoneyGuard from '@/components/products/MoneyGuard'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="money-guard">
      <MoneyGuard />
    </AccessGate>
  )
}