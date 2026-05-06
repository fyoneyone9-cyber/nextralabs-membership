import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { action, query, userApiKey } = await req.json();
    const STAYSEE_API_KEY = userApiKey || process.env.STAYSEE_API_KEY || 'sk_b54ca47f884c30d98dc429d3cbbbc29c';

    if (action === 'search-booking') {
      // 本物のStaysee APIエンドポイント (仮定)
      const response = await fetch('https://api.staysee.jp/v1/bookings/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STAYSEE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: query, status: 'staying' })
      });
      const data = await response.json();
      return NextResponse.json({ success: true, results: data });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
