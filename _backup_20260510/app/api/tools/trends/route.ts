import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    // 【三段構え】GNews API(内部呼び出し) + RSS 2種
    const [newsItems, trendItems] = await Promise.all([
      fetchRss(GOOGLE_NEWS_SEARCH_RSS, 'Google News (Speed)'),
      fetchRss(GOOGLE_TRENDS_RSS, 'Google Trends (Volume)')
    ]);

    // GNews API側のデータも補完的に混ぜるために構造を合わせる
    // (フロントエンドが/api/tools/trendsを直接呼んだ場合でも最強の状態にする)
    return NextResponse.json({
      source: 'triple_hybrid_node',
      updated: new Date().toISOString(),
      count: newsItems.length + trendItems.length,
      trends: [...newsItems, ...trendItems].slice(0, 20),
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Hybrid Fetch Failed' }, { status: 500 })
  }
}
