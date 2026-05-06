import ResignationAssistant from '@/components/products/ResignationAssistant'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="resignation-assistant">
      <ResignationAssistant />
    </AccessGate>
  )
}