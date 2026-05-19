import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[]

  const results: any[] = []

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hello in Japanese' }] }] }),
        }
      )
      const body = await res.json()
      results.push({
        key: `Key${i+1}:...${key.slice(-6)}`,
        status: res.status,
        answer: body.candidates?.[0]?.content?.parts?.[0]?.text ?? null,
        error: body.error ?? null,
      })
    } catch (e: any) {
      results.push({ key: `Key${i+1}`, error: e.message })
    }
  }

  return NextResponse.json({ results, keyCount: keys.length })
}