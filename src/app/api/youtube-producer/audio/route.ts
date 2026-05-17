import { NextRequest, NextResponse } from 'next/server'
import { checkApiLimit } from '@/lib/api-limit';
import { unstable_noStore as noStore } from 'next/cache'

const GSK_BASE = 'https://www.genspark.ai'

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
  // 【憲法8条】API呼び出しツールは会員登録必須
  const limitCheck = await checkApiLimit('youtube-producer-audio', 5);
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
    const { prompt, mood, genre } = await req.json()

    const GSK_API_KEY = process.env.GSK_API_KEY

    if (GSK_API_KEY) {
      // Try Genspark audio generation (correct endpoint)
      try {
        const res = await fetch(`${GSK_BASE}/api/tool_cli/audio_generation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': GSK_API_KEY,
          },
          body: JSON.stringify({
            prompt: prompt || `${mood} ${genre} background music for YouTube video, instrumental only, no vocals`,
            model: 'minimax/music-01',
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const d = data.data
          let audioUrl = ''
          if (d?.audio_url) audioUrl = d.audio_url
          else if (d?.url) audioUrl = d.url
          else if (typeof d === 'string' && d.startsWith('http')) audioUrl = d

          if (audioUrl) {
            return NextResponse.json({
              audioUrl,
              prompt,
              mood,
              genre,
              suggestion: '✅ BGMが生成されました！'
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
