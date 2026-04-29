import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, mood, genre } = await req.json()

    const GSK_API_KEY = process.env.GSK_API_KEY

    if (GSK_API_KEY) {
      // Try Genspark audio generation
      try {
        const res = await fetch('https://www.genspark.ai/api/cli_tools/call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': GSK_API_KEY,
          },
          body: JSON.stringify({
            tool_name: 'audio_generation',
            params: {
              prompt: prompt || `${mood} ${genre} background music for YouTube video, instrumental only, no vocals`,
              model: 'minimax/music-01',
            },
          }),
        })

        if (res.ok) {
          const data = await res.json()
          let audioUrl = ''
          if (data.data?.audio_url) audioUrl = data.data.audio_url
          else if (data.data?.url) audioUrl = data.data.url
          else if (typeof data.data === 'string' && data.data.startsWith('http')) audioUrl = data.data

          if (audioUrl) {
            return NextResponse.json({
              audioUrl,
              prompt,
              mood,
              genre,
              suggestion: `✅ BGMが生成されました！`
            })
          }
        }
      } catch (audioErr) {
        console.error('Audio generation error:', audioErr)
      }
    }

    // Fallback: return prompt for manual generation
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
