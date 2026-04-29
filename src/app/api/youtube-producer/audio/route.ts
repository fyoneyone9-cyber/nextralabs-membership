import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, mood, genre } = await req.json()

    // Try to use gsk audio API or fallback
    // For now, return a structured response that the frontend can use
    // The actual audio generation would use ElevenLabs, Suno, or similar API

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'OPENAI_API_KEYが設定されていません。BGM生成にはAPI keyが必要です。',
        prompt,
        mood,
        genre,
        suggestion: `以下のプロンプトを使って、Suno AI (https://suno.ai) やUdio等で生成できます:\n\n${prompt}`
      })
    }

    // Use OpenAI TTS as a simple audio placeholder
    // For production, integrate with Suno API or similar music generation
    return NextResponse.json({
      audioUrl: null,
      prompt,
      mood,
      genre,
      suggestion: `BGM生成プロンプト:\n${prompt}\n\n🎵 以下のサービスで生成できます:\n• Suno AI (https://suno.ai)\n• Udio (https://udio.com)\n• AIVA (https://aiva.ai)\n\nまたは、フリーBGMサイトで「${mood}」「${genre}」で検索してください。`
    })
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
