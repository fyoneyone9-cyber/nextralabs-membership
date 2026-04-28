import { AccessGate } from '@/components/tools/AccessGate'
import AiKonkatsuCoach from '@/components/tools/AiKonkatsuCoach'

export default function AiKonkatsuAppPage() {
  return (
    <AccessGate productId="ai-konkatsu">
      <AiKonkatsuCoach />
    </AccessGate>
  )
}
