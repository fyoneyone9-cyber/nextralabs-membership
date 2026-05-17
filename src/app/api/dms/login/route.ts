import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const SUPER_ADMIN = {
  login_id: 'f.yoneyone9@gmail.com',
  password: '10Birano6587',
}

// Cookie共通オプション
const cookieOpts = (env: string) => ({
  httpOnly: false,   // クライアントからも読める（dms_session をUIで参照するため）
  secure: env === 'production',
  sameSite: 'lax' as const,
  path: '/dms',
  maxAge: 60 * 60 * 8,  // 8時間
})

export async function POST(req: NextRequest) {
  const { login_id, password } = await req.json()

  if (!login_id || !password) {
    return NextResponse.json({ error: 'ID・パスワードを入力してください' }, { status: 400 })
  }

  // ── スーパーアドミン ──
  if (login_id === SUPER_ADMIN.login_id && password === SUPER_ADMIN.password) {
    // dms_tenants に super-admin レコードがあれば実UUID を使う
    // なければ upsert して作成（初回のみ）
    let tenantId = 'super-admin'
    let companyName = 'NextraLabs（管理者）'

    const { data: existing } = await supabase
      .from('dms_tenants')
      .select('id, company_name')
      .eq('login_id', login_id)
      .single()

    if (existing) {
      // 既存レコードのUUIDを使う
      tenantId = existing.id
      companyName = existing.company_name
    } else {
      // 初回：super-admin レコードを作成
      const hash = await bcrypt.hash(password, 10)
      const { data: created } = await supabase
        .from('dms_tenants')
        .insert({
          company_name: 'NextraLabs（管理者）',
          login_id,
          password_hash: hash,
          plan: 'admin',
          status: 'active',
        })
        .select('id, company_name')
        .single()

      if (created) {
        tenantId = created.id
        companyName = created.company_name
      }
      // insert失敗してもフォールバックとして 'super-admin' 文字列を使う
    }

    const sessionData = {
      id: tenantId,
      login_id,
      company_name: companyName,
      role: 'super_admin',
      plan: 'admin',
    }
    const res = NextResponse.json({ ok: true, session: sessionData })
    res.cookies.set('dms_session', JSON.stringify(sessionData), cookieOpts(process.env.NODE_ENV!))
    return res
  }

  // ── 通常テナント ──
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

  const sessionData = {
    id: tenant.id,
    login_id: tenant.login_id,
    company_name: tenant.company_name,
    role: 'tenant',
    plan: tenant.plan,
    pms_type: tenant.pms_type,
  }
  const res = NextResponse.json({ ok: true, session: sessionData })
  res.cookies.set('dms_session', JSON.stringify(sessionData), cookieOpts(process.env.NODE_ENV!))
  return res
}
