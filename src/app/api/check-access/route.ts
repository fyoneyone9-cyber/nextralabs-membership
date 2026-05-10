import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// =============================================
// プラン別ツールアクセス管理
// 更新: 2026-05-10 新プラン構成
//
// 🆓 FREE        : ローカル完結・面白系（ログイン不要）
// 🔵 LIGHT       : ¥480/月 — 軽めAPIツール
// ⚡ STANDARD    : ¥980/月 — GeminiテキストAI系
// 👑 PREMIUM     : ¥1,980/月 — YouTube/SNS/Gmail等重量級
// 🏨 ENTERPRISE  : 別見積もり専用 — Nextra AI（法人契約のみ・プレミアムでもアクセス不可）
// =============================================

// 🏨 エンタープライズ専用（別見積もり・直接契約のみ）
const ENTERPRISE_IDS = [
  'staysee-ai-finder',  // Nextra AI旧名 — PMS/スマートロック 法人向け
  'nextra-ai',          // Nextra AI KIOSK — ホテルDX 法人契約のみ
]

// 👑 プレミアム専用（重量級API: YouTube・SNS・Gmail・画像生成等）
const PREMIUM_IDS = [
  'inbox-organizer',        // Gmail AI Accelerator — Gmail API + Gemini
  'youtube-producer',       // AI YouTubeプロデューサー — YouTube + 音声生成
  'youtube-coordinator',    // YouTube AI Sync — YouTube + 楽天
  'sns-auto-poster',        // AI SNSオートポスター — 複数SNS API + Gemini
  'ai-select-shop',         // AIセレクトショップ — Shopify/Printful + Gemini
  'trend-stock',            // SNSトレンドAI分析 — 楽天 + Gemini
  'prompt-master',          // AI画像プロンプトマスター — Gemini + 画像生成
]

// ⚡ スタンダード以上（GeminiテキストAI系・中程度API）
const STANDARD_IDS = [
  'ai-sidejob',             // AI副業スタートダッシュ — Gemini
  'disaster-guard',         // AI防災パーソナルガイド — Gemini
  'scam-defender',          // AI詐欺ディフェンダー — Gemini + 楽天
  'money-guard',            // AI家計防衛シミュレーター — Gemini
  'moving-checker',         // AI引越し安心チェッカー — Gemini
  'buy-smart-nav',          // 中古・新品AI比較ナビ — 楽天 + Gemini
  'location-finder',        // AI Location Finder — Gemini + 位置情報
  'ai-recipe',              // AIレシピ献立コーチ — Gemini
  'ai-konkatsu',            // AI婚活コーチ — Gemini
  'exam-scheduler',         // AI試験スケジューラー — Gemini
  'kindle-factory',         // Kindle AI Factory — Gemini
  'smart-gardening',        // AIスマートガーデニング — Gemini
  'buzz-writer',            // BuzzWriter — Gemini
  'closet-coach',           // ClosetCoach — Gemini
  'comm-coach',             // CommCoach — Gemini
  'evidence-manager',       // エビデンスAIマネージャー — Gemini
]

// 🔵 ライト以上（軽めAPIツール）
const LIGHT_IDS = [
  'expense-sync',           // Expense AI Sync — 楽天API軽め
  'contact-sync',           // Contact AI Sync — カメラ + ローカル処理
  'price-tracker',          // Price Tracker — 楽天API
]

// 🆓 FREE（ログイン不要・ローカル完結）
// 上記リストに含まれないツールは全てfree扱い
// 該当: kdp-guide, shopping-stopper, resignation-assistant, shio-taiou,
//       pet-translator, universal-converter, loan-advisor, etc.

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 管理者は常に全アクセス
    if (user?.email === 'f.yoneyone9@gmail.com') {
      return NextResponse.json({ hasAccess: true, reason: 'admin' })
    }

    // 🏨 エンタープライズ専用 — プレミアムを含むいかなるプランでもアクセス不可
    if (ENTERPRISE_IDS.includes(productId)) {
      const hasEnterprise = user
        ? await (async () => {
            const { data: sub } = await supabase
              .from('subscriptions')
              .select('plan')
              .eq('user_id', user.id)
              .eq('status', 'active')
              .maybeSingle()
            return sub?.plan === 'enterprise'
          })()
        : false
      return NextResponse.json({
        hasAccess: hasEnterprise,
        reason: hasEnterprise ? 'authorized' : 'enterprise_required',
        plan: 'enterprise',
        requiredPlan: 'enterprise',
      })
    }

    // FREEツールはログイン不要で即通過
    const requiresPlan = [...PREMIUM_IDS, ...STANDARD_IDS, ...LIGHT_IDS].includes(productId)
    if (!requiresPlan) {
      return NextResponse.json({ hasAccess: true, reason: 'free' })
    }

    // 有料ツール: ログイン必須
    if (!user) {
      return NextResponse.json({ hasAccess: false, reason: 'not_logged_in' })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const userPlan = subscription?.plan || 'free'

    let hasAccess = false
    let requiredPlan = 'light'

    if (PREMIUM_IDS.includes(productId)) {
      hasAccess = userPlan === 'premium'
      requiredPlan = 'premium'
    } else if (STANDARD_IDS.includes(productId)) {
      hasAccess = ['premium', 'standard'].includes(userPlan)
      requiredPlan = 'standard'
    } else if (LIGHT_IDS.includes(productId)) {
      hasAccess = ['premium', 'standard', 'light'].includes(userPlan)
      requiredPlan = 'light'
    }

    return NextResponse.json({
      hasAccess,
      reason: hasAccess ? 'authorized' : 'plan_required',
      plan: userPlan,
      requiredPlan,
    })
  } catch (error: any) {
    console.error('Check access error:', error)
    return NextResponse.json({ hasAccess: false, reason: 'error' })
  }
}
