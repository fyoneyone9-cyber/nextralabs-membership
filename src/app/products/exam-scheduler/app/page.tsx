import ExamScheduler from '@/components/products/ExamScheduler'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="exam-scheduler">
      <ExamScheduler />
    </AccessGate>
  )
}