import AiReportGenerator from '@/components/tools/AiReportGenerator'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-report-generator">
      <AiReportGenerator />
    </AccessGate>
  )
}
