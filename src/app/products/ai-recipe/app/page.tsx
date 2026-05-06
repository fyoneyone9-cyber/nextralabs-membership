import AiRecipeScope from '@/components/products/AiRecipeScope'
import { AccessGate } from '@/components/products/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-recipe">
      <AiRecipeScope />
    </AccessGate>
  )
}