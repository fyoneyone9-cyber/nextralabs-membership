import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface TrendItem {
  title: string
  description: string
  source: string
  link: string
  pubDate: string
}

const GOOGLE_TRENDS_RSS = 'https://trends.google.co.jp/trending/rss?geo=JP'
const GOOGLE_NEWS_SEARCH_RSS = 'https://news.google.com/rss/search?q=when:1h+allinurl:jp&hl=ja&gl=JP&ceid=JP:ja'

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

function extractCDATA(text: string): string {
  const m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return m ? m[1].trim() : text.replace(/<[^>]*>?/gm, '').trim()
}

async function fetchRss(url: string, sourceName: string): Promise<TrendItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 NextraLabs/1.1' },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items: TrendItem[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      const block = match[1]
      const title = extractCDATA(extractTag(block, 'title'))
      const link = extractTag(block, 'link')
      const pubDate = extractTag(block, 'pubDate')
      const description = extractCDATA(extractTag(block, 'description'))
      if (title) items.push({ title, description, source: sourceName, link, pubDate })
    }
    return items;
  } catch { return []; }
}

// Geminiを使ったフォールバック：日本の最新トレンドをAIで生成
async function fetchTrendsFromGemini(): Promise<TrendItem[]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return []
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = `現在の日本でSNS（X/Twitter・Instagram・TikTok）でトレンドになっているトピックを8個挙げてください。
JSONのみで返答してください（説明文不要）:
[
  {"title": "トレンド名"},
  ...
]`
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    const parsed = JSON.parse(jsonMatch[0])
    return parsed.map((t: any) => ({
      title: t.title || t,
      description: '',
      source: 'Gemini AI Trends',
      link: '',
      pubDate: new Date().toISOString(),
    }))
  } catch { return [] }
}

export async function GET() {
  // 🛡️ レート制限（1日30回）
  const limitCheck = await checkApiLimit('trends', 30);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    // RSS取得を試みる
    const [newsItems, trendItems] = await Promise.all([
      fetchRss(GOOGLE_NEWS_SEARCH_RSS, 'Google News'),
      fetchRss(GOOGLE_TRENDS_RSS, 'Google Trends')
    ]);

    const rssItems = [...newsItems, ...trendItems].slice(0, 20)

    // RSSが0件 → Geminiフォールバック
    if (rssItems.length === 0) {
      const geminiItems = await fetchTrendsFromGemini()
      return NextResponse.json({
        source: 'gemini_fallback',
        updated: new Date().toISOString(),
        count: geminiItems.length,
        trends: geminiItems,
      })
    }

    return NextResponse.json({
      source: 'rss_hybrid',
      updated: new Date().toISOString(),
      count: rssItems.length,
      trends: rssItems,
    })
  } catch (e: any) {
    // 最終フォールバック：Gemini
    try {
      const geminiItems = await fetchTrendsFromGemini()
      return NextResponse.json({
        source: 'gemini_fallback',
        updated: new Date().toISOString(),
        count: geminiItems.length,
        trends: geminiItems,
      })
    } catch {
      return NextResponse.json({ error: 'Trend fetch failed' }, { status: 500 })
    }
  }
}
