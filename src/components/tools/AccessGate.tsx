import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

// 辟｡譁吶ヤ繝ｼ繝ｫ
const FREE_TOOLS = ['office-politics-graph', 'moving-checker', 'sns-auto-poster', 'ai-report-generator', 'kdp-guide']

// 繝ｩ繧､繝医・繝ｩ繝ｳ莉･荳・
const LIGHT_TOOLS = ['shio-taiou', 'ai-konkatsu', 'comm-coach', 'prompt-master', 'ai-sidejob', 'resignation-assistant', 'closet-coach']

// 繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ莉･荳・
const STANDARD_TOOLS = ['exam-scheduler', 'disaster-guard', 'scam-defender', 'money-guard', 'ticket-scout', 'shopping-stopper', 'buzz-writer']

// 繝励Ξ繝溘い繝繝励Λ繝ｳ縺ｮ縺ｿ
const PREMIUM_TOOLS = ['pet-translator', 'vintage-hunter', 'location-finder', 'ai-select-shop', 'youtube-producer', 'inbox-organizer', 'sns-auto-poster-pro', 'smart-gardening', 'sales-automation']

// 菴懈・荳ｭ・亥・繝ｦ繝ｼ繧ｶ繝ｼ蛻ｩ逕ｨ荳榊庄・・
const DEVELOPMENT_TOOLS = ['ai-recipe']

const PLAN_LEVEL: Record<string, number> = {
  light: 1,
  standard: 2,
  premium: 3,
}

function getRequiredLevel(productId: string): number {
  if (FREE_TOOLS.includes(productId)) return 0
  if (LIGHT_TOOLS.includes(productId)) return 1
  if (STANDARD_TOOLS.includes(productId)) return 2
  if (PREMIUM_TOOLS.includes(productId)) return 3
  return 2
}

function getRequiredPlanName(level: number): string {
  if (level === 1) return '繝ｩ繧､繝医・繝ｩ繝ｳ・按･480/譛茨ｼ・
  if (level === 2) return '繧ｹ繧ｿ繝ｳ繝繝ｼ繝峨・繝ｩ繝ｳ・按･980/譛茨ｼ・
  return '繝励Ξ繝溘い繝繝励Λ繝ｳ・按･1,980/譛茨ｼ・
}

interface AccessGateProps {
  productId: string
  children: React.ReactNode
}

export async function AccessGate({ productId, children }: AccessGateProps) {
  // 菴懈・荳ｭ縺ｮ繝・・繝ｫ繧帝・譁ｭ
  if (DEVELOPMENT_TOOLS.includes(productId)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-10 font-sans">
        <div className="space-y-6">
          <div className="text-6xl animate-pulse">圦</div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Under Development</h1>
          <p className="text-slate-400 font-bold max-w-md">縺薙・繝・・繝ｫ縺ｯ迴ｾ蝨ｨ髢狗匱荳ｭ縺ｮ縺溘ａ縲√＃蛻ｩ逕ｨ縺・◆縺縺代∪縺帙ｓ縲・/p>
          <Link href="/products">
            <Button variant="outline" className="border-slate-800 text-slate-500 hover:bg-slate-900 font-black">荳隕ｧ縺ｫ謌ｻ繧・/Button>
          </Link>
        </div>
      </div>
    );
  }

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const requiredLevel = getRequiredLevel(productId)
  if (requiredLevel === 0) return <>{children}</>
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const userLevel = subscription ? (PLAN_LEVEL[subscription.plan] ?? 0) : 0
  if (userLevel >= requiredLevel) return <>{children}</>

  const requiredPlanName = getRequiredPlanName(requiredLevel)
  const isUpgrade = userLevel > 0

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6 py-16">
        <div className="text-6xl mb-6">{isUpgrade ? '筮・ｸ・ : '白'}</div>
        <h1 className="text-2xl font-bold text-white mb-4">{isUpgrade ? '繝励Λ繝ｳ縺ｮ繧｢繝・・繧ｰ繝ｬ繝ｼ繝峨′蠢・ｦ√〒縺・ : `${requiredPlanName}髯仙ｮ啻}</h1>
        <div className="flex flex-col gap-3">
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md bg-violet-500 text-white font-semibold px-6 py-3 hover:bg-violet-600 transition-colors">{isUpgrade ? '繧｢繝・・繧ｰ繝ｬ繝ｼ繝峨☆繧・ : '繝励Λ繝ｳ繧定ｦ九ｋ'}</Link>
          <Link href="/products" className="inline-flex items-center justify-center rounded-md border border-gray-700 text-gray-300 font-medium px-6 py-3 hover:border-gray-500 hover:text-white transition-colors">繝・・繝ｫ荳隕ｧ縺ｫ謌ｻ繧・/Link>
        </div>
      </div>
    
      </div>
  )
}


