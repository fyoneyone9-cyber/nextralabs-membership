import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 物件一覧取得
export async function GET() {
  const { data, error } = await supabase
    .from('dms_properties')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ properties: data || [] })
}

// POST: 物件新規作成
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name, pms_type = '', pms_connected = false } = body
  if (!name?.trim()) return NextResponse.json({ error: '物件名は必須です' }, { status: 400 })

  const { data, error } = await supabase
    .from('dms_properties')
    .insert({ id: crypto.randomUUID(), name: name.trim(), pms_type, pms_connected })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: data })
}

// PUT: 物件更新（バルクUPSERT用）
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { properties } = body
  if (!Array.isArray(properties)) return NextResponse.json({ error: 'properties must be array' }, { status: 400 })

  const { error } = await supabase
    .from('dms_properties')
    .upsert(properties.map((p: any) => ({
      id: p.id || crypto.randomUUID(),
      name: p.name,
      pms_type: p.pms_type || p.pmsType || '',
      pms_connected: p.pms_connected ?? p.pmsConnected ?? false,
      updated_at: new Date().toISOString(),
    })), { onConflict: 'id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: 物件削除
export async function DELETE(req: NextRequest) {
  const { id } = await req.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase.from('dms_properties').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
