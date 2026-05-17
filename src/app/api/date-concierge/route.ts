import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { checkApiLimit } from '@/lib/api-limit'

// ── 型定義 ──────────────────────────────────────────────────────────────────

interface GeoResult {
  lat: number
  lng: number
}

interface RestaurantResult {
  name: string
  address: string
  genre: string
  budget: string
  rating: number
  reviewCount: number
  url: string
  imageUrl?: string
  privateRoom: boolean
  lat: number
  lng: number
}

interface SpotResult {
  name: string
  type: string
  rating: number
  address: string
  placeId: string
  lat: number
  lng: number
}

interface TimelineItem {
  time: string
  activity: string
  location: string
  note: string
}

// ── Google APIキー解決 ────────────────────────────────────────────────────────

function getGoogleApiKey(): string {
  return (
    process.env.GOOGLE_GEOCODING_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    ''
  )
}

// ── Geocoding ────────────────────────────────────────────────────────────────

async function geocode(address: string, apiKey: string): Promise<GeoResult | null> {
  // 現在地フォーマット: "現在地:lat,lng"
  if (address.startsWith('現在地:')) {
    const [lat, lng] = address.replace('現在地:', '').split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  if (!apiKey) {
    console.error('[date-concierge] Google API key is not set')
    return null
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=ja&region=JP`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    console.log(`[date-concierge] geocode("${address}") status=${data.status}`)
    if (data.status === 'OK' && data.results?.[0]) {
      const loc = data.results[0].geometry.location
      return { lat: loc.lat, lng: loc.lng }
    }
    if (data.error_message) {
      console.error(`[date-concierge] geocode error: ${data.error_message}`)
    }
    return null
  } catch (e) {
    console.error('[date-concierge] geocode exception:', e)
    return null
  }
}

// ── 中間地点 ─────────────────────────────────────────────────────────────────

function midpoint(a: GeoResult, b: GeoResult): GeoResult {
  return {
    lat: (a.lat + b.lat) / 2,
    lng: (a.lng + b.lng) / 2,
  }
}

// ── 予算テキスト変換 ─────────────────────────────────────────────────────────

function budgetText(budget: number): string {
  if (budget <= 3000) return '〜¥3,000'
  if (budget <= 5000) return '〜¥5,000'
  if (budget <= 8000) return '〜¥8,000'
  if (budget <= 10000) return '〜¥10,000'
  return '¥10,000〜'
}

// ── ムード別検索クエリ ────────────────────────────────────────────────────────

function getMoodQuery(mood: string, privateRoom: boolean): string {
  const privText = privateRoom ? ' 個室' : ''
  const queries: Record<string, string> = {
    romantic: `ロマンチック 夜景 レストラン${privText}`,
    casual: `カフェ ランチ レストラン${privText}`,
    night: `夜景 ディナー レストラン${privText}`,
    anniversary: `記念日 特別 レストラン${privText} 高評価`,
    active: `おしゃれ カフェ レストラン${privText}`,
  }
  return queries[mood] || `レストラン${privText}`
}

// ── Google Places API (New) - レストラン検索 ─────────────────────────────────

interface PlaceResult {
  displayName?: { text: string; languageCode?: string }
  formattedAddress?: string
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  priceLevel?: string
  location?: { latitude: number; longitude: number }
  primaryTypeDisplayName?: { text: string }
  photos?: Array<{ name: string }>
}

async function searchRestaurantNew(
  lat: number,
  lng: number,
  budget: number,
  privateRoom: boolean,
  mood: string,
  apiKey: string
): Promise<RestaurantResult | null> {
  if (!apiKey) return null

  try {
    const query = getMoodQuery(mood, privateRoom)
    const body = {
      textQuery: query,
      languageCode: 'ja',
      maxResultCount: 10,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 3000.0,
        },
      },
      minRating: 3.8,
    }

    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.priceLevel,places.location,places.primaryTypeDisplayName',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()
    console.log(`[date-concierge] Places searchText status=${res.status}, places=${data.places?.length ?? 0}`)

    if (!data.places || data.places.length === 0) return null

    // 評価の高い順でソートして最上位を返す
    const sorted = [...data.places as PlaceResult[]].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    )
    const r = sorted[0]

    // 価格レベルを日本円目安に変換
    const priceLevelMap: Record<string, string> = {
      PRICE_LEVEL_FREE: '〜¥1,000',
      PRICE_LEVEL_INEXPENSIVE: '〜¥2,000',
      PRICE_LEVEL_MODERATE: '〜¥5,000',
      PRICE_LEVEL_EXPENSIVE: '〜¥10,000',
      PRICE_LEVEL_VERY_EXPENSIVE: '¥10,000〜',
    }

    return {
      name: r.displayName?.text || '未取得',
      address: r.formattedAddress || '',
      genre: r.primaryTypeDisplayName?.text || 'レストラン',
      budget: priceLevelMap[r.priceLevel || ''] || budgetText(budget),
      rating: r.rating || 0,
      reviewCount: r.userRatingCount || 0,
      url: r.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.displayName?.text || '')}`,
      privateRoom: privateRoom,
      lat: r.location?.latitude || lat,
      lng: r.location?.longitude || lng,
    }
  } catch (e) {
    console.error('[date-concierge] searchRestaurantNew error:', e)
    return null
  }
}

