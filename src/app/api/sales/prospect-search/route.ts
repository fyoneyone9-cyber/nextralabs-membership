import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

interface Prospect {
  place_id: string
  name: string
  address: string
  phone: string | null
  website: string | null
  email: string | null
  rating: number | null
}

// ── Places API (New) で施設検索 ──────────────────────────
async function searchWithPlacesNew(category: string, region: string): Promise<Prospect[]> {
  const queryMap: Record<string, string> = {
    'ホテル・旅館': 'ホテル 旅館',
    '結婚相談所': '結婚相談所',
    '民泊・短期賃貸': '民泊 ゲストハウス',
    'その他': 'ビジネス',
  }
  const textQuery = `${queryMap[category] || category} ${region}`

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textQuery, languageCode: 'ja' }),
  })

  if (!res.ok) return []
  const data = await res.json()
  const places = data.places || []

  return places.slice(0, 10).map((p: {
    id: string
    displayName?: { text: string }
    formattedAddress?: string
    nationalPhoneNumber?: string
    websiteUri?: string
    rating?: number
  }) => ({
    place_id: p.id || '',
    name: p.displayName?.text || '',
    address: p.formattedAddress || '',
    phone: p.nationalPhoneNumber || null,
    website: p.websiteUri || null,
    email: null,
    rating: p.rating || null,
  }))
}

// ── Gemini でメアド付きリスト生成（Places API が使えない場合のフォールバック）──
async function searchWithGemini(category: string, region: string): Promise<Prospect[]> {
  const categoryJp: Record<string, string> = {
    'ホテル・旅館': 'ホテル・旅館',
    '結婚相談所': '結婚相談所',
    '民泊・短期賃貸': '民泊・ゲストハウス',
    'その他': '企業',
  }
  const cat = categoryJp[category] || category

  const prompt = `${region}にある${cat}を10件リストアップしてください。
実在する施設のみ記載し、名前・公式サイトURL・問い合わせ用メールアドレス・電話番号・住所を含めてください。
メールアドレスが不明な場合は null にしてください。

必ずJSON配列のみを返してください（前後に説明文不要）：
[
  {
    "name": "施設名",
    "address": "住所",
    "phone": "電話番号 or null",
    "website": "URL or null",
    "email": "メアド or null",
    "rating": null
  }
]`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      }),
    }
  )

  if (!res.ok) return []
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // JSONブロックを抽出
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []

  try {
    const parsed = JSON.parse(match[0]) as Array<{
      name: string
      address: string
      phone: string | null
      website: string | null
      email: string | null
      rating: number | null
    }>
    return parsed.map((item, i) => ({
      place_id: `gemini-${i}`,
      name: item.name || '',
      address: item.address || '',
      phone: item.phone || null,
      website: item.website || null,
      email: item.email || null,
      rating: item.rating || null,
    }))
  } catch {
    return []
  }
}

// ── 公式サイトからメアドをクロール ──────────────────────
async function extractEmailFromWebsite(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)' },
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const html = await res.text()
    const matches = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)
    if (!matches) return null
    const excluded = /\.(png|jpg|gif|svg|js|css|woff)|example\.|noreply|no-reply|unsubscribe|sentry|cloudflare/i
    return matches.find(e => !excluded.test(e)) || null
  } catch {
    return null
  }
}

// ── メインハンドラ ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { category, region } = await req.json()
    if (!category || !region) {
      return NextResponse.json({ error: 'category と region は必須です' }, { status: 400 })
    }

    // まず Places API (New) を試す
    let prospects = await searchWithPlacesNew(category, region)

    // Places API が使えない場合は Gemini にフォールバック
    if (prospects.length === 0) {
      console.log('Places API returned 0 results, falling back to Gemini')
      prospects = await searchWithGemini(category, region)
    }

    // メールアドレスをWebサイトから補完（並列・Places API結果のみ）
    const results = await Promise.all(
      prospects.map(async (p) => {
        // Gemini結果にメアドがあればそのまま使う
        if (p.email) return p
        // Webサイトがあればクロールして取得
        if (p.website) {
          const email = await extractEmailFromWebsite(p.website)
          return { ...p, email }
        }
        return p
      })
    )

    return NextResponse.json({ results, source: prospects[0]?.place_id?.startsWith('gemini') ? 'gemini' : 'places' })
  } catch (err) {
    console.error('prospect-search error:', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
