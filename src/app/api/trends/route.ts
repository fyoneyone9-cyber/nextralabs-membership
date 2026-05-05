import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  /**
   * 憲法：Google Trends 究極奪還エンジン
   * ブラウザ擬態を極限まで高め、最新のバズワードを12件抽出。
   * Googleが弾かれた場合は、即座にNHK/J-CAST等の本物ソースへ切り替える。
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
    
    items.shift();
    const trends = items
      .map(item => {
        const match = item.match(/<title>([^<]+)<\/title>/);
        return match ? match[1].replace('<![CDATA[', '').replace(']]>', '').replace(/&amp;/g, '&').trim() : null;
      })
      .filter(Boolean)
      .slice(0, 15); // 多めに15件

    if (trends.length > 0) {
      console.log(`[Trends API] Success: ${trends.length} items from Google.`);
      return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });
    }
    throw new Error('Parse_Failed');

  } catch (error: any) {
    console.warn(`[Trends API] Google failed. Trying Public News fallback.`);
    try {
      // 第2層：NHKニュースRSS（本物のライブデータ）
      const nhkRes = await fetch('https://www.nhk.or.jp/rss/news/cat0.xml', { cache: 'no-store' });
      const nXml = await nhkRes.text();
      const nTrends = nXml.split('<item>').slice(1, 16).map(i => {
        const match = i.match(/<title>([^<]+)<\/title>/);
        return match ? match[1].trim() : null;
      }).filter(Boolean);
      
      if (nTrends.length > 0) {
        return NextResponse.json({ trends: nTrends, source: 'NHK_LIVE', isLive: true });
      }
    } catch (e) { /* fail silent */ }

    // 第3層：J-CASTトレンド
    try {
      const jcastRes = await fetch('https://www.j-cast.com/trend/index.xml', { cache: 'no-store' });
      const jXml = await jcastRes.text();
      const jTrends = jXml.split('<item>').slice(1, 16).map(i => {
        const match = i.match(/<title>([^<]+)<\/title>/);
        return match ? match[1].trim() : null;
      }).filter(Boolean);
      if (jTrends.length > 0) return NextResponse.json({ trends: jTrends, source: 'JCAST_LIVE', isLive: true });
    } catch (e) {}

    // 最終手段：憲法に基づき正直にLOCALを表示（虚無は許さない）
    return NextResponse.json({ 
      trends: ["AI革命", "最新ガジェット", "働き方改革", "メタバース", "Web3"], 
      source: 'LOCAL_STRICT_FALLBACK', 
      isLive: false 
    });
  }
}
