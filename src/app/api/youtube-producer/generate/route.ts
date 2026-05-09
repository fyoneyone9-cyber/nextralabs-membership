import { NextRequest, NextResponse } from 'next/server'
import { checkYoutubeLimit, recordYoutubeUsage } from '@/lib/youtube-rate-limit'

// ⚡ 憲法：Google Gemini OpenAI 互換エンドポイントへ直接接続（認証エラー回避）
const LLM_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai'

async function callLLM(systemPrompt: string, userPrompt: string) {
  // 環境変数優先
  const API_KEY = process.env.GSK_API_KEY;

  if (!API_KEY) {
    throw new Error('APIキー(GSK_API_KEY)が設定されていません。VercelのEnvironment Variables設定を確認してください。');
  }

  // 🚀 憲法：Genspark 本物のAPIキー (gsk-...) 用の通信設定
  // X-Api-Keyヘッダーを使用して送信（Genspark標準形式）
  const res = await fetch('https://www.genspark.ai/api/llm_proxy/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      model: 'gemini-2.0-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM error (${res.status}): ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content || ''

  // Extract JSON from response
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim()

  try {
    return JSON.parse(jsonStr)
  } catch {
    const objMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objMatch) {
      try { return JSON.parse(objMatch[0]) } catch { /* fall through */ }
    }
    return { text: content }
  }
}

export async function POST(req: NextRequest) {
  try {
    const limitError = await checkYoutubeLimit()
    if (limitError) {
      return NextResponse.json({ error: limitError.error }, { status: limitError.status })
    }
    await recordYoutubeUsage()

    const body = await req.json()
    const { type, transcript, genre, genrePrompt, customPrompt, scriptTitle, script: scriptText } = body
    const transcriptSlice = (transcript || '').slice(0, 8000)

    switch (type) {
      case 'script': {
        const result = await callLLM(
          `あなたはYouTube台本のプロライターです。ジャンル「${genre}」の動画台本を作成してください。
スタイル: ${genrePrompt}
${customPrompt ? `追加指示: ${customPrompt}` : ''}

必ず以下のJSON形式で返してください（JSONのみ、他のテキストは不要）:
{
  "opening": "オープニング（フック、挨拶、今日のテーマ紹介）",
  "body": "本編（メインコンテンツ、セクション分け、具体例）",
  "closing": "エンディング（まとめ、CTA、次回予告）",
  "fullScript": "全文（opening+body+closing を自然につなげたもの）",
  "estimatedMinutes": 10
}`,
          `以下の文字起こしをもとにYouTube台本を作成してください:\n\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      case 'characters': {
        const result = await callLLM(
          `あなたは文章分析の専門家です。テキストから登場人物を抽出し、各人物のイラスト生成用プロンプトを作成してください。
必ず以下のJSON形式で返してください:
{
  "characters": [
    {
      "name": "人物名",
      "description": "説明",
      "role": "役割",
      "imagePrompt": "英語のプロンプト"
    }
  ]
}`,
          transcriptSlice
        )
        return NextResponse.json(result)
      }

      case 'thumbnail': {
        const result = await callLLM(
          `あなたはYouTubeサムネイルデザインの専門家です。動画のサムネイル案を3パターン生成してください。
必ず以下のJSON形式で返してください:
{
  "thumbnails": [
    {
      "title": "テキスト",
      "imagePrompt": "英語のプロンプト"
    }
  ]
}`,
          `ジャンル: ${genre}\n台本冒頭: ${scriptTitle}\n\n文字起こし:\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      case 'title': {
        const result = await callLLM(
          `あなたはYouTube SEOの専門家です。クリック率を最大化するタイトル、タグ、説明文を作成してください。
必ず以下のJSON形式で返してください:
{
  "main": "メインタイトル",
  "alternatives": ["代替1", "代替2", "代替3"],
  "tags": ["タグ1", "タグ2"],
  "description": "説明文"
}`,
          `ジャンル: ${genre}\n台本: ${(scriptText || '').slice(0, 2000)}\n\n文字起こし:\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      case 'bgm': {
        const result = await callLLM(
          `あなたは音楽プロデューサーです。最適なBGM設定を提案してください。
必ず以下のJSON形式で返してください:
{
  "mood": "ムード",
  "genre": "音楽ジャンル",
  "prompt": "英語のAI音楽生成プロンプト"
}`,
          `動画ジャンル: ${genre}\n\n文字起こし:\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: '不明なタイプ' }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
