import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

async function verifyAdmin(req: NextRequest) {
  return req.headers.get('x-admin-email') === ADMIN_EMAIL
}

// GET: テンプレート一覧
export async function GET(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (!await verifyAdmin(req)) return NextResponse.json({ ok: false }, { status: 403 })

  const { data, error } = await supabase
    .from('newsletter_templates')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}

// POST: テンプレート保存
export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (!await verifyAdmin(req)) return NextResponse.json({ ok: false }, { status: 403 })

  const { id, title, subject, body } = await req.json()
  if (!title || !subject || !body) {
    return NextResponse.json({ ok: false, message: 'title・subject・body は必須です' }, { status: 400 })
  }

  const now = new Date().toISOString()

  if (id) {
    // 更新
    const { error } = await supabase
      .from('newsletter_templates')
      .update({ title, subject, body, updated_at: now })
      .eq('id', id)
    if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  } else {
    // 新規
    const { error } = await supabase
      .from('newsletter_templates')
      .insert({ title, subject, body, created_at: now, updated_at: now })
    if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE: テンプレート削除
export async function DELETE(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (!await verifyAdmin(req)) return NextResponse.json({ ok: false }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ ok: false, message: 'id が必要です' }, { status: 400 })

  const { error } = await getSupabase().from('newsletter_templates').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
