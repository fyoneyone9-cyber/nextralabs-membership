/**
 * 製品ページ用の構造化データ（JSON-LD）コンポーネント
 * 各製品LPページに追加して検索結果でのリッチスニペットを有効化する
 */

interface ProductJsonLdProps {
  name: string
  description: string
  url: string
  price?: string
  priceCurrency?: string
  ratingValue?: string
  reviewCount?: string
  image?: string
  category?: string
  applicationCategory?: string
}

export function ProductJsonLd({
  name,
  description,
  url,
  price = '0',
  priceCurrency = 'JPY',
  ratingValue = '4.8',
  reviewCount = '100',
  image = 'https://nextralab.jp/og-image.png',
  category = 'AIツール',
  applicationCategory = 'ProductivityApplication',
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    image,
    applicationCategory,
    operatingSystem: 'Web',
    inLanguage: 'ja-JP',
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'NextraLabs',
        url: 'https://nextralab.jp',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NextraLabs',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nextralab.jp/icon.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * FAQページ用の構造化データ
 */
interface FaqItem {
  question: string
  answer: string
}

interface FaqJsonLdProps {
  faqs: FaqItem[]
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * BreadcrumbリストのJSON-LD
 */
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
