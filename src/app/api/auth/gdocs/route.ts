import { NextResponse } from 'next/server'

// Google Docs OAuth → redirect to Google consent screen
export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const examTitle = searchParams.get('title') || ''
  const examContent = searchParams.get('content') || ''

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl}/api/auth/gdocs/callback`

  const scopes = [
    'https://www.googleapis.com/auth/documents',       // Google Docs 読み書き
    'https://www.googleapis.com/auth/drive.file',      // 自分が作ったファイルのみアクセス
  ].join(' ')

  // stateにタイトルとコンテンツを含めてcallbackに渡す
  const state = Buffer.from(JSON.stringify({ title: examTitle, content: examContent })).toString('base64url')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    state,
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  return NextResponse.redirect(authUrl)
}
