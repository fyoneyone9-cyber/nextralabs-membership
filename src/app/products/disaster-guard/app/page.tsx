import DisasterGuard from '@/components/tools/DisasterGuard'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="disaster-guard">
      <DisasterGuard />
    </AccessGate>
  )
}