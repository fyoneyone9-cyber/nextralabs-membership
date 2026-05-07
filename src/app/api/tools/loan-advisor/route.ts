import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { debts, currentTotal, currentAvgRate } = body

    const prompt = `
あなたはプロのマネーアドバイザーです。多重債務で悩むユーザーに対して、おまとめローンを活用した完済へのロードマップを提案してください。

【現在の状況】
- 借入総額: ${Number(currentTotal).toLocaleString()}円
- 平均金利: ${Number(currentAvgRate).toFixed(1)}%
- 借入社数: ${Array.isArray(debts) ? debts.length : 0}社

【指示】
1. 現在の状況を客観的に評価し、完済への希望を伝えてください。
2. おまとめローンのメリットを簡潔に伝えてください。
3. 具体的な改善アクションを3つ提示してください。
4. 250文字程度の日本語で、Markdown形式で出力してください。
    `

    // --- STRATEGY 1: Gemini ---
    try {
      const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        if (text) {
          return NextResponse.json({ success: true, advice: text, model: 'gemini' })
        }
      }
    } catch (e) {
      console.error('Gemini failed, falling back to OpenAI...', e)
    }

    // --- STRATEGY 2: OpenAI (Fallback) ---
    try {
      const openaiKey = process.env.OPENAI_API_KEY
      if (openaiKey) {
        const openai = new OpenAI({ apiKey: openaiKey })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: prompt }],
          max_tokens: 500,
        })
        const text = completion.choices[0].message.content
        if (text) {
          return NextResponse.json({ success: true, advice: text, model: 'openai' })
        }
      }
    } catch (e) {
      console.error('OpenAI failed too...', e)
    }

    throw new Error('All AI models failed to respond.')

  } catch (error: any) {
    console.error('Loan Advisor API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'AI診断中にエラーが発生しました'
    }, { status: 500 })
  }
}
