import { AccessGate } from '@/components/products/AccessGate'
import ContactSyncSystem from '@/components/products/ContactSyncSystem'

export default function Page() {
  return (
    <AccessGate productId="contact-sync">
      <ContactSyncSystem />
    </AccessGate>
  )
}
