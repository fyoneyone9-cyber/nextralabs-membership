import { AccessGate } from '@/components/tools/AccessGate'
import { PromptMaster } from '@/components/tools/PromptMaster'

export const metadata = {
  title: 'AI画像プロンプトマスター | NextraLabs',
}

export default function PromptMasterAppPage() {
  return (
    <AccessGate productId="prompt-master">
      <PromptMaster />
    </AccessGate>
  )
}
