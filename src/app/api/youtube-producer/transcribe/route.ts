import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    // URL mode (JSON body)
    if (contentType.includes('application/json')) {
      const { url } = await req.json()
      if (!url) return NextResponse.json({ error: 'URLが必要です' }, { status: 400 })

      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)' },
      })
      const html = await response.text()

      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 50000)

      return NextResponse.json({ text })
    }

    // File mode (FormData)
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'ファイルが必要です' }, { status: 400 })

    const fileName = file.name.toLowerCase()

    // Text files — read directly
    if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.srt') || fileName.endsWith('.vtt')) {
      const text = await file.text()
      return NextResponse.json({ text })
    }

    // Audio/Video — use Genspark API (via gsk transcribe endpoint)
    const GSK_API_KEY = process.env.GSK_API_KEY
    if (!GSK_API_KEY) {
      return NextResponse.json({
        text: `[文字起こし] ファイル "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)}MB) を受信しました。\n\n⚠️ サーバーにAPIキーが設定されていないため、自動文字起こしができません。\n\n「テキスト直接入力」モードで、別ツールの文字起こし結果を貼り付けてください。`
      })
    }

    // Step 1: Upload file to Genspark to get a file wrapper URL
    const uploadForm = new FormData()
    uploadForm.append('file', file)

    const uploadRes = await fetch('https://www.genspark.ai/api/cli_tools/upload', {
      method: 'POST',
      headers: { 'X-Api-Key': GSK_API_KEY },
      body: uploadForm,
    })

    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      console.error('Upload error:', uploadRes.status, errText)
      return NextResponse.json({
        text: `アップロードエラー（${uploadRes.status}）: ファイルのアップロードに失敗しました。\n\n「テキスト直接入力」モードをお試しください。`
      })
    }

    const uploadData = await uploadRes.json()
    const fileUrl = uploadData.file_wrapper_url || uploadData.upload_url || uploadData.url
    if (!fileUrl) {
      console.error('Upload response:', JSON.stringify(uploadData))
      return NextResponse.json({
        text: `アップロード結果からURLが取得できませんでした。\n\n「テキスト直接入力」モードをお試しください。`
      })
    }

    // Make full URL if relative
    const fullFileUrl = fileUrl.startsWith('http') ? fileUrl : `https://www.genspark.ai${fileUrl}`

    // Step 2: Call transcribe API
    const transcribeRes = await fetch('https://www.genspark.ai/api/cli_tools/call', {
      method: 'POST',
      headers: {
        'X-Api-Key': GSK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool_name: 'audio_transcribe',
        params: {
          audio_urls: [fullFileUrl],
          model: 'whisper-1',
        },
      }),
    })

    if (!transcribeRes.ok) {
      const errText = await transcribeRes.text()
      console.error('Transcribe error:', transcribeRes.status, errText)
      return NextResponse.json({
        text: `文字起こしエラー（${transcribeRes.status}）\n\n「テキスト直接入力」モードをお試しください。`
      })
    }

    const transcribeData = await transcribeRes.json()

    // Extract text from response — handle multiple possible response formats
    let text = ''
    if (transcribeData.text) {
      text = transcribeData.text
    } else if (transcribeData.data?.text) {
      text = transcribeData.data.text
    } else if (transcribeData.data?.transcription) {
      text = transcribeData.data.transcription
    } else if (transcribeData.result?.text) {
      text = transcribeData.result.text
    } else if (typeof transcribeData.data === 'string') {
      text = transcribeData.data
    } else {
      // Try to extract any text-like field
      const dataStr = JSON.stringify(transcribeData)
      console.log('Transcribe response:', dataStr.slice(0, 500))
      // Look for segments/words
      if (transcribeData.data?.segments) {
        text = transcribeData.data.segments.map((s: { text?: string }) => s.text || '').join(' ')
      } else if (transcribeData.data?.words) {
        text = transcribeData.data.words.map((w: { word?: string }) => w.word || '').join(' ')
      } else {
        text = `文字起こし結果:\n${dataStr.slice(0, 2000)}`
      }
    }

    return NextResponse.json({ text })
  } catch (e) {
    console.error('Transcribe route error:', e)
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
