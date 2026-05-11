import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  const createdAt = new Date().toISOString()

  // Supabaseにイベント保存 → CallsEngineがRealtimeで検知して通知
  try {
    await supabase.from('dms_call_events').insert({
      room_name: room.name,
      room_url: room.url,
      property_name: propertyName,
      created_at: createdAt,
      status: 'active',
    })
  } catch {
    // 保存失敗してもルーム作成自体は成功として返す
  }

  return NextResponse.json({
    url: room.url,
    name: room.name,
    propertyName,
    createdAt,
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

  // Supabaseのステータスも更新
  try {
    await supabase.from('dms_call_events').update({ status: 'ended' }).eq('room_name', roomName)
  } catch { /* 無視 */ }

  return NextResponse.json({ ok: true })
}
