'use client'
import { AccessGate } from '@/components/tools/AccessGate'
import dynamic from 'next/dynamic'

// 先ほど作ったコンポーネントを再利用（パスを適切に設定）
const VercelDeployments = dynamic(() => import('@/app/admin/deployments/page'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center text-emerald-500">Loading Fleet Data...</div>
})

export default function VercelMonitorAppPage() {
  return (
    <AccessGate productId="vercel-monitor">
      <VercelDeployments />
    </AccessGate>
  )
}
