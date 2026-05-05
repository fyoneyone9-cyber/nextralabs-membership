import { NextResponse } from 'next/server';

export async function POST(req: Request) {
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
