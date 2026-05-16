import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '使い方ガイド・スタートアップ | NextraLabs【AIツール始め方】',
  description: 'NextraLabs（ネクストララボ）の使い方ガイド。無料登録からAIツール利用開始まで5分で完了。Gemini 2.5 Flash搭載の30種類以上のAIツールの使い方を丁寧に解説。',
  keywords: ['NextraLabs 使い方', 'AIツール 始め方', 'NextraLabs ガイド', 'AIメンバーシップ 登録方法', 'Gemini 2.5 Flash 使い方'],
  openGraph: {
    title: '使い方ガイド | NextraLabs',
    description: 'NextraLabsの始め方ガイド。無料登録から5分でAIツール利用開始。',
    url: 'https://nextralab.jp/guide',
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: '使い方ガイド | NextraLabs', description: '5分でAIツール利用開始。NextraLabsの始め方ガイド。' },
  alternates: { canonical: 'https://nextralab.jp/guide' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'NextraLabs AIツールの始め方',
  description: 'NextraLabsに登録してAIツールを使い始める方法',
  step: [
    { '@type': 'HowToStep', position: 1, name: '無料会員登録', text: 'メールアドレスでNextraLabsに無料登録します。' },
    { '@type': 'HowToStep', position: 2, name: 'プランを選択', text: '無料プラン・ライト・スタンダード・プレミアムから選択します。' },
    { '@type': 'HowToStep', position: 3, name: 'AIツールを利用', text: '30種類以上のAIツールを即利用開始できます。' },
  ],
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://nextralab.jp' },
    { '@type': 'ListItem', position: 2, name: '使い方ガイド', item: 'https://nextralab.jp/guide' },
  ],
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  )
}
