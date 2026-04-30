import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

interface TicketEvent {
  title: string
  venue: string
  eventDate: string
  saleDate: string
  saleStartTime: string
  url: string
  site: string
}

async function searchTicketsWithGemini(artist: string, sites: string[]): Promise<TicketEvent[]> {
  const siteNames: Record<string, string> = {
    eplus: 'e+（イープラス）eplus.jp',
    lawson: 'ローチケ（ローソンチケット）l-tike.com',
    pia: 'チケットぴあ t.pia.jp',
  }
  const targetSites = sites.map(s => siteNames[s] ?? s).join('、')

  // Step1: Google Searchグラウンディングで情報収集（自然文で返す）
  const searchPrompt = `${artist} ライブ コンサート チケット 発売日 2025 2026 site:eplus.jp OR site:l-tike.com OR site:t.pia.jp について教えてください。公演名・会場・公演日・チケット発売日をできるだけ詳しく。`

  const step1Res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: searchPrompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.1 },
      }),
    }
  )

  const step1Data = await step1Res.json()
  if (step1Data.error) {
    console.error('Gemini Step1 error:', JSON.stringify(step1Data.error))
    return []
  }

  // 全partsからテキストを結合（grounding時は複数partsに分かれることがある）
  const parts = step1Data.candidates?.[0]?.content?.parts ?? []
  const rawText = parts.map((p: { text?: string }) => p.text ?? '').join('\n')
  console.log('Step1 raw text:', rawText.slice(0, 800))

  if (!rawText.trim()) return []

  // Step2: 収集した情報をJSON変換（グラウンディングなし）
  const convertPrompt = `以下のテキストから「${artist}」のライブ・コンサートチケット情報を抽出し、JSON配列に変換してください。

テキスト：
${rawText}

出力フォーマット（JSONのみ、説明文不要）：
[
  {
    "title": "公演名",
    "venue": "会場名（都道府県含む）",
    "eventDate": "YYYY-MM-DD（不明なら空文字）",
    "saleDate": "YYYY-MM-DD（不明なら空文字）",
    "saleStartTime": "HH:MM（不明なら10:00）",
    "url": "チケットURL",
    "site": "e+ または ローチケ または チケットぴあ"
  }
]

情報がなければ [] を返してください。`

  const step2Res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: convertPrompt }] }],
        generationConfig: { temperature: 0.0 },
      }),
    }
  )

  const step2Data = await step2Res.json()
  const jsonText = step2Data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  console.log('Step2 json text:', jsonText.slice(0, 500))

  const jsonMatch = jsonText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/) ||
                    jsonText.match(/(\[[\s\S]*\])/)
  if (!jsonMatch) return []

  try {
    const events: TicketEvent[] = JSON.parse(jsonMatch[1] ?? jsonMatch[0])
    return events.filter(e => e.title)
  } catch (e) {
    console.error('JSON parse error:', e)
    return []
  }
}

// Google Calendar にイベント追加
async function addToGoogleCalendar(
  accessToken: string,
  event: TicketEvent
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  if (!event.saleDate) {
    return { success: false, error: '発売日不明のためスキップ' }
  }

  const [year, month, day] = event.saleDate.split('-').map(Number)
  const [hour, min] = (event.saleStartTime || '10:00').split(':').map(Number)

  const startDateTime = new Date(year, month - 1, day, hour, min)
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000)

  const calendarEvent = {
    summary: `🎫 チケット発売: ${event.title}`,
    description: `会場: ${event.venue}\n公演日: ${event.eventDate || '未定'}\nサイト: ${event.site}\n詳細: ${event.url}`,
    start: { dateTime: startDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
    end: { dateTime: endDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  }

  const calRes = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendarEvent),
    }
  )

  if (!calRes.ok) {
    const err = await calRes.json()
    return { success: false, error: err.error?.message ?? 'Calendar API error' }
  }

  const calData = await calRes.json()
  return { success: true, eventId: calData.id }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!subscription) {
      return NextResponse.json({ error: 'サブスクリプションが必要です' }, { status: 403 })
    }

    const { artist, sites, accessToken, addToCalendar } = await req.json()

    if (!artist?.trim()) {
      return NextResponse.json({ error: 'アーティスト名を入力してください' }, { status: 400 })
    }

    const selectedSites: string[] = sites?.length ? sites : ['eplus', 'lawson', 'pia']

    // 使用ログ記録
    await supabase.from('tool_usage_logs').insert({
      user_id: user.id,
      tool_id: 'ticket-scout',
      created_at: new Date().toISOString(),
    })

    // Geminiグラウンディングで検索
    const events = await searchTicketsWithGemini(artist.trim(), selectedSites)

    // カレンダー登録
    const calendarResults: { event: TicketEvent; success: boolean; error?: string }[] = []

    if (addToCalendar && accessToken && events.length > 0) {
      for (const event of events) {
        if (event.saleDate) {
          const result = await addToGoogleCalendar(accessToken, event)
          calendarResults.push({ event, ...result })
        }
      }
    }

    return NextResponse.json({
      artist,
      events,
      calendarResults,
      totalFound: events.length,
      sitesSearched: selectedSites.map(k => ({
        eplus: 'e+', lawson: 'ローチケ', pia: 'チケットぴあ',
      }[k] ?? k)),
      debug: process.env.NODE_ENV === 'development' ? { eventsRaw: events } : undefined,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 })
  }
}
