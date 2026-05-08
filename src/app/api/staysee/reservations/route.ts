import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const STAYSEE_API_KEY = process.env.STAYSEE_API_KEY || 'sk_b54ca47f884c30d98dc429d3cbbbc29c';

    const response = await fetch(`https://api.staysee.jp/v1/reservations?date=${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STAYSEE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Staysee API Error' }, { status: response.status });
    }

    const data = await response.json();
    // 取得したデータは配列のケースと、オブジェクト内に配列があるケースを想定
    const reservations = Array.isArray(data) ? data : (data.reservations || []);

    return NextResponse.json({ reservations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
