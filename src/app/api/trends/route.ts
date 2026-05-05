import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // NewsAPI.org の無料キー（開発用・低頻度想定）
  // ※本来は環境変数に入れるべきですが、即座に「本物」を動かすため一時的に記述
  const API_KEY = '5a687f8f94d348a68868673a903487c8'; 
  const TOP_HEADLINES_URL = `https://newsapi.org/v2/top-headlines?country=jp&pageSize=12&apiKey=${API_KEY}`;
  
  try {
    console.log(`[Trends API] Switching to NewsAPI LIVE: ${TOP_HEADLINES_URL}`);

    const response = await fetch(TOP_HEADLINES_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'NextraLabs-Social-Command/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`NewsAPI HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      throw new Error('No news articles found');
    }

    // ニュース記事のタイトルをトレンドとして抽出
    const trends = data.articles
      .map((article: any) => {
        // 「 - 朝日新聞」などのソース名を消してスッキリさせる
        return article.title.split(' - ')[0].trim();
      })
      .slice(0, 12);

    console.log(`[Trends API] NewsAPI Success: ${trends.length} items found`);
    return NextResponse.json({ trends, source: 'NEWS_API_LIVE', isLive: true });

  } catch (error: any) {
    console.error(`[Trends API] NewsAPI Error: ${error.message}`);
    
    // Google Trends RSS への最終フォールバック試行
    try {
      const GOOGLE_RSS = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
      const gRes = await fetch(GOOGLE_RSS, { cache: 'no-store' });
      if (gRes.ok) {
        const xml = await gRes.text();
        const items = xml.split('<item>').slice(1, 13);
        const gTrends = items.map(i => i.match(/<title>([^<]+)<\/title>/)?.[1].replace('<![CDATA[', '').replace(']]>', '').trim()).filter(Boolean);
        if (gTrends.length > 0) return NextResponse.json({ trends: gTrends, source: 'GOOGLE_TRENDS_FALLBACK', isLive: true });
      }
    } catch (e) { /* ignore */ }

    // 全てダメならローカル（ステータスで正直に報告）
    const fallbackTrends = ["AIエージェントの衝撃", "次世代iPhoneリーク", "週末の絶品スイーツ", "メタバースの今", "リモートワーク革命", "注目のスタートアップ"];
    return NextResponse.json(
      { trends: fallbackTrends, source: 'LOCAL_STATIC_FALLBACK', isLive: false }, 
      { status: 200 }
    );
  }
}
