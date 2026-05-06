import DisasterGuard from '@/components/products/DisasterGuard'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="disaster-guard">
      <DisasterGuard />
    </AccessGate>
  )
}