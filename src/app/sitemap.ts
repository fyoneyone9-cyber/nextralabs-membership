import { MetadataRoute } from 'next'

const BASE = 'https://membership-site-nextralabos.vercel.app'

// 全製品一覧（LP page + app page 両方）
const PRODUCTS = [
  // SNS・コンテンツ制作
  'sns-auto-poster',
  'ai-select-shop',
  'youtube-producer',
  'youtube-coordinator',
  'prompt-master',
  'buzz-writer',
  // 出版・AI文章生成
  'kdp-guide',
  'kindle-factory',
  // ビジネス・仕事効率化
  'inbox-organizer',
  'ai-sidejob',
  'universal-converter',
  'resignation-assistant',
  // 学習・資格
  'exam-scheduler',
  'ai-exam-generator',
  // お金・節約・防犯
  'money-guard',
  'loan-advisor',
  'shopping-stopper',
  'buy-smart-nav',
  'scam-defender',
  // ライフスタイル・日常
  'ai-recipe',
  'smart-gardening',
  'disaster-guard',
  'moving-checker',
  'gift-advisor',
  // 旅行・おでかけ・聖地巡礼
  'travel-concierge',
  'pilgrimage-planner',
  'date-concierge',
  'location-finder',
  // 宿泊・不動産DX
  'nextra-ai',
  'staysee-ai-finder',
  // 婚活・結婚相談所
  'konkatsu-scheduler',
  'omiai-room',
  'beauty-boost',
  // その他
  'ai-recipe',
  'pet-translator',
  'closet-coach',
  'comm-coach',
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
