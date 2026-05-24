/**
 * guard.ts — サーバーサイド プランガード
 * 各 /api/xxx/route.ts の POST/GET ハンドラ先頭で呼び出す。
 * plan-ids.ts の ID 定義と完全に連動する。
 */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PREMIUM_IDS, STANDARD_IDS, LIGHT_IDS, ENTERPRISE_IDS } from '@/lib/plan-ids'

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

export async function guardPlan(
  productId: string
): Promise<{ ok: boolean; status: number; error?: string }> {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未ログイン
  if (!user) {
    return { ok: false, status: 401, error: '認証が必要です' }
  }

  // 管理者は常に全パス通過
  if (user.email === ADMIN_EMAIL) {
    return { ok: true, status: 200 }
  }

  // FREE ツール（plan-ids.ts のどのリストにも載っていない）は全員通過
  const isPaidTool = [
    ...ENTERPRISE_IDS,
    ...PREMIUM_IDS,
    ...STANDARD_IDS,
    ...LIGHT_IDS,
  ].includes(productId)
  if (!isPaidTool) {
    return { ok: true, status: 200 }
  }

  // サブスクリプション取得
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const plan = sub?.plan ?? 'free'

  if (ENTERPRISE_IDS.includes(productId)) {
    if (plan !== 'enterprise') {
      return { ok: false, status: 403, error: 'エンタープライズプランが必要です' }
    }
  } else if (PREMIUM_IDS.includes(productId)) {
    if (plan !== 'premium') {
      return { ok: false, status: 403, error: 'プレミアムプランへのアップグレードが必要です' }
    }
  } else if (STANDARD_IDS.includes(productId)) {
    if (!['premium', 'standard'].includes(plan)) {
      return { ok: false, status: 403, error: 'スタンダード以上のプランが必要です' }
    }
  } else if (LIGHT_IDS.includes(productId)) {
    if (!['premium', 'standard', 'light'].includes(plan)) {
      return { ok: false, status: 403, error: 'ライト以上のプランが必要です' }
    }
  }

  return { ok: true, status: 200 }
}
