import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const feedUrl = 'https://trends.google.co.jp/trending/rss?geo=JP'

    const res = await fetch(feedUrl, {
      next: { revalidate: 600 }, // cache 10 min
      headers: { 'User-Agent': 'NextraLabs/1.0' },
    })

    if (!res.ok) {
      return NextResponse.json({ news: [], error: 'Failed to fetch feed' }, { status: 500 })
    }

    const xml = await res.text()

    const results: { title: string; link: string; category: string; pubDate: string; traffic: string }[] = []

    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1]

      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        || itemXml.match(/<title>(.*?)<\/title>/)?.[1]
        || ''

      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1]
        || itemXml.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1]
        || ''

      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''

      // ht:approx_traffic — handles namespace prefix variations
      const traffic = itemXml.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1]
        || itemXml.match(/<approx_traffic>(.*?)<\/approx_traffic>/)?.[1]
        || ''

      if (title.trim()) {
        results.push({
          title: title.trim(),
          link: link.trim(),
          category: 'トレンド',
          pubDate: pubDate.trim(),
          traffic: traffic.trim(),
        })
      }
    }

    // Deduplicate and limit to 20
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
