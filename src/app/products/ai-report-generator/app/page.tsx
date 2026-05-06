import AiReportGenerator from '@/components/products/AiReportGenerator'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-report-generator">
      <AiReportGenerator />
    </AccessGate>
  )
}