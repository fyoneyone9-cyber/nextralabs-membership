import { AccessGate } from '@/components/tools/AccessGate'
import ResignationAssistant from '@/components/tools/ResignationAssistant'

export default function ResignationAssistantAppPage() {
  return (
    <AccessGate productId="resignation-assistant">
      <ResignationAssistant />
    </AccessGate>
  )
}
