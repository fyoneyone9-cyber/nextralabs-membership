import dynamic from 'next/dynamic'

const NextraAiLP = dynamic(() => import('@/components/tools/NextraAiLP'), { ssr: false })

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <NextraAiLP />
    </div>
  )
}
