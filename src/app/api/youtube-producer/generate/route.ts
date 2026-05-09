import { NextRequest, NextResponse } from 'next/server'
import { checkYoutubeLimit, recordYoutubeUsage } from '@/lib/youtube-rate-limit'

async function callLLM(systemPrompt: string, userPrompt: string) {
  // MASTERMODEL仕様のAPIキー
  const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCMbtu9IJIGbml2KOv1Yjit9QP7TkmIgiA';

  // Google Gemini OpenAI 互換エンドポイントへ直接接続
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
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
        const result = await callLLM(`人物抽出: { "characters": [{ "name": "名前", "description": "説明", "role": "役割", "imagePrompt": "プロンプト" }] }`, transcriptSlice)
        return NextResponse.json(result)
      }
      case 'thumbnail': {
        const result = await callLLM(`サムネ案3つ: { "thumbnails": [{ "title": "文字", "imagePrompt": "プロンプト" }] }`, `ジャンル: ${genre}\n台本: ${scriptTitle}`)
        return NextResponse.json(result)
      }
      case 'title': {
        const result = await callLLM(`SEO設定: { "main": "タイトル", "alternatives": ["案"], "tags": ["タグ"], "description": "概要欄" }`, `ジャンル: ${genre}\n台本: ${scriptText}`)
        return NextResponse.json(result)
      }
      case 'bgm': {
        const result = await callLLM(`BGM提案: { "mood": "ムード", "genre": "ジャンル", "prompt": "プロンプト" }`, transcriptSlice)
        return NextResponse.json(result)
      }
      default:
        return NextResponse.json({ error: '不明なタイプ' }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
