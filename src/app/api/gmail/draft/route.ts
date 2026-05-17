import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

// Create a Gmail draft (does NOT send)
export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing authorization' }, { status: 401 })
  }

  const accessToken = authHeader.slice(7)

  try {
    const { to, subject, body, inReplyTo, threadId } = await req.json()

    if (!subject && !body) {
      return NextResponse.json({ error: 'subject or body required' }, { status: 400 })
    }

    // Build RFC 2822 message
    const lines = [
      to ? `To: ${to}` : '',
      `Subject: ${subject || '(no subject)'}`,
      'Content-Type: text/plain; charset=utf-8',
      inReplyTo ? `In-Reply-To: ${inReplyTo}` : '',
      inReplyTo ? `References: ${inReplyTo}` : '',
      '',
      body || '',
    ].filter(Boolean).join('\r\n')

    // Base64url encode
    const raw = btoa(unescape(encodeURIComponent(lines)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const draftBody: Record<string, unknown> = {
      message: { raw },
    }
    if (threadId) {
      draftBody.message = { raw, threadId }
    }

    const draftRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftBody),
    })

    if (!draftRes.ok) {
      const err = await draftRes.json()
      return NextResponse.json({ error: 'Failed to create draft', detail: err }, { status: draftRes.status })
    }

    const draft = await draftRes.json()
    return NextResponse.json({
      success: true,
      draftId: draft.id,
      message: '下書きを作成しました。Gmailの下書きフォルダを確認してください。',
    })
  } catch (err) {
    console.error('Gmail draft creation error:', err)
    return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 })
  }
}
