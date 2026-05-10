import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID!
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_GEOCODING_API_KEY!

// ─── 楽天トラベル API ─────────────────────────────────────────────────────────

interface RakutenHotel {
  hotelBasicInfo: {
    hotelNo: number
    hotelName: string
    hotelInformationUrl: string
    hotelImageUrl: string
    reviewAverage: number | null
    reviewCount: number
    hotelMinCharge: number | null
    address1: string
    address2: string
    nearestStation: string
    access: string
    latitude: number
    longitude: number
  }
}

async function searchRakutenHotels(
  destination: string,
  checkinDate: string,
  checkoutDate: string,
  adults: number,
  budget: number
): Promise<RakutenHotel[]> {
  try {
    const params = new URLSearchParams({
      applicationId: RAKUTEN_APP_ID,
      affiliateId: RAKUTEN_AFFILIATE_ID,
      format: 'json',
      keyword: destination,
      checkinDate,
      checkoutDate,
      adultNum: adults.toString(),
      maxCharge: budget.toString(),
      hits: '5',
      sort: '+hotelMinCharge',
      responseType: 'small',
    })

    const res = await fetch(
      `https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426?${params}`,
      { headers: { 'User-Agent': 'NextraLabs/1.0' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!data.hotels) return []

    return data.hotels
      .map((h: { hotelBasicInfo?: RakutenHotel['hotelBasicInfo'] }) => ({
        hotelBasicInfo: h.hotelBasicInfo,
      }))
      .filter((h: RakutenHotel) => h.hotelBasicInfo)
      .slice(0, 5)
  } catch {
    return []
  }
}

// ─── Google Places API ────────────────────────────────────────────────────────

interface PlaceResult {
  name: string
  vicinity: string
  rating: number
  types: string[]
  photoRef?: string
  placeId: string
}

async function searchNearbyAttractions(
  destination: string,
  category: string
): Promise<PlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) return []
  try {
    // まずGeocoding で座標取得
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${GOOGLE_PLACES_API_KEY}&language=ja`
    )
    const geoData = await geoRes.json()
    if (!geoData.results?.length) return []
    const { lat, lng } = geoData.results[0].geometry.location

    // 近隣スポット検索
    const typeMap: Record<string, string> = {
      観光地: 'tourist_attraction',
      グルメ: 'restaurant',
      自然: 'park',
      ショッピング: 'shopping_mall',
      温泉: 'spa',
      神社仏閣: 'place_of_worship',
    }
    const placeType = typeMap[category] || 'tourist_attraction'

    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=${placeType}&key=${GOOGLE_PLACES_API_KEY}&language=ja`
    )
    const placesData = await placesRes.json()
    if (!placesData.results) return []

    return placesData.results
      .slice(0, 8)
      .map((p: { name: string; vicinity: string; rating?: number; types: string[]; photos?: Array<{ photo_reference: string }>; place_id: string }) => ({
        name: p.name,
        vicinity: p.vicinity,
        rating: p.rating || 0,
        types: p.types,
        photoRef: p.photos?.[0]?.photo_reference,
        placeId: p.place_id,
      }))
  } catch {
    return []
  }
}

// ─── Gemini AI 旅程生成 ───────────────────────────────────────────────────────

