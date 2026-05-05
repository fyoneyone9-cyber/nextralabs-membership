import TicketScout from '@/components/tools/TicketScout'
import { AccessGate } from '@/components/auth/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ticket-scout">
      <TicketScout />
    </AccessGate>
  )
}