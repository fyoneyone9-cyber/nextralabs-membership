import { AccessGate } from '@/components/tools/AccessGate'
import PetTranslator from '@/components/tools/PetTranslator'

export default function PetTranslatorAppPage() {
  return (
    <AccessGate productId="pet-translator">
      <PetTranslator />
    </AccessGate>
  )
}
