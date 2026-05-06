import PromptMaster from '@/components/products/PromptMaster'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="prompt-master">
      <PromptMaster />
    </AccessGate>
  )
}