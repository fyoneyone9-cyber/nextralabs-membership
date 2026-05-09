import { AccessGate } from '@/components/tools/AccessGate'
import { LoanAdvisor } from '@/components/tools/LoanAdvisor'

export default function Page() {
  return (
    <AccessGate productId="loan-advisor">
      <LoanAdvisor />
    </AccessGate>
  )
}
