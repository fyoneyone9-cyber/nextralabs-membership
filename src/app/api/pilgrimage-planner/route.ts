import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_GEOCODING_API_KEY!
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID!
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID!

const TOOL_ID = 'pilgrimage-planner'
const DAILY_LIMIT = 5

// ─── YouTube Data API ──────────────────────────────────────────────────────────

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

interface VideoInfo {
  title: string
  description: string
  channelTitle: string
  tags: string[]
  thumbnails: { url: string }[]
}

async function fetchVideoInfo(videoId: string): Promise<VideoInfo | null> {
  if (!YOUTUBE_API_KEY) return null
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`
    )
    const data = await res.json()
    const item = data.items?.[0]?.snippet
    if (!item) return null
    return {
      title: item.title ?? '',
      description: item.description ?? '',
      channelTitle: item.channelTitle ?? '',
      tags: item.tags ?? [],
      thumbnails: [
        { url: item.thumbnails?.high?.url ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
        { url: item.thumbnails?.medium?.url ?? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
      ],
    }
  } catch {
    // YouTube API unavailable — fallback to thumbnail-only
    return {
      title: '',
      description: '',
      channelTitle: '',
      tags: [],
      thumbnails: [
        { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
        { url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
      ],
    }
  }
}

// ─── プリセット定義 ────────────────────────────────────────────────────────────

export const PRESETS = [
  { id: 'kimetsu', label: '鬼滅の刃', keyword: '鬼滅の刃 聖地 ロケ地', description: '竹林・大正ロマン情緒の街並み', color: 'border-red-500', emoji: '🗡️' },
    { id: 'kiminonawa', label: '君の名は', keyword: '君の名は 聖地 ロケ地 飛騨 新宿', description: '飛騨古川・新宿・諏訪湖', color: 'border-blue-400', emoji: '☄️' },
  { id: 'slamdunk', label: 'スラムダンク', keyword: 'スラムダンク 聖地 鎌倉 江ノ電', description: '鎌倉・江ノ電・湘南', color: 'border-orange-400', emoji: '🏀' },
  { id: 'spirited', label: '千と千尋', keyword: '千と千尋の神隠し 聖地 モデル地', description: '道後温泉・台湾・山梨', color: 'border-purple-400', emoji: '🏮' },
  { id: 'evangelion', label: 'エヴァンゲリオン', keyword: 'エヴァンゲリオン 聖地 箱根 宇部', description: '箱根・宇部市・鷹取山', color: 'border-green-400', emoji: '🤖' },
  { id: 'yuruyuri', label: 'ゆるキャン△', keyword: 'ゆるキャン 聖地 山梨 富士山', description: '山梨・富士山周辺', color: 'border-yellow-400', emoji: '⛺' },
]

// ─── Gemini でロケ地・聖地を特定 ───────────────────────────────────────────────

interface SacredSpot {
  name: string
  address: string
  description: string
  sceneDescription: string
  lat?: number
  lng?: number
  mapsUrl?: string
}

async function identifyHolySites(
  videoInfo: VideoInfo | null,
  keyword: string,
  presetKeyword?: string
): Promise<SacredSpot[]> {
  const context = videoInfo
    ? `タイトル: ${videoInfo.title}\nチャンネル: ${videoInfo.channelTitle}\nタグ: ${videoInfo.tags.slice(0, 10).join(', ')}\n説明文（冒頭500字）: ${videoInfo.description.slice(0, 500)}`
    : `キーワード: ${keyword}`

  const prompt = `あなたはアニメ・映画・ドラマのロケ地・聖地巡礼の専門家です。
以下の情報から、実在する聖地・ロケ地を最大5件特定してください。

${presetKeyword ? `作品キーワード: ${presetKeyword}` : ''}
${context}

各スポットについて、以下のJSON配列形式で出力してください（マークダウン不使用）：
[
  {
    "name": "スポット名（例：鎌倉高校前踏切）",
    "address": "住所（例：神奈川県鎌倉市腰越2丁目）",
    "googleMapsQuery": "Google Mapsで検索するクエリ（例：鎌倉高校前踏切 神奈川県）",
    "description": "このスポットの特徴・見どころ（50字以内）",
    "sceneDescription": "作中のどのシーンに登場するか（50字以内）"
  }
]

注意：
- 実在する場所のみ記載する（架空の場所は除外）
- 日本国内の場所を優先する
- googleMapsQueryは日本語で正確に記載する
- JSON配列のみを出力し、他のテキストは一切含めない`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    )
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    const spots = JSON.parse(jsonMatch[0])
    return spots.slice(0, 5)
  } catch {
    return []
  }
}

// ─── Google Geocoding でスポット座標取得 ──────────────────────────────────────

async function geocodeSpots(spots: SacredSpot[]): Promise<SacredSpot[]> {
  if (!GOOGLE_PLACES_API_KEY) return spots
  return Promise.all(
    spots.map(async (spot) => {
      try {
        const query = (spot as unknown as { googleMapsQuery?: string }).googleMapsQuery ?? spot.address ?? spot.name
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&language=ja`
        )
        const data = await res.json()
        if (data.results?.length > 0) {
          const loc = data.results[0].geometry.location
          return {
            ...spot,
            lat: loc.lat,
            lng: loc.lng,
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
          }
        }
      } catch { /* skip */ }
      return spot
    })
  )
}

