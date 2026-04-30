import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PREMIUM_TOOLS = ['inbox-organizer', 'prompt-master', 'youtube-producer', 'pet-translator', 'ai-select-shop', 'vintage-hunter', 'ai-sidejob']

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
    // Standard plan user trying to access premium tool 竊・show upgrade prompt
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6 py-16">
          <div className="text-6xl mb-6">虫</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            繝励Ξ繝溘い繝繝励Λ繝ｳ髯仙ｮ・          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            縺薙・繝・・繝ｫ縺ｯ繝励Ξ繝溘い繝繝励Λ繝ｳ・按･1,980/譛茨ｼ峨〒縺泌茜逕ｨ縺・◆縺縺代∪縺吶・br />
            迴ｾ蝨ｨ縺ｮ繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ縺九ｉ繧｢繝・・繧ｰ繝ｬ繝ｼ繝峨＠縺ｦ縺上□縺輔＞縲・          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-violet-500 text-white font-semibold px-6 py-3 hover:bg-violet-600 transition-colors"
            >
              繝励Ξ繝溘い繝縺ｫ繧｢繝・・繧ｰ繝ｬ繝ｼ繝・            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md border border-gray-700 text-gray-300 font-medium px-6 py-3 hover:border-gray-500 hover:text-white transition-colors"
            >
              繝・・繝ｫ荳隕ｧ縺ｫ謌ｻ繧・            </Link>
          </div>
        </div>
      </div>
    )
  }

  // No access
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6 py-16">
        <div className="text-6xl mb-6">白</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          繝励Ξ繝溘い繝莨壼藤髯仙ｮ・        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          縺薙・繝・・繝ｫ縺ｯ繝励Ξ繝溘い繝莨壼藤縺ｾ縺溘・蜊伜刀雉ｼ蜈･閠・・縺ｿ縺泌茜逕ｨ縺・◆縺縺代∪縺吶・          繝励Λ繝ｳ縺ｫ蜉蜈･縺吶ｋ縺九∝膚蜩√ｒ雉ｼ蜈･縺励※縺上□縺輔＞縲・        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-white text-gray-900 font-semibold px-6 py-3 hover:bg-gray-200 transition-colors"
          >
            繝励Λ繝ｳ繧定ｦ九ｋ
          </Link>
          <Link
            href={`/products/${productId}`}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 text-gray-300 font-medium px-6 py-3 hover:border-gray-500 hover:text-white transition-colors"
          >
            蝠・刀繝壹・繧ｸ縺ｫ謌ｻ繧・          </Link>
        </div>
      </div>
    </div>
  )
}
