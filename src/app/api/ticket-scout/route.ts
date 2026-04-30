import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// チケットサイトの検索URL設定
const TICKET_SITES = {
  eplus: {
    name: 'e+',
    searchUrl: (artist: string) =>
      `https://eplus.jp/sf/search?query=${encodeURIComponent(artist)}&act=search`,
    rssUrl: (artist: string) =>
      `https://eplus.jp/sf/search?query=${encodeURIComponent(artist)}&act=rss`,
  },
  lawson: {
    name: 'ローチケ',
    searchUrl: (artist: string) =>
      `https://l-tike.com/search/?keyword=${encodeURIComponent(artist)}`,
    rssUrl: (artist: string) =>
      `https://l-tike.com/search/?keyword=${encodeURIComponent(artist)}&type=rss`,
  },
  pia: {
    name: 'チケットぴあ',
    searchUrl: (artist: string) =>
      `https://t.pia.jp/pia/search/searchWord.do?word=${encodeURIComponent(artist)}`,
    rssUrl: (artist: string) =>
      `https://t.pia.jp/pia/search/searchWord.do?word=${encodeURIComponent(artist)}&format=rss`,
  },
}

interface TicketEvent {
  title: string
  venue: string
  eventDate: string
  saleDate: string
  saleStartTime: string
  url: string
  site: string
}

// HTMLからテキストを抽出するシンプルなパーサー
function extractText(html: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
  const matches: string[] = []
  let m
  while ((m = regex.exec(html)) !== null) {
    matches.push(m[1].replace(/<[^>]+>/g, '').trim())
  }
  return matches
}

// 日付っぽい文字列を抽出
function extractDate(text: string): string {
  const dateMatch = text.match(/(\d{4}[年\/\-]\d{1,2}[月\/\-]\d{1,2}[日]?)/)
  if (dateMatch) return dateMatch[1]
  const shortMatch = text.match(/(\d{1,2}[月\/]\d{1,2}[日]?)/)
  if (shortMatch) return shortMatch[1]
  return ''
}

// チケット情報をスクレイピング（Gemini APIで解析）
async function scrapeTicketInfo(artist: string, siteKey: string): Promise<TicketEvent[]> {
  const site = TICKET_SITES[siteKey as keyof typeof TICKET_SITES]
  if (!site) return []

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

  try {
    // 検索ページをフェッチ
    const res = await fetch(site.searchUrl(artist), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs-Bot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en-US;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return []
    const html = await res.text()

    // Gemini APIでHTML解析
    const prompt = `以下のHTMLはチケット販売サイト「${site.name}」の「${artist}」の検索結果ページです。
公演情報を最大5件抽出してJSONで返してください。

各公演に含める情報：
- title: 公演名
- venue: 会場名（都道府県含む）
- eventDate: 公演日（YYYY-MM-DD形式、不明なら空文字）
- saleDate: チケット発売日（YYYY-MM-DD形式、不明なら空文字）
- saleStartTime: 発売開始時刻（HH:MM形式、不明なら"10:00"）
- url: 公演詳細URL（相対URLなら絶対URLに変換）
- site: "${site.name}"

JSONのみ返してください（説明文不要）。フォーマット：
[{"title":"...","venue":"...","eventDate":"...","saleDate":"...","saleStartTime":"...","url":"...","site":"..."}]

HTML（先頭8000文字）:
${html.slice(0, 8000)}`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 },
        }),
      }
    )

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // JSONを抽出
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    const events: TicketEvent[] = JSON.parse(jsonMatch[0])
    return events.filter(e => e.title)
  } catch (err) {
    console.error(`Scrape error for ${siteKey}:`, err)
    return []
  }
}

// Google Calendar にイベント追加
async function addToGoogleCalendar(
  accessToken: string,
  event: TicketEvent
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  if (!event.saleDate) {
    return { success: false, error: '発売日が不明なためカレンダー登録をスキップしました' }
  }

  const [year, month, day] = event.saleDate.split('-').map(Number)
  const [hour, min] = (event.saleStartTime || '10:00').split(':').map(Number)

  const startDateTime = new Date(year, month - 1, day, hour, min)
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000) // 30分

  const calendarEvent = {
    summary: `🎫 チケット発売: ${event.title}`,
    description: `会場: ${event.venue}\n公演日: ${event.eventDate || '未定'}\nサイト: ${event.site}\n詳細: ${event.url}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Tokyo',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Tokyo',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  }

  const res = await fetch(
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

  if (!res.ok) {
    const err = await res.json()
    return { success: false, error: err.error?.message ?? 'Calendar API error' }
  }

  const data = await res.json()
  return { success: true, eventId: data.id }
}

// メインAPI
export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 })

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

    const { artist, sites, accessToken, addToCalendar } = await req.json()

    if (!artist?.trim()) {
      return NextResponse.json({ error: 'アーティスト名を入力してください' }, { status: 400 })
    }

    const selectedSites: string[] = sites?.length ? sites : ['eplus', 'lawson', 'pia']

    // 並列スクレイピング
    const results = await Promise.allSettled(
      selectedSites.map(site => scrapeTicketInfo(artist.trim(), site))
    )

    const allEvents: TicketEvent[] = results.flatMap(r =>
      r.status === 'fulfilled' ? r.value : []
    )

    // カレンダー登録
    const calendarResults: { event: TicketEvent; success: boolean; error?: string }[] = []

    if (addToCalendar && accessToken && allEvents.length > 0) {
      for (const event of allEvents) {
        if (event.saleDate) {
          const calResult = await addToGoogleCalendar(accessToken, event)
          calendarResults.push({ event, ...calResult })
        }
      }
    }

    return NextResponse.json({
      artist,
      events: allEvents,
      calendarResults,
      totalFound: allEvents.length,
      sitesSearched: selectedSites.map(k => TICKET_SITES[k as keyof typeof TICKET_SITES]?.name ?? k),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 })
  }
}
