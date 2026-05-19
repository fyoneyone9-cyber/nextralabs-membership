import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 60

async function callGemini(prompt: string, input: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(`${prompt}\n\n---\n${input}`)
    return result.response.text() ?? null
  } catch (e: unknown) {
    console.warn('Gemini unavailable, falling back to GPT only:', e instanceof Error ? e.message : e)
    return null
  }
}

async function callGPT(prompt: string, input: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '日本語で簡潔に回答してください。' },
        { role: 'user', content: `${prompt}\n\n---\n${input}` },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? '(回答なし)'
}

async function generateVerdict(gemini: string, gpt: string, input: string): Promise<{ verdict: string; matchScore: number }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const systemPrompt = `あなたは2つのAIの回答を比較・統合するエキスパートです。
2つのAIの回答を比較し、以下の形式でJSONを出力してください:
{
  "verdict": "両AIが同意している点のみを統合した確実な回答（要約形式）",
  "matchScore": 両AIの一致度（0〜100の数値）
}
一致度の基準:
- 80以上: ほぼ完全に一致
- 60〜79: 主要な点で一致
- 40〜59: 部分的に一致
- 39以下: 大きく異なる`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `【元の入力】\n${input}\n\n【Geminiの回答】\n${gemini}\n\n【GPT-4oの回答】\n${gpt}` },
      ],
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) throw new Error(`OpenAI verdict API error: ${res.status}`)
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? '{}'
  const parsed = JSON.parse(content)
  return {
    verdict: parsed.verdict ?? '両AIの回答を統合できませんでした。',
    matchScore: typeof parsed.matchScore === 'number' ? Math.min(100, Math.max(0, parsed.matchScore)) : 50,
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input, prompt } = await req.json()

    if (!input?.trim()) {
      return NextResponse.json({ error: '入力が空です' }, { status: 400 })
    }

    const finalPrompt = prompt?.trim() || '以下の内容について、事実・根拠・信頼性を確認してください。'

    const [geminiResult, gptResult] = await Promise.all([
      callGemini(finalPrompt, input),
      callGPT(finalPrompt, input),
    ])

    // Geminiが使えない場合はGPT単体で返す
    if (geminiResult === null) {
      return NextResponse.json({
        gemini: '（Gemini APIクォータ超過のため利用不可）',
        gpt: gptResult,
        verdict: gptResult,
        matchScore: 50,
        notice: 'Gemini APIのクォータ超過のため、GPT-4o-miniのみの結果を表示しています。',
      })
    }

    const { verdict, matchScore } = await generateVerdict(geminiResult, gptResult, input)

    return NextResponse.json({
      gemini: geminiResult,
      gpt: gptResult,
      verdict,
      matchScore,
    })
  } catch (e: unknown) {
    console.error('cross-checker error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal Server Error' }, { status: 500 })
  }
}
