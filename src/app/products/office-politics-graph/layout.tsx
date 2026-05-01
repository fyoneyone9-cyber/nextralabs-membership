import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '社内政治 相関図',
  description: 'Slackメンションとカレンダーデータから組織のキーマンを可視化。PageRankで人間関係を分析。無料。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/office-politics-graph' },
  openGraph: { title: '社内政治 相関図 | NextraLabs', description: 'Slackメンションとカレンダーデータから組織のキーマンを可視化。PageRankで人間関係を分析。', url: 'https://membership-site-nextralabos.vercel.app/products/office-politics-graph', type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
