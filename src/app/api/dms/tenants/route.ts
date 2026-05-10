import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

// ADMINかどうか検証（簡易: Authorizationヘッダー or body.adminKey）
function isAdmin(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-key') || ''
  return auth === process.env.DMS_ADMIN_KEY || auth === 'nextra-admin-2026'
}

/* ── GET: テナント一覧 ── */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('dms_tenants')
    .select('id, company_name, login_id, contact_email, contact_phone, plan, pms_type, status, created_at, last_login_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tenants: data || [] })
}

/* ── POST: テナント新規作成 ── */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { company_name, login_id, password, contact_email, contact_phone, plan, pms_type } = body

  if (!company_name || !login_id || !password) {
    return NextResponse.json({ error: '会社名・ログインID・パスワードは必須です' }, { status: 400 })
  }

  // パスワードをハッシュ化
  const password_hash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('dms_tenants')
    .insert({
      company_name,
      login_id,
      password_hash,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      plan: plan || 'standard',
      pms_type: pms_type || 'none',
      status: 'active',
    })
    .select('id, company_name, login_id, contact_email, contact_phone, plan, pms_type, status, created_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'そのログインIDは既に使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ tenant: data })
}

/* ── PATCH: テナント更新 ── */
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, password, ...fields } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const updates: Record<string, unknown> = { ...fields }
  if (password) {
    updates.password_hash = await bcrypt.hash(password, 10)
  }

  const { data, error } = await supabase
    .from('dms_tenants')
    .update(updates)
    .eq('id', id)
    .select('id, company_name, login_id, contact_email, contact_phone, plan, pms_type, status, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tenant: data })
}

/* ── DELETE: テナント削除 ── */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabase.from('dms_tenants').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
