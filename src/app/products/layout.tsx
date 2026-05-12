import { Metadata } from 'next'
import ProductsLayoutClient from './layout-client'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AIツール一覧 | NextraLabs — 30種類以上が月額980円〜使い放題',
  description:
    'NextraLabsのAIツール全30種類以上を一覧で見られます。SNS・出版・家計・旅行・学習・副業・防犯・婚活など幅広いジャンルをカバー。無料プランあり。',
  keywords: [
    'AIツール一覧', 'AI使い放題', 'NextraLabs ツール',
    'AIメンバーシップ 日本', 'AI副業ツール', 'AI家計管理',
    'AI詐欺対策', 'Kindle出版AI', 'AI旅行計画',
    'AI資格勉強', 'SNS AI自動投稿', 'AI婚活', '月額AIサービス',
  ],
  alternates: { canonical: `${BASE}/products` },
  openGraph: {
    title: 'AIツール一覧 | NextraLabs',
    description: '30種類以上のAIツールが月額980円〜使い放題。SNS・出版・家計・旅行・学習・副業・防犯・婚活など全ジャンル対応。',
    url: `${BASE}/products`,
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIツール一覧 | NextraLabs',
    description: '30種類以上のAIツールが月額980円〜使い放題。',
    images: [`${BASE}/og-image.png`],
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <ProductsLayoutClient>{children}</ProductsLayoutClient>
}
