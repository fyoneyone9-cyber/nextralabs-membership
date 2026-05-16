import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { subject, context } = await request.json()

    if (!subject) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 })
    }

    const prompt = `あなたは日本の資格試験の問題作成の専門家です。
以下の試験・学習内容に基づいて、本番試験と同じ形式の模擬問題を20問作成してください。

【試験・学習内容】
${subject}

${context ? `【補足コンテキスト・苦手分野】\n${context}` : ''}

## 出力形式（必ず守ること）
- 各問題は「問題X.」で始める
- 選択肢は「ア）イ）ウ）エ）」の4択形式
- 各問題の後に「【正解】ウ）」の形式で正解を示す
- 各問題の後に「【解説】〜」で100字程度の解説を付ける
- 問題間は空行で区切る
- タイトル行として「■ {試験名} 模擬問題集」を最初に書く
- 作成日として「作成日：{YYYY年MM月DD日}」を2行目に書く
- 問題は実際の過去問の傾向・難易度に合わせること

必ず日本語で出力すること。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0]?.message?.content || ''

    // タイトル抽出（最初の行）
    const lines = generatedContent.split('\n')
    const title = lines[0]?.replace(/^■\s*/, '') || '模擬試験問題集'

    return NextResponse.json({
      title,
      content: generatedContent,
      tokenUsed: completion.usage?.total_tokens || 0,
    })
  } catch (err) {
    console.error('exam-generate error:', err)
    return NextResponse.json({ error: 'AI生成に失敗しました' }, { status: 500 })
  }
}
