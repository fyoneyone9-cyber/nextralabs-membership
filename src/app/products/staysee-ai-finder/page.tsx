import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案',
  description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
  keywords: ["AI宿探し","旅行AI","ホテルAI検索","楽天トラベルAI","宿泊先AI提案"],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/staysee-ai-finder',
  },
  openGraph: {
    title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案 | NextraLabs',
    description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
    url: 'https://membership-site-nextralabos.vercel.app/products/staysee-ai-finder',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案',
    description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

const StayseeFinderLP = dynamic(() => import('@/components/tools/StayseeFinderLP'), { ssr: false })

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <StayseeFinderLP />
    </div>
  )
}
