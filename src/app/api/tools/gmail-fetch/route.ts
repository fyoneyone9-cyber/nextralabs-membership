import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';

async function extractBody(payload: any): Promise<string> {
  if (payload.parts) {
    const plain = payload.parts.find((p: any) => p.mimeType === 'text/plain');
    const part = plain || payload.parts[0];
    if (part?.body?.data) return Buffer.from(part.body.data, 'base64').toString('utf-8');
    // ネストされたmultipart対応
    for (const p of payload.parts) {
      const nested = await extractBody(p);
      if (nested) return nested;
    }
  }
  if (payload.body?.data) return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  return '';
}

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('gmail-fetch', 10);
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
    const { accessToken } = await req.json();
    if (!accessToken) return NextResponse.json({ error: 'Access token is required' }, { status: 400 });

    // ① 受信メール最新10件
    const listRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&labelIds=INBOX',
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    if (listRes.status === 401) return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    const listData = await listRes.json();
    if (listData.error) return NextResponse.json({ error: listData.error.message }, { status: 400 });

    const messages = await Promise.all((listData.messages || []).map(async (msg: any) => {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      const detail = await detailRes.json();
      const headers = detail.payload?.headers || [];
      const body = await extractBody(detail.payload);

      return {
        id: msg.id,
        threadId: detail.threadId,
        subject: headers.find((h: any) => h.name === 'Subject')?.value || '(件名なし)',
        from: headers.find((h: any) => h.name === 'From')?.value || 'Unknown',
        to: headers.find((h: any) => h.name === 'To')?.value || '',
        date: headers.find((h: any) => h.name === 'Date')?.value || '',
        snippet: detail.snippet || '',
        body: body || detail.snippet || '',
        quadrant: 'pending', // gmail-reply で AI分類後に上書きされる
      };
    }));

    // ② 送信済みメール最新5件（RAGコンテキスト用）
    const sentRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&labelIds=SENT',
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    const sentData = await sentRes.json();

    const sentMessages = await Promise.all((sentData.messages || []).map(async (msg: any) => {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      const detail = await detailRes.json();
      const body = await extractBody(detail.payload);
      return {
        id: msg.id,
        body: (body || detail.snippet || '').slice(0, 400), // 長すぎる場合は400字に制限
      };
    }));

    return NextResponse.json({ messages, sentMessages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
