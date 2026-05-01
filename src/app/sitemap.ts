import { MetadataRoute } from 'next'

const BASE = 'https://membership-site-nextralabos.vercel.app'
const products = [
  'exam-scheduler',
  'pet-translator',
  'vintage-hunter',
  'office-politics-graph',
  'shio-taiou',
  'moving-checker',
  'scam-defender',
  'money-guard',
  'disaster-guard',
  'shopping-stopper',
  'ai-konkatsu',
  'comm-coach',
  'closet-coach',
  'sns-auto-poster',
  'ai-sidejob',
  'inbox-organizer',
  'prompt-master',
  'youtube-producer',
  'location-finder',
  'ticket-scout',
  'buzz-writer',
  'ai-report-generator',
  'ai-select-shop',
  'resignation-assistant',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...products.map(id => ({
      url: `${BASE}/products/${id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
