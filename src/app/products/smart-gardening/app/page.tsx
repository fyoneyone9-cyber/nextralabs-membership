import React from 'react';
import SmartGardening from '@/components/tools/SmartGardening';
import { AccessGate } from '@/components/tools/AccessGate';

export const dynamic = 'force-dynamic';

export default function SmartGardeningAppPage() {
  return (
    <AccessGate productId="smart-gardening">
      <SmartGardening />
    </AccessGate>
  );
}
