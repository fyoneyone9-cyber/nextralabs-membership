import { AccessGate } from '@/components/tools/AccessGate'
import TicketScout from '@/components/tools/TicketScout'

export default function TicketScoutAppPage() {
  return (
    <AccessGate productId="ticket-scout">
      <TicketScout />
    </AccessGate>
  )
}