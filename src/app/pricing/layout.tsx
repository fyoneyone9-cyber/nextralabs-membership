import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '料金プラン | NextraLabs AIツールメンバーシップ【月額980円〜】',
  description:
    'NextraLabsの料金プランを比較。無料・ライト（980円）・スタンダード（1,980円）・プレミアム（2,980円）の4プランから選択。30種類以上のAIツールが使い放題。いつでも解約可能。',
  keywords: ['NextraLabs料金', 'AIツール月額料金', 'AIメンバーシップ価格', '980円AIツール', 'AIサービス比較'],
  alternates: {
    canonical: 'https://nextralab.jp/pricing',
  },
  openGraph: {
    title: '料金プラン | NextraLabs AIツールメンバーシップ',
    description: '無料〜月額2,980円の4プラン。30種類以上のAIツールをお試し可能。いつでも解約OK。',
    url: 'https://nextralab.jp/pricing',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630 }],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
