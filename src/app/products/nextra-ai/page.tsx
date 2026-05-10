import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nextra AI（ホテルDX）| チェックイン・予約・解錠を完全自動化',
  description: '中小ホテル・旅館向けのAI DXソリューション。フロントレス運営・スマートチェックイン・多言語対応を月額で実現。NextraLabsプレミアムプラン。',
  keywords: ['ホテルAI', 'ホテルDX', 'スマートチェックイン', '旅館AI', 'フロントレス運営'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
  },
  openGraph: {
    title: 'Nextra AI（ホテルDX）| チェックイン・予約・解錠を完全自動化 | NextraLabs',
    description: '中小ホテル・旅館向けのAI DXソリューション。フロントレス運営・スマートチェックイン・多言語対応を月額で実現。NextraLabsプレミアムプラン。',
    url: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Nextra AI（ホテルDX）| チェックイン・予約・解錠を完全自動化' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nextra AI（ホテルDX）| チェックイン・予約・解錠を完全自動化',
    description: '中小ホテル・旅館向けのAI DXソリューション。フロントレス運営・スマートチェックイン・多言語対応を月額で実現。NextraLabsプレミアムプラン。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

import dynamic from 'next/dynamic'

const NextraAiLP = dynamic(() => import('./NextraAiLP'), { ssr: false })

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <NextraAiLP />
    </div>
  )
}
