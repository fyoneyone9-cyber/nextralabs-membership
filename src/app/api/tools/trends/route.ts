import { NextResponse } from 'next/server'

interface TrendItem {
  title: string
  traffic: string
  pubDate: string
  link: string
}

// Google Trends Daily Trending (Japan) RSS
const GOOGLE_TRENDS_RSS = 'https://trends.google.co.jp/trending/rss?geo=JP'

// Simple XML tag extractor (no external lib needed)
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

function extractCDATA(text: string): string {
  const m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return m ? m[1].trim() : text.trim()
}

export async function GET() {
  try {
    const res = await fetch(GOOGLE_TRENDS_RSS, {
      headers: { 'User-Agent': 'NextraLabs/1.0' },
      next: { revalidate: 1800 }, // cache 30 min
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch trends', status: res.status }, { status: 502 })
    }

    const xml = await res.text()

    // Extract all <item> blocks
    const items: TrendItem[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1]
      const title = extractCDATA(extractTag(block, 'title'))
      const traffic = extractTag(block, 'ht:approx_traffic') || extractTag(block, 'ht:picture_source')
      const pubDate = extractTag(block, 'pubDate')
      const link = extractTag(block, 'link')

      if (title) {
        items.push({ title, traffic, pubDate, link })
      }
    }

    return NextResponse.json({
      source: 'google_trends_jp',
      updated: new Date().toISOString(),
      count: items.length,
      trends: items.slice(0, 20),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
