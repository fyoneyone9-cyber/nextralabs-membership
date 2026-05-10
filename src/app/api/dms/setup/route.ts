import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/dms/setup?key=nextra-admin-2026
 * dms_tenants テーブルを作成する（初回セットアップ用）
 * Service Role Key が必要なため、サーバーサイドでのみ実行可能
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== 'nextra-admin-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // テーブル作成 SQL（IF NOT EXISTS で冪等）
  const sql = `
    CREATE TABLE IF NOT EXISTS dms_tenants (
      id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
      company_name  text        NOT NULL,
      login_id      text        UNIQUE NOT NULL,
      password_hash text        NOT NULL,
      contact_email text,
      contact_phone text,
      plan          text        DEFAULT 'standard',
      pms_type      text        DEFAULT 'none',
      status        text        DEFAULT 'active',
      created_at    timestamptz DEFAULT now(),
      last_login_at timestamptz
    );
  `

  // supabase-js ではrawSQLを直接実行できないため、
  // rpc か postgrest の / エンドポイント経由で実行
  // → Service Role Key で直接 REST API を叩く
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey':        process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ sql }),
  })

  if (!response.ok) {
    // exec_sql RPC がない場合は Management API を使う
    const mgmtRes = await fetch(
      `https://api.supabase.com/v1/projects/${extractProjectRef()}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ query: sql }),
      }
    )
    if (!mgmtRes.ok) {
      const errText = await mgmtRes.text()
      return NextResponse.json({ error: errText, hint: 'Supabase SQL Editorで手動実行してください', sql }, { status: 500 })
    }
    return NextResponse.json({ ok: true, method: 'management-api' })
  }

  return NextResponse.json({ ok: true, method: 'rpc' })
}

function extractProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return url.replace('https://', '').replace('.supabase.co', '')
}
