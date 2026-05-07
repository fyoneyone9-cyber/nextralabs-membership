'use client'
import dynamic from 'next/dynamic'

const KindleFactory = dynamic(
  () => import('@/components/tools/KindleFactory').then(m => m.KindleFactory),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center text-emerald-500 font-black italic animate-pulse uppercase tracking-widest">Loading Kindle Factory...</div> }
)

export default function KindleFactoryPage() {
  return <KindleFactory />
}