async function generateItineraryWithGemini(
  destination: string,
  days: number,
  adults: number,
  purpose: string,
  hotels: RakutenHotel[],
  attractions: PlaceResult[]
): Promise<string> {
  const hotelSummary = hotels
    .map(
      (h, i) =>
        `${i + 1}. ${h.hotelBasicInfo.hotelName}（${h.hotelBasicInfo.address1}${h.hotelBasicInfo.address2}）最安: ¥${(h.hotelBasicInfo.hotelMinCharge ?? 0).toLocaleString()}/泊`
    )
    .join('\n')

  const attractionSummary = attractions
    .map((a, i) => `${i + 1}. ${a.name}（評価: ${a.rating > 0 ? a.rating : 'N/A'}）`)
    .join('\n')

  const prompt = `あなたはプロの旅行コンシェルジュです。以下の情報を元に、実用的で魅力的な旅程を日本語で作成してください。

【旅行先】${destination}
【日数】${days}泊${days + 1}日
【人数】${adults}名
【旅行目的・テーマ】${purpose}

【候補ホテル（楽天トラベル）】
${hotelSummary || '（ホテル情報取得中）'}

【周辺観光スポット（Google Maps）】
${attractionSummary || '（スポット情報取得中）'}

以下の形式で旅程を作成してください：

## ✈️ ${destination} ${days}泊${days + 1}日 旅程

### おすすめ宿泊先
（候補ホテルから1〜2件をピックアップして理由とともに紹介）

### 旅程詳細
#### 1日目
- 午前：（具体的な観光スポット・移動手段を記載）
- 午後：
- 夕方・夜：

（2日目以降も同様のフォーマットで）

### 💡 旅のコツ・現地情報
（移動・グルメ・注意点など3〜5項目）

### 💰 概算予算
（交通費・宿泊費・食費・観光費の目安）

---
文章は親しみやすく、旅の楽しさが伝わるよう書いてください。マークダウン形式で出力してください。`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    }
  )
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '旅程の生成に失敗しました。'
}

// ─── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // 1日5回制限チェック（スタンダード以上）
    const today = new Date().toISOString().split('T')[0]
    const { data: usageLogs } = await supabase
      .from('tool_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', 'travel-concierge')
      .gte('created_at', `${today}T00:00:00.000Z`)

    const usageCount = usageLogs?.length ?? 0
    if (usageCount >= 5) {
      return NextResponse.json(
        { error: '本日の利用上限（1日5回）に達しました。明日またお試しください。' },
        { status: 429 }
      )
    }

    // リクエスト取得
    const { destination, checkinDate, checkoutDate, adults, budget, purpose, attractionCategory } =
      await req.json()

    if (!destination || !checkinDate || !checkoutDate) {
      return NextResponse.json({ error: '必須項目（目的地・日程）を入力してください' }, { status: 400 })
    }

    // 並列でデータ取得
    const [hotels, attractions] = await Promise.all([
      searchRakutenHotels(destination, checkinDate, checkoutDate, adults || 2, budget || 20000),
      searchNearbyAttractions(destination, attractionCategory || '観光地'),
    ])

    // チェックアウト日とチェックイン日の差（泊数）
    const days = Math.max(
      1,
      Math.round(
        (new Date(checkoutDate).getTime() - new Date(checkinDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    )

    // Gemini で旅程生成
    const itinerary = await generateItineraryWithGemini(
      destination,
      days,
      adults || 2,
      purpose || '観光・リフレッシュ',
      hotels,
      attractions
    )

    // 使用ログ記録
    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: 'travel-concierge',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      hotels: hotels.map((h) => ({
        name: h.hotelBasicInfo.hotelName,
        url: h.hotelBasicInfo.hotelInformationUrl,
        imageUrl: h.hotelBasicInfo.hotelImageUrl,
        rating: h.hotelBasicInfo.reviewAverage,
        reviewCount: h.hotelBasicInfo.reviewCount,
        minCharge: h.hotelBasicInfo.hotelMinCharge,
        address: `${h.hotelBasicInfo.address1}${h.hotelBasicInfo.address2}`,
        nearestStation: h.hotelBasicInfo.nearestStation,
      })),
      attractions: attractions.map((a) => ({
        name: a.name,
        vicinity: a.vicinity,
        rating: a.rating,
        photoRef: a.photoRef,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${a.placeId}`,
      })),
      itinerary,
      remainingToday: 5 - usageCount - 1,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '旅程の生成中にエラーが発生しました' }, { status: 500 })
  }
}
