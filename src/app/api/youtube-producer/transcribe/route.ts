import { NextRequest, NextResponse } from 'next/server'

// Increase body size limit for audio uploads (default is 4MB)
export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    // URL mode (JSON body)
    if (contentType.includes('application/json')) {
      const { url } = await req.json()
      if (!url) return NextResponse.json({ error: 'URLが必要です' }, { status: 400 })

      // Use gsk crawl equivalent — fetch page content
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextraLabs/1.0)' },
      })
      const html = await response.text()

      // Strip HTML tags for basic text extraction
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

    // Audio/Video — use OpenAI Whisper API
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      // Fallback: return a helpful message
      return NextResponse.json({
        text: `[文字起こし] ファイル "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)}MB) を受信しました。\n\n⚠️ サーバーにOPENAI_API_KEYが設定されていないため、自動文字起こしができません。\n\n以下の方法で文字起こしテキストを入力してください：\n1. 「テキスト直接入力」モードに切り替え\n2. 別のツール（Whisper, Google音声認識等）で文字起こししたテキストをペースト\n\nまたは、Vercel環境変数にOPENAI_API_KEYを設定してください。`
      })
    }

    // Send to Whisper
    const whisperForm = new FormData()
    whisperForm.append('file', file)
    whisperForm.append('model', 'whisper-1')
    whisperForm.append('language', 'ja')
    whisperForm.append('response_format', 'text')

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: whisperForm,
    })

    if (!whisperRes.ok) {
      const err = await whisperRes.text()
      return NextResponse.json({ text: `文字起こしエラー: ${err}` })
    }

    const text = await whisperRes.text()
    return NextResponse.json({ text })
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
