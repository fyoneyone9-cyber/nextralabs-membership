import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 第1キーと第2キーを配列で管理（ローテーション）
  const API_KEYS = [
    '5a687f8f94d348a68868673a903487c8', // Key 1
    '0d64d6796845143fe7f3759f1366bf2f'  // Key 2 (New)
  ];
  
  // 1. まずは Google Trends RSS にステルスモードで挑戦
  const GOOGLE_RSS = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
  try {
    const gRes = await fetch(GOOGLE_RSS, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/xml,application/xml,application/rss+xml'
      }
    });
    if (gRes.ok) {
      const xml = await gRes.text();
      const items = xml.split('<item>').slice(1, 13);
      const trends = items.map(i => i.match(/<title>([^<]+)<\/title>/)?.[1].replace('<![CDATA[', '').replace(']]>', '').trim()).filter(Boolean);
      if (trends.length > 0) {
        return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });
      }
    }
  } catch (e) { console.error("[Trends] Google RSS failed"); }

  // 2. Googleがダメなら News API をキー・ローテーションで試行
  for (const key of API_KEYS) {
    try {
      const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=jp&pageSize=12&apiKey=${key}`;
      const response = await fetch(NEWS_URL, { cache: 'no-store' });

      if (response.ok) {
        const data = await response.json();
        const trends = data.articles?.map((a: any) => a.title.split(' - ')[0].trim()).slice(0, 12);
        if (trends && trends.length > 0) {
          console.log(`[Trends API] NewsAPI Success with Key: ${key.slice(0,4)}...`);
          return NextResponse.json({ trends, source: 'NEWS_API_LIVE', isLive: true });
        }
      } else {
        const err = await response.json();
        console.warn(`[Trends API] NewsAPI Key failed (${key.slice(0,4)}...):`, err.message);
      }
    } catch (error) {
      console.error(`[Trends API] Network error for NewsAPI key:`, error);
    }
  }

  // 3. 全てが全滅した場合のみ、正直に LOCAL_STATIC を宣言
  const fallback = ["AIエージェントの衝撃", "次世代iPhoneリーク", "週末の絶品スイーツ", "メタバースの今", "リモートワーク革命", "注目のスタートアップ"];
  console.error("[Trends API] ALL LIVE SOURCES EXHAUSTED.");
  return NextResponse.json({ trends: fallback, source: 'LOCAL_FALLBACK', isLive: false });
}
