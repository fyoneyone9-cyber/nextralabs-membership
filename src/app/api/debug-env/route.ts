import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const k1 = process.env.Last_GEMINI_API_KEY
  const k2 = process.env.AICrossChecker_GEMINI_API_KEY
  const k3 = process.env.GEMINI_API_KEY
  return NextResponse.json({
    Last_GEMINI_API_KEY: k1 ? `SET (ends: ...${k1.slice(-6)})` : 'NOT SET',
    AICrossChecker_GEMINI_API_KEY: k2 ? `SET (ends: ...${k2.slice(-6)})` : 'NOT SET',
    GEMINI_API_KEY: k3 ? `SET (ends: ...${k3.slice(-6)})` : 'NOT SET',
  })
}
