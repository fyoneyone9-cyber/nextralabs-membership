import AiKonkatsuCoach from '@/components/tools/AiKonkatsuCoach'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-konkatsu">
      <AiKonkatsuCoach />
    </AccessGate>
  )
}