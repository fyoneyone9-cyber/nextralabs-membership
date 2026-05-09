import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const GOOGLE_RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    const response = await fetch(GOOGLE_RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://trends.google.co.jp/',
      },
    });

    if (!response.ok) throw new Error(`Google_HTTP_${response.status}`);

    const xml = await response.text();
    const trends = (xml.match(/<title>([^<]+)<\/title>/g) || [])
      .slice(1, 16)
      .map(t => t.replace(/<\/?title>/g, '').replace('<![CDATA[', '').replace(']]>', '').replace(/&amp;/g, '&').trim())
      .filter(t => t && t !== 'Japan');

    return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });

  } catch (error: any) {
    return NextResponse.json({ 
      trends: ["AI革命", "最新ガジェット", "働き方改革", "メタバース", "Web3"], 
      source: 'LOCAL_STRICT_FALLBACK', 
      isLive: false 
    });
  }
}
