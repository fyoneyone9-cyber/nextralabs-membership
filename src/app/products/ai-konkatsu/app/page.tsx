import AiKonkatsuCoach from '@/components/products/AiKonkatsuCoach'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-konkatsu">
      <AiKonkatsuCoach />
    </AccessGate>
  )
}