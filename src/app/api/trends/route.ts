import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 信頼性の高い代替エンドポイント（USフィードだが接続確認用、またはバックアップ）
    // 本来は日本のRSS: https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP
    const RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
    
    console.log(`Fetching trends from: ${RSS_URL}`);

    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Trends RSS fetch failed with status ${response.status}: ${errorText.slice(0, 100)}`);
      throw new Error(`Google Trends RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    
    // パース処理の強化
    const items = xml.split('<item>');
    if (items.length <= 1) {
      // XML構造が違う可能性、またはブロックされている可能性をチェック
      console.log('XML snippet:', xml.slice(0, 500));
      throw new Error('No <item> elements found in RSS');
    }
    
    items.shift(); // ヘッダー除去

    const trends = items
      .map(item => {
        // <title>タグまたは <ht:approx_traffic> などの関連タグから抽出を試みる
        const titleMatch = item.match(/<title>([^<]+)<\/title>/);
        return titleMatch ? titleMatch[1].replace('<![CDATA[', '').replace(']]>', '').trim() : null;
      })
      .filter(Boolean)
      .slice(0, 12);

    if (trends.length === 0) {
      throw new Error('Parsed trends list is empty');
    }

    return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE' });
  } catch (error: any) {
    console.error('Trends API Route Error:', error.message);
    // 憲法に基づき、失敗した場合は500エラーを返し、フロント側に CONNECTION_ERROR を出させる
    return NextResponse.json(
      { trends: [], error: `Live connection failed: ${error.message}` }, 
      { status: 500 }
    );
  }
}
