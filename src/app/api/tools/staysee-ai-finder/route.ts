import { NextResponse } from 'next/server';

/**
 * 🏨 Staysee API Connector (MASTERMODEL)
 * 憲法：本物のステイシーAPIと通信し、宿泊者データを取得・照合する。
 */

export async function POST(req: Request) {
  try {
    const { action, query, userApiKey } = await req.json();
    const STAYSEE_API_KEY = userApiKey || process.env.STAYSEE_API_KEY || 'sk_b54ca47f884c30d98dc429d3cbbbc29c';

    if (action === 'search-booking') {
      // 🚀 本物のStaysee APIエンドポイント (仮定：公式ドキュメントに基づき調整)
      // 注意：実際のStaysee API仕様に合わせてパスを変更する必要があります
      const response = await fetch('https://api.staysee.jp/v1/bookings/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STAYSEE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          keyword: query,
          status: 'staying' // 現在滞在中のゲストを優先
        })
      });

      const data = await response.json();
      return NextResponse.json({ success: true, results: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[STAYSEE_API_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
