import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

// 無料ツール（誰でもアクセス可）
const FREE_TOOLS = ['office-politics-graph', 'moving-checker', 'sns-auto-poster', 'ai-report-generator', 'kdp-guide']

// ライトプラン以上が必要
const LIGHT_TOOLS = ['shio-taiou', 'ai-konkatsu', 'comm-coach', 'prompt-master', 'ai-sidejob', 'resignation-assistant', 'closet-coach']

// スタンダードプラン以上が必要
const STANDARD_TOOLS = ['exam-scheduler', 'disaster-guard', 'scam-defender', 'money-guard', 'ticket-scout', 'shopping-stopper', 'buzz-writer']

// プレミアムプランのみ
const PREMIUM_TOOLS = ['pet-translator', 'vintage-hunter', 'location-finder', 'ai-select-shop', 'youtube-producer', 'inbox-organizer', 'sns-auto-poster-pro', 'smart-gardening']

// プランの強さを数値化
const PLAN_LEVEL: Record<string, number> = {
  light: 1,
  standard: 2,
  premium: 3,
}

// ツールに必要な最低プランレベルを返す
function getRequiredLevel(productId: string): number {
  if (FREE_TOOLS.includes(productId)) return 0
  if (LIGHT_TOOLS.includes(productId)) return 1
  if (STANDARD_TOOLS.includes(productId)) return 2
  if (PREMIUM_TOOLS.includes(productId)) return 3
  // デフォルト: スタンダード以上
  return 2
}

// 必要プラン名を日本語で返す
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
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const requiredLevel = getRequiredLevel(productId)

  // 無料ツールはログイン不要
  if (requiredLevel === 0) {
    return <>{children}</>
  }

  // 未ログイン
  if (!user) {
    redirect('/login')
  }

  // サブスク確認
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const userLevel = subscription ? (PLAN_LEVEL[subscription.plan] ?? 0) : 0

  // アクセス許可
  if (userLevel >= requiredLevel) {
    return <>{children}</>
  }

  // アクセス拒否 → アップグレード促進UI
  const requiredPlanName = getRequiredPlanName(requiredLevel)
  const isUpgrade = userLevel > 0 // 既存会員のアップグレードか、新規加入か

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6 py-16">
        <div className="text-6xl mb-6">{isUpgrade ? '⬆️' : '🔒'}</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          {isUpgrade ? 'プランのアップグレードが必要です' : `${requiredPlanName}限定`}
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          このツールのご利用には{requiredPlanName}が必要です。<br />
          {isUpgrade ? 'プランをアップグレードしてお使いください。' : 'プランに加入してご利用ください。'}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-violet-500 text-white font-semibold px-6 py-3 hover:bg-violet-600 transition-colors"
          >
            {isUpgrade ? 'アップグレードする' : 'プランを見る'}
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
