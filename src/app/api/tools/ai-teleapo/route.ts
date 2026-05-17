import { checkApiLimit } from '@/lib/api-limit'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { unstable_noStore as noStore } from 'next/cache'

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const limitCheck = await checkApiLimit('ai-teleapo', 10)
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }
    return NextResponse.json({ error: '本日の利用上限（10回）に達しました。' }, { status: 429 })
  }

  const body = await req.json()
  const { action } = body

  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) return NextResponse.json({ error: 'AI設定エラー' }, { status: 500 })

  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  if (action === 'script') {
    const { companyName, contactName, industry, product, scene, budget } = body
    const prompt = `あなたは法人営業のプロフェッショナルです。以下の情報をもとに、実際に使える架電台本を作成してください。

【企業情報】
- 会社名: ${companyName}
- 担当者名: ${contactName}
- 業種: ${industry}
- 提案商材: ${product}
- 架電シーン: ${scene}
- 予算感: ${budget}

以下の構成で台本を作成してください：
1. 【つかみ】最初の15秒（受付突破・担当者に繋いでもらう）
2. 【ニーズ喚起】担当者との会話（課題を引き出す質問3つ）
3. 【価値提示】商材のベネフィットを30秒で伝える
4. 【クロージング】アポ取得のための一言
5. 【想定Q&A】よくある断り文句3つとその切り返し

実際に話すセリフ形式で書いてください。自然な口語体で。`

    const result = await model.generateContent(prompt)
    return NextResponse.json({ script: result.response.text() })
  }

  if (action === 'estimate') {
    const { companyName, serviceName, items, notes } = body
    const itemsText = (items || []).map((i: {name: string, price: number}) => `- ${i.name}: ¥${i.price.toLocaleString()}`).join('\n')
    const total = (items || []).reduce((sum: number, i: {price: number}) => sum + i.price, 0)

    const prompt = `あなたは法人営業の見積もり作成の専門家です。以下の情報をもとに、プロフェッショナルな見積もり提案文を作成してください。

【見積もり情報】
- 宛先: ${companyName} 御中
- サービス名: ${serviceName}
- 費目:
${itemsText}
- 合計金額: ¥${total.toLocaleString()}
- 備考・条件: ${notes || 'なし'}

以下を出力してください：
1. 【提案の要旨】この見積もりの価値を3行で
2. 【導入メリット】具体的な数字を使ったROI説明
3. 【特記事項】契約条件・支払い条件の推奨文
4. 【次のステップ】相手に送るメールの締め文`

    const result = await model.generateContent(prompt)
    return NextResponse.json({ estimate: result.response.text(), items: items || [], total, companyName, serviceName })
  }

  if (action === 'advice') {
    const { records } = body
    const recordsText = (records || []).map((r: {company: string, result: string, memo: string, date: string}) =>
      `- ${r.date} ${r.company}: ${r.result} / ${r.memo}`
    ).join('\n')

    const prompt = `あなたは法人営業のコーチです。以下の架電記録を分析し、改善アドバイスを提供してください。

【架電記録】
${recordsText}

以下の形式で回答してください：
1. 【現状分析】アポ率・傾向の分析
2. 【改善ポイント】今すぐ変えるべき3つのこと
3. 【今週の優先アクション】具体的な行動計画
4. 【モチベーション】営業マンへの一言`

    const result = await model.generateContent(prompt)
    return NextResponse.json({ advice: result.response.text() })
  }

  return NextResponse.json({ error: '不明なアクションです' }, { status: 400 })
}
