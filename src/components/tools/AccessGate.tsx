import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PREMIUM_TOOLS = ['inbox-organizer', 'prompt-master', 'youtube-producer', 'pet-translator', 'ai-select-shop', 'vintage-hunter', 'ai-sidejob', 'location-finder']

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
    .select('status, plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (subscription) {
    const isPremiumTool = PREMIUM_TOOLS.includes(productId)
    // Premium tools require premium plan; standard tools work with any active subscription
    if (!isPremiumTool || subscription.plan === 'premium') {
      return <>{children}</>
    }
    // Standard plan user trying to access premium tool → show upgrade prompt
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6 py-16">
          <div className="text-6xl mb-6">💎</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            プレミアムプラン限定
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            このツールはプレミアムプラン（¥1,980/月）でご利用いただけます。<br />
            現在のスタンダードプランからアップグレードしてください。
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-violet-500 text-white font-semibold px-6 py-3 hover:bg-violet-600 transition-colors"
            >
              プレミアムにアップグレード
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md border border-gray-700 text-gray-300 font-medium px-6 py-3 hover:border-gray-500 hover:text-white transition-colors"
            >
              ツール一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    )
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
          このツールはプレミアムプラン（¥1,980/月）でご利用いただけます。<br />
          プランに加入してご利用ください。
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
            ツールの詳細を見る
          </Link>
        </div>
      </div>
    </div>
  )
}
