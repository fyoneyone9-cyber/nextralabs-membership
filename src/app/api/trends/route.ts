import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP';
  
  try {
    console.log(`[Trends API] Fetching: ${RSS_URL}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    const response = await fetch(RSS_URL, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'No body');
      console.error(`[Trends API] Google RSS Error ${response.status}: ${errorBody.slice(0, 100)}`);
      throw new Error(`Google Trends HTTP ${response.status}`);
    }

    const xml = await response.text();
    
    const items = xml.split('<item>');
    if (items.length <= 1) {
      console.error(`[Trends API] Invalid XML Structure. Length: ${xml.length}`);
      throw new Error('Invalid RSS Format');
    }
    
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

    if (trends.length === 0) {
      throw new Error('No trends found after parsing');
    }

    console.log(`[Trends API] Success: ${trends.length} items found`);
    return NextResponse.json({ trends, source: 'GOOGLE_TRENDS_LIVE' });

  } catch (error: any) {
    let message = error.message;
    if (error.name === 'AbortError') message = 'Connection Timeout (Google did not respond)';
    
    console.error(`[Trends API] Route Error: ${message}`);
    
    return NextResponse.json(
      { trends: [], error: message }, 
      { status: 500 }
    );
  }
}
