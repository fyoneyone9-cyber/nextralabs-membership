import React from 'react';
import SalesAutomation from '@/components/tools/sales-automation';
import { AccessGate } from '@/components/tools/AccessGate';

export const dynamic = 'force-dynamic';

export default function SalesAutomationAppPage() {
  return (
    <AccessGate productId="sales-automation">
      <SalesAutomation />
    </AccessGate>
  );
}
