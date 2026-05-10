import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ご利用ガイド | NextraLabsの使い方完全解説',
  description:
    'NextraLabsのAIツール・MASTERMODELの使い方を図解で解説。ログイン方法・プラン選択・各ツールの操作手順・Shopify連携まで初心者でもわかるガイド。',
  keywords: ['NextraLabs使い方', 'AIツールガイド', 'MASTERMODEL使い方', 'NextraLabsマニュアル'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/guide',
  },
  openGraph: {
    title: 'ご利用ガイド | NextraLabsの使い方完全解説',
    description: 'NextraLabsのAIツール・MASTERMODELの使い方を図解で解説。初心者でもすぐ始められる。',
    url: 'https://membership-site-nextralabos.vercel.app/guide',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630 }],
  },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
