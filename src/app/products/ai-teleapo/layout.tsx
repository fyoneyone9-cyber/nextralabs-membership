import {{ Metadata }} from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {{
  title: 'AIテレアポくん | AI架電台本＆法人見積もり自動生成 | NextraLabs',
  description: '業種・商材・担当者情報を入力するだけでAIが最適な架電台本を生成。トーク結果に応じた法人向け見積書も自動作成。法人アポ率を3倍に。',
  keywords: ['AIテレアポ', '架電台本AI', '法人見積もり自動生成', '営業電話AI', 'テレアポ自動化', '法人営業AI', '架電スクリプト', '見積書自動生成', 'NextraLabs'],
  openGraph: {{
    title: 'AIテレアポくん | AI架電台本＆法人見積もり自動生成 | NextraLabs',
    description: '営業電話の台本と見積もりをAIが瞬時に生成。法人アポ率を3倍に。',
    url: `${{BASE}}/products/ai-teleapo`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{{ url: `${{BASE}}/og-image.png`, width: 1200, height: 630 }}],
  }},
  twitter: {{ card: 'summary_large_image', title: 'AIテレアポくん | NextraLabs', description: '架電台本と法人見積もりをAIが自動生成' }},
  alternates: {{ canonical: `${{BASE}}/products/ai-teleapo` }},
}}

const breadcrumb = {{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {{ '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE }},
    {{ '@type': 'ListItem', position: 2, name: 'AIツール', item: `${{BASE}}/products` }},
    {{ '@type': 'ListItem', position: 3, name: 'AIテレアポくん', item: `${{BASE}}/products/ai-teleapo` }},
  ],
}}

const softwareSchema = {{
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AIテレアポくん',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {{ '@type': 'Offer', price: '480', priceCurrency: 'JPY', description: 'ライトプラン月額' }},
  description: '法人営業の架電台本と見積もりをAIが自動生成。アポ率3倍を目指す営業支援ツール。',
}}

export default function Layout({{ children }}: {{ children: React.ReactNode }}) {{
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{{{ __html: JSON.stringify(breadcrumb) }}}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{{{ __html: JSON.stringify(softwareSchema) }}}} />
      {{children}}
    </>
  )
}}
