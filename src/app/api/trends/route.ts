import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Google Trends の日本向けRSSフィード
    const RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
    
    // User-Agentを設定してfetch
    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Google Trends RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    
    // <title>タグをより正確にパース (最初の2つはRSSタイトルと説明なので飛ばす)
    const items = xml.split('<item>');
    items.shift(); // 最初のメタ情報を除去

    const trends = items
      .map(item => {
        const match = item.match(/<title>([^<]+)<\/title>/);
        return match ? match[1].trim() : null;
      })
      .filter(Boolean)
      .slice(0, 12);

    if (trends.length === 0) {
      throw new Error('No trends found in RSS');
    }

    return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE' });
  } catch (error) {
    console.error('Trends API Error:', error);
    // エラー時はフォールバックデータを返さず、エラーを返す（偽物を出さないため）
    return NextResponse.json({ trends: [], error: 'Failed to fetch live trends' }, { status: 500 });
  }
}
