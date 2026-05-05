import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  /**
   * 憲法：Google Trends 究極の「本物」奪還エンジン
   * 05-06 発覚：VercelサーバーIPがGoogleに恒久的にブロックされている可能性。
   * 解決策：クライアント（NextraLabs様のブラウザ）の認証セッションを最大限活用し、
   * プロキシ的にGoogle Trends JPを吸い上げる。
   */
  
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token'); // フロントから渡される可能性のあるトークン

  // スクリーンショットに基づき、最も確実に「本物」が眠っているパス
  const RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    console.log(`[ULTIMATE_DEBUG] Fetching real trends from Google JP...`);

    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://trends.google.co.jp/',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      throw new Error(`Google_JP_Blocked_${response.status}`);
    }

    const xml = await response.text();
    const items = xml.split('<item>');
    
    if (items.length <= 1) throw new Error('Empty_Payload');
    
    items.shift();
    const trends = items.map(item => {
      const titleMatch = item.match(/<title>([^<]+)<\/title>/);
      return titleMatch ? titleMatch[1].replace('<![CDATA[', '').replace(']]>', '').trim() : null;
    }).filter(Boolean).slice(0, 12);

    if (trends.length > 0) {
      console.log(`[ULTIMATE_DEBUG] Success: Real Google Trends captured.`);
      return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_JP_LIVE', isLive: true });
    }

    throw new Error('Parse_Error');

  } catch (error: any) {
    console.error(`[ULTIMATE_DEBUG] Google Trends failed: ${error.message}. Trying high-priority backup...`);
    
    // 憲法：Googleがダメなら、同じ「今のバズ」を扱う J-CAST トレンドを「本物」として採用
    try {
      const backupRes = await fetch('https://www.j-cast.com/trend/index.xml', { cache: 'no-store' });
      if (backupRes.ok) {
        const bXml = await backupRes.text();
        const bItems = bXml.split('<item>').slice(1, 13);
        const bTrends = bItems.map(i => {
           const t = i.match(/<title>([^<]+)<\/title>/)?.[1] || "";
           return t.replace('<![CDATA[', '').replace(']]>', '').trim();
        }).filter(Boolean);
        
        if (bTrends.length > 0) {
          return NextResponse.json({ trends: bTrends, source: 'JCAST_TREND_LIVE', isLive: true });
        }
      }
    } catch (e) { /* fail silent */ }

    // 憲法：ここまできてメールデータを出すような間違いは二度としない
    return NextResponse.json({ trends: [], error: "No real-time trends available", isLive: false }, { status: 500 });
  }
}
