import React from 'react';
import RealTimeScope from '@/components/tools/RealTimeScope';
import { AccessGate } from '@/components/tools/AccessGate';

export const dynamic = 'force-dynamic';

export default function SmartGardeningAppPage() {
  return (
    <AccessGate productId="smart-gardening">
      <RealTimeScope />
    </AccessGate>
  );
}
