import { AccessGate } from '@/components/tools/AccessGate'
import PetTranslator from '@/components/tools/PetTranslator'

export default function Page() {
  return (
    <AccessGate productId="pet-translator">
      <PetTranslator />
    </AccessGate>
  )
}
