import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic';

// 季節別フォールバック（APIが全滅した場合のみ使用）
const EC_TREND_POOLS: Record<string, string[]> = {
  spring:  ['春ファッション', 'GW旅行グッズ', '新生活インテリア'],
  summer:  ['夏フェスグッズ', 'UV対策アイテム', 'アウトドア用品'],
  autumn:  ['秋冬アパレル', 'ハロウィングッズ', 'キャンプ道具'],
  winter:  ['クリスマスギフト', '防寒インナー', '年末大掃除グッズ'],
  always: [
    'AI活用グッズ', '副業・在宅ツール', '健康・ダイエット',
    'ゲーミングギア', 'おうち時間', 'ペットグッズ',
    'スキンケア', 'スマホアクセサリ', 'サブスクボックス',
  ],
};

function getSeason(month: number): string {
  if (month >= 3 && month <= 5)  return 'spring';
  if (month >= 6 && month <= 8)  return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// Google Trends RSS（日本）
const GOOGLE_TRENDS_RSS = 'https://trends.google.co.jp/trending/rss?geo=JP';

function parseGoogleTrendsRSS(xml: string): string[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items
    .map(block => {
      const m = block.match(/<title>([^<]+)<\/title>/);
      return m ? m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() : '';
    })
    .filter(t => t.length >= 2 && t.length <= 20);
}

export async function GET() {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const month = new Date().getMonth() + 1;
  const season = getSeason(month);

  // ── 1. Google Trends RSS（本物・リアルタイム）──
  try {
    const response = await fetch(GOOGLE_TRENDS_RSS, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (response.ok) {
      const xml = await response.text();
      const parsed = parseGoogleTrendsRSS(xml);

      const seen = new Set<string>();
      const unique: string[] = [];
      for (const t of parsed) {
        if (t && !seen.has(t)) { seen.add(t); unique.push(t); }
        if (unique.length >= 9) break;
      }

      if (unique.length >= 6) {
        return NextResponse.json({
          trends: unique.slice(0, 9),
          source: 'GOOGLE_TRENDS_LIVE',
          isLive: true,
          count: unique.length,
        });
      }
    }
  } catch (_) {
    // fallthrough to curated
  }

  // ── 2. 全APIが失敗した場合：季節キュレーション ──
  const seasonalKws = EC_TREND_POOLS[season];
  const alwaysKws   = EC_TREND_POOLS.always;
  const curated = [...seasonalKws, ...alwaysKws].slice(0, 9);

  return NextResponse.json({
    trends: curated,
    source: 'CURATED_EC',
    isLive: false,
    count: curated.length,
  });
}
