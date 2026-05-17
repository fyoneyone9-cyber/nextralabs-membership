import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const key = req.nextUrl.searchParams.get('key')
  if (key !== 'nextra-admin-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // テーブルが既に存在するか確認（dms_tenantsにSELECTを試みる）
  const supabase = createClient(supabaseUrl, serviceKey)
  const { error: checkErr } = await supabase.from('dms_tenants').select('id').limit(1)

  if (!checkErr) {
    return NextResponse.json({ ok: true, message: 'dms_tenants テーブルは既に存在します', exists: true })
  }

  // テーブルが存在しない場合: Supabase REST /query エンドポイントで作成
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

  // supabase-js v2: sql タグを使って生SQLを実行
  const { error } = await supabase.rpc('exec_sql', { sql }).single()

  if (error) {
    // exec_sql RPCがない場合はSQLを返して手動実行を案内
    return NextResponse.json({
      ok: false,
      message: 'テーブルが存在しないため、Supabase SQL Editorで以下のSQLを実行してください',
      sql: sql.trim(),
      error: error.message,
    }, { status: 200 }) // 200で返して見やすくする
  }

  return NextResponse.json({ ok: true, message: 'dms_tenants テーブルを作成しました' })
}
