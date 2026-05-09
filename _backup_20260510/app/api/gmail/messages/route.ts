import { NextRequest, NextResponse } from 'next/server'

// Fetch Gmail messages — returns subject + sender only (minimal data)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing authorization' }, { status: 401 })
  }

  const accessToken = authHeader.slice(7)
  const maxResults = req.nextUrl.searchParams.get('maxResults') || '30'
  const query = req.nextUrl.searchParams.get('q') || 'in:inbox'

  try {
    // List message IDs
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!listRes.ok) {
      const err = await listRes.json()
      return NextResponse.json({ error: 'Gmail API error', detail: err }, { status: listRes.status })
    }

    const listData = await listRes.json()
    const messageIds: string[] = (listData.messages || []).map((m: { id: string }) => m.id)

    if (messageIds.length === 0) {
      return NextResponse.json({ messages: [], total: 0 })
    }

    // Batch fetch message headers (subject + from only)
    // Use individual requests with metadata format for efficiency
    const messages = await Promise.all(
      messageIds.map(async (id) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        if (!msgRes.ok) return null

        const msg = await msgRes.json()
        const headers = msg.payload?.headers || []
        const getHeader = (name: string) => headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

        return {
          id: msg.id,
          threadId: msg.threadId,
          subject: getHeader('Subject'),
          from: getHeader('From'),
          date: getHeader('Date'),
          snippet: msg.snippet || '',
          labelIds: msg.labelIds || [],
          isUnread: (msg.labelIds || []).includes('UNREAD'),
        }
      })
    )

    return NextResponse.json({
      messages: messages.filter(Boolean),
      total: listData.resultSizeEstimate || messages.length,
    })
  } catch (err) {
    console.error('Gmail messages fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
