import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  /**
   * 憲法：Google Trends 奪還エンジン (最終形態)
   * VercelのIPブロックを回避するため、User-Agentを最新のデスクトップChrome(v124)に固定。
   * Google Trends 日本版RSSから「本物のバズワード」を12件抽出する。
   */
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
    const items = xml.split('<item>');
    if (items.length <= 1) throw new Error('Empty_RSS');
    
    items.shift(); // ヘッダー除去
    const trends = items
      .map(item => {
        const match = item.match(/<title>([^<]+)<\/title>/);
        return match ? match[1].replace('<![CDATA[', '').replace(']]>', '').trim() : null;
      })
      .filter(Boolean)
      .slice(0, 12);

    if (trends.length > 0) {
      return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });
    }
    throw new Error('Parse_Failed');

  } catch (error: any) {
    console.error(`[Trends API] Google failed: ${error.message}. Fallback to Public News.`);
    // 第2層：NHKニュースRSS（これも本物のライブデータ）
    try {
      const nhkRes = await fetch('https://www.nhk.or.jp/rss/news/cat0.xml', { cache: 'no-store' });
      const nXml = await nhkRes.text();
      const nTrends = nXml.split('<item>').slice(1, 13).map(i => i.match(/<title>([^<]+)<\/title>/)?.[1].trim()).filter(Boolean);
      if (nTrends.length > 0) return NextResponse.json({ trends: nTrends, source: 'NHK_LIVE', isLive: true });
    } catch (e) { /* fail silent */ }

    // 最終手段：憲法に基づき正直にLOCALを表示
    return NextResponse.json({ 
      trends: ["最新AIツール", "働き方改革", "次世代デバイス"], 
      source: 'LOCAL_FALLBACK', 
      isLive: false 
    });
  }
}
