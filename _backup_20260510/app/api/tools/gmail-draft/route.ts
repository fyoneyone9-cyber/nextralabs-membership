import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken, threadId, replyBody } = await req.json();
    
    if (!accessToken || !threadId || !replyBody) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 🚀 Gmail API: create draft
    // https://developers.google.com/gmail/api/reference/rest/v1/users.drafts/create
    const draftRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          threadId: threadId,
          raw: Buffer.from(
            `Content-Type: text/plain; charset="UTF-8"\n` +
            `MIME-Version: 1.0\n` +
            `Content-Transfer-Encoding: 7bit\n\n` +
            replyBody
          ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        }
      }),
    });

    const data = await draftRes.json();
    if (!draftRes.ok) throw new Error(data.error?.message || 'Draft creation failed');

    return NextResponse.json({ success: true, draftId: data.id });
  } catch (error: any) {
    console.error('[GMAIL_DRAFT_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
