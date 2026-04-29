import { NextRequest, NextResponse } from 'next/server'

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || ''
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY || ''

const CONDITION_MAP: Record<string, string> = {
  '新品': '新品',
  '未使用に近い': '未使用に近い',
  '目立った傷や汚れなし': '目立った傷や汚れなし',
  'やや傷や汚れあり': 'やや傷や汚れあり',
  '傷や汚れあり': '傷や汚れあり',
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

function extractCondition(title: string, desc: string): string {
  const text = title + ' ' + desc
  if (text.includes('新品') || text.includes('未使用') || text.includes('タグ付き')) return '新品'
  if (text.includes('美品') || text.includes('極美')) return '未使用に近い'
  if (text.includes('良品') || text.includes('良好')) return '目立った傷や汚れなし'
  if (text.includes('傷') || text.includes('汚れ') || text.includes('ジャンク')) return '傷や汚れあり'
  return 'やや傷や汚れあり'
}

function extractSize(title: string): string {
  const m = title.match(/\b(XXS|XS|S|M|L|XL|XXL|XXXL|FREE|F)\b/i)
  return m ? m[1].toUpperCase() : 'FREE'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand') || ''
  const keywords = searchParams.get('keywords') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const condition = searchParams.get('condition') || ''

  // Build search keyword
  const searchKeyword = [brand, keywords, '古着 ヴィンテージ'].filter(Boolean).join(' ')

  // If no API keys, fall back to mock data
  if (!RAKUTEN_APP_ID) {
    return fallbackMockSearch(brand, keywords, minPrice, maxPrice, condition)
  }

  try {
    const params = new URLSearchParams({
      applicationId: RAKUTEN_APP_ID,
      keyword: searchKeyword,
      genreId: '551177', // メンズファッション > 古着
      hits: '30',
      sort: '-updateTimestamp',
      imageFlag: '1',
    })
    if (RAKUTEN_ACCESS_KEY) params.set('accessKey', RAKUTEN_ACCESS_KEY)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const res = await fetch(
      `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?${params.toString()}`,
      { next: { revalidate: 300 } } // cache 5 min
    )

    if (!res.ok) {
      console.error('Rakuten API error:', res.status, await res.text())
      return fallbackMockSearch(brand, keywords, minPrice, maxPrice, condition)
    }

    const data = await res.json()
    const items = (data.Items || []).map((wrapper: any, i: number) => {
      const item = wrapper.Item || wrapper
      const title = item.itemName || ''
      const desc = item.itemCaption || ''
      const price = item.itemPrice || 0
      const itemCondition = extractCondition(title, desc)
      const size = extractSize(title)
      const gradient = GRADIENTS[i % GRADIENTS.length]
      const brandName = brand || (item.shopName || 'Unknown')
      const rarity = Math.min(100, Math.floor(Math.random() * 60 + 20))

      // Estimate market price (10-40% markup for vintage)
      const markup = 1.1 + Math.random() * 0.3
      const marketPrice = Math.round(price * markup / 100) * 100

      return {
        id: item.itemCode || `rk-${i}`,
        title,
        brand: brandName,
        price,
        marketPrice,
        condition: itemCondition,
        size,
        listedAt: new Date().toISOString(),
        rarity,
        aiScore: 0,
        gradientFrom: gradient[0],
        gradientTo: gradient[1],
        initials: brandName.substring(0, 2).toUpperCase(),
        description: desc.substring(0, 120),
        category: 'トップス',
        listingUrl: item.itemUrl || '',
        source: 'rakuten',
      }
    })

    // Filter by condition if specified
    const filtered = condition && condition !== 'all'
      ? items.filter((item: any) => item.condition === condition)
      : items

    return NextResponse.json({
      items: filtered,
      total: filtered.length,
      source: 'rakuten',
      query: { brand, keywords, minPrice, maxPrice, condition },
    })
  } catch (err) {
    console.error('Rakuten API fetch error:', err)
    return fallbackMockSearch(brand, keywords, minPrice, maxPrice, condition)
  }
}

// ==================== Fallback Mock ====================
function fallbackMockSearch(brand: string, keywords: string, minPrice: string, maxPrice: string, condition: string) {
  const BRANDS = [
    'Supreme', 'NIKE Vintage', 'Stüssy', 'KAPITAL', 'UNDERCOVER',
    'Needles', 'Patagonia', 'THE NORTH FACE', 'A BATHING APE',
    'COMME des GARÇONS', 'visvim', 'Yohji Yamamoto',
  ]
  const CONDITIONS = ['新品', '未使用に近い', '目立った傷や汚れなし', 'やや傷や汚れあり', '傷や汚れあり']
  const SIZES = ['S', 'M', 'L', 'XL', 'FREE']
  const TEMPLATES: Record<string, string[]> = {
    'Supreme': ['Box Logo Tee', 'Box Logo Hoodie', 'Camp Cap'],
    'NIKE Vintage': ['90s スウッシュTee', 'ACG ジャケット', 'Air Max 95 OG'],
    'Stüssy': ['ワールドツアーTee', '8 Ball Tee', 'ストックロゴ パーカー'],
  }

  const seed = Date.now()
  let s = seed
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }

  const min = parseInt(minPrice) || 0
  const max = parseInt(maxPrice) || 999999
  const items = []

  for (let i = 0; i < 25; i++) {
    const b = brand ? BRANDS.find(x => x.toLowerCase().includes(brand.toLowerCase())) || BRANDS[0] : BRANDS[Math.floor(rand() * BRANDS.length)]
    const templates = TEMPLATES[b] || [`${b} ヴィンテージ`]
    const title = templates[Math.floor(rand() * templates.length)]
    const price = Math.round((2000 + rand() * 48000) / 100) * 100
    if (price < min || price > max) continue
    const marketPrice = Math.round(price * (1.1 + rand() * 0.4) / 100) * 100
    const cond = CONDITIONS[Math.floor(rand() * CONDITIONS.length)]
    if (condition && condition !== 'all' && cond !== condition) continue
    const gradient = GRADIENTS[i % GRADIENTS.length]

    items.push({
      id: `mock-${i}`,
      title,
      brand: b,
      price,
      marketPrice,
      condition: cond,
      size: SIZES[Math.floor(rand() * SIZES.length)],
      listedAt: new Date(Date.now() - Math.floor(rand() * 48) * 3600000).toISOString(),
      rarity: Math.floor(rand() * 100),
      aiScore: 0,
      gradientFrom: gradient[0],
      gradientTo: gradient[1],
      initials: b.substring(0, 2).toUpperCase(),
      description: 'ヴィンテージ品。状態は写真をご確認ください。',
      category: 'トップス',
      listingUrl: `https://jp.mercari.com/search?keyword=${encodeURIComponent(b + ' ' + title)}`,
      source: 'mock',
    })
  }

  return NextResponse.json({
    items,
    total: items.length,
    source: 'mock',
    query: { brand, keywords, minPrice, maxPrice, condition },
  })
}
