import InboxOrganizer from '@/components/tools/InboxOrganizer'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="inbox-organizer">
      <InboxOrganizer />
    </AccessGate>
  )
}