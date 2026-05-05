import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  /**
   * 憲法：二重構造トレンド取得エンジン
   * 1. Google Trends JP (認証セッション依存)
   * 2. Public News RSS (NHK/J-CAST) - Googleが弾かれた際の「本物」のバックアップ
   */
  
  const sources = [
    { name: 'GOOGLE_TRENDS_LIVE', url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP' },
    { name: 'NHK_NEWS_LIVE', url: 'https://www.nhk.or.jp/rss/news/cat0.xml' },
    { name: 'JCAST_TREND_LIVE', url: 'https://www.j-cast.com/trend/index.xml' }
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const items = xml.split('<item>');
      if (items.length <= 1) continue;
      
      items.shift();
      const trends = items
        .map(item => {
          const titleMatch = item.match(/<title>([^<]+)<\/title>/);
          if (!titleMatch) return null;
          return titleMatch[1]
            .replace('<![CDATA[', '')
            .replace(']]>', '')
            .replace(/&amp;/g, '&')
            .trim();
        })
        .filter(Boolean)
        .slice(0, 12);

      if (trends.length > 0) {
        return NextResponse.json({ trends, source: source.name, isLive: true });
      }
    } catch (e) {
      console.error(`Source ${source.name} failed:`, e);
    }
  }

  // 全滅時のみLOCAL
  return NextResponse.json({ 
    trends: ["AIエージェント", "働き方改革", "次世代デバイス"], 
    source: 'LOCAL_FALLBACK', 
    isLive: false 
  });
}
