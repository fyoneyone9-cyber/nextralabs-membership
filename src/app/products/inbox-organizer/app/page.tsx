import { AccessGate } from '@/components/tools/AccessGate'
import InboxOrganizer from '@/components/tools/InboxOrganizer'

export default function Page() {
  return (
    <AccessGate productId="inbox-organizer">
      <InboxOrganizer />
    </AccessGate>
  )
}
