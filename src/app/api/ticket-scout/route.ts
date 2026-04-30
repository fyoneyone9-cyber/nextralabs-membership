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

  const prompt = `以下のアーティストのライブ・コンサートのチケット情報を検索してください。

アーティスト名：${artist}
検索対象サイト：${targetSites}

各公演について以下の情報をJSON配列で返してください：
- title: 公演名（ツアー名・会場名を含む）
- venue: 会場名（都道府県を含む）
- eventDate: 公演日（YYYY-MM-DD形式、複数日程ある場合は最初の日程。不明なら空文字）
- saleDate: チケット発売日（YYYY-MM-DD形式。不明なら空文字）
- saleStartTime: 発売開始時刻（HH:MM形式。不明なら"10:00"）
- url: チケット購入ページのURL
- site: 販売サイト名（e+ / ローチケ / チケットぴあ）

JSONのみ返してください（説明文・マークダウン不要）。
見つからない場合は空配列 [] を返してください。`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.1 },
      }),
    }
  )

  const data = await res.json()

  // エラーチェック
  if (data.error) {
    console.error('Gemini API error:', JSON.stringify(data.error))
    return []
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  console.log('Gemini response text:', text.slice(0, 500))

  // JSON抽出（コードブロック対応）
  const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/) ||
                    text.match(/(\[[\s\S]*\])/)
  if (!jsonMatch) {
    console.log('No JSON found in response')
    return []
  }

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

    // 全体で1日50回制限（Gemini grounding無料枠）
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('tool_usage_logs')
      .select('id', { count: 'exact', head: true })
      .eq('tool_id', 'ticket-scout')
      .gte('created_at', `${today}T00:00:00.000Z`)

    if ((count ?? 0) >= 50) {
      return NextResponse.json({ error: '本日の利用上限（全体50回）に達しました。明日またお試しください。' }, { status: 429 })
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
