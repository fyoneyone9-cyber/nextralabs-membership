import { NextRequest, NextResponse } from 'next/server'

const STAYSEE_BASE = 'https://api.staysee.jp/v1'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-staysee-api-key') || process.env.STAYSEE_API_KEY || ''
  if (!apiKey) {
    return NextResponse.json({ error: 'STAYSEE_API_KEY not configured' }, { status: 400 })
  }

  try {
    const res = await fetch(`${STAYSEE_BASE}/properties`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Staysee API error: ${err}` }, { status: res.status })
    }

    const data = await res.json()
    // Stayseeのレスポンスをnormalize
    const properties = (data.properties || data.data || data || []).map((p: any) => ({
      id: String(p.id || p.property_id || ''),
      name: p.name || p.property_name || '（名称未設定）',
      pmsType: 'staysee',
      pmsConnected: true,
    }))

    return NextResponse.json({ properties })
  } catch (e) {
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
