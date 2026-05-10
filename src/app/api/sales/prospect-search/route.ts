import { NextRequest, NextResponse } from 'next/server'

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

interface Place {
  place_id: string
  name: string
  formatted_address: string
  international_phone_number?: string
  website?: string
  email?: string
  rating?: number
}

// Google Places Text Search → Place Details でメアド取得
async function searchPlaces(query: string, region: string): Promise<Place[]> {
  const searchQuery = `${query} ${region}`

  // Step1: Text Search
  const textSearchRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&language=ja&region=jp&key=${PLACES_API_KEY}`
  )
  const textSearchData = await textSearchRes.json()

  if (!textSearchData.results || textSearchData.results.length === 0) {
    return []
  }

  // Step2: 上位10件の詳細情報を取得（website/phone）
  const places: Place[] = []
  const targets = textSearchData.results.slice(0, 10)

  for (const result of targets) {
    const detailRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=name,formatted_address,website,international_phone_number,rating&language=ja&key=${PLACES_API_KEY}`
    )
    const detailData = await detailRes.json()
    const detail = detailData.result || {}

    places.push({
      place_id: result.place_id,
      name: detail.name || result.name,
      formatted_address: detail.formatted_address || result.formatted_address || '',
      international_phone_number: detail.international_phone_number,
      website: detail.website,
      rating: detail.rating || result.rating,
    })
  }

  return places
}

// WebサイトURLからメールアドレスをクロール（簡易版）
async function extractEmailFromWebsite(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs-Bot/1.0)' },
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const html = await res.text()
    // メールアドレス正規表現
    const matches = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)
    if (!matches) return null
    // 除外パターン（画像・スクリプト・no-reply等）
    const excluded = /\.(png|jpg|gif|svg|js|css|woff)|example\.|noreply|no-reply|unsubscribe|sentry|cloudflare/i
    const valid = matches.find(e => !excluded.test(e))
    return valid || null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category, region } = await req.json()
    if (!category || !region) {
      return NextResponse.json({ error: 'category と region は必須です' }, { status: 400 })
    }

    // カテゴリ→検索クエリ変換
    const queryMap: Record<string, string> = {
      'ホテル・旅館': 'ホテル 旅館',
      '結婚相談所': '結婚相談所',
      '民泊・短期賃貸': '民泊 ゲストハウス',
      'その他': 'ビジネス',
    }
    const query = queryMap[category] || category

    const places = await searchPlaces(query, region)

    // メールアドレスをWebサイトから抽出（並列）
    const results = await Promise.all(
      places.map(async (place) => {
        let email: string | null = null
        if (place.website) {
          email = await extractEmailFromWebsite(place.website)
        }
        return {
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          phone: place.international_phone_number || null,
          website: place.website || null,
          email,
          rating: place.rating || null,
        }
      })
    )

    return NextResponse.json({ results })
  } catch (err) {
    console.error('prospect-search error:', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
