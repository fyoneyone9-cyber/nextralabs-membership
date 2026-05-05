import AiSidejob from '@/components/tools/AiSidejob'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-sidejob">
      <AiSidejob />
    </AccessGate>
  )
}