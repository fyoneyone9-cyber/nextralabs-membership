import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const { debts, currentTotal, currentAvgRate } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('API key not configured')

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
あなたはプロのお金のアドバイザーです。多重債務で悩むユーザーに対して、現在の状況を分析し、おまとめローンを活用した完済へのロードマップを提案してください。

【現在の状況】
- 借入総額: ${currentTotal.toLocaleString()}円
- 平均金利: ${currentAvgRate.toFixed(1)}%
- 借入社数: ${debts.length}社
${debts.map((d: any) => `- ${d.name}: ${d.amount}万円 (金利${d.rate}%)`).join('\n')}

【おまとめローンのメリット予測（シミュレーション）】
- おまとめ後の推定金利: 12.0%（仮定）

【指示】
1. まず、現在の状況（多重債務の状態）を冷静かつ客観的に評価してください。
2. おまとめローンに一本化した場合の精神的・経済的メリットを具体的に伝えてください。
3. 完済に向けて今日からできる具体的なアクションを3つ提示してください。
4. ユーザーを励まし、希望を持たせるトーンで回答してください。
5. 日本語で、200〜300文字程度で簡潔にまとめてください。
6. Markdown形式で出力してください。
    `

    const result = await model.generateContent(prompt)
    const advice = result.response.text()

    return NextResponse.json({ success: true, advice })
  } catch (error: any) {
    console.error('Loan Advisor Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
