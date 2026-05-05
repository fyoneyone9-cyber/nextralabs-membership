import ResignationAssistant from '@/components/tools/ResignationAssistant'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="resignation-assistant">
      <ResignationAssistant />
    </AccessGate>
  )
}