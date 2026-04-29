import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

const PRODUCT_PRICES: Record<string, string> = {
  'office-politics-graph': 'price_1TQxDF5HQYoJh51tFVXN1dxa',
  'vintage-hunter': 'price_1TQx1J5HQYoJh51tTM9RUG3C',
  'pet-translator': 'price_1TQxOl5HQYoJh51tljGeIR5q',
  'shopping-stopper': 'price_1TQzP85HQYoJh51t7WxcFA3R',
  'ai-select-shop': 'price_1TQzcL5HQYoJh51trjl09stO',
  'resignation-assistant': 'price_1TRDd05HQYoJh51tSzMhM8aM',
  'ai-konkatsu': 'price_1TRDwF5HQYoJh51tGfyO8RiX',
  'scam-defender': 'price_1TREBw5HQYoJh51tItYeDOzQu',
  'money-guard': 'price_1TREUG5HQYoJh51tA3byMETJ',
  'moving-checker': 'price_1TREg65HQYoJh51tCt3YZc7B',
  'buzz-writer': 'price_1TREu35HQYoJh51tgGd6ZmVM',
  'comm-coach': 'price_1TRFcM5HQYoJh51t5AtDIqY9',
  'closet-coach': 'price_1TRFta5HQYoJh51tHy0EJp4C',
  'disaster-guard': 'price_1TRGjV5HQYoJh51tjqxbF15C',
  'prompt-master': 'price_1TRHMx5HQYoJh51tI6CAvkWx',
  'ai-sidejob': 'price_1TRI0f5HQYoJh51tFa9Vk6lK',
  'youtube-producer': 'price_1TRRuJ5HQYoJh51tn0zRAEm9',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body

    const priceId = PRODUCT_PRICES[productId]
    if (!priceId) {
      return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
    }

    // ログイン中ユーザーを取得（未ログインでも購入可能）
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const metadata: Record<string, string> = { product_id: productId }
    if (user) {
      metadata.user_id = user.id
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://membership-site-nextralabos.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/products/${productId}?checkout=success`,
      cancel_url: `${baseUrl}/products/${productId}?checkout=cancel`,
      metadata,
      ...(user?.email ? { customer_email: user.email } : {}),
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Product checkout error:', error)
    return NextResponse.json(
      { error: 'チェックアウトセッションの作成に失敗しました', detail: error?.message || String(error) },
      { status: 500 }
    )
  }
}
