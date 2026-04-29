import { NextRequest, NextResponse } from 'next/server'

// Move a Gmail message to Trash
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)

    const { messageId } = await req.json()
    if (!messageId) {
      return NextResponse.json({ error: 'messageId required' }, { status: 400 })
    }

    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Gmail trash error:', err)
      return NextResponse.json({ error: 'Failed to trash message' }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Trash error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
