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

// より安定したRSSソース群
const RSS_SOURCES = [
  { url: 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja', name: 'Google News JP' },
  { url: 'https://trends.google.co.jp/trending/rss?geo=JP', name: 'Google Trends JP' },
  { url: 'https://news.google.com/rss/search?q=when:6h+site:jp&hl=ja&gl=JP&ceid=JP:ja', name: 'Google News 6h' },
]

function extractCDATA(text: string): string {
  const m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return m ? m[1].trim() : text.replace(/<[^>]*>?/gm, '').trim()
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

async function fetchRss(url: string, sourceName: string): Promise<TrendItem[]> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/2.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: controller.signal,
      next: { revalidate: 180 },
    })
    clearTimeout(timer)
    if (!res.ok) return []
    const xml = await res.text()
    const items: TrendItem[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
      const block = match[1]
      const title = extractCDATA(extractTag(block, 'title'))
      const link = extractTag(block, 'link')
      const pubDate = extractTag(block, 'pubDate')
      const description = extractCDATA(extractTag(block, 'description'))
      if (title && title.length > 1) {
        items.push({ title: title.slice(0, 40), description, source: sourceName, link, pubDate })
      }
    }
    return items
  } catch { return [] }
}

async function fetchTrendsFromGemini(): Promise<TrendItem[]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return []
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const now = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'long', day: 'numeric' })
    const prompt = `今日（${now}）の日本でSNS（X/Twitter・Instagram・TikTok）でバズっているトピックを10個挙げてください。
時事ニュース・エンタメ・ビジネス・テック・ライフスタイルから幅広く選んでください。
JSONのみで返答（説明文不要）:
[{"title":"トレンド名"},...]`
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    const parsed = JSON.parse(jsonMatch[0])
    return parsed.slice(0, 10).map((t: any) => ({
      title: (t.title || t).slice(0, 40),
      description: '',
      source: 'AI生成トレンド',
      link: '',
      pubDate: new Date().toISOString(),
    }))
  } catch { return [] }
}

export async function GET() {
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
    // 複数RSSを並列取得
    const results = await Promise.all(
      RSS_SOURCES.map(s => fetchRss(s.url, s.name))
    )
    const allItems = results.flat()

    // 重複タイトル除去
    const seen = new Set<string>()
    const unique = allItems.filter(item => {
      const key = item.title.slice(0, 15)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 10)

    if (unique.length >= 4) {
      return NextResponse.json({
        source: 'rss_hybrid',
        updated: new Date().toISOString(),
        count: unique.length,
        trends: unique,
      })
    }

    // RSS不足 → Geminiで補完
    const geminiItems = await fetchTrendsFromGemini()
    const merged = [...unique, ...geminiItems].slice(0, 10)

    return NextResponse.json({
      source: merged.length > unique.length ? 'rss+gemini' : 'gemini_fallback',
      updated: new Date().toISOString(),
      count: merged.length,
      trends: merged,
    })
  } catch {
    const geminiItems = await fetchTrendsFromGemini()
    return NextResponse.json({
      source: 'gemini_fallback',
      updated: new Date().toISOString(),
      count: geminiItems.length,
      trends: geminiItems,
    })
  }
}
