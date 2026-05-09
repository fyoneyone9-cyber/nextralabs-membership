import { AccessGate } from '@/components/tools/AccessGate'
import ContactSyncSystem from '@/components/tools/ContactSyncSystem'

export default function Page() {
  return (
    <AccessGate productId="contact-sync">
      <ContactSyncSystem />
    </AccessGate>
  )
}
