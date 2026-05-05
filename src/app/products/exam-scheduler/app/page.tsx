import ExamScheduler from '@/components/tools/ExamScheduler'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="exam-scheduler">
      <ExamScheduler />
    </AccessGate>
  )
}