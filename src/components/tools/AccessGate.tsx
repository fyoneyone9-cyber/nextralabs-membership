import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

// 無料ツール
const FREE_TOOLS = ['office-politics-graph', 'moving-checker', 'sns-auto-poster', 'ai-report-generator', 'kdp-guide']

// ライトプラン以上
const LIGHT_TOOLS = ['shio-taiou', 'ai-konkatsu', 'comm-coach', 'prompt-master', 'ai-sidejob', 'resignation-assistant', 'closet-coach']

// スタンダードプラン以上
const STANDARD_TOOLS = ['exam-scheduler', 'disaster-guard', 'scam-defender', 'money-guard', 'ticket-scout', 'shopping-stopper', 'buzz-writer']

// プレミアムプランのみ
const PREMIUM_TOOLS = ['pet-translator', 'vintage-hunter', 'location-finder', 'ai-select-shop', 'youtube-producer', 'inbox-organizer', 'sns-auto-poster-pro', 'smart-gardening']

// 作成中（全ユーザー利用不可）
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
  if (level === 1) return 'ライトプラン（¥480/月）'
  if (level === 2) return 'スタンダードプラン（¥980/月）'
  return 'プレミアムプラン（¥1,980/月）'
}

interface AccessGateProps {
  productId: string
  children: React.ReactNode
}

export async function AccessGate({ productId, children }: AccessGateProps) {
  // 作成中のツールを遮断
  if (DEVELOPMENT_TOOLS.includes(productId)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-10 font-sans">
        <div className="space-y-6">
          <div className="text-6xl animate-pulse">🚧</div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Under Development</h1>
          <p className="text-slate-400 font-bold max-w-md">このツールは現在開発中のため、ご利用いただけません。</p>
          <Link href="/products">
            <Button variant="outline" className="border-slate-800 text-slate-500 hover:bg-slate-900 font-black">一覧に戻る</Button>
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
        <div className="text-6xl mb-6">{isUpgrade ? '⬆️' : '🔒'}</div>
        <h1 className="text-2xl font-bold text-white mb-4">{isUpgrade ? 'プランのアップグレードが必要です' : `${requiredPlanName}限定`}</h1>
        <div className="flex flex-col gap-3">
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md bg-violet-500 text-white font-semibold px-6 py-3 hover:bg-violet-600 transition-colors">{isUpgrade ? 'アップグレードする' : 'プランを見る'}</Link>
          <Link href="/products" className="inline-flex items-center justify-center rounded-md border border-gray-700 text-gray-300 font-medium px-6 py-3 hover:border-gray-500 hover:text-white transition-colors">ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  )
}
