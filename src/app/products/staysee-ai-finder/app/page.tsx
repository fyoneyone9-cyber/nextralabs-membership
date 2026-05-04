import StayseeFinderEngine from '@/components/tools/StayseeFinderEngine'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function StayseeAppPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/products/staysee-ai-finder" 
            className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> 製品紹介へ戻る
          </Link>
        </div>
        
        <StayseeFinderEngine />
      </div>
    </div>
  )
}
