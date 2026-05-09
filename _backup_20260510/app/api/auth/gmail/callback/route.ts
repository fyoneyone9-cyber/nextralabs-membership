import { NextRequest, NextResponse } from 'next/server'

// Gmail OAuth callback — exchange code for tokens, redirect to inbox-organizer with token in hash
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/products/inbox-organizer/app?gmail_error=${error || 'no_code'}`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/products/inbox-organizer/app?gmail_error=server_config`)
  }

  const redirectUri = `${baseUrl}/api/auth/gmail/callback`

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Gmail OAuth token exchange failed:', tokenData)
      return NextResponse.redirect(`${baseUrl}/products/inbox-organizer/app?gmail_error=token_exchange`)
    }

    // Get user email for display
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = await profileRes.json()

    // Redirect back to app with tokens in URL hash (never sent to server in subsequent requests)
    // Tokens are stored in sessionStorage on the client side
    const params = new URLSearchParams({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || '',
      expires_in: String(tokenData.expires_in || 3600),
      email: profile.email || '',
    })

    return NextResponse.redirect(`${baseUrl}/products/inbox-organizer/app#gmail_auth=${params.toString()}`)
  } catch (err) {
    console.error('Gmail OAuth callback error:', err)
    return NextResponse.redirect(`${baseUrl}/products/inbox-organizer/app?gmail_error=server_error`)
  }
}
