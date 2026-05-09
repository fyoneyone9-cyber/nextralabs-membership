import { AccessGate } from '@/components/tools/AccessGate'
import PromptMaster from '@/components/tools/PromptMaster'

export default function Page() {
  return (
    <AccessGate productId="prompt-master">
      <PromptMaster />
    </AccessGate>
  )
}
