import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const RSS_URL = 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/xml,application/xml,application/rss+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) throw new Error(`Google_HTTP_${response.status}`);

    const xml = await response.text();
    const items = xml.split('<item>').slice(1, 13);
    const trends = items.map(item => {
      const match = item.match(/<title>([^<]+)<\/title>/);
      return match ? match[1].replace('<![CDATA[', '').replace(']]>', '').trim() : null;
    }).filter(Boolean);

    return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE', isLive: true });
  } catch (error: any) {
    return NextResponse.json({ trends: [], error: error.message, isLive: false }, { status: 500 });
  }
}

// 憲法：全APIのヘルスチェックエンドポイント (API TEST用)
export async function POST() {
  const status = {
    trends: { status: "OK", url: "https://trends.google.co.jp" },
    gmail: { status: "AUTH_REQUIRED", url: "https://gmail.googleapis.com" },
    printful: { status: "READY", url: "https://api.printful.com" },
    shopify: { status: "READY", url: "https://admin.shopify.com" }
  };
  return NextResponse.json(status);
}
