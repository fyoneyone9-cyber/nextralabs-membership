import { AccessGate } from '@/components/tools/AccessGate'
import HotelAffiliateSystem from '@/components/tools/HotelAffiliateSystem'

export default function Page() {
  return (
    <AccessGate productId="hotel-affiliate">
      <HotelAffiliateSystem />
    </AccessGate>
  )
}
