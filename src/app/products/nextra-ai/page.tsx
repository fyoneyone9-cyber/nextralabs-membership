import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nextra AI | ホテル・旅館 無人チェックインKIOSK | NextraLabs',
  description: 'フロント不要で24時間チェックイン。身分証スキャン・電子署名・スマートロック連携・多言語（日英中韓）対応。旅館業法準拠のAIチェックインシステム。¥9,800〜/月で導入可能。',
  keywords: [
    'ホテルDX','無人チェックイン','スマートチェックイン','キオスクシステム',
    '旅館DX','PMS連携','スマートロック','旅館業法対応',
    '多言語チェックイン','フロントレス','AI身分証確認','電子署名','NextraLabs'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
  },
  openGraph: {
    title: 'Nextra AI | ホテル・旅館 無人チェックインKIOSK | NextraLabs',
    description: 'フロント不要で24時間チェックイン。身分証スキャン・電子署名・スマートロック連携・多言語（日英中韓）対応。旅館業法準拠のAIチェックインシステム。¥9,800〜/月で導入可能。',
    url: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Nextra AI 無人チェックインKIOSKシステム' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nextra AI | ホテル・旅館 無人チェックインKIOSK | NextraLabs',
    description: 'フロント不要で24時間チェックイン。身分証スキャン・スマートロック連携・旅館業法準拠。¥9,800〜/月。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

import dynamic from 'next/dynamic'

const NextraAiLP = dynamic(() => import('./NextraAiLP'), { ssr: false })

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Nextra AI',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: 'フロント不要で24時間チェックイン。身分証スキャン・電子署名・スマートロック連携・多言語（日英中韓）対応。旅館業法準拠のAIチェックインシステム。',
        url: 'https://membership-site-nextralabos.vercel.app/products/nextra-ai',
        offers: {
          '@type': 'Offer',
          price: '9800',
          priceCurrency: 'JPY',
          name: '10室プラン',
          priceSpecification: [
            { '@type': 'UnitPriceSpecification', price: '9800', priceCurrency: 'JPY', name: '〜10室プラン', billingIncrement: 1, unitCode: 'MON' },
            { '@type': 'UnitPriceSpecification', price: '19800', priceCurrency: 'JPY', name: '〜30室プラン', billingIncrement: 1, unitCode: 'MON' },
            { '@type': 'UnitPriceSpecification', price: '29800', priceCurrency: 'JPY', name: '無制限プラン', billingIncrement: 1, unitCode: 'MON' },
          ],
        },
        publisher: {
          '@type': 'Organization',
          name: 'NextraLabs',
          url: 'https://membership-site-nextralabos.vercel.app',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '初期費用はかかりますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '初期費用は0円です。月額料金のみで導入でき、¥9,800/月（〜10室）からご利用いただけます。導入サポートも含まれています。',
            },
          },
          {
            '@type': 'Question',
            name: '対応PMSを教えてください。',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '主要なクラウド型PMSとのAPI連携に対応しています。具体的な対応PMS一覧はお問い合わせください。スクレイピング不要のAPI連携で、予約・客室ステータスをリアルタイム同期します。',
            },
          },
          {
            '@type': 'Question',
            name: '対応しているスマートロックの種類は？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bluetooth・NFC・PIN対応の主要スマートロックに対応しています。ご利用中の機器がある場合は事前にお問い合わせください。',
            },
          },
          {
            '@type': 'Question',
            name: '旅館業法に準拠していますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'はい。旅館業法が定める宿泊者名簿の記録要件をデジタルで完全充足します。身分証スキャン・電子署名・宿泊記録の自動保存により、行政提出用データをワンクリックで出力可能です。',
            },
          },
          {
            '@type': 'Question',
            name: 'サポート体制はどうなっていますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'メールサポートは平日10〜18時に対応しています。プレミアムプランではオンボーディングサポートと専任担当者によるフォローアップが含まれます。',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#050507]">
        <NextraAiLP />
      </div>
    </>
  )
}
