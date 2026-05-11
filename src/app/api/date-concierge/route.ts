import { NextRequest, NextResponse } from 'next/server'

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

// ── Geocoding ────────────────────────────────────────────────────────────────

async function geocode(address: string, apiKey: string): Promise<GeoResult | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=ja&region=JP`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status === 'OK' && data.results?.[0]) {
      const loc = data.results[0].geometry.location
      return { lat: loc.lat, lng: loc.lng }
    }
    return null
  } catch {
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

// ── 楽天グルメAPIの予算コード ─────────────────────────────────────────────────

function budgetCode(budget: number): string {
  if (budget <= 3000) return 'B011'
  if (budget <= 5000) return 'B013'
  if (budget <= 8000) return 'B014'
  if (budget <= 10000) return 'B016'
  return 'B017'
}

// ── 楽天グルメ検索 ────────────────────────────────────────────────────────────

async function searchRestaurant(
  lat: number,
  lng: number,
  budget: number,
  privateRoom: boolean,
  appId: string
): Promise<RestaurantResult | null> {
  try {
    const params = new URLSearchParams({
      applicationId: appId,
      latitude: String(lat),
      longitude: String(lng),
      searchRadius: '3',
      hits: '10',
      sort: '-reviewAverage',
      budgetDinner: budgetCode(budget),
      format: 'json',
    })
    if (privateRoom) {
      params.set('privateRoom', '1')
    }
    const url = `https://app.rakuten.co.jp/services/api/Gourmet/RestaurantSearch/20131123?${params}`
    const res = await fetch(url)
    const data = await res.json()

    const restaurants = data?.SearchResult?.Restaurants?.Restaurant
    if (!restaurants || restaurants.length === 0) return null

    // 評価4.0以上を優先、なければ最上位を返す
    const sorted = [...restaurants].sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      (Number(b.reviewAverage) || 0) - (Number(a.reviewAverage) || 0)
    )
    const r = sorted[0]

    return {
      name: r.name || '',
      address: r.address || '',
      genre: r.genreCategory?.middleGenreCategory?.middleGenreCategoryName || r.genreCategory?.middleGenreCategoryName || 'レストラン',
      budget: `¥${r.budgetDinner || '〜'}`,
      rating: Number(r.reviewAverage) || 0,
      reviewCount: Number(r.reviewCount) || 0,
      url: r.couponUrls?.sp || r.couponUrls?.pc || `https://r.gnavi.co.jp/${r.id}/`,
      imageUrl: r.imageUrl?.shop_image1 || undefined,
      privateRoom: Number(r.privateRoom) === 1,
      lat: Number(r.latitude) || lat,
      lng: Number(r.longitude) || lng,
    }
  } catch {
    return null
  }
}

// ── Google Places スポット検索 ────────────────────────────────────────────────

async function searchSpots(lat: number, lng: number, apiKey: string): Promise<SpotResult[]> {
  try {
    const types = ['park', 'tourist_attraction']
    const results: SpotResult[] = []

    for (const type of types) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${apiKey}&language=ja`
      const res = await fetch(url)
      const data = await res.json()

      if (data.results) {
        for (const place of data.results) {
          if ((place.rating || 0) >= 3.8 && results.length < 4) {
            results.push({
              name: place.name || '',
              type: type === 'park' ? '公園' : '観光スポット',
              rating: place.rating || 0,
              address: place.vicinity || '',
              placeId: place.place_id || '',
              lat: place.geometry?.location?.lat || lat,
              lng: place.geometry?.location?.lng || lng,
            })
          }
        }
      }
      if (results.length >= 3) break
    }

    return results.slice(0, 3)
  } catch {
    return []
  }
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
    ? `レストラン: ${restaurant.name}（${restaurant.genre}、評価${restaurant.rating}、${restaurant.budget}）`
    : 'レストランは未定'
  const spotsInfo = spots.length > 0
    ? `スポット: ${spots.map(s => s.name).join('、')}`
    : 'スポットなし'

  const prompt = `以下の情報を元に、カップルの${moodText}のタイムラインをJSON形式で生成してください。

開始時刻: ${startTime}
${restaurantInfo}
${spotsInfo}

要件:
- timelineは4〜6件
- 各アイテム: time(HH:MM形式), activity(短い活動名), location(場所名), note(1文のアドバイス)
- coupleMessage: 今日のデートへの気持ちを高める一言メッセージ（2文、絵文字使用可）
- 移動・食事・散策を自然な流れで構成
- 日本語で回答

JSON形式のみ返してください:
{
  "timeline": [
    {"time": "18:00", "activity": "集合", "location": "最寄り駅", "note": ""},
    ...
  ],
  "coupleMessage": "..."
}`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        timeline: parsed.timeline || [],
        coupleMessage: parsed.coupleMessage || 'ふたりで素敵な時間を過ごしてください！',
      }
    }
  } catch {
    // フォールバック
  }

  // フォールバックタイムライン
  const [h, m] = startTime.split(':').map(Number)
  const addMinutes = (base: number, baseM: number, mins: number) => {
    const total = base * 60 + baseM + mins
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  }
  const t0 = startTime
  const t1 = addMinutes(h, m, 30)
  const t2 = addMinutes(h, m, 120)
  const t3 = addMinutes(h, m, 180)

  return {
    timeline: [
      { time: t0, activity: '集合', location: '中間地点の最寄り駅', note: '少し早めに着いて余裕を持って' },
      { time: t1, activity: '夕食・ディナー', location: restaurant?.name || '厳選レストラン', note: 'ゆっくりと食事を楽しんで' },
      { time: t2, activity: '散策', location: spots[0]?.name || '周辺スポット', note: '食後の散歩で距離を縮めて' },
      { time: t3, activity: '夜景・締め', location: spots[1]?.name || '夜景スポット', note: '素敵な夜のフィナーレを' },
    ],
    coupleMessage: 'ふたりの距離をゼロにする最高のコースです。✨ 素敵な時間を過ごしてください！',
  }
}

// ── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
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

    const geoKey = process.env.GOOGLE_GEOCODING_API_KEY || ''
    const placesKey = process.env.GOOGLE_PLACES_API_KEY || ''
    const rakutenAppId = process.env.RAKUTEN_APP_ID || ''
    const geminiKey = process.env.GEMINI_API_KEY || ''

    // 1. Geocoding
    const [coordA, coordB] = await Promise.all([
      geocode(myLocation, geoKey),
      geocode(partnerLocation, geoKey),
    ])

    if (!coordA || !coordB) {
      return NextResponse.json({ error: '住所の検索に失敗しました。具体的な駅名や住所を入力してください。' }, { status: 400 })
    }

    // 2. 中間地点
    const mid = midpoint(coordA, coordB)

    // 3. 並列実行: レストラン + スポット
    const [restaurant, spots] = await Promise.all([
      searchRestaurant(mid.lat, mid.lng, budget, privateRoom, rakutenAppId),
      searchSpots(mid.lat, mid.lng, placesKey),
    ])

    // 4. タイムライン
    const { timeline, coupleMessage } = await generateTimeline(
      restaurant,
      spots,
      mood,
      startTime,
      geminiKey
    )

    return NextResponse.json({
      midpoint: mid,
      restaurant,
      spots,
      timeline,
      coupleMessage,
    })
  } catch (error) {
    console.error('date-concierge error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
