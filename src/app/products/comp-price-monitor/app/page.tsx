'use client'

import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

// 菫ｮ豁｣・夂ｫｶ蜷井ｾ｡譬ｼ逶｣隕悶さ繝ｳ繝昴・繝阪Φ繝医ｒ邨ｶ蟇ｾ繝代せ縺ｧ謖・ｮ壹＠縲‘xport蠖｢蠑上・驕輔＞繧貞精蜿・const CompPriceMonitorSystem = dynamic(() => import('@/components/tools/CompPriceMonitorSystem').then(mod => {
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
