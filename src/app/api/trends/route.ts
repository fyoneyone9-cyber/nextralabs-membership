import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Google Trends RSS 日本版
  const RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (response.ok) {
      const xml = await response.text();
      const items = xml.split('<item>').slice(1, 13);
      const trends = items.map(item => {
        const titleMatch = item.match(/<title>([^<]+)<\/title>/);
        return titleMatch ? titleMatch[1].replace('<![CDATA[', '').replace(']]>', '').trim() : null;
      }).filter(Boolean);

      if (trends.length > 0) {
        return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });
      }
    }
    throw new Error('Google Trends RSS failed');

  } catch (error) {
    // GoogleがダメならNewsAPIへフォールバック
    try {
      const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=jp&pageSize=12&apiKey=5a687f8f94d348a68868673a903487c8`;
      const nRes = await fetch(NEWS_URL, { cache: 'no-store' });
      if (nRes.ok) {
        const nData = await nRes.json();
        const nTrends = nData.articles?.map((a: any) => a.title.split(' - ')[0].trim()).slice(0, 12);
        if (nTrends && nTrends.length > 0) return NextResponse.json({ trends: nTrends, source: 'NEWS_API_FALLBACK', isLive: true });
      }
    } catch (e) { /* ignore */ }

    // 最終手段
    return NextResponse.json({ trends: ["AIエージェント", "働き方改革", "次世代デバイス"], isLive: false });
  }
}
