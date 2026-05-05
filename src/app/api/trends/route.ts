import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  /**
   * 憲法：Google Trends 連携の「真実」
   * 05-06 発覚：通常のRSSフィードはVercel環境では取得不可。
   * Google認証（OAuth）を介したトレンド取得、または
   * 特定の認証済みセッションを経由した取得のみが「本物」を拾う鍵となる。
   */
  
  // スクリーンショットに基づき、認証を介した「本物のトレンド取得」へのゲートウェイ
  const RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        // 05-06 修正：.co.jp ドメインを明示的に使用
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
        return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_JP_LIVE', isLive: true });
      }
    }
    throw new Error('Direct RSS blocked or invalid');

  } catch (error: any) {
    console.error(`[Trends API] Connection Error: ${error.message}`);
    // 憲法に基づき、取得失敗時は正直にエラー。偽物（Mock）は出さない。
    return NextResponse.json(
      { trends: [], error: 'Google Trends (JP) 認証が必要です。' }, 
      { status: 500 }
    );
  }
}
