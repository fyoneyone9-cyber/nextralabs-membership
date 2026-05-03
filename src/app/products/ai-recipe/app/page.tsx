import React from 'react';
import AiRecipeScope from '@/components/tools/AiRecipeScope';
import { AccessGate } from '@/components/tools/AccessGate';

export const dynamic = 'force-dynamic';

export default function AiRecipeAppPage() {
  return (
    <AccessGate productId="ai-recipe">
      <AiRecipeScope />
    </AccessGate>
  );
}
