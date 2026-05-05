import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 日本版が不安定な場合、グローバル版にフォールバックする仕組みを導入
  const RSS_URLS = [
    'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US'
  ];
  
  for (const url of RSS_URLS) {
    try {
      console.log(`[Trends API] Trying: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 

      const response = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Referer': 'https://trends.google.co.jp/'
        },
      });

      clearTimeout(timeoutId);

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
        console.log(`[Trends API] Success with: ${url}`);
        return NextResponse.json({ trends, source: url });
      }
    } catch (e) {
      console.error(`[Trends API] Failed URL ${url}:`, e);
    }
  }

  // 全て失敗した場合は憲法に基づき正直にエラーを返す
  return NextResponse.json(
    { trends: [], error: 'All Trend RSS endpoints failed' }, 
    { status: 500 }
  );
}
