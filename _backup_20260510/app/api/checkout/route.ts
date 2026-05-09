import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

/**
 * 🛠️ Master Price ID Map (MEMORY.mdに基づく)
 * 環境変数がない場合のフェイルセーフとしてハードコード
 */
const PRICE_IDS = {
  // ⚠️ 必ずVercel環境変数 STRIPE_LIGHT_PRICE_ID を設定してください
  // ここのフォールバック値は本番では使わないこと
  light: process.env.STRIPE_LIGHT_PRICE_ID || '',
  standard: 'price_1TRYU05HQYoJh51tWIeoMqf0',
  premium: 'price_1TRYVG5HQYoJh51tKFh7eI3x'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const plan = body.plan || 'standard'
    const accessToken = body.access_token

    // 環境変数を優先し、なければハードコードから取得
    let priceId = "";
    if (plan === 'premium') priceId = process.env.STRIPE_PREMIUM_PRICE_ID || PRICE_IDS.premium;
    else if (plan === 'light') priceId = process.env.STRIPE_LIGHT_PRICE_ID || PRICE_IDS.light;
    else priceId = process.env.STRIPE_STANDARD_PRICE_ID || PRICE_IDS.standard;

    console.log(`[CHECKOUT] Initializing for plan: ${plan}, priceId: ${priceId}`);

    if (!priceId) {
      console.error(`[CHECKOUT] Price ID missing for plan: ${plan}. Set STRIPE_${plan.toUpperCase()}_PRICE_ID in Vercel env.`)
      return NextResponse.json({ error: `Stripe Price IDが設定されていません（plan: ${plan}）。Vercelの環境変数を確認してください。` }, { status: 500 })
    }

    let user: any = null
    try {
      const supabaseServer = createServerSupabaseClient()
      const { data } = await supabaseServer.auth.getUser()
      user = data?.user
    } catch {}

    if (!user && accessToken) {
      try {
        const supabaseToken = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        )
        const { data } = await supabaseToken.auth.getUser()
        user = data?.user
      } catch {}
    }

    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: subscription } = await supabaseService
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://membership-site-nextralabos.vercel.app'}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://membership-site-nextralabos.vercel.app'}/pricing?checkout=cancel`,
      metadata: { user_id: user.id, plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'チェックアウトセッションの作成に失敗しました' },
      { status: 500 }
    )
  }
}
