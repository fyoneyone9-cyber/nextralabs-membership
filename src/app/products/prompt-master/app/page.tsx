import PromptMaster from '@/components/tools/PromptMaster'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="prompt-master">
      <PromptMaster />
    </AccessGate>
  )
}