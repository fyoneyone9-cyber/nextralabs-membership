import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('dms_session', '', {
    path: '/dms',
    maxAge: 0,
  })
  return res
}
