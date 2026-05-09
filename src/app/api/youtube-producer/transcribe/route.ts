import { NextRequest, NextResponse } from 'next/server'
import { checkApiLimit } from '@/lib/api-limit';

export const runtime = 'nodejs'
export const maxDuration = 60

const GSK_BASE = 'https://www.genspark.ai'

export async function POST(req: NextRequest) {
  try {
  // 【憲法8条】API呼び出しツールは会員登録必須
  const limitCheck = await checkApiLimit('youtube-producer-transcribe', 5);
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

    // Audio/Video — use Genspark API
    const GSK_API_KEY = process.env.GSK_API_KEY
    if (!GSK_API_KEY) {
      return NextResponse.json({
        text: `⚠️ APIキーが設定されていません。\n\n「テキスト直接入力」モードで文字起こし結果を貼り付けてください。`
      })
    }

    const headers = {
      'X-Api-Key': GSK_API_KEY,
      'Content-Type': 'application/json',
    }

    // Step 1: Get upload URL from Genspark
    const uploadUrlRes = await fetch(`${GSK_BASE}/api/tool_cli/file/upload_url`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content_type: file.type || 'audio/mpeg',
        name: file.name || 'audio.mp3',
      }),
    })

    if (!uploadUrlRes.ok) {
      const err = await uploadUrlRes.text()
      console.error('Upload URL error:', uploadUrlRes.status, err)
      return NextResponse.json({
        text: `アップロードURLの取得に失敗しました（${uploadUrlRes.status}）\n\n「テキスト直接入力」モードをお試しください。`
      })
    }

    const uploadUrlData = await uploadUrlRes.json()
    const sasUrl = uploadUrlData.data?.upload_url || uploadUrlData.upload_url
    const fileWrapperUrl = uploadUrlData.data?.file_wrapper_url || uploadUrlData.file_wrapper_url

    if (!sasUrl) {
      console.error('No SAS URL in response:', JSON.stringify(uploadUrlData))
      return NextResponse.json({
        text: `アップロードURLが見つかりません。\n\n「テキスト直接入力」モードをお試しください。`
      })
    }

    // Step 2: Upload file to Azure blob storage
    const fileBuffer = await file.arrayBuffer()
    // 巨大なバイナリデータはfetchで直接送ると環境によってRequest Entity Too Largeやタイムアウトが発生する可能性がある
    // ただしSAS URLへのPUT自体はAzure側の仕様。ここではエラーハンドリングを強化。
    const uploadRes = await fetch(sasUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'audio/mpeg',
        'x-ms-blob-type': 'BlockBlob',
      },
      body: fileBuffer,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      console.error('File upload error:', uploadRes.status, err.slice(0, 200))
      // エラーがHTML（Request Entity Too Large等）の場合があるため、パースエラーを防ぐ
      return NextResponse.json({
        text: `アップロードに失敗しました (${uploadRes.status}: ${err.includes('Request Entity Too Large') ? 'ファイルが大きすぎます' : '通信エラー'})。\n\n数MB程度の小さなファイルでお試しいただくか、「テキスト直接入力」モードをご利用ください。`
      })
    }

    // Step 3: Call transcribe API with file wrapper URL
    const fullUrl = fileWrapperUrl?.startsWith('http') ? fileWrapperUrl : `${GSK_BASE}${fileWrapperUrl}`

    const transcribeRes = await fetch(`${GSK_BASE}/api/tool_cli/audio_transcribe`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        audio_urls: [fullUrl],
      }),
    })

    if (!transcribeRes.ok) {
      const err = await transcribeRes.text()
      console.error('Transcribe error:', transcribeRes.status, err.slice(0, 200))
      return NextResponse.json({
        text: `文字起こしエラー（${transcribeRes.status}）\n\n「テキスト直接入力」モードをお試しください。`
      })
    }

    const transcribeData = await transcribeRes.json()

    // Extract text — handle various response formats
    let text = ''
    const d = transcribeData.data
    if (typeof d === 'string') {
      text = d
    } else if (d?.text) {
      text = d.text
    } else if (d?.transcription) {
      text = d.transcription
    } else if (d?.segments) {
      text = d.segments.map((s: { text?: string }) => s.text || '').join(' ')
    } else if (d?.words) {
      text = d.words.map((w: { word?: string }) => w.word || '').join(' ')
    } else if (d?.results) {
      // Handle array of results (one per audio file)
      const results = Array.isArray(d.results) ? d.results : [d.results]
      text = results.map((r: { text?: string; transcription?: string }) =>
        r?.text || r?.transcription || ''
      ).join('\n\n')
    } else {
      text = JSON.stringify(transcribeData).slice(0, 3000)
    }

    return NextResponse.json({ text: text.trim() })
  } catch (e) {
    console.error('Transcribe route error:', e)
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
