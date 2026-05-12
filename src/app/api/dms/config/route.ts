/**
 * /api/dms/config
 * テナント設定のクラウド読み書きAPI
 *
 * GET  → そのテナントの設定を返す
 * POST → そのテナントの設定を更新する
 *
 * 認証: Cookie "dms_session" (JSON: { id, role, ... })
 *   - id が実UUID → dms_tenants の当該レコードを更新
 *   - id が 'super-admin'（旧セッション互換） → デフォルト値を返す（保存不可）
 *
 * dms_tenants に必要なカラム:
 *   pms_type       text    DEFAULT 'none'
 *   pms_fields     jsonb   DEFAULT '{}'
 *   lock_type      text    DEFAULT 'fixed'
 *   lock_fields    jsonb   DEFAULT '{}'
 *   daily_api_key  text    DEFAULT ''
 *   org_name       text    DEFAULT ''
 *   fixed_password text    DEFAULT '8421'
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEFAULTS = {
  pms_type: 'none',
  pms_fields: {} as Record<string, string>,
  lock_type: 'fixed',
  lock_fields: {} as Record<string, string>,
  daily_api_key: '',
  org_name: '',
  fixed_password: '8421',
}

function getSession(req: NextRequest): { id: string; role: string } | null {
  try {
    const cookie = req.cookies.get('dms_session')?.value
    if (!cookie) return null
    return JSON.parse(cookie)
  } catch { return null }
}

/* ── GET: 設定取得 ── */
export async function GET(req: NextRequest) {
  const session = getSession(req)
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 })

  // 旧セッション互換（'super-admin' 文字列 ID）
  if (session.id === 'super-admin') {
    return NextResponse.json({
      ...DEFAULTS,
      _warning: 'super-adminの旧セッションです。再ログインすると設定の保存が可能になります。'
    })
  }

  const { data, error } = await supabase
    .from('dms_tenants')
    .select('pms_type, pms_fields, lock_type, lock_fields, daily_api_key, org_name, fixed_password')
    .eq('id', session.id)
    .single()

  if (error || !data) {
    // カラム未追加 or レコード不在 → デフォルト値を返す（エラーにしない）
    return NextResponse.json(DEFAULTS)
  }

  // null を DEFAULTS でフォールバック
  return NextResponse.json({
    pms_type:       data.pms_type       ?? DEFAULTS.pms_type,
    pms_fields:     data.pms_fields      ?? DEFAULTS.pms_fields,
    lock_type:      data.lock_type       ?? DEFAULTS.lock_type,
    lock_fields:    data.lock_fields     ?? DEFAULTS.lock_fields,
    daily_api_key:  data.daily_api_key   ?? DEFAULTS.daily_api_key,
    org_name:       data.org_name        ?? DEFAULTS.org_name,
    fixed_password: data.fixed_password  ?? DEFAULTS.fixed_password,
  })
}

/* ── POST: 設定保存 ── */
export async function POST(req: NextRequest) {
  const session = getSession(req)
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 })

  // 旧セッション互換（'super-admin'）は保存不可 → 再ログインを促す
  if (session.id === 'super-admin') {
    return NextResponse.json({
      error: '旧セッションのため設定を保存できません。一度ログアウトして再ログインしてください。',
      needsRelogin: true,
    }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))

  // 許可されたキーのみ更新（セキュリティ）
  const allowed = ['pms_type', 'pms_fields', 'lock_type', 'lock_fields', 'daily_api_key', 'org_name', 'fixed_password']
  const patch: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) patch[key] = body[key]
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: '更新するフィールドがありません' }, { status: 400 })
  }

  const { error } = await supabase
    .from('dms_tenants')
    .update(patch)
    .eq('id', session.id)

  if (error) {
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      return NextResponse.json({
        error: 'DBカラムが未追加です。Supabase SQL Editorで以下を実行してください：\n\nALTER TABLE dms_tenants ADD COLUMN IF NOT EXISTS pms_type text DEFAULT \'none\', ADD COLUMN IF NOT EXISTS pms_fields jsonb DEFAULT \'{}\'::jsonb, ADD COLUMN IF NOT EXISTS lock_type text DEFAULT \'fixed\', ADD COLUMN IF NOT EXISTS lock_fields jsonb DEFAULT \'{}\'::jsonb, ADD COLUMN IF NOT EXISTS daily_api_key text DEFAULT \'\', ADD COLUMN IF NOT EXISTS org_name text DEFAULT \'\', ADD COLUMN IF NOT EXISTS fixed_password text DEFAULT \'8421\';',
        needsMigration: true,
        sql: "ALTER TABLE dms_tenants ADD COLUMN IF NOT EXISTS pms_type text DEFAULT 'none', ADD COLUMN IF NOT EXISTS pms_fields jsonb DEFAULT '{}'::jsonb, ADD COLUMN IF NOT EXISTS lock_type text DEFAULT 'fixed', ADD COLUMN IF NOT EXISTS lock_fields jsonb DEFAULT '{}'::jsonb, ADD COLUMN IF NOT EXISTS daily_api_key text DEFAULT '', ADD COLUMN IF NOT EXISTS org_name text DEFAULT '', ADD COLUMN IF NOT EXISTS fixed_password text DEFAULT '8421';"
      }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
