import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { debts, currentTotal, currentAvgRate } = body

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    // 2.0-flash が 404/500 になる可能性を考慮して 1.5-flash も試せるように
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
あなたはプロのマネーアドバイザーです。多重債務で悩むユーザーに対して、おまとめローンを活用した完済へのロードマップを提案してください。

【現在の状況】
- 借入総額: ${Number(currentTotal).toLocaleString()}円
- 平均金利: ${Number(currentAvgRate).toFixed(1)}%
- 借入社数: ${Array.isArray(debts) ? debts.length : 0}社

【指示】
1. 現在の状況を客観的に評価し、完済への希望を伝えてください。
2. おまとめローン（一本化）のメリットを簡潔に伝えてください。
3. 具体的な改善アクションを3つ提示してください。
4. 250文字程度の日本語で、Markdown形式で出力してください。
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const advice = response.text()

    if (!advice) throw new Error('Empty response from AI')

    return NextResponse.json({ success: true, advice })
  } catch (error: any) {
    console.error('Loan Advisor API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'AI診断中にエラーが発生しました',
      detail: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 })
  }
}
