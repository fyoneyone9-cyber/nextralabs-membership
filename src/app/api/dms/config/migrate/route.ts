/**
 * /api/dms/config/migrate
 * dms_tenants テーブルに設定カラムを追加するマイグレーション
 * GET ?key=nextra-admin-2026 で実行
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== 'nextra-admin-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 追加すべきカラム定義
  const columns = [
    { name: 'pms_type',        def: "text DEFAULT 'none'" },
    { name: 'pms_fields',      def: 'jsonb DEFAULT \'{}\'::jsonb' },
    { name: 'lock_type',       def: "text DEFAULT 'fixed'" },
    { name: 'lock_fields',     def: 'jsonb DEFAULT \'{}\'::jsonb' },
    { name: 'daily_api_key',   def: "text DEFAULT ''" },
    { name: 'org_name',        def: "text DEFAULT ''" },
    { name: 'fixed_password',  def: "text DEFAULT '8421'" },
  ]

  const results: { column: string; status: string; error?: string }[] = []

  for (const col of columns) {
    // カラムが既に存在するか確認
    const { data: existing } = await supabase
      .from('dms_tenants')
      .select(col.name)
      .limit(1)

    if (existing !== null) {
      results.push({ column: col.name, status: 'already_exists' })
      continue
    }

    // Supabase SQL Editor用のSQLを返す（直接実行はRLSの関係で難しいため）
    results.push({
      column: col.name,
      status: 'needs_sql',
      error: `ALTER TABLE dms_tenants ADD COLUMN IF NOT EXISTS ${col.name} ${col.def};`,
    })
  }

  const needsSql = results.filter(r => r.status === 'needs_sql')

  if (needsSql.length > 0) {
    const sql = needsSql.map(r => r.error).join('\n')
    return NextResponse.json({
      ok: false,
      message: 'Supabase SQL Editorで以下のSQLを実行してください',
      sql,
      results,
    })
  }

  return NextResponse.json({ ok: true, message: '全カラム確認済み', results })
}
