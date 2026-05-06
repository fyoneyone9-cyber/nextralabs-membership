import AiSidejob from '@/components/products/AiSidejob'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-sidejob">
      <AiSidejob />
    </AccessGate>
  )
}