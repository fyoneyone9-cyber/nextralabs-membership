import { NextRequest, NextResponse } from 'next/server'
import { callGeminiWithRotation } from '@/lib/gemini-rotate'

export const runtime = 'nodejs'
export const maxDuration = 60

async function callGemini(prompt: string, input: string): Promise<string> {
  return callGeminiWithRotation(`${prompt}\n\n---\n${input}`)
}

async function callGPT(prompt: string, input: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return '（OpenAI APIキー未設定）'

  try {
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

    if (!res.ok) {
      if (res.status === 429) return '（OpenAI APIクォータ超過のため利用不可）'
      return `（OpenAI APIエラー: ${res.status}）`
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? '(回答なし)'
  } catch (e: any) {
    return `（OpenAI呼び出しエラー: ${e.message ?? 'unknown'}）`
  }
}

function isFailed(text: string): boolean {
  return text.startsWith('（') && text.endsWith('）')
}

async function generateVerdict(
  gemini: string,
  gpt: string,
  input: string
): Promise<{ verdict: string; matchScore: number }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { verdict: '確定回答を生成できません（APIキー未設定）', matchScore: 0 }
  }

  const geminiOk = !isFailed(gemini)
  const gptOk = !isFailed(gpt)

  // 両方失敗
  if (!geminiOk && !gptOk) {
    return {
      verdict: '両AIとも回答できませんでした。APIの状態を確認してください。',
      matchScore: 0,
    }
  }

  // 片方だけ成功 → その回答をそのまま確定回答にする
  if (!geminiOk && gptOk) {
    return {
      verdict: `（GeminiはAPIエラーのため未回答）\n\nGPT-4oの回答：\n${gpt}`,
      matchScore: 50,
    }
  }
  if (geminiOk && !gptOk) {
    return {
      verdict: `（GPTはAPIエラーのため未回答）\n\nGeminiの回答：\n${gemini}`,
      matchScore: 50,
    }
  }

  // 両方成功 → 統合
  const systemPrompt = `あなたは2つのAIの回答を比較・統合するエキスパートです。
2つのAIの回答を比較し、以下の形式でJSON出力してください：
{
  "verdict": "両AIが合意している点のみを統合した確定回答（箇条書き可）",
  "matchScore": 両AIの一致度（0〜100の整数）
}
一致度の基準：
- 80以上：ほぼ完全に一致
- 60〜79：主要な点で一致
- 40〜59：部分的に一致
- 39以下：大きく相違あり`

  try {
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

    if (!res.ok) {
      return { verdict: '確定回答の生成に失敗しました。', matchScore: 50 }
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(content)
    return {
      verdict: parsed.verdict ?? '両AIの回答を統合できませんでした。',
      matchScore: typeof parsed.matchScore === 'number' ? Math.min(100, Math.max(0, parsed.matchScore)) : 50,
    }
  } catch (e: any) {
    return { verdict: '確定回答の生成中にエラーが発生しました。', matchScore: 50 }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input, prompt } = await req.json()

    if (!input?.trim()) {
      return NextResponse.json({ error: '入力が空です' }, { status: 400 })
    }

    const finalPrompt = prompt?.trim() || '以下の内容について、事実・正確性を検証してください。'

    // 並列実行（どちらが失敗してもcatchせずfallback文字列を返す）
    const [geminiResult, gptResult] = await Promise.all([
      callGemini(finalPrompt, input),
      callGPT(finalPrompt, input),
    ])

    // 確定回答生成
    const { verdict, matchScore } = await generateVerdict(geminiResult, gptResult, input)

    return NextResponse.json({
      gemini: geminiResult,
      gpt: gptResult,
      verdict,
      matchScore,
    })
  } catch (e: any) {
    console.error('cross-checker error:', e)
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 })
  }
}
