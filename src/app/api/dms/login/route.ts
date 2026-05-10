import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SUPER_ADMIN = {
  login_id: 'f.yoneyone9@gmail.com',
  password: '10Birano6587',
}

export async function POST(req: NextRequest) {
  const { login_id, password } = await req.json()

  if (!login_id || !password) {
    return NextResponse.json({ error: 'ID・パスワードを入力してください' }, { status: 400 })
  }

  // スーパーアドミン（マスター管理者）
  if (login_id === SUPER_ADMIN.login_id && password === SUPER_ADMIN.password) {
    return NextResponse.json({
      ok: true,
      session: {
        id: 'super-admin',
        login_id,
        company_name: 'NextraLabs（管理者）',
        role: 'super_admin',
        plan: 'admin',
      }
    })
  }

  // Supabase dms_tenants からログインID検索
  const { data: tenant, error } = await supabase
    .from('dms_tenants')
    .select('id, company_name, login_id, password_hash, plan, pms_type, status')
    .eq('login_id', login_id)
    .single()

  if (error || !tenant) {
    return NextResponse.json({ error: 'IDまたはパスワードが正しくありません' }, { status: 401 })
  }

  if (tenant.status !== 'active') {
    return NextResponse.json({ error: 'このアカウントは無効化されています' }, { status: 403 })
  }

  const valid = await bcrypt.compare(password, tenant.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'IDまたはパスワードが正しくありません' }, { status: 401 })
  }

  // 最終ログイン日時を更新
  await supabase
    .from('dms_tenants')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', tenant.id)

  return NextResponse.json({
    ok: true,
    session: {
      id: tenant.id,
      login_id: tenant.login_id,
      company_name: tenant.company_name,
      role: 'tenant',
      plan: tenant.plan,
      pms_type: tenant.pms_type,
    }
  })
}
