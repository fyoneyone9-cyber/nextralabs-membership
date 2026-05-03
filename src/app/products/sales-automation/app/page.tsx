import React from 'react';
import SalesAutomation from '@/components/tools/sales-automation';
import { AccessGate } from '@/components/tools/AccessGate';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function SalesAutomationAppPage() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  return (
    <AccessGate productId="sales-automation">
      <SalesAutomation />
    </AccessGate>
  );
}
