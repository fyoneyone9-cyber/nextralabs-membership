import { NextRequest, NextResponse } from 'next/server'

const BRANDS = [
  'Supreme', 'NIKE Vintage', 'Stüssy', 'KAPITAL', 'UNDERCOVER',
  'Needles', 'Patagonia', 'THE NORTH FACE', 'A BATHING APE',
  'COMME des GARÇONS', 'visvim', 'Yohji Yamamoto', 'ISSEY MIYAKE',
  "Levi's", 'Ralph Lauren', 'Champion', 'Carhartt', 'Dickies',
]

const CATEGORIES = ['トップス', 'ボトムス', 'アウター', 'アクセサリー', 'シューズ']

const CONDITIONS = [
  '新品', '未使用に近い', '目立った傷や汚れなし', 'やや傷や汚れあり', '傷や汚れあり',
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE']

const ITEM_TEMPLATES: Record<string, string[]> = {
  'Supreme': [
    'Box Logo Tee', 'Box Logo Hoodie', 'Camp Cap', 'Shoulder Bag', 'Backpack',
    'Beanie', 'Work Pants', 'Coaches Jacket', 'S Logo Cap', 'Bandana BOGOパーカー',
  ],
  'NIKE Vintage': [
    '90s スウッシュTee', 'ACG ジャケット', 'Air Max 95 OG', 'Windbreaker',
    'ナイロンジャケット 銀タグ', 'トラックジャケット', '白タグ スウェット',
  ],
  'Stüssy': [
    'ワールドツアーTee', '8 Ball Tee', 'ストックロゴ パーカー',
    'ナイロンジャケット', 'バケットハット', 'オールドステューシー ロンT',
  ],
  'KAPITAL': [
    'ボーン刺繍 デニム', 'リンガーTee', 'フリースジャケット', 'スカジャン',
    'バンダナ パッチワーク', 'インディゴ染め カーディガン',
  ],
  'UNDERCOVER': [
    'SCAB期 Tee', 'BUT BEAUTIFUL II ジャケット', 'GORE-TEX コート',
    'プリントパーカー', '名作期 スウェット', 'JOY DIVISION コラボ',
  ],
  'Needles': [
    'トラックパンツ パピヨン', 'Rebuild フランネル', 'アシンメトリーシャツ',
    'ブーツカット パンツ', 'ベルベット ジャケット',
  ],
  'Patagonia': [
    'レトロX ジャケット', 'シンチラ フリース', 'バギーズ ショーツ',
    'ナノパフ ベスト', 'R2 ジャケット', 'ダウンセーター',
  ],
  'THE NORTH FACE': [
    'バルトロライト ジャケット', 'ヌプシ ダウンベスト', 'マウンテンジャケット',
    'デナリフリース', 'ゴアテックス マウンテンパーカー', '90s ヌプシ US規格',
  ],
}

const GRADIENTS = [
  ['#f59e0b', '#ea580c'],
  ['#8b5cf6', '#6d28d9'],
  ['#10b981', '#059669'],
  ['#3b82f6', '#1d4ed8'],
  ['#ec4899', '#be185d'],
  ['#ef4444', '#b91c1c'],
  ['#14b8a6', '#0d9488'],
  ['#f97316', '#c2410c'],
  ['#a855f7', '#7c3aed'],
  ['#06b6d4', '#0891b2'],
]

const DESCRIPTIONS: string[] = [
  'ヴィンテージ感のある非常に良い状態。サイズ感も現代的で着用しやすい一着。',
  '希少な年代もので、市場に出回ることが少ないレアピース。状態も良好。',
  'デッドストック級の美品。タグ付きで保管状態も良い。コレクター垂涎のアイテム。',
  '使用感はあるものの、ヴィンテージならではの味わい。リペア不要でそのまま着用可能。',
  '定番の人気モデル。サイズ欠けが多い中、貴重なサイズが出品中。',
  '90年代の黄金期モデル。当時のディテールがしっかり残っている良品。',
  'オリジナルのプリントが鮮明に残る良コンディション。カラーも人気の配色。',
  '日本未発売のUS規格。国内では入手困難な希少品。',
]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand') || ''
  const keywords = searchParams.get('keywords') || ''
  const minPrice = parseInt(searchParams.get('minPrice') || '0') || 0
  const maxPrice = parseInt(searchParams.get('maxPrice') || '999999') || 999999
  const condition = searchParams.get('condition') || ''

  // Seed based on search params for consistent but varied results
  const seedStr = `${brand}${keywords}${Date.now().toString().slice(0, -4)}`
  let seedNum = 0
  for (let i = 0; i < seedStr.length; i++) seedNum = ((seedNum << 5) - seedNum + seedStr.charCodeAt(i)) | 0
  const random = seededRandom(Math.abs(seedNum))

  // Determine which brands to include
  let targetBrands = BRANDS
  if (brand) {
    const searchBrand = brand.toLowerCase()
    targetBrands = BRANDS.filter(b => b.toLowerCase().includes(searchBrand))
    if (targetBrands.length === 0) targetBrands = BRANDS // fallback
  }

  const numResults = 20 + Math.floor(random() * 30) // 20-50 results
  const items = []

  for (let i = 0; i < numResults; i++) {
    const itemBrand = targetBrands[Math.floor(random() * targetBrands.length)]
    const templates = ITEM_TEMPLATES[itemBrand] || [`${itemBrand} ヴィンテージアイテム`]
    let title = templates[Math.floor(random() * templates.length)]

    // Add keyword relevance
    if (keywords) {
      const kw = keywords.split(/[,\s]+/).filter(Boolean)
      if (kw.length > 0 && random() > 0.3) {
        title = `${title} ${kw[Math.floor(random() * kw.length)]}`
      }
    }

    const basePrice = 2000 + Math.floor(random() * 48000)
    const marketMultiplier = 0.8 + random() * 1.5
    const marketPrice = Math.round(basePrice * marketMultiplier / 100) * 100
    const price = Math.round(basePrice / 100) * 100

    const itemCondition = CONDITIONS[Math.floor(random() * CONDITIONS.length)]
    const size = SIZES[Math.floor(random() * SIZES.length)]
    const category = CATEGORIES[Math.floor(random() * CATEGORIES.length)]
    const rarity = Math.floor(random() * 100)

    // Listed time: within last 48 hours
    const hoursAgo = Math.floor(random() * 48)
    const listedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    const gradient = GRADIENTS[Math.floor(random() * GRADIENTS.length)]
    const initials = itemBrand.substring(0, 2).toUpperCase()
    const description = DESCRIPTIONS[Math.floor(random() * DESCRIPTIONS.length)]

    // Filter by price
    if (price < minPrice || price > maxPrice) continue
    // Filter by condition
    if (condition && condition !== 'all' && itemCondition !== condition) continue

    // Generate a mercari-style listing URL
    const listingUrl = `https://jp.mercari.com/search?keyword=${encodeURIComponent(itemBrand + ' ' + title)}`

    items.push({
      id: `vh-${i}-${seedNum}`,
      title,
      brand: itemBrand,
      price,
      marketPrice,
      condition: itemCondition,
      size,
      listedAt,
      rarity,
      aiScore: 0, // calculated client-side
      gradientFrom: gradient[0],
      gradientTo: gradient[1],
      initials,
      description,
      category,
      listingUrl,
    })
  }

  return NextResponse.json({
    items,
    total: items.length,
    query: { brand, keywords, minPrice, maxPrice, condition },
  })
}
