import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const key1 = process.env.AICrossChecker_GEMINI_API_KEY
  const key2 = process.env.GEMINI_API_KEY
  return NextResponse.json({
    AICrossChecker_GEMINI_API_KEY: key1 ? `SET (ends: ...${key1.slice(-6)})` : 'NOT SET',
    GEMINI_API_KEY: key2 ? `SET (ends: ...${key2.slice(-6)})` : 'NOT SET',
  })
}
