import { NextResponse } from 'next/server'

// Gmail OAuth login — redirect to Google consent screen
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 })
  }

  // Determine redirect URI based on environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl}/api/auth/gmail/callback`

  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',   // Read email list (subject, sender)
    'https://www.googleapis.com/auth/gmail.compose',     // Create drafts
  ].join(' ')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    state: 'inbox-coach',
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  return NextResponse.redirect(authUrl)
}
