import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ショッピング・EC向けトレンドキーワード（季節・需要・ジャンル）
// Google Trends RSS が 404 になったため、
// ECマーケット向けキュレーションキーワードで常時安定稼働（2026-05-09）
const EC_TREND_POOLS: Record<string, string[]> = {
  // 季節イベント
  spring:  ['春ファッション', 'GW旅行グッズ', '新生活インテリア'],
  summer:  ['夏フェスグッズ', 'UV対策アイテム', 'アウトドア用品'],
  autumn:  ['秋冬アパレル', 'ハロウィングッズ', 'キャンプ道具'],
  winter:  ['クリスマスギフト', '防寒インナー', '年末大掃除グッズ'],
  // 常時需要（ECで売れ筋）
  always: [
    'AI活用グッズ',
    '副業・在宅ツール',
    '健康・ダイエット',
    'ゲーミングギア',
    'おうち時間',
    'ペットグッズ',
    'スキンケア',
    'スマホアクセサリ',
    'サブスクボックス',
  ],
};

// 現在の月から季節を判定
function getSeason(month: number): string {
  if (month >= 3 && month <= 5)  return 'spring';
  if (month >= 6 && month <= 8)  return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// Rakuten Ichiba RSS (トレンドランキング)
const RAKUTEN_RSS = 'https://ranking.rakuten.co.jp/rss/overall/';

function parseRakutenRSS(xml: string): string[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items
    .map(block => {
      const m = block.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) ||
                block.match(/<title>([^<]+)<\/title>/);
      return m ? m[1].replace(/&amp;/g, '&').trim() : '';
    })
    .map(t => {
      // 商品名を短縮（最初の区切り文字まで）
      return t
        .replace(/\s*[|｜\/\\].*/g, '')
        .replace(/【[^】]*】/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/（[^）]*）/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 12);
    })
    .filter(t => t.length >= 2);
}

export async function GET() {
  const month = new Date().getMonth() + 1;
  const season = getSeason(month);
  const seasonalKws: string[] = EC_TREND_POOLS[season];
  const alwaysKws:   string[] = EC_TREND_POOLS.always;

  // まず楽天ランキングRSSを試みる
  try {
    const response = await fetch(RAKUTEN_RSS, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)',
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const xml = await response.text();
      const parsed = parseRakutenRSS(xml);

      const seen = new Set<string>();
      const unique: string[] = [];
      for (const t of parsed) {
        if (t && !seen.has(t)) { seen.add(t); unique.push(t); }
        if (unique.length >= 9) break;
      }

      if (unique.length >= 6) {
        const trends = unique.length >= 9
          ? unique.slice(0, 9)
          : [...unique, ...[...seasonalKws, ...alwaysKws].filter(k => !seen.has(k))].slice(0, 9);

        return NextResponse.json({ trends, source: 'RAKUTEN_LIVE', isLive: true, count: trends.length });
      }
    }
  } catch (_) {
    // fallthrough
  }

  // 楽天が取れない場合：季節3件 + 常時6件のキュレーション
  const curated = [...seasonalKws, ...alwaysKws].slice(0, 9);
  return NextResponse.json({
    trends: curated,
    source: 'CURATED_EC',
    isLive: false,
    count: curated.length,
  });
}
