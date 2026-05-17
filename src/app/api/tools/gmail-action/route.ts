import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache'

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('gmail-action', 10);
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

  try {
    const { accessToken, messageId, action } = await req.json();
    if (!accessToken || !messageId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    // Gmail API: trash or archive (remove INBOX label)
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/${action === 'trash' ? 'trash' : 'modify'}`;
    const body = action === 'archive' ? { removeLabelIds: ['INBOX'] } : undefined;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) throw new Error('Gmail API action failed');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
