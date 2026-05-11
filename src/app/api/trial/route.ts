import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const TRIAL_LIMIT = 3 // 月3回まで無料体験

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: トライアル残回数を確認
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ canTry: false, reason: 'not_logged_in' })

  const now = new Date()
  const { data: usage } = await supabaseAdmin
    .from('trial_usage')
    .select('used_count, reset_at')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  // リセット日を過ぎていたら使用済みとみなさない
  const isReset = usage?.reset_at && new Date(usage.reset_at) <= now
  const usedCount = (usage && !isReset) ? usage.used_count : 0
  const remaining = Math.max(0, TRIAL_LIMIT - usedCount)

  return NextResponse.json({
    canTry: remaining > 0,
    remaining,
    limit: TRIAL_LIMIT,
    used: usedCount,
  })
}

// POST: トライアル使用を記録（ツール起動時に呼ぶ）
export async function POST(request: NextRequest) {
  const { productId } = await request.json()
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'not_logged_in' }, { status: 401 })

  const now = new Date()
  const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const { data: usage } = await supabaseAdmin
    .from('trial_usage')
    .select('id, used_count, reset_at')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  const isReset = usage?.reset_at && new Date(usage.reset_at) <= now

  if (!usage || isReset) {
    // 新規 or リセット後 → 1回目として挿入
    await supabaseAdmin.from('trial_usage').upsert({
      user_id: user.id,
      product_id: productId,
      used_count: 1,
      last_used_at: now.toISOString(),
      reset_at: nextMonthReset.toISOString(),
    }, { onConflict: 'user_id,product_id' })
    return NextResponse.json({ ok: true, remaining: TRIAL_LIMIT - 1 })
  }

  if (usage.used_count >= TRIAL_LIMIT) {
    return NextResponse.json({ ok: false, reason: 'limit_reached', remaining: 0 })
  }

  await supabaseAdmin
    .from('trial_usage')
    .update({
      used_count: usage.used_count + 1,
      last_used_at: now.toISOString(),
    })
    .eq('id', usage.id)

  return NextResponse.json({ ok: true, remaining: TRIAL_LIMIT - (usage.used_count + 1) })
}
