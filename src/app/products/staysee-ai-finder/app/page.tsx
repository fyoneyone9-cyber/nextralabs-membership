import StayseeFinderEngine from '@/components/tools/StayseeFinderEngine'
import { AccessGate } from '@/components/tools/AccessGate' // 🔒 アクセスゲートを導入
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function StayseeAppPage() {
  return (
    /* 🛡️ 有料メンバー（プレミアムプラン）のみに限定 */
    <AccessGate productId="staysee-ai-finder">
      <div className="min-h-screen bg-[#0a0a0f] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-4xl mx-auto">
            <Link 
              href="/products/staysee-ai-finder" 
              className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Product Page
            </Link>
          </div>
          
          <StayseeFinderEngine />
        </div>
      </div>
    </AccessGate>
  )
}
