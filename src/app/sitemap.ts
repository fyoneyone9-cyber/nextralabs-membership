import { MetadataRoute } from 'next'

const BASE = 'https://membership-site-nextralabos.vercel.app'

// 全製品一覧（LP page + app page 両方）
const PRODUCTS = [
  // ライフ系
  'scam-defender',
  'money-guard',
  'disaster-guard',
  'shopping-stopper',
  'moving-checker',
  'loan-advisor',
  // 副業・ビジネス系
  'ai-sidejob',
  'kindle-factory',
  'kdp-guide',
  'prompt-master',
  'sns-auto-poster',
  'youtube-producer',
  'youtube-coordinator',
  'ai-select-shop',
  'buzz-writer',
  'resignation-assistant',
  // 教育・資格系
  'exam-scheduler',
  'ai-exam-generator',
  // ホーム・ガーデン
  'smart-gardening',
  'closet-coach',
  // コミュニケーション
  'comm-coach',
  'inbox-organizer',
  // 旅行・ホテル
  'staysee-ai-finder',
  'nextra-ai',
  'location-finder',
  // ツール系
  'universal-converter',
  'ai-recipe',
  'pet-translator',
  'buy-smart-nav',
  'shio-taiou',
]

// 静的ページ
const STATIC_PAGES = [
  { path: '', priority: 1.0, changeFreq: 'daily' as const },
  { path: '/products', priority: 0.95, changeFreq: 'daily' as const },
  { path: '/pricing', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/contact', priority: 0.6, changeFreq: 'monthly' as const },
  { path: '/privacy', priority: 0.4, changeFreq: 'yearly' as const },
  { path: '/terms', priority: 0.4, changeFreq: 'yearly' as const },
  { path: '/tokusho', priority: 0.4, changeFreq: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // 静的ページ
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority, changeFreq }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }))

  // 各製品のLPページ
  const productLpEntries: MetadataRoute.Sitemap = PRODUCTS.map((id) => ({
    url: `${BASE}/products/${id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // /app ページはログイン必須のため意図的にサイトマップから除外（noindex設定済み）

  return [...staticEntries, ...productLpEntries]
}
