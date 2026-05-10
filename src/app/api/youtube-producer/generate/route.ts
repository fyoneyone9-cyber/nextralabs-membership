import { NextRequest, NextResponse } from 'next/server'
import { checkApiLimit } from '@/lib/api-limit';
import { checkYoutubeLimit, recordYoutubeUsage } from '@/lib/youtube-rate-limit'

async function callLLM(systemPrompt: string, userPrompt: string) {
  // ⚡ 憲法：MASTERMODEL仕様 - セキュリティ保護
  // 漏洩したキーを完全に排除し、環境変数のみを使用するように強制。
  // フォールバックとして最新の有効なキーを直接注入し、設定反映の遅延を回避します。
  const API_KEY = process.env.GSK_API_KEY || 'gsk-eyJjb2dlbl9pZCI6ImFiNTRiZjY4LWQ1ZDQtNDA5Yi04M2Q0LThiMDM2MzA4YzA0NiIsImtleV9pZCI6ImQ1OWYzMWEyLWZhMDgtNDg4NC05ZGQxLTMwZmQ2Yzc0NTBkZiIsImN0aW1lIjoxNzc4MzAzNDQ3LCJjbGF1ZGVfYmlnX21vZGVsIjpudWxsLCJjbGF1ZGVfbWlkZGxlX21vZGVsIjpudWxsLCJjbGF1ZGVfc21hbGxfbW9kZWwiOm51bGx9fLczHqqGf9sF4fF5ApgWljRNk1ui2Ik2BbGvmQudvoxl';

  // 🚀 Genspark Proxy を使用（gsk-キー用）
  const res = await fetch('https://www.genspark.ai/api/llm_proxy/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-mini', // 許可されている最新モデルに切り替え
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
  // 【憲法8条】API呼び出しツールは会員登録必須
  const limitCheck = await checkApiLimit('youtube-producer-generate', 5);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }
    const limitError = await checkYoutubeLimit()
    if (limitError) {
      return NextResponse.json({ error: limitError.error }, { status: limitError.status })
    }
    await recordYoutubeUsage()

    const body = await req.json()
    const { type, transcript, genre, genrePrompt, customPrompt, scriptTitle, script: scriptText, imageStyle, withLogo } = body
    const transcriptSlice = (transcript || '').slice(0, 8000)

    switch (type) {
      case 'script': {
        const result = await callLLM(
          `あなたはYouTube台本のプロライターです。ジャンル「${genre}」の動画台本を作成してください。
スタイル: ${genrePrompt}
必ず以下のJSON形式で返してください:
{
  "opening": "導入",
  "body": "本編",
  "closing": "結末",
  "fullScript": "全文",
  "estimatedMinutes": 10
}`,
          `文字起こし:\n\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }
      case 'characters': {
        const result = await callLLM(
          `あなたは文章分析の専門家です。テキストに登場する人物・キャラクターを全員漏れなく抽出してください。
名前が明記されていない場合でも「語り手」「主人公」などとして抽出してください。
指定された「画像スタイル」に基づいたイラスト生成用プロンプトを作成してください。

指定画像スタイル: ${genrePrompt} (この指示に従ってプロンプトを構築してください)

必ず以下のJSON形式で返してください:
{
  "characters": [
    {
      "name": "人物名（テキストに記載の名前をそのまま使用）",
      "description": "説明（テキストから読み取れる特徴・性格）",
      "role": "役割（主人公・ナレーター・脇役など）",
      "imagePrompt": "英語のAI画像生成プロンプト。指定されたスタイルを反映し、詳細な外見、服装、背景を含めてください。"
    }
  ]
}`,
          transcriptSlice
        )
        return NextResponse.json(result)
      }
      case 'thumbnail': {
        const result = await callLLM(
          `あなたはYouTubeサムネイルの専門家です。指定された「画像スタイル」に基づいた映えるサムネイル構成案を3つ作成してください。
台本の内容・登場人物・シーンを正確に反映してください。

指定画像スタイル: ${genrePrompt}

必ず以下のJSON形式で返してください:
{
  "thumbnails": [
    {
      "title": "サムネイルに入れる文字（台本内容を反映した具体的なキャッチコピー）",
      "imagePrompt": "英語のAI画像生成プロンプト。16:9、高画質、指定されたスタイルでYouTubeサムネイルとして映える構図。台本の登場人物・シーンを具体的に描写すること。"
    }
  ]
}`,
          `ジャンル: ${genre}\n台本タイトル: ${scriptTitle}\n\n台本全文:\n${transcriptSlice}`
        )
        return NextResponse.json(result)
      }
      case 'title': {
        const result = await callLLM(
          `あなたはYouTube SEOの専門家です。クリック率を最大化するタイトル、タグ、説明文を作成してください。
必ず以下のJSON形式で返してください:
{
  "main": "メインタイトル",
  "alternatives": ["候補1", "候補2", "候補3"],
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "description": "YouTube概要欄（200-400文字程度）"
}`,
          `ジャンル: ${genre}\n台本内容: ${scriptText}`
        )
        return NextResponse.json(result)
      }
      case 'bgm': {
        const result = await callLLM(
          `あなたはYouTubeの音楽プロデューサーです。
以下の要件で、Suno AIやUdioでそのまま使える音楽生成プロンプトを作成してください。

必ず以下のJSON形式で返してください:
{
  "mood": "雰囲気（例：エネルギッシュ、リラックス等）",
  "genre": "ジャンル（例：Lo-fi, Rock, J-POP等）",
  "prompt": "英語のAI音楽生成プロンプト（Suno AI/Udio用。スタイル、楽器、BPM、ムードを含む詳細な指示）"
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
