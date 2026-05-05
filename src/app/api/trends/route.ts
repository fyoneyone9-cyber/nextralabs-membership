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
      return NextResponse.json({ trends, source: url, isLive: true });
    }
  } catch (e) {
    console.error(`[Trends API] Failed URL ${url}:`, e);
  }
}

// 【憲法特例】全エンドポイントがGoogleにブロックされた場合のみ、
// 「ローカルの静的データ」を返すが、NextraLabs様が100%判別できるようにフラグを立てる。
const fallbackTrends = [
  "AIエージェントの衝撃", "次世代iPhoneリーク", "週末の絶品スイーツ", 
  "メタバースの今", "リモートワーク革命", "注目のスタートアップ",
  "最新の生成AIツール", "環境保護とテクノロジー", "宇宙旅行の現実味",
  "プロンプトエンジニアリング", "Web3の新潮流", "未来の都市設計"
];

console.warn("[Trends API] ALL LIVE ENDPOINTS FAILED. Returning Local static data.");
return NextResponse.json(
  { trends: fallbackTrends, source: 'LOCAL_STATIC_FALLBACK', isLive: false }, 
  { status: 200 }
);
}
