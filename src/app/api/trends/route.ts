import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 接続先リスト: 官公庁・公共放送系の安定したRSSを優先
  const RSS_SOURCES = [
    { name: 'NHK_NEWS_LIVE', url: 'https://www.nhk.or.jp/rss/news/cat0.xml' }, // 主要ニュース
    { name: 'JCAST_NEWS_LIVE', url: 'https://www.j-cast.com/index.xml' },      // トレンド・話題
    { name: 'GOV_NEWS_LIVE', url: 'https://www.kantei.go.jp/jp/headline.xml' } // 首相官邸（究極の公的ソース）
  ];
  
  for (const source of RSS_SOURCES) {
    try {
      console.log(`[Trends API] Attempting Public RSS: ${source.name} (${source.url})`);

      const response = await fetch(source.url, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
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
          // NHK等のRSSに含まれる余計な装飾をクリーンアップ
          return titleMatch[1]
            .replace('<![CDATA[', '')
            .replace(']]>', '')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .trim();
        })
        .filter(Boolean)
        .slice(0, 12);

      if (trends.length > 0) {
        console.log(`[Trends API] Success with Public Source: ${source.name}`);
        return NextResponse.json({ trends, source: source.name, isLive: true });
      }
    } catch (e) {
      console.error(`[Trends API] Failed Public Source ${source.name}:`, e);
    }
  }

  // 公共RSSが全滅した場合の最終手段（憲法準拠ステータス）
  const fallback = ["AIエージェントの衝撃", "次世代iPhoneリーク", "週末の絶品スイーツ", "メタバースの今", "リモートワーク革命", "注目のスタートアップ"];
  return NextResponse.json({ trends: fallback, source: 'LOCAL_FALLBACK_STRICT', isLive: false });
}
