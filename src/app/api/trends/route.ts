import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 無料枠制限が厳しい NewsAPI の代わりに、
  // Google Trends RSS (US経由) を 403 回避ヘッダーで再構築
  const RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    console.log(`[Trends API] Attempting high-bypass fetch: ${RSS_URL}`);

    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/xml,application/xml,application/rss+xml',
        // Vercel/Googleのブロックを回避するための、より高度なブラウザ擬態
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
    });

    if (!response.ok) {
      throw new Error(`Google Trends Blocked: ${response.status}`);
    }

    const xml = await response.text();
    const items = xml.split('<item>');
    
    if (items.length <= 1) {
      throw new Error('Invalid RSS Format (Empty)');
    }
    
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
      return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });
    }

    throw new Error('No trends parsed');

  } catch (error: any) {
    console.error(`[Trends API] Primary Failed: ${error.message}`);
    
    // バックアップ: NewsAPI (5a687f8f94d348a68868673a903487c8)
    try {
      const NEWS_URL = 'https://newsapi.org/v2/top-headlines?country=jp&pageSize=12&apiKey=5a687f8f94d348a68868673a903487c8';
      const nRes = await fetch(NEWS_URL, { cache: 'no-store' });
      if (nRes.ok) {
        const nData = await nRes.json();
        const nTrends = nData.articles?.map((a: any) => a.title.split(' - ')[0].trim()).slice(0, 12);
        if (nTrends && nTrends.length > 0) {
          return NextResponse.json({ trends: nTrends, source: 'NEWS_API_BACKUP', isLive: true });
        }
      }
    } catch (e) { /* ignore */ }

    // 最終手段: 以前の12個のキーワード
    const fallback = [
      "AIエージェントの衝撃", "次世代iPhoneリーク", "週末の絶品スイーツ", 
      "メタバースの今", "リモートワーク革命", "注目のスタートアップ",
      "最新の生成AIツール", "環境保護とテクノロジー", "宇宙旅行の現実味",
      "プロンプトエンジニアリング", "Web3の新潮流", "未来の都市設計"
    ];
    return NextResponse.json({ trends: fallback, source: 'LOCAL_FALLBACK', isLive: false });
  }
}
