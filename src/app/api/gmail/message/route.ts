import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

// Fetch a single Gmail message with full body
export async function GET(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing authorization' }, { status: 401 })
  }

  const accessToken = authHeader.slice(7)
  const messageId = req.nextUrl.searchParams.get('id')

  if (!messageId) {
    return NextResponse.json({ error: 'Missing message id' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: 'Gmail API error', detail: err }, { status: res.status })
    }

    const msg = await res.json()

    // Extract plain text body from payload
    const body = extractBody(msg.payload)

    return NextResponse.json({ body })
  } catch (err) {
    console.error('Gmail message fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 })
  }
}

function extractBody(payload: Record<string, unknown>): string {
  // Try to find text/plain part
  const plain = findPart(payload, 'text/plain')
  if (plain) return decodeBase64Url(plain)

  // Fallback to text/html and strip tags
  const html = findPart(payload, 'text/html')
  if (html) return stripHtml(decodeBase64Url(html))

  return ''
}

function findPart(payload: Record<string, unknown>, mimeType: string): string | null {
  if (payload.mimeType === mimeType && payload.body && (payload.body as Record<string, unknown>).data) {
    return (payload.body as Record<string, string>).data
  }
  const parts = payload.parts as Record<string, unknown>[] | undefined
  if (parts) {
    for (const part of parts) {
      const found = findPart(part, mimeType)
      if (found) return found
    }
  }
  return null
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
  try {
    return Buffer.from(base64, 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
