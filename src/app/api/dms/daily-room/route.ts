import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.DAILY_API_KEY || req.headers.get('x-daily-api-key') || ''
  if (!apiKey) {
    return NextResponse.json({ error: 'DAILY_API_KEY not configured' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const roomName = `dms-call-${Date.now()}`
  const propertyName = body.propertyName || 'フロント'

  const res = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: 'public',
      properties: {
        exp: Math.floor(Date.now() / 1000) + 3600,
        max_participants: 2,
        enable_chat: false,
        enable_screenshare: false,
        start_video_off: false,
        start_audio_off: false,
      }
    })
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const room = await res.json()

  return NextResponse.json({
    url: room.url,
    name: room.name,
    propertyName,
    createdAt: new Date().toISOString(),
  })
}

export async function DELETE(req: NextRequest) {
  const apiKey = process.env.DAILY_API_KEY || req.headers.get('x-daily-api-key') || ''
  const { roomName } = await req.json().catch(() => ({}))
  if (!apiKey || !roomName) return NextResponse.json({ ok: false }, { status: 400 })

  await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  })
  return NextResponse.json({ ok: true })
}
