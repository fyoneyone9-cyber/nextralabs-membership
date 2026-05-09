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

// ニュース見出しからトレンドキーワードを短く抽出
function extractKeyword(title: string): string {
  return title
    .replace(/\s*[|｜].*/g, '')
    .replace(/\s*[-–—].*/g, '')
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/について.*$/g, '')
    .replace(/とは.*$/g, '')
    .replace(/、.*$/g, '')           // 読点以降を削除（短縮）
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12);                    // 最大12文字でカードに収まる
}

// 除外すべきノイズワード（チャンネルタイトル・汎用語）
const NOISE_WORDS = new Set([
  'google ニュース', 'google news', 'トップニュース', 'ニュース',
  'japan', 'jp', '',
]);

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

    // <item> ブロック内の <title> のみを抽出（チャンネル <title> を除外）
    const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const rawTitles = itemBlocks
      .map(block => {
        const m = block.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) ||
                  block.match(/<title>([^<]+)<\/title>/);
        return m ? m[1] : '';
      })
      .map(t =>
        t
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim()
      )
      .map(extractKeyword)
      .filter(t => t.length >= 3 && !NOISE_WORDS.has(t.toLowerCase()));

    // 重複除去＋9件
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const t of rawTitles) {
      if (!seen.has(t)) { seen.add(t); unique.push(t); }
      if (unique.length >= 9) break;
    }

    // 足りない場合はフォールバックで補填
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
