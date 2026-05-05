import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  /**
   * 憲法：Google Trends 究極奪還エンジン
   * ブラウザ擬態を極限まで高め、認証なしでも本物を吸い上げる
   */
  const RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/xml,application/xml,application/rss+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://trends.google.co.jp/',
      },
    });

    if (!response.ok) throw new Error(`Google_HTTP_${response.status}`);

    const xml = await response.text();
    const items = xml.split('<item>');
    if (items.length <= 1) throw new Error('Empty_RSS');
    
    items.shift();
    const trends = items
      .map(item => {
        const match = item.match(/<title>([^<]+)<\/title>/);
        return match ? match[1].replace('<![CDATA[', '').replace(']]>', '').replace(/&amp;/g, '&').trim() : null;
      })
      .filter(Boolean)
      .slice(0, 12);

    return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });

  } catch (error: any) {
    console.error(`[Trends API] Critical Failure: ${error.message}`);
    // 憲法：本物がダメなら、即座にJ-CASTトレンド（話題系本物）へ。
    try {
      const jcastRes = await fetch('https://www.j-cast.com/trend/index.xml', { cache: 'no-store' });
      const jXml = await jcastRes.text();
      const jTrends = jXml.split('<item>').slice(1, 13).map(i => i.match(/<title>([^<]+)<\/title>/)?.[1].replace('<![CDATA[', '').replace(']]>', '').trim()).filter(Boolean);
      if (jTrends.length > 0) return NextResponse.json({ trends: jTrends, source: 'JCAST_TREND_LIVE', isLive: true });
    } catch (e) { /* silent */ }

    return NextResponse.json({ trends: [], error: error.message }, { status: 500 });
  }
}
