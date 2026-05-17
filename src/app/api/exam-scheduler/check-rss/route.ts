import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function GET(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ date: null, error: 'URLが必要です' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NextraLabs-ExamScheduler/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return NextResponse.json({ date: null, error: `HTTP ${res.status}` })

    const xml = await res.text()
    const today = new Date()
    const foundDates: Date[] = []

    const patterns = [
      /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
      /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/g,
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(xml)) !== null) {
        const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]))
        if (d > today) foundDates.push(d)
      }
    }

    if (foundDates.length === 0) return NextResponse.json({ date: null })
    foundDates.sort((a, b) => a.getTime() - b.getTime())
    return NextResponse.json({ date: foundDates[0].toISOString().split('T')[0] })
  } catch (e) {
    return NextResponse.json({ date: null, error: String(e) })
  }
}
