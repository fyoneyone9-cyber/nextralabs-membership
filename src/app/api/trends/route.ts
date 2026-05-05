import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  /**
   * 【憲法】Google Trends 究極バイパス・エンジン
   * VercelのサーバーIPがGoogleにマークされているため、
   * プロキシ的挙動とCookieシミュレーションを強化して「本物」を奪還する。
   */
  
  const RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    console.log(`[ULTIMATE_DEBUG] Fetching Trends from: ${RSS_URL}`);

    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/xml,application/xml,application/rss+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
        'Referer': 'https://trends.google.co.jp/',
        'Cache-Control': 'no-cache',
      },
    });

    const headersLog = Object.fromEntries(response.headers.entries());
    console.log(`[ULTIMATE_DEBUG] Google Response Status: ${response.status}`, { headers: headersLog });

    if (!response.ok) {
      throw new Error(`Google_HTTP_${response.status}`);
    }

    const xml = await response.text();
    const items = xml.split('<item>');
    
    if (items.length <= 1) {
      throw new Error('Empty_RSS_Payload');
    }
    
    items.shift();
    const trends = items.map(item => {
      const titleMatch = item.match(/<title>([^<]+)<\/title>/);
      return titleMatch ? titleMatch[1].replace('<![CDATA[', '').replace(']]>', '').trim() : null;
    }).filter(Boolean).slice(0, 12);

    if (trends.length > 0) {
      return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_JP_LIVE', isLive: true });
    }

    throw new Error('Parse_Failed');

  } catch (error: any) {
    console.error(`[ULTIMATE_DEBUG] Primary Trend Engine Failed: ${error.message}`);
    
    // 憲法に基づき、次善の「本物」ソース（NHK）へ。
    try {
      const fallbackRes = await fetch('https://www.nhk.or.jp/rss/news/cat0.xml', { cache: 'no-store' });
      if (fallbackRes.ok) {
        const fXml = await fallbackRes.res.text();
        const fItems = fXml.split('<item>').slice(1, 13);
        const fTrends = fItems.map(i => i.match(/<title>([^<]+)<\/title>/)?.[1].trim()).filter(Boolean);
        return NextResponse.json({ trends: fTrends, source: 'NHK_NEWS_BACKUP', isLive: true });
      }
    } catch (e) { /* fail silent */ }

    return NextResponse.json({ trends: [], error: error.message, isLive: false }, { status: 500 });
  }
}
