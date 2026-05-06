import PRCommandSystem from '@/components/tools/PRCommandSystem'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="pr-command">
      <PRCommandSystem />
    </AccessGate>
  )
}
