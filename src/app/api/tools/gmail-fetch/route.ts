import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) return NextResponse.json({ error: 'Access token is required' }, { status: 400 });

    // 憲法：本物のデータを取得（最新15件に拡大）
    const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const listData = await listRes.json();

    const messages = await Promise.all((listData.messages || []).map(async (msg: any) => {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const detail = await detailRes.json();
      const headers = detail.payload.headers;

      // 本文の抽出（multipart対応）
      let body = "";
      if (detail.payload.parts) {
        const part = detail.payload.parts.find((p: any) => p.mimeType === 'text/plain') || detail.payload.parts[0];
        if (part.body.data) body = Buffer.from(part.body.data, 'base64').toString();
      } else if (detail.payload.body.data) {
        body = Buffer.from(detail.payload.body.data, 'base64').toString();
      }

      return {
        id: msg.id,
        subject: headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
        from: headers.find((h: any) => h.name === 'From')?.value || 'Unknown',
        date: headers.find((h: any) => h.name === 'Date')?.value || '',
        snippet: detail.snippet,
        body: body || detail.snippet, // 全文を保持
        quadrant: 'urgent_important' // ここでAI判定ロジックを入れる余地
      };
    }));

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
