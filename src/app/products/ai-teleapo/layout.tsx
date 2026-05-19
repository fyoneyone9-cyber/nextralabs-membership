import { Metadata } from 'next'

const BASE = 'https://nextralab.jp'

export const metadata: Metadata = {
  title: 'AI繝・Ξ繧｢繝昴￥繧・| AI譫ｶ髮ｻ蜿ｰ譛ｬ・・ｳ穂ｺｺ隕狗ｩ阪ｂ繧願・蜍慕函謌・| NextraLabs',
  description: '讌ｭ遞ｮ繝ｻ蝠・攝繝ｻ諡・ｽ楢・ュ蝣ｱ繧貞・蜉帙☆繧九□縺代〒AI縺梧怙驕ｩ縺ｪ譫ｶ髮ｻ蜿ｰ譛ｬ繧堤函謌舌ゅヨ繝ｼ繧ｯ邨先棡縺ｫ蠢懊§縺滓ｳ穂ｺｺ蜷代￠隕狗ｩ肴嶌繧り・蜍穂ｽ懈・縲よｳ穂ｺｺ繧｢繝晉紫繧・蛟阪↓縲・,
  keywords: ['AI繝・Ξ繧｢繝・, '譫ｶ髮ｻ蜿ｰ譛ｬAI', '豕穂ｺｺ隕狗ｩ阪ｂ繧願・蜍慕函謌・, '蝟ｶ讌ｭ髮ｻ隧ｱAI', '繝・Ξ繧｢繝晁・蜍募喧', '豕穂ｺｺ蝟ｶ讌ｭAI', '譫ｶ髮ｻ繧ｹ繧ｯ繝ｪ繝励ヨ', '隕狗ｩ肴嶌閾ｪ蜍慕函謌・, 'NextraLabs'],
  openGraph: {
    title: 'AI繝・Ξ繧｢繝昴￥繧・| AI譫ｶ髮ｻ蜿ｰ譛ｬ・・ｳ穂ｺｺ隕狗ｩ阪ｂ繧願・蜍慕函謌・| NextraLabs',
    description: '蝟ｶ讌ｭ髮ｻ隧ｱ縺ｮ蜿ｰ譛ｬ縺ｨ隕狗ｩ阪ｂ繧翫ｒAI縺檎椪譎ゅ↓逕滓・縲よｳ穂ｺｺ繧｢繝晉紫繧・蛟阪↓縲・,
    url: `${BASE}/products/ai-teleapo`,
    siteName: 'NextraLabs',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI繝・Ξ繧｢繝昴￥繧・| NextraLabs', description: '譫ｶ髮ｻ蜿ｰ譛ｬ縺ｨ豕穂ｺｺ隕狗ｩ阪ｂ繧翫ｒAI縺瑚・蜍慕函謌・ },
  alternates: { canonical: `${BASE}/products/ai-teleapo` },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '繝帙・繝', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'AI繝・・繝ｫ', item: `${BASE}/products` },
    { '@type': 'ListItem', position: 3, name: 'AI繝・Ξ繧｢繝昴￥繧・, item: `${BASE}/products/ai-teleapo` },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI繝・Ξ繧｢繝昴￥繧・,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '480', priceCurrency: 'JPY', description: '繝ｩ繧､繝医・繝ｩ繝ｳ譛磯｡・ },
  description: '豕穂ｺｺ蝟ｶ讌ｭ縺ｮ譫ｶ髮ｻ蜿ｰ譛ｬ縺ｨ隕狗ｩ阪ｂ繧翫ｒAI縺瑚・蜍慕函謌舌ゅい繝晉紫3蛟阪ｒ逶ｮ謖・☆蝟ｶ讌ｭ謾ｯ謠ｴ繝・・繝ｫ縲・,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {children}
    </>
  )
}
