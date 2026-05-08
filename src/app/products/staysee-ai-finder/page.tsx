import dynamic from 'next/dynamic'

const StayseeFinderLP = dynamic(() => import('@/components/tools/StayseeFinderLP'), { ssr: false })

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <StayseeFinderLP />
    </div>
  )
}
