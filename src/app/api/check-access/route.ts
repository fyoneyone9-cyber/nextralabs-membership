import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ENTERPRISE_IDS, PREMIUM_IDS, STANDARD_IDS, LIGHT_IDS } from '@/lib/plan-ids'

// IDリストは src/lib/plan-ids.ts で一元管理。ここは編集しない。

export async function POST(request: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const { productId } = await request.json()
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 管理者は常に全アクセス
    if (user?.email === 'f.yoneyone9@gmail.com') {
      return NextResponse.json({ hasAccess: true, reason: 'admin' })
    }

    // 🏨 エンタープライズ専用 — プレミアムを含むいかなるプランでもアクセス不可
    if (ENTERPRISE_IDS.includes(productId)) {
      const hasEnterprise = user
        ? await (async () => {
            const { data: sub } = await supabase
              .from('subscriptions')
              .select('plan')
              .eq('user_id', user.id)
              .eq('status', 'active')
              .maybeSingle()
            return sub?.plan === 'enterprise'
          })()
        : false
      return NextResponse.json({
        hasAccess: hasEnterprise,
        reason: hasEnterprise ? 'authorized' : 'enterprise_required',
        plan: 'enterprise',
        requiredPlan: 'enterprise',
      })
    }

    // FREEツールはログイン不要で即通過
    const requiresPlan = [...PREMIUM_IDS, ...STANDARD_IDS, ...LIGHT_IDS].includes(productId)
    if (!requiresPlan) {
      return NextResponse.json({ hasAccess: true, reason: 'free' })
    }

    // 有料ツール: ログイン必須
    if (!user) {
      return NextResponse.json({ hasAccess: false, reason: 'not_logged_in' })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const userPlan = subscription?.plan || 'free'

    let hasAccess = false
    let requiredPlan = 'light'

    if (PREMIUM_IDS.includes(productId)) {
      hasAccess = userPlan === 'premium'
      requiredPlan = 'premium'
    } else if (STANDARD_IDS.includes(productId)) {
      hasAccess = ['premium', 'standard'].includes(userPlan)
      requiredPlan = 'standard'
    } else if (LIGHT_IDS.includes(productId)) {
      hasAccess = ['premium', 'standard', 'light'].includes(userPlan)
      requiredPlan = 'light'
    }

    return NextResponse.json({
      hasAccess,
      reason: hasAccess ? 'authorized' : 'plan_required',
      plan: userPlan,
      requiredPlan,
    })
  } catch (error: any) {
    console.error('Check access error:', error)
    return NextResponse.json({ hasAccess: false, reason: 'error' })
  }
}
