import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'halal-checker | インバウンド宗教・食習慣対応AI | NextraLabs',
  description: '予約者名と国籍を入力するだけで、ハラール・ベジタリアン・コーシャ等の宗教・食習慣配慮をGemini AIが自動推定。フロントの申し送りを3秒で作成。ホテル・旅館のインバウンド対応を自動化。',
  alternates: { canonical: 'https://nextralab.jp/halal-checker' },
}

export default function HalalCheckerLayout({ children }: { children: React.ReactNode }) {
  return children
}
