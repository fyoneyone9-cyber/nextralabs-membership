import React from 'react';
import { Droplets } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SmartGardeningPage() {
  return (
    <div className="p-10 text-center space-y-4">
      <Droplets className="w-16 h-16 mx-auto text-green-500" />
      <h1 className="text-3xl font-bold text-white">AI水やり守護神</h1>
      <p className="text-slate-400">システムメンテナンス中です。まもなく公開されます。</p>
    </div>
  );
}
