import InboxOrganizer from '@/components/products/InboxOrganizer'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="inbox-organizer">
      <InboxOrganizer />
    </AccessGate>
  )
}