// ─── 楽天トラベル 宿泊検索 ────────────────────────────────────────────────────

interface RakutenHotel {
  name: string
  url: string
  imageUrl: string
  rating: number | null
  reviewCount: number
  minCharge: number | null
  address: string
  nearestStation: string
}

async function searchNearbyHotels(
  destination: string,
  checkinDate: string,
  checkoutDate: string,
  adults: number,
  budget: number
): Promise<RakutenHotel[]> {
  if (!RAKUTEN_APP_ID) return []
  try {
    const params = new URLSearchParams({
      applicationId: RAKUTEN_APP_ID,
      affiliateId: RAKUTEN_AFFILIATE_ID || '',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.hotels.slice(0, 5).map((h: any) => {
      const info = h.hotelBasicInfo
      return {
        name: info.hotelName,
        url: info.hotelInformationUrl,
        imageUrl: info.hotelImageUrl,
        rating: info.reviewAverage ?? null,
        reviewCount: info.reviewCount ?? 0,
        minCharge: info.hotelMinCharge ?? null,
        address: `${info.address1}${info.address2}`,
        nearestStation: info.nearestStation ?? '',
      }
    })
  } catch {
    return []
  }
}

// ─── Gemini で旅程プラン生成 ──────────────────────────────────────────────────

async function generatePilgrimageItinerary(
  spots: SacredSpot[],
  hotels: RakutenHotel[],
  tripStyle: string,
  departure: string,
  adults: number,
  workTitle: string
): Promise<string> {
  const spotList = spots
    .map((s, i) => `${i + 1}. ${s.name}（${s.address}）— ${s.sceneDescription}`)
    .join('\n')

  const hotelList = hotels.length > 0
    ? hotels
        .map((h, i) => `${i + 1}. ${h.name} ¥${(h.minCharge ?? 0).toLocaleString()}/泊 ${h.address}`)
        .join('\n')
    : '（楽天トラベルデータなし — 一般的な宿泊先を提案）'

  const days = tripStyle === '日帰り' ? 0 : tripStyle === '1泊2日' ? 1 : 2

  const prompt = `あなたは推し活・聖地巡礼専門のツアープランナーです。
以下の聖地スポットをすべて巡る${tripStyle}の旅程を作成してください。

## 作品
${workTitle}

## 聖地スポット
${spotList}

## 宿泊候補（楽天トラベル）
${hotelList}

## 旅行条件
- 出発地：${departure}
- スタイル：${tripStyle}
- 人数：${adults}名

## 出力フォーマット（必ず守ること）

### 🗾 ${tripStyle}聖地巡礼ルート

${days === 0 ? `#### 📅 当日スケジュール
- 午前（出発〜現地着）：
- 午前〜昼（聖地巡り①②）：
- 午後（聖地巡り③〜）：
- 夕方（帰路）：` : days === 1 ? `#### 📅 1日目
- 午前（出発・現地到着）：
- 午後（聖地巡り①②③）：
- 夜（夕食・宿泊）：

#### 📅 2日目
- 午前（聖地巡り④⑤）：
- 昼（ランチ・土産）：
- 夕方（帰路）：` : `#### 📅 1日目
- 午前（出発・現地到着）：
- 午後（聖地巡り①②）：
- 夜（夕食・宿泊）：

#### 📅 2日目
- 午前（聖地巡り③④）：
- 午後（近隣観光）：
- 夜（夕食・宿泊）：

#### 📅 3日目
- 午前（聖地巡り⑤・ショッピング）：
- 昼〜夕方（帰路）：`}

---

### 🏨 おすすめ宿泊先
（上記の宿泊候補から最適なものを1〜2軒推薦、なければ一般提案）

---

### 🚃 アクセス・移動手段
- ${departure}からの行き方（新幹線/特急/バスなど）：
- 現地での移動（バス/電車/レンタカー/徒歩）：
- 所要時間の目安：

---

### 🍜 聖地グルメ・お土産
- おすすめグルメ（作品モチーフ・地元名物）：
- 推しグッズ・限定土産：
- 聖地カフェ・コラボ店（あれば）：

---

### 💰 概算予算（${adults}名合計）
- 交通費：¥〜¥
- 宿泊費：¥〜¥
- 食費：¥〜¥
- 入場料・体験費：¥〜¥
- グッズ・土産：¥〜¥
- **合計目安：¥〜¥**

---

### 📸 聖地巡礼のコツ
- 混雑回避のベストタイム：
- 写真撮影のポイント：
- 巡礼マナー・注意事項：
- おすすめ持ち物：

---

すべての項目に具体的な内容を必ず記入すること。「（記載なし）」「（省略）」などのプレースホルダーは絶対に使用しないこと。`

  try {
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '旅程の生成に失敗しました'
  } catch {
    return '旅程の生成に失敗しました'
  }
}

// ─── メインハンドラ ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // 1日5回制限
    const today = new Date().toISOString().split('T')[0]
    const { data: usageLogs } = await supabase
      .from('tool_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', TOOL_ID)
      .gte('created_at', `${today}T00:00:00.000Z`)

    const usageCount = usageLogs?.length ?? 0
    if (usageCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `本日の利用上限（${DAILY_LIMIT}回）に達しました。明日またお試しください。` },
        { status: 429 }
      )
    }

    const {
      youtubeUrl,
      keyword,        // テキスト入力 or プリセットキーワード
      presetId,       // プリセット選択時のID
      tripStyle,      // '日帰り' | '1泊2日' | '2泊3日'
      departure,      // 出発地（例：東京）
      adults,         // 人数
      budget,         // 宿泊予算（円/泊）
      checkinDate,
      checkoutDate,
    } = await req.json()

    if (!youtubeUrl && !keyword && !presetId) {
      return NextResponse.json(
        { error: 'YouTube URLまたは作品名を入力してください' },
        { status: 400 }
      )
    }

    // プリセット解決
    const preset = PRESETS.find((p) => p.id === presetId)
    const searchKeyword = keyword || preset?.keyword || ''
    const workTitle = keyword || preset?.label || 'この作品'

    // YouTube情報取得（URLがある場合）
    let videoInfo: VideoInfo | null = null
    let videoId: string | null = null
    if (youtubeUrl) {
      videoId = extractVideoId(youtubeUrl)
      if (videoId) {
        videoInfo = await fetchVideoInfo(videoId)
      }
    }

    // 聖地特定
    let spots = await identifyHolySites(videoInfo, searchKeyword, preset?.keyword)

    // 座標付与
    spots = await geocodeSpots(spots)

    // 宿泊地は最初のスポットの都道府県 or 住所全体を楽天キーワードに使用
    const firstAddress = spots[0]?.address ?? ''
    const prefMatch = firstAddress.match(/(.+?[都道府県])/)
    const primaryLocation = prefMatch ? prefMatch[1] : (firstAddress || departure || '東京')
    const today2 = new Date()
    const defaultCheckin = checkinDate || new Date(today2.getTime() + 7 * 86400000).toISOString().split('T')[0]
    const defaultCheckout = checkoutDate || new Date(today2.getTime() + 8 * 86400000).toISOString().split('T')[0]

    // 楽天ホテル検索
    const hotels = await searchNearbyHotels(
      primaryLocation,
      defaultCheckin,
      defaultCheckout,
      adults || 2,
      budget || 15000
    )

    // 旅程生成
    const itinerary = await generatePilgrimageItinerary(
      spots,
      hotels,
      tripStyle || '1泊2日',
      departure || '東京',
      adults || 2,
      workTitle
    )

    // 使用ログ記録
    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: TOOL_ID,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      videoId,
      videoInfo: videoInfo ? {
        title: videoInfo.title,
        channelTitle: videoInfo.channelTitle,
        thumbnail: videoInfo.thumbnails[0]?.url,
      } : null,
      workTitle,
      spots,
      hotels,
      itinerary,
      tripStyle: tripStyle || '1泊2日',
      departure: departure || '東京',
      remainingToday: DAILY_LIMIT - usageCount - 1,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '処理中にエラーが発生しました' }, { status: 500 })
  }
}
