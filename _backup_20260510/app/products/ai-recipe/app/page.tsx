import { AccessGate } from '@/components/tools/AccessGate'
import AiRecipeScope from '@/components/tools/AiRecipeScope'

export default function Page() {
  return (
    <AccessGate productId="ai-recipe">
      <AiRecipeScope />
    </AccessGate>
  )
}
