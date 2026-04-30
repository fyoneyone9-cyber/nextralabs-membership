import { NextResponse, NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const plan = body.plan || 'standard'

    const priceId = plan === 'premium'
      ? process.env.STRIPE_PREMIUM_PRICE_ID
      : process.env.STRIPE_STANDARD_PRICE_ID

    if (!priceId) {
      return NextResponse.json({ error: 'Price IDが設定されていません' }, { status: 500 })
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // 既存のStripe customerを確認（.maybeSingle()で0件でもエラーにしない）
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      // 新しいStripe customerを作成
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    }

    // Checkout sessionを作成
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://membership-site-nextralabos.vercel.app'}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://membership-site-nextralabos.vercel.app'}/pricing?checkout=cancel`,
      metadata: { user_id: user.id, plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error?.message, error?.type, error?.statusCode)
    return NextResponse.json(
      { error: error?.message || 'チェックアウトセッションの作成に失敗しました' },
      { status: error?.statusCode || 500 }
    )
  }
}
