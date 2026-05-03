import React from 'react';
import AiRecipeScope from '@/components/tools/ai-recipe-scope';
import { AccessGate } from '@/components/tools/AccessGate';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function AiRecipeAppPage() {
  // ビルド時の環境では実行させない
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  return (
    <AccessGate productId="ai-recipe">
      <AiRecipeScope />
    </AccessGate>
  );
}
