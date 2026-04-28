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

    // 1. 有料プラン（サブスク active）があれば全商品アクセスOK
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subscription) {
      return NextResponse.json({ hasAccess: true, reason: 'subscription' })
    }

    // 2. 単品購入チェック
    if (productId) {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('status')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('status', 'completed')
        .single()

      if (purchase) {
        return NextResponse.json({ hasAccess: true, reason: 'purchase' })
      }
    }

    return NextResponse.json({ hasAccess: false, reason: 'no_access' })
  } catch (error: any) {
    console.error('Check access error:', error)
    return NextResponse.json({ hasAccess: false, reason: 'error' })
  }
}
