export const runtime = 'nodejs'

/**
 * exam-temp: Googleドキュメント保存用コンテンツの一時保存
 * Vercel Serverlessはインスタンスが分散するためメモリキャッシュ不可 → Supabaseに保存
 * TTL: 10分（expires_at列で管理）
 *
 * Supabase SQLエディタで以下を実行してテーブルを作成してください:
 * https://supabase.com/dashboard/project/jidaseiiyamrhyvukasch/sql/new
 *
 * CREATE TABLE IF NOT EXISTS exam_temp (
 *   key TEXT PRIMARY KEY,
 *   title TEXT NOT NULL DEFAULT 'AI模擬試験問題集',
 *   content TEXT NOT NULL,
 *   expires_at TIMESTAMPTZ NOT NULL
 * );
 * -- 期限切れ行を自動削除（pg_cron等がなくてもGET時に削除する）
 */

import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function supabaseFetch(path: string, options: RequestInit) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
      ...(options.headers || {}),
    },
  })
}

// POST: 保存 → { key }
export async function POST(req: NextRequest) {
  noStore()
  const { title, content } = await req.json()
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 })

  const key = Math.random().toString(36).slice(2) + Date.now().toString(36)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const res = await supabaseFetch('/exam_temp', {
    method: 'POST',
    body: JSON.stringify({ key, title: title || 'AI模擬試験問題集', content, expires_at: expiresAt }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('exam-temp POST error:', err)
    return NextResponse.json({ error: 'save failed', detail: err }, { status: 500 })
  }

  return NextResponse.json({ key })
}

// GET: 取り出し → { title, content }（取得後削除）
export async function GET(req: NextRequest) {
  noStore()
  const key = new URL(req.url).searchParams.get('key') || ''
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  const res = await supabaseFetch(`/exam_temp?key=eq.${encodeURIComponent(key)}&select=title,content,expires_at`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  })

  if (!res.ok) return NextResponse.json({ error: 'fetch failed' }, { status: 500 })

  const rows = await res.json()
  if (!rows || rows.length === 0) return NextResponse.json({ error: 'not found or expired' }, { status: 404 })

  const row = rows[0]
  if (new Date(row.expires_at) < new Date()) {
    return NextResponse.json({ error: 'expired' }, { status: 404 })
  }

  // 取得後削除
  await supabaseFetch(`/exam_temp?key=eq.${encodeURIComponent(key)}`, { method: 'DELETE' })

  return NextResponse.json({ title: row.title, content: row.content })
}
