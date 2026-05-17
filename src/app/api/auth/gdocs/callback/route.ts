import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function GET(request: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/products/ai-exam-generator/app?gdocs_error=access_denied`)
  }

  // stateからタイトル・コンテンツを復元
  let title = 'AI模擬試験問題集'
  let content = ''
  try {
    const decoded = JSON.parse(Buffer.from(state || '', 'base64url').toString())
    title = decoded.title || title
    content = decoded.content || ''
  } catch {
    // stateパース失敗は無視
  }

  try {
    // 1. code → access_token 交換
    const redirectUri = `${baseUrl}/api/auth/gdocs/callback`
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      throw new Error('トークン取得失敗: ' + JSON.stringify(tokenData))
    }

    const accessToken = tokenData.access_token

    // 2. 新規Googleドキュメント作成
    const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })

    const doc = await createRes.json()
    if (!doc.documentId) {
      throw new Error('ドキュメント作成失敗: ' + JSON.stringify(doc))
    }

    // 3. コンテンツを挿入（batchUpdate）
    if (content) {
      await fetch(`https://docs.googleapis.com/v1/documents/${doc.documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: content,
              },
            },
          ],
        }),
      })
    }

    // 4. 完了 → ドキュメントURLにリダイレクト
    const docUrl = `https://docs.google.com/document/d/${doc.documentId}/edit`
    return NextResponse.redirect(
      `${baseUrl}/products/ai-exam-generator/app?gdocs_url=${encodeURIComponent(docUrl)}`
    )
  } catch (err) {
    console.error('Google Docs callback error:', err)
    return NextResponse.redirect(`${baseUrl}/products/ai-exam-generator/app?gdocs_error=server_error`)
  }
}
