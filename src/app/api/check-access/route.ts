import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// =============================================
// 🔒 プラン別ツール分類 (AccessGate.tsx と完全統一)
// =============================================

const PREMIUM_IDS = [
  'inbox-organizer',
  'prompt-master',
  'youtube-producer',
  'pet-translator',
  'ai-select-shop',
  'staysee-ai-finder',
  'ai-sidejob',
  'interior-coordinator',
  'youtube-coordinator',
]

const STANDARD_IDS = [
  'buy-smart-nav',
  'scam-defender',
  'shopping-stopper',
  'closet-coach',
  'buzz-writer',
  'comm-coach',
  'resignation-assistant',
  'money-guard',
  'shio-taiou',
  'trend-stock',
]

const LIGHT_IDS = [
  'expense-sync',
  'contact-sync',
]

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ hasAccess: false, reason: 'not_logged_in' })
    }

    // 管理者は常に通過
    if (user.email === 'f.yoneyone9@gmail.com') {
      return NextResponse.json({ hasAccess: true, reason: 'admin' })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const userPlan = subscription?.plan || 'free'

    let hasAccess = false

    if (PREMIUM_IDS.includes(productId)) {
      hasAccess = userPlan === 'premium'
    } else if (STANDARD_IDS.includes(productId)) {
      hasAccess = ['premium', 'standard'].includes(userPlan)
    } else if (LIGHT_IDS.includes(productId)) {
      hasAccess = ['premium', 'standard', 'light'].includes(userPlan)
    } else {
      // 無料ツール：ログインのみで通過
      hasAccess = true
    }

    return NextResponse.json({
      hasAccess,
      reason: hasAccess ? 'authorized' : 'plan_required',
      plan: userPlan,
    })
  } catch (error: any) {
    console.error('Check access error:', error)
    return NextResponse.json({ hasAccess: false, reason: 'error' })
  }
}
