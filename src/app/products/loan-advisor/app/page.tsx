import dynamic from 'next/dynamic'
import { AccessGate } from '@/components/tools/AccessGate'

const LoanAdvisorTool = dynamic(
  () => import('@/components/tools/LoanAdvisor').then(m => m.LoanAdvisor),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center text-emerald-500 font-black italic animate-pulse uppercase tracking-widest">Analyzing Market Rates...</div> }
)

export default function LoanAdvisorPage() {
  return (
    <AccessGate productId="loan-advisor">
      <LoanAdvisorTool />
    </AccessGate>
  )
}
