import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Google Trendsの公式RSSが404になったため、Google News RSS（日本トップ）から
// トレンドキーワードを抽出する方式に変更（2026-05-09）
const GOOGLE_NEWS_RSS = 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja';

// Vercelで確実に取得できる安定フォールバック（9件＝3列×3行）
const STABLE_FALLBACK = [
  "AI活用術", "副業・在宅ワーク", "節約・投資",
  "ChatGPT最新情報", "動画・コンテンツ制作", "健康・ダイエット",
  "転職・キャリア", "ガジェット・テック", "SNSマーケティング"
];

function extractKeyword(title: string): string {
  // 「〇〇とは」「〇〇の方法」などの冗長語を除去してキーワード化
  return title
    .replace(/\s*[|｜].*/g, '')           // パイプ以降削除
    .replace(/\s*[-–—].*/g, '')           // ダッシュ以降削除
    .replace(/（[^）]*）/g, '')            // 括弧内削除
    .replace(/\([^)]*\)/g, '')
    .replace(/について.*$/g, '')
    .replace(/とは.*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20);                         // 長すぎる場合は20文字まで
}

export async function GET() {
  try {
    const response = await fetch(GOOGLE_NEWS_RSS, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) throw new Error(`NewsRSS_HTTP_${response.status}`);

    const xml = await response.text();

    // <title>タグからニュース見出しを抽出（最初の1件はチャンネルタイトルなのでスキップ）
    const rawTitles = (xml.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>|<title>([^<]+)<\/title>/g) || [])
      .slice(1, 20)
      .map(t =>
        t
          .replace(/<title><!\[CDATA\[/, '')
          .replace(/\]\]><\/title>/, '')
          .replace(/<\/?title>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim()
      )
      .map(extractKeyword)
      .filter(t => t.length >= 3);

    // 重複除去＋9件に整形（足りない場合はフォールバックで補填）
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const t of rawTitles) {
      if (!seen.has(t)) { seen.add(t); unique.push(t); }
      if (unique.length >= 9) break;
    }

    // 9件未満の場合はフォールバックで補填
    const trends = unique.length >= 9
      ? unique.slice(0, 9)
      : [...unique, ...STABLE_FALLBACK.filter(f => !seen.has(f))].slice(0, 9);

    return NextResponse.json({
      trends,
      source: 'GOOGLE_NEWS_LIVE',
      isLive: true,
      count: trends.length,
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[trends API] fallback triggered:', msg);

    return NextResponse.json({
      trends: STABLE_FALLBACK,
      source: 'STABLE_FALLBACK',
      isLive: false,
      count: STABLE_FALLBACK.length,
    });
  }
}
