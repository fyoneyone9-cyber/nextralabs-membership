import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Google Trends の日本向けRSSフィード
    const RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
    
    const response = await fetch(RSS_URL, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google Trends RSS');
    }

    const xml = await response.text();
    
    // 簡易的なXMLパース（<title>タグの中身を抽出）
    // RSSの構造: <item><title>キーワード</title>...
    const titles = xml.match(/<title>([^<]+)<\/title>/g) || [];
    
    // 最初のタイトル（RSS自体のタイトル「Daily Search Trends」）を除外し、
    // HTMLエンティティなどをデコード
    const trends = titles
      .slice(1)
      .map(t => t.replace(/<\/?title>/g, '').trim())
      .filter(t => t !== 'Daily Search Trends' && t !== 'Google Trends')
      .slice(0, 12); // 上位12件

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Trends API Error:', error);
    return NextResponse.json({ trends: [], error: 'Failed to fetch trends' }, { status: 500 });
  }
}
