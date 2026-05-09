import { AccessGate } from '@/components/tools/AccessGate'
import AiReportGenerator from '@/components/tools/AiReportGenerator'

export default function AiReportGeneratorAppPage() {
  return (
    <AccessGate productId="ai-report-generator">
      <AiReportGenerator />
    </AccessGate>
  )
}