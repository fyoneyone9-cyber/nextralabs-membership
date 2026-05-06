import TicketScout from '@/components/products/TicketScout'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ticket-scout">
      <TicketScout />
    </AccessGate>
  )
}