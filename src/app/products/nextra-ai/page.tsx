import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nextra AI | AIスマートチェックイン・ホテルDX自動化システム | NextraLabs',
  description: 'フロントなしでチェックイン完結。AIによる本人確認・多言語対応・鍵発行を完全自動化。中小ホテル・旅館のDXをNextraLabsが月額で実現。無料体験あり。',
  keywords: [
    'ホテルDX', 'スマートチェックイン', 'AIチェックイン', 'フロントレス運営',
    '自動チェックイン', '旅館AI', '本人確認AI', '多言語チェックイン',
    'ホテル自動化', 'PMS連携', 'キオスクチェックイン', 'NextraLabs'
  ],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
  },
  openGraph: {
    title: 'Nextra AI | AIスマートチェックイン・ホテルDX自動化システム | NextraLabs',
    description: 'フロントなしでチェックイン完結。AIによる本人確認・多言語対応・鍵発行を完全自動化。中小ホテル・旅館のDXをNextraLabsが月額で実現。',
    url: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Nextra AI スマートチェックインシステム' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nextra AI | AIスマートチェックイン・ホテルDX自動化システム',
    description: 'フロントなしでチェックイン完結。AIによる本人確認・多言語対応・鍵発行を完全自動化。NextraLabsプレミアムプラン。',
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
