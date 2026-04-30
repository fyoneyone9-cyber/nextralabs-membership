import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ hasAccess: false, reason: 'not_logged_in' })
    }

    const PREMIUM_TOOLS = ['inbox-organizer', 'prompt-master', 'youtube-producer', 'pet-translator', 'ai-select-shop', 'vintage-hunter', 'ai-sidejob']

    // 1. サブスクチェック
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (subscription) {
      const isPremiumTool = PREMIUM_TOOLS.includes(productId)
      if (!isPremiumTool || subscription.plan === 'premium') {
        return NextResponse.json({ hasAccess: true, reason: 'subscription', plan: subscription.plan })
      }
      return NextResponse.json({ hasAccess: false, reason: 'premium_required', plan: subscription.plan })
    }

    return NextResponse.json({ hasAccess: false, reason: 'no_access' })
  } catch (error: any) {
    console.error('Check access error:', error)
    return NextResponse.json({ hasAccess: false, reason: 'error' })
  }
}
