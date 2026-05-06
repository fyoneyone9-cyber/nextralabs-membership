import AiRecipeScope from '@/components/tools/AiRecipeScope'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="ai-recipe">
      <AiRecipeScope />
    </AccessGate>
  )
}