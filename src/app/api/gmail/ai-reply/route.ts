import { NextRequest, NextResponse } from 'next/server'

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
]

export async function POST(req: NextRequest) {
  try {
    const { subject, from, snippet } = await req.json()

    if (!subject && !snippet) {
      return NextResponse.json({ error: 'subject or snippet required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const prompt = `あなたは丁寧なビジネスメールの返信を作成するアシスタントです。
以下のメール情報をもとに、適切な日本語の返信メール本文を作成してください。

【差出人】${from || '不明'}
【件名】${subject || '(件名なし)'}
【メール概要】${snippet || '(内容不明)'}

ルール：
- 日本語のビジネスメールの形式で書く
- 挨拶と署名は含めない（本文のみ）
- 簡潔に3〜5行程度
- 丁寧語を使う
- 相手への返信として自然な内容にする
- メールの内容に応じて適切に返信する（お礼、確認、了解、質問への回答など）

返信本文のみを出力してください。余計な説明は不要です。`

    const requestBody = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    })

    // Try models with fallback
    for (const model of MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
          }
        )

        if (res.ok) {
          const data = await res.json()
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          if (reply.trim()) {
            return NextResponse.json({ reply: reply.trim(), model })
          }
        }

        const status = res.status
        // If 429 (quota) or 503 (overloaded), try next model
        if (status === 429 || status === 503) {
          console.log(`${model} returned ${status}, trying next model...`)
          continue
        }

        // Other errors, log and try next
        const err = await res.text()
        console.error(`Gemini ${model} error (${status}):`, err)
        continue
      } catch (fetchErr) {
        console.error(`Gemini ${model} fetch error:`, fetchErr)
        continue
      }
    }

    // All models failed
    return NextResponse.json({ error: 'AI generation failed - all models busy' }, { status: 502 })
  } catch (error) {
    console.error('AI reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
