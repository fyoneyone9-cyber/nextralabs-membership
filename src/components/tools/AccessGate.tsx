import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface AccessGateProps {
  productId: string
  children: React.ReactNode
}

export async function AccessGate({ productId, children }: AccessGateProps) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (subscription) {
    return <>{children}</>
  }

  // Check single purchase
  const { data: purchase } = await supabase
    .from('purchases')
    .select('status')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('status', 'completed')
    .single()

  if (purchase) {
    return <>{children}</>
  }

  // No access
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6 py-16">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          プレミアム会員限定
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          このツールはプレミアム会員または単品購入者のみご利用いただけます。
          プランに加入するか、商品を購入してください。
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-white text-gray-900 font-semibold px-6 py-3 hover:bg-gray-200 transition-colors"
          >
            プランを見る
          </Link>
          <Link
            href={`/products/${productId}`}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 text-gray-300 font-medium px-6 py-3 hover:border-gray-500 hover:text-white transition-colors"
          >
            商品ページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