// ── Google Places API (New) - スポット検索 ───────────────────────────────────

async function searchSpots(lat: number, lng: number, apiKey: string): Promise<SpotResult[]> {
  if (!apiKey) return []

  const spotTypes = ['park', 'tourist_attraction', 'night_club']
  const results: SpotResult[] = []

  for (const type of spotTypes) {
    if (results.length >= 3) break
    try {
      const body = {
        includedTypes: [type],
        maxResultCount: 5,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 2000.0,
          },
        },
      }

      const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.id,places.location,places.primaryTypeDisplayName',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      })

      const data = await res.json()
      if (data.places) {
        for (const place of data.places as PlaceResult[]) {
          if ((place.rating || 0) >= 3.5 && results.length < 3) {
            results.push({
              name: place.displayName?.text || '',
              type: type === 'park' ? '公園' : type === 'night_club' ? '夜景スポット' : '観光スポット',
              rating: place.rating || 0,
              address: place.formattedAddress || '',
              placeId: '',
              lat: place.location?.latitude || lat,
              lng: place.location?.longitude || lng,
            })
          }
        }
      }
    } catch (e) {
      console.error(`[date-concierge] searchSpots(${type}) error:`, e)
    }
  }

  return results.slice(0, 3)
}

// ── Gemini タイムライン生成 ────────────────────────────────────────────────────

