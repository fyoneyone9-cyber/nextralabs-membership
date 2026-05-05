import PetTranslator from '@/components/tools/PetTranslator'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="pet-translator">
      <PetTranslator />
    </AccessGate>
  )
}