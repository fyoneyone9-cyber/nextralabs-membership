import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY!
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

// YouTube video ID を URL から抽出
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

// YouTube サムネイル URL 一覧（3枚）— 異なるタイムスタンプのフレームを取得
function getThumbnailUrls(videoId: string): string[] {
  // 0.jpg=先頭フレーム, 1.jpg=1/4地点, 2.jpg=2/4地点, 3.jpg=3/4地点
  // maxresdefaultは存在しない動画では404→hqdefaultと同じ画像になるため使用しない
  return [
    `https://img.youtube.com/vi/${videoId}/1.jpg`,
    `https://img.youtube.com/vi/${videoId}/2.jpg`,
    `https://img.youtube.com/vi/${videoId}/3.jpg`,
  ]
}

// Gemini Vision で画像を解析して場所情報を抽出
async function analyzeImagesWithGemini(imageUrls: string[]): Promise<string> {
  const parts: object[] = [
    {
      text: `あなたは場所特定の専門家です。以下の画像（YouTubeのサムネイル）を分析し、撮影場所を特定してください。

以下の情報を日本語で抽出・推定してください：
1. 建物・施設名（看板・外観から）
2. 周辺の地名・ランドマーク
3. 地域・都市名
4. 国名
5. 推定される具体的な住所または場所名（Google Mapsで検索できる形式で）
6. 特定の根拠（どの視覚的要素から判断したか）

最後に必ず以下の形式で出力してください：
LOCATION_QUERY: [Google Maps検索用クエリ（英語または日本語）]
CONFIDENCE: [高/中/低]
REASON: [特定根拠の要約]`,
    },
  ]

  for (const url of imageUrls) {
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: await fetchImageAsBase64(url),
      },
    })
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    }
  )
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// 画像URLをBase64に変換
async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  return Buffer.from(buffer).toString('base64')
}

// Geocoding API で座標取得
async function geocode(query: string): Promise<{ lat: number; lng: number; formatted: string } | null> {
  const encoded = encodeURIComponent(query)
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GEOCODING_API_KEY}&language=ja`
  )
  const data = await res.json()
  if (data.results?.length > 0) {
    const loc = data.results[0].geometry.location
    return {
      lat: loc.lat,
      lng: loc.lng,
      formatted: data.results[0].formatted_address,
    }
  }
  return null
}

// Places API でより詳細な場所情報を取得
async function searchPlace(query: string, lat: number, lng: number): Promise<{ name: string; address: string; placeId: string } | null> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=5000&key=${PLACES_API_KEY}&language=ja`
  )
  const data = await res.json()
  if (data.results?.length > 0) {
    const place = data.results[0]
    return {
      name: place.name,
      address: place.formatted_address,
      placeId: place.place_id,
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // プレミアムチェック
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!subscription || subscription.plan !== 'premium') {
      return NextResponse.json({ error: 'プレミアムプランが必要です' }, { status: 403 })
    }

    // 1日1回制限チェック
    const today = new Date().toISOString().split('T')[0]
    const { data: usageLog } = await supabase
      .from('tool_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', 'location-finder')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .maybeSingle()

    if (usageLog) {
      return NextResponse.json({ error: '本日の利用上限（1日1回）に達しました。明日またお試しください。' }, { status: 429 })
    }

    // リクエスト取得
    const { youtubeUrl } = await req.json()
    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URLが必要です' }, { status: 400 })
    }

    const videoId = extractVideoId(youtubeUrl)
    if (!videoId) {
      return NextResponse.json({ error: '有効なYouTube URLを入力してください' }, { status: 400 })
    }

    // サムネイル取得（3枚）
    const thumbnailUrls = getThumbnailUrls(videoId)

    // Gemini Vision で解析
    const analysisText = await analyzeImagesWithGemini(thumbnailUrls)

    // LOCATION_QUERY を抽出
    const locationMatch = analysisText.match(/LOCATION_QUERY:\s*(.+)/i)
    const confidenceMatch = analysisText.match(/CONFIDENCE:\s*(.+)/i)
    const reasonMatch = analysisText.match(/REASON:\s*(.+)/i)

    const locationQuery = locationMatch?.[1]?.trim() ?? ''
    const confidence = confidenceMatch?.[1]?.trim() ?? '低'
    const reason = reasonMatch?.[1]?.trim() ?? ''

    let geocodeResult = null
    let placeResult = null

    if (locationQuery) {
      geocodeResult = await geocode(locationQuery)
      if (geocodeResult) {
        placeResult = await searchPlace(locationQuery, geocodeResult.lat, geocodeResult.lng)
      }
    }

    // 使用ログを記録
    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: 'location-finder',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      videoId,
      thumbnailUrls,
      analysis: analysisText,
      locationQuery,
      confidence,
      reason,
      geocode: geocodeResult,
      place: placeResult,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '解析中にエラーが発生しました' }, { status: 500 })
  }
}
