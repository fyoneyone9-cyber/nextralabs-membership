import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function POST() {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('dms_session', '', {
    path: '/dms',
    maxAge: 0,
  })
  return res
}
