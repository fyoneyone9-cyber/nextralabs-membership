'use client'

import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

// 修正：競合価格監視コンポーネントを絶対パスで指定し、export形式の違いを吸収
const CompPriceMonitorSystem = dynamic(() => import('@/components/tools/CompPriceMonitorSystem').then(mod => {
  if (mod.CompPriceMonitorSystem) return mod.CompPriceMonitorSystem;
  if (mod.default) return mod.default;
  return mod;
}), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-blue-500 animate-pulse uppercase tracking-[0.5em]">Initializing Revenue Node...</div>
})

export default function Page() {
  return (
    <AccessGate productId="comp-price-monitor">
      <CompPriceMonitorSystem />
    </AccessGate>
  )
}
