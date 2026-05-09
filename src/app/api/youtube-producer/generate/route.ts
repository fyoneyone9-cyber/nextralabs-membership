import { NextRequest, NextResponse } from 'next/server'
import { checkYoutubeLimit, recordYoutubeUsage } from '@/lib/youtube-rate-limit'

const LLM_BASE = 'https://www.genspark.ai/api/llm_proxy/v1'

async function callLLM(systemPrompt: string, userPrompt: string) {
  const GSK_API_KEY = process.env.GSK_API_KEY
  if (!GSK_API_KEY) {
    throw new Error('APIキーが設定されていません')
  }

  // Use Genspark LLM Proxy (OpenAI-compatible)
  const res = await fetch(`${LLM_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GSK_API_KEY}`,
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
    // Try to find JSON object in text
    const objMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objMatch) {
      try { return JSON.parse(objMatch[0]) } catch { /* fall through */ }
    }
    return { text: content }
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1日1回制限チェック（generateが最初に呼ばれるエントリーポイント）
    const limitError = await checkYoutubeLimit()
    if (limitError) {
      return NextResponse.json({ error: limitError.error }, { status: limitError.status })
    }
    // 使用ログ記録
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
  "estimatedMinutes": 数字（想定再生時間）
}`,
          `以下の文字起こしをもとにYouTube台本を作成してください:\n\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      case 'characters': {
        const result = await callLLM(
          `あなたは文章分析の専門家です。テキストから登場人物を抽出し、各人物のイラスト生成用プロンプトを作成してください。

必ず以下のJSON形式で返してください（JSONのみ、他のテキストは不要）:
{
  "characters": [
    {
      "name": "人物名",
      "description": "テキスト内での説明・役割の要約",
      "role": "役割（例: 主人公、専門家、ゲスト等）",
      "imagePrompt": "英語のAI画像生成プロンプト。アニメ風イラスト、上半身、背景シンプル。人物の特徴を詳しく。例: 'Anime style illustration, upper body portrait, [特徴], simple gradient background, high quality'"
    }
  ]
}

人物が見つからない場合は、テキストの語り手を1人作成してください。最大5人まで。`,
          transcriptSlice
        )
        return NextResponse.json(result)
      }

      case 'thumbnail': {
        const result = await callLLM(
          `あなたはYouTubeサムネイルデザインの専門家です。動画のサムネイル案を3パターン生成してください。

サムネイルのコツ:
- 文字は大きく、3〜7文字以内
- インパクトのある色使い（赤/黄/青）
- 感情を伝える表情やアイコン
- 16:9アスペクト比

必ず以下のJSON形式で返してください（JSONのみ、他のテキストは不要）:
{
  "thumbnails": [
    {
      "title": "サムネイルに入れるテキスト（3〜7文字）",
      "imagePrompt": "英語のAI画像生成プロンプト。YouTube thumbnail style, 16:9, bold composition, vibrant colors, eye-catching..."
    }
  ]
}

3パターンは異なるスタイルで: 1つ目=インパクト型, 2つ目=情報型, 3つ目=感情訴求型`,
          `ジャンル: ${genre}\n台本冒頭: ${scriptTitle}\n\n文字起こし:\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      case 'title': {
        const result = await callLLM(
          `あなたはYouTube SEOとタイトルの専門家です。クリック率を最大化するタイトル、タグ、説明文を作成してください。

タイトルのコツ:
- 40文字以内（全角）
- 数字を入れる（「3つの方法」「100万回再生」等）
- 感情ワード（衝撃、驚愕、神回、やばい等）
- 疑問形も効果的

必ず以下のJSON形式で返してください（JSONのみ、他のテキストは不要）:
{
  "main": "メインタイトル",
  "alternatives": ["代替1", "代替2", "代替3", "代替4"],
  "tags": ["タグ1", "タグ2", "タグ3", ...最大15個],
  "description": "YouTube説明文（200〜400文字、ハッシュタグ含む）"
}`,
          `ジャンル: ${genre}\n台本: ${(scriptText || '').slice(0, 2000)}\n\n文字起こし:\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }

      case 'bgm': {
        const result = await callLLM(
          `あなたは音楽プロデューサーです。文字起こしの雰囲気を分析して、最適なBGM設定を提案してください。

分析ポイント:
- テキストの感情（明るい/暗い/緊張/リラックス等）
- テンポ感（速い/ゆっくり/変化あり）
- ジャンルの適合性

必ず以下のJSON形式で返してください（JSONのみ、他のテキストは不要）:
{
  "mood": "ムード（例: 明るく前向き, 落ち着いた知的, ドラマチック等）",
  "genre": "音楽ジャンル（例: Lo-fi Hip Hop, Cinematic, Acoustic Pop等）",
  "prompt": "英語のAI音楽生成プロンプト。例: 'Upbeat lo-fi hip hop beat, warm piano chords, gentle drums, 90 BPM, background music for YouTube video, no vocals'"
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
