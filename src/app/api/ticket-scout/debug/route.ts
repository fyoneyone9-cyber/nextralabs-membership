import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get('artist') ?? '郷ひろみ'

  // Step1: grounding
  const step1Res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${artist} ライブ チケット 発売日 2025 2026 eplus.jp OR l-tike.com OR t.pia.jp` }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.1 },
      }),
    }
  )

  const step1Data = await step1Res.json()

  const parts = step1Data.candidates?.[0]?.content?.parts ?? []
  const rawText = parts.map((p: { text?: string }) => p.text ?? '').join('\n')

  return NextResponse.json({
    step1_status: step1Res.status,
    step1_error: step1Data.error ?? null,
    step1_parts_count: parts.length,
    step1_raw_text: rawText.slice(0, 2000),
    step1_full_response: JSON.stringify(step1Data).slice(0, 3000),
  })
}
