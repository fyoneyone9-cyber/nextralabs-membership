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

    const prompt = `あなたはプロのビジネスメール代筆アシスタントです。
以下のメール情報をもとに、実際に送信できるレベルの丁寧な日本語返信メールを作成してください。

【差出人】${from || '不明'}
【件名】${subject || '(件名なし)'}
【メール概要】${snippet || '(内容不明)'}

ルール：
- 「お世話になっております。」から始める
- 件名とメール概要の内容をしっかり読み取り、具体的に言及する
- メールの種類に応じて適切な返信パターンを選ぶ：
  * 通知・お知らせ → 確認した旨 + 感想や今後の対応
  * お礼・スキ通知 → 感謝 + 具体的なコメント
  * 依頼・質問 → 回答 + 補足情報
  * 日程調整 → 候補日の確認・提案
  * 報告 → 確認した旨 + フィードバック
- 5〜10行程度（短すぎず長すぎず）
- 丁寧語を使うが、堅すぎない自然な文体
- 最後は「よろしくお願いいたします。」で締める
- 署名は含めない

返信本文のみを出力してください。`

    const requestBody = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 600,
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
