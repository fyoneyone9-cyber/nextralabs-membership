import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

const STAYSEE_BASE = 'https://api.staysee.jp/v1'

function getTenantApiKey(req: NextRequest): string {
  // リクエストヘッダー優先、なければlocalStorageから渡されたヘッダー
  return req.headers.get('x-staysee-api-key') || process.env.STAYSEE_API_KEY || ''
}

export async function GET(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const apiKey = getTenantApiKey(req)
  if (!apiKey) {
    return NextResponse.json({ error: 'Staysee APIキーが設定されていません。PMS設定から入力してください。' }, { status: 400 })
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
      return NextResponse.json({ error: `Staysee API エラー: ${err}` }, { status: res.status })
    }

    const data = await res.json()
    const properties = (data.properties || data.data || data || []).map((p: any) => ({
      id: String(p.id || p.property_id || crypto.randomUUID()),
      name: p.name || p.property_name || '（名称未設定）',
      pms_type: 'staysee',
      pms_connected: true,
    }))

    return NextResponse.json({ properties })
  } catch {
    return NextResponse.json({ error: 'Staysee APIへの接続に失敗しました' }, { status: 500 })
  }
}
