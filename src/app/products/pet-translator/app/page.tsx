import PetTranslator from '@/components/products/PetTranslator'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="pet-translator">
      <PetTranslator />
    </AccessGate>
  )
}