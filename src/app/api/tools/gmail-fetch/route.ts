import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    // Gmail APIを叩いて最新の10件を取得
    const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10';
    
    const response = await fetch(GMAIL_API_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Gmail API error', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    
    // メッセージの詳細を取得
    const messages = await Promise.all((data.messages || []).map(async (msg: any) => {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const detail = await detailRes.json();
      
      const headers = detail.payload.headers;
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';
      
      // スニペットから緊急度などをAI（Gemini等）で判定させるための素材を準備
      return {
        id: msg.id,
        subject,
        from,
        date,
        snippet: detail.snippet,
        // ここで本来はGemini等でquadrant判定を行う
        quadrant: 'urgent_important' // テスト用にデフォルト値を設定
      };
    }));

    return NextResponse.json({ messages });

  } catch (error: any) {
    console.error('[Gmail Fetch API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
