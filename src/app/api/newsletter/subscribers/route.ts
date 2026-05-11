import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

async function verifyAdmin(req: NextRequest) {
  const auth = req.headers.get('x-admin-email')
  return auth === ADMIN_EMAIL
}

// GET: 読者一覧取得
export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ ok: false, message: '権限がありません' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'active'
  const tag    = searchParams.get('tag')

  let query = supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('status', status)
    .order('subscribed_at', { ascending: false })

  if (tag) query = query.contains('tags', [tag])

  const { data, error } = await query
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, data })
}

// DELETE: 読者削除
export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ ok: false, message: '権限がありません' }, { status: 403 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ ok: false, message: 'id が必要です' }, { status: 400 })

  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

// PATCH: タグ更新
export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ ok: false, message: '権限がありません' }, { status: 403 })
  }

  const { id, tags } = await req.json()
  if (!id) return NextResponse.json({ ok: false, message: 'id が必要です' }, { status: 400 })

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ tags, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
