import { AccessGate } from '@/components/tools/AccessGate'
import ExamScheduler from '@/components/tools/ExamScheduler'

export default function ExamSchedulerAppPage() {
  return (
    <AccessGate productId="exam-scheduler">
      <ExamScheduler />
    </AccessGate>
  )
}
