export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const LOCAL_API = 'http://127.0.0.1:8000'
const ALLOWED_EMAIL = 'f.yoneyone9@gmail.com'

async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ALLOWED_EMAIL) return null
  return user
}

// ローカル ComfyUI API への中継
async function proxyLocal(path: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${LOCAL_API}${path}`, {
      ...options,
      signal: AbortSignal.timeout(600_000), // 10分タイムアウト
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    if (e?.name === 'TimeoutError' || e?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'ローカルAPIサーバーに接続できません。api_server.py を起動してください。' },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action') || 'status'

  if (action === 'status') {
    return proxyLocal('/api/status')
  }
  if (action === 'pages') {
    return proxyLocal('/api/pages')
  }
  if (action === 'templates') {
    return proxyLocal('/api/templates')
  }
  if (action === 'models') {
    return proxyLocal('/api/models')
  }
  if (action === 'download') {
    const prefix = searchParams.get('prefix') || 'manga_preview'
    try {
      const res = await fetch(`${LOCAL_API}/api/download/pdf?prefix=${prefix}`, {
        signal: AbortSignal.timeout(30_000),
      })
      if (!res.ok) return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
      const blob = await res.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${prefix}.pdf"`,
        },
      })
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 })
    }
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const action = body.action

  if (action === 'generate') {
    return proxyLocal('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        script: body.script,
        page_prefix: body.page_prefix || 'manga',
        panels_per_page: body.panels_per_page || 3,
      }),
    })
  }
  if (action === 'update_prompt') {
    return proxyLocal('/api/pages/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_name: body.page_name,
        panel: body.panel,
        prompt: body.prompt,
        dialogue: body.dialogue,
      }),
    })
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
