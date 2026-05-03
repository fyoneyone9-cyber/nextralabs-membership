import React from 'react';
import SmartGardening from '@/components/tools/SmartGardening';
import AccessGate from '@/components/tools/AccessGate';
import { Droplets } from 'lucide-react';

export const metadata = {
  title: 'AI水やり守護神 | NextraLabs',
  description: '写真と天気から、AIが最適な水やりタイミングをアドバイス。大切な植物を枯らさないための守護神。',
};

export default function SmartGardeningPage() {
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
