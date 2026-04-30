import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client (uses service role key for direct DB writes)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session: any = event.data.object
        const userId = session.metadata?.user_id
        
        if (!userId) break

        if (session.mode === 'subscription') {
          // サブスクリプション購入完了
          const subscriptionData: any = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const plan = session.metadata?.plan || 'standard'
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionData.id,
            plan,
            status: subscriptionData.status,
            current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
          }, { onConflict: 'user_id' })
        } else if (session.mode === 'payment') {
          // 単品購入完了 — purchases テーブルに記録
          const productId = session.metadata?.product_id
          if (productId) {
            await supabaseAdmin.from('purchases').upsert({
              user_id: userId,
              product_id: productId,
              stripe_session_id: session.id,
              status: 'completed',
            }, { onConflict: 'user_id,product_id' })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subUpdated: any = event.data.object
        const customerId = subUpdated.customer as string

        // customer IDからユーザーを検索
        const { data: existingSub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle()

        if (existingSub) {
          // Determine plan from price ID
          const priceId = subUpdated.items?.data?.[0]?.price?.id
          const updatedPlan = priceId === process.env.STRIPE_PREMIUM_PRICE_ID ? 'premium' : 'standard'
          await supabaseAdmin.from('subscriptions').update({
            status: subUpdated.status,
            plan: updatedPlan,
            current_period_start: new Date(subUpdated.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subUpdated.current_period_end * 1000).toISOString(),
          }).eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subDeleted: any = event.data.object
        const customerId = subDeleted.customer as string

        await supabaseAdmin.from('subscriptions').update({
          status: 'canceled',
        }).eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice: any = event.data.object
        const subscriptionId = invoice.subscription as string
        if (subscriptionId) {
          await supabaseAdmin.from('subscriptions').update({
            status: 'active',
          }).eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoiceFailed: any = event.data.object
        const subscriptionId = invoiceFailed.subscription as string
        if (subscriptionId) {
          await supabaseAdmin.from('subscriptions').update({
            status: 'past_due',
          }).eq('stripe_subscription_id', subscriptionId)
        }
        break
      }
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
