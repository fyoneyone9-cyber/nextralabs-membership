import { AccessGate } from '@/components/tools/AccessGate'
import DisasterGuard from '@/components/tools/DisasterGuard'

export default function DisasterGuardAppPage() {
  return (
    <AccessGate productId="disaster-guard">
      <DisasterGuard />
    </AccessGate>
  )
}