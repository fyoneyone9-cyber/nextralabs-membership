import { AccessGate } from '@/components/tools/AccessGate'
import { AiSidejob } from '@/components/tools/AiSidejob'

export const metadata = {
  title: 'AI副業スタートダッシュ | NextraLabs',
}

export default function AiSidejobAppPage() {
  return (
    <AccessGate productId="ai-sidejob">
      <AiSidejob />
    </AccessGate>
  )
}
