import { NextResponse } from 'next/server';
import { handleAiRequest } from '@/lib/ai-cache';
import { checkApiLimit } from '@/lib/api-limit';
import { unstable_noStore as noStore } from 'next/cache'

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    // クレジット保護：1日20回制限（B2Bのためやや多めに設定）
    const limitCheck = await checkApiLimit('staysee-ai-finder', 20);
    if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }
    const STAYSEE_API_KEY = userApiKey || process.env.STAYSEE_API_KEY || 'sk_b54ca47f884c30d98dc429d3cbbbc29c';

    if (action === 'search-booking') {
      // キャッシュエンジンを通して実行（クレジット節約！）
      const result = await handleAiRequest(`staysee-${query}`, async () => {
        const response = await fetch('https://api.staysee.jp/v1/bookings/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STAYSEE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ keyword: query, status: 'staying' })
        });
        const data = await response.json();
        return JSON.stringify(data);
      });

      return NextResponse.json({ success: true, results: JSON.parse(result) });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
