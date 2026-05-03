import React from 'react';
import SmartGardening from '@/components/tools/SmartGardening';
import { AccessGate } from '@/components/tools/AccessGate';
import { Droplets } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SmartGardeningAppPage() {
  return (
    <AccessGate 
      productId="smart-gardening" 
      title="AI水やり守護神"
      icon={<Droplets className="w-12 h-12 text-green-500" />}
    >
      <SmartGardening />
    </AccessGate>
  );
}
