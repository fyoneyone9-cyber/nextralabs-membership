/**
 * exam-temp: Googleドキュメント保存用の問題集コンテンツを一時保存するAPI
 * OAuthリダイレクト前にcontentを保存し、callback後に取り出す
 * Vercel Serverless (nodejs) のインスタンス内メモリキャッシュを使用
 * TTL: 10分
 */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

interface CacheEntry { content: string; title: string; expires: number }
const cache = new Map<string, CacheEntry>()

// 期限切れエントリを掃除
function purgeExpired() {
  const now = Date.now()
  for (const [k, v] of cache.entries()) {
    if (v.expires < now) cache.delete(k)
  }
}

// POST: 保存 → { key }
export async function POST(req: NextRequest) {
  noStore()
  const { title, content } = await req.json()
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 })
  purgeExpired()
  const key = Math.random().toString(36).slice(2) + Date.now().toString(36)
  cache.set(key, { title: title || 'AI模擬試験問題集', content, expires: Date.now() + 10 * 60 * 1000 })
  return NextResponse.json({ key })
}

// GET: 取り出し → { title, content } (取得後削除)
export async function GET(req: NextRequest) {
  noStore()
  const key = new URL(req.url).searchParams.get('key') || ''
  const entry = cache.get(key)
  if (!entry || entry.expires < Date.now()) {
    return NextResponse.json({ error: 'not found or expired' }, { status: 404 })
  }
  cache.delete(key)
  return NextResponse.json({ title: entry.title, content: entry.content })
}
