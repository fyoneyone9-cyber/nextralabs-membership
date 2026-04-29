import { NextRequest, NextResponse } from 'next/server'

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

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini API error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    const data = await res.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({ reply: reply.trim() })
  } catch (error) {
    console.error('AI reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
