import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch trending news from multiple RSS feeds (Japanese)
    const feeds = [
      'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
      'https://news.yahoo.co.jp/rss/topics/business.xml',
      'https://news.yahoo.co.jp/rss/topics/it.xml',
    ]

    const results: { title: string; link: string; category: string; pubDate: string }[] = []

    for (const feedUrl of feeds) {
      try {
        const res = await fetch(feedUrl, {
          next: { revalidate: 600 }, // cache 10 min
          headers: { 'User-Agent': 'NextraLabs/1.0' },
        })
        if (!res.ok) continue
        const xml = await res.text()

        // Simple XML parsing for RSS items
        const itemRegex = /<item>([\s\S]*?)<\/item>/g
        let match
        while ((match = itemRegex.exec(xml)) !== null) {
          const itemXml = match[1]
          const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
            || itemXml.match(/<title>(.*?)<\/title>/)?.[1]
            || ''
          const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || ''
          const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''

          const category = feedUrl.includes('business') ? 'ビジネス'
            : feedUrl.includes('it') ? 'IT・テクノロジー'
            : '総合'

          if (title) {
            results.push({ title: title.trim(), link, category, pubDate })
          }
        }
      } catch {
        // skip failed feed
      }
    }

    // Deduplicate and limit
    const seen = new Set<string>()
    const unique = results.filter(r => {
      if (seen.has(r.title)) return false
      seen.add(r.title)
      return true
    }).slice(0, 20)

    return NextResponse.json({ news: unique, fetchedAt: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ news: [], error: 'Failed to fetch news' }, { status: 500 })
  }
}