async function generateTimeline(
  restaurant: RestaurantResult | null,
  spots: SpotResult[],
  mood: string,
  startTime: string,
  geminiKey: string
): Promise<{ timeline: TimelineItem[]; coupleMessage: string }> {
  const moodJa: Record<string, string> = {
    romantic: 'ロマンチックな夜デート',
    casual: '昼のカジュアルデート',
    night: '夜デート×夜景',
    anniversary: '記念日特別コース',
    active: 'アクティブデート',
  }
  const moodText = moodJa[mood] || 'デート'

  const restaurantInfo = restaurant
    ? `レストラン: ${restaurant.name}（${restaurant.genre}、評価${restaurant.rating}）`
    : 'レストランは見つかりませんでした（周辺のカフェ等で代替）'
  const spotsInfo = spots.length > 0
    ? `スポット: ${spots.map(s => s.name).join('、')}`
    : '特別なスポットなし（散策コース）'

  const prompt = `以下の情報でカップルの${moodText}のタイムラインをJSON形式で生成してください。

開始時刻: ${startTime}
${restaurantInfo}
${spotsInfo}

要件:
- timelineは4〜5件
- 各: {"time":"HH:MM","activity":"短い活動名","location":"場所名","note":"1文のアドバイス"}
- coupleMessage: 今日のデートへの気持ちを高める一言（2文）
- 自然な流れで構成
- 日本語のみ

JSONのみ返してください:
{"timeline":[...],"coupleMessage":"..."}`

  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
        signal: AbortSignal.timeout(15000),
      })
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.timeline?.length > 0) {
          return { timeline: parsed.timeline, coupleMessage: parsed.coupleMessage || '' }
        }
      }
    } catch (e) {
      console.error('[date-concierge] Gemini error:', e)
    }
  }

  // フォールバックタイムライン
  const [h, m] = startTime.split(':').map(Number)
  const addMins = (mins: number) => {
    const total = h * 60 + m + mins
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  }

  return {
    timeline: [
      { time: startTime, activity: '集合', location: '中間地点の最寄り駅', note: '少し早めに着いて余裕を持って' },
      { time: addMins(30), activity: '食事', location: restaurant?.name || '厳選レストラン', note: 'ゆっくりと食事を楽しんで' },
      { time: addMins(120), activity: '散策', location: spots[0]?.name || '周辺スポット', note: '食後の散歩で距離を縮めて' },
      { time: addMins(180), activity: '夜景・締め', location: spots[1]?.name || '夜景スポット', note: '素敵な夜のフィナーレを' },
    ],
    coupleMessage: 'ふたりの距離をゼロにする最高のコースです ✨ 素敵な時間を過ごしてください！',
  }
}

// ── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 認証 + 1日5回制限
  const limitCheck = await checkApiLimit('date-concierge', 5)
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }
    return NextResponse.json({ error: '本日の利用上限（5回）に達しました。明日またお試しください。' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const {
      myLocation,
      partnerLocation,
      mood = 'romantic',
      budget = 5000,
      privateRoom = false,
      startTime = '18:00',
    } = body

    if (!myLocation || !partnerLocation) {
      return NextResponse.json({ error: '出発地を2つ入力してください' }, { status: 400 })
    }

    const apiKey = getGoogleApiKey()
    const geminiKey = process.env.GEMINI_API_KEY || ''

    console.log('[date-concierge] start', {
      myLocation, partnerLocation, mood, budget, privateRoom, startTime,
      apiKeySet: !!apiKey, geminiKeySet: !!geminiKey,
    })

    // 1. Geocoding
    const [coordA, coordB] = await Promise.all([
      geocode(myLocation, apiKey),
      geocode(partnerLocation, apiKey),
    ])

    if (!coordA) {
      return NextResponse.json({
        error: `「${myLocation}」の住所が見つかりませんでした。「新宿駅」「渋谷区道玄坂」のように具体的な駅名・住所を入力してください。`,
      }, { status: 400 })
    }
    if (!coordB) {
      return NextResponse.json({
        error: `「${partnerLocation}」の住所が見つかりませんでした。具体的な駅名や住所を入力してください。`,
      }, { status: 400 })
    }

    // 2. 中間地点
    const mid = midpoint(coordA, coordB)
    console.log(`[date-concierge] midpoint: ${mid.lat}, ${mid.lng}`)

    // 3. 並列実行: レストラン + スポット
    const [restaurant, spots] = await Promise.all([
      searchRestaurantNew(mid.lat, mid.lng, budget, privateRoom, mood, apiKey),
      searchSpots(mid.lat, mid.lng, apiKey),
    ])

    // 4. タイムライン
    const { timeline, coupleMessage } = await generateTimeline(
      restaurant, spots, mood, startTime, geminiKey
    )

    return NextResponse.json({
      midpoint: mid,
      restaurant,
      spots,
      timeline,
      coupleMessage,
    })
  } catch (error) {
    console.error('[date-concierge] fatal error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。' }, { status: 500 })
  }
}
