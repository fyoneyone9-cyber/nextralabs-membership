'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Loader2, Wrench, ArrowRight, Zap, Star } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const plans = [
  {
    id: 'free',
    name: '無料プラン',
    price: 0,
    period: '/月',
    tagline: '登録不要・今すぐ使える',
    dailyCost: null,
    color: 'slate',
    badge: null,
    features: [
      'KDP出版AI完全ナビ',
      'AI買い物依存ストッパー',
      '退職代行アシスタント',
      '塩対応ジェネレーター',
      'ペット翻訳',
      'Universal Converter',
      '借金完済診断',
      'ローカル完結ツール全部',
    ],
    disabled: ['有料APIツール', '優先サポート'],
  },
  {
    id: 'light',
    name: 'ライトプラン',
    price: 480,
    period: '/月',
    tagline: '気軽に始めたい方向け',
    dailyCost: '1日16円 ≒ 缶コーヒー1本',
    color: 'cyan',
    badge: 'ライト',
    features: [
      '無料プランの全ツール',
      'Expense AI Sync',
      'Contact AI Sync',
      'Price Tracker',
    ],
    disabled: ['Gemini AI系ツール', 'YouTube/SNS系ツール'],
  },
  {
    id: 'standard',
    name: 'スタンダード',
    price: 980,
    period: '/月',
    tagline: 'Gemini AI系ツールが全部使える',
    dailyCost: '1日32円 ≒ チョコレート1枚',
    color: 'emerald',
    badge: 'おすすめ',
    recommended: true,
    features: [
      'ライトプランの全ツール',
      'AI副業スタートダッシュ',
      'AI防災パーソナルガイド',
      'AI詐欺ディフェンダー',
      'AI家計防衛シミュレーター',
      'AI引越し安心チェッカー',
      'Kindle AI Factory',
      'Gemini AI系ツール全部',
      '優先サポート',
      '新ツールの先行アクセス',
    ],
    disabled: ['YouTube/SNS/Gmail AI系ツール'],
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: 1980,
    period: '/月',
    tagline: 'YouTube・SNS・Gmail AI系も全部',
    dailyCost: 'コーヒー2杯分/月',
    color: 'violet',
    badge: 'プレミアム',
    features: [
      'スタンダードプランの全ツール',
      'Gmail AI Accelerator',
      'AI YouTubeプロデューサー',
      'YouTube AI Sync',
      'AI SNSオートポスター',
      'AIセレクトショップ',
      'SNSトレンドAI分析',
      'AI画像プロンプトマスター',
      '最優先サポート',
    ],
    disabled: [],
  },
]

export default function PricingPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const lockRef = useRef(false)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle()
        setIsPaid(!!data)
      }
    }
    check()
  }, [])

  const handleCheckout = async (plan: 'light' | 'standard' | 'premium') => {
    if (!user) { window.location.href = '/signup'; return }
    if (lockRef.current) return
    lockRef.current = true
    setLoadingPlan(plan)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, access_token: session?.access_token }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { toast.error(data.error || 'チェックアウトの作成に失敗しました') }
    } catch { toast.error('エラーが発生しました') }
    lockRef.current = false
    setLoadingPlan(null)
  }

  const handleManage = async () => {
    if (lockRef.current) return
    lockRef.current = true
    setLoadingPlan('manage')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: session?.access_token }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
    } catch { toast.error('エラーが発生しました') }
    lockRef.current = false
    setLoadingPlan(null)
  }

  const getCheckIcon = (color: string) => {
    const colorMap: Record<string, string> = {
      slate: 'text-emerald-400',
      cyan: 'text-cyan-400',
      emerald: 'text-emerald-400',
      violet: 'text-violet-400',
    }
    return colorMap[color] || 'text-emerald-400'
  }

  const getButtonEl = (plan: typeof plans[0]) => {
    if (plan.id === 'free') {
      if (!user) return (
        <Button className="w-full h-11 border border-white/10 text-slate-300 font-semibold rounded-xl bg-white/5 hover:bg-white/10 transition-all" onClick={() => window.location.href = '/signup'}>
          無料で始める <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      )
      if (!isPaid) return (
        <Button className="w-full h-11 border border-white/10 text-slate-500 font-semibold rounded-xl bg-transparent" disabled>現在のプラン</Button>
      )
      return null
    }

    if (isPaid) return (
      <Button className="w-full h-11 border border-white/10 text-slate-400 font-semibold rounded-xl bg-white/5 hover:bg-white/10 transition-all" onClick={handleManage} disabled={loadingPlan === 'manage'}>
        {loadingPlan === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}プラン管理
      </Button>
    )

    if (plan.id === 'light') return (
      <Button className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)]" onClick={() => handleCheckout('light')} disabled={loadingPlan === 'light'}>
        {loadingPlan === 'light' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}登録する <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    )
    if (plan.id === 'standard') return (
      <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_32px_rgba(16,185,129,0.5)]" onClick={() => handleCheckout('standard')} disabled={loadingPlan === 'standard'}>
        {loadingPlan === 'standard' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}登録する <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    )
    if (plan.id === 'premium') return (
      <Button className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)]" onClick={() => handleCheckout('premium')} disabled={loadingPlan === 'premium'}>
        {loadingPlan === 'premium' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}登録する <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    )
  }

  const getBadgeClass = (color: string) => {
    const map: Record<string, string> = {
      cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    }
    return map[color] || ''
  }

  const getCardClass = (plan: typeof plans[0]) => {
    if (plan.recommended) {
      return 'relative flex flex-col bg-[#0d1117] border border-emerald-500/50 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20'
    }
    return 'relative flex flex-col bg-[#0d1117] border border-white/8 rounded-2xl hover:border-white/15 transition-colors'
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-emerald-500/25 bg-emerald-500/5 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-widest uppercase">Pricing Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 leading-[1.1]">
            料金プラン
          </h1>
          <p className="text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            ¥480のライトから始めて、必要に応じてアップグレード。<br />全プラン共通で無料ツールも使えます。
          </p>
        </div>

        {/* コスト比較バナー */}
        <div className="relative mb-14 overflow-hidden rounded-2xl border border-white/8 bg-[#0d1117] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-cyan-950/20 pointer-events-none" />
          <div className="relative text-center">
            <p className="text-2xl md:text-3xl font-semibold text-white mb-2 leading-snug">
              スタバの珈琲<span className="text-emerald-400">1杯</span>分で始まる。<br />
              でも、あなたの<span className="text-cyan-400">2時間</span>を返してくれる。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { icon: '🆓', label: '無料', value: 'ローカル完結ツール使い放題', color: 'text-slate-300' },
                { icon: '🔵', label: 'ライト ¥480', value: '1日16円（コーヒー1杯）', color: 'text-cyan-400' },
                { icon: '⚡', label: 'スタンダード ¥980', value: '1日32円（チョコ1枚）', color: 'text-emerald-400' },
                { icon: '👑', label: 'プレミアム ¥1,980', value: 'コーヒー2杯/月', color: 'text-violet-400' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                  <div className={`text-sm font-medium ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Grid — 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {plans.map((plan) => (
            <div key={plan.id} className={getCardClass(plan)}>
              {plan.recommended && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              )}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full border ${getBadgeClass(plan.color)}`}>
                    {plan.recommended && <Crown className="h-3 w-3" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{plan.tagline}</p>
                  {plan.dailyCost && (
                    <p className={`text-xs mt-1 font-medium ${getCheckIcon(plan.color)}`}>{plan.dailyCost}</p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">¥{plan.price.toLocaleString()}</span>
                    <span className="text-sm text-slate-500">{plan.period}</span>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${getCheckIcon(plan.color)}`} />
                        {f}
                      </li>
                    ))}
                    {plan.disabled.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="h-3.5 w-3.5 mt-0.5 shrink-0 text-center leading-none">–</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {getButtonEl(plan)}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise / Custom Development */}
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d1117] p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Wrench className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white">Nextra AI & カスタム開発</h3>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">法人向け</span>
                </div>
                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                  ホテルDX・法人向けシステム開発。業務特化型AIツール開発、社内システムとのAPI連携、デザイン・UI/UXカスタマイズ、専任サポートまで対応します。
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {['業務特化型AIツール開発', '既存ツールのカスタマイズ', 'API連携', '専任サポート・ライン', '保守・継続サポート'].map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Check className="h-3 w-3 text-emerald-400 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="shrink-0 md:text-right">
              <div className="text-xl font-bold text-emerald-400 mb-1">要見積もり</div>
              <p className="text-xs text-slate-500 mb-4">要件に応じて個別にご提案</p>
              <Link href="/contact">
                <Button className="h-11 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl gap-2 transition-all">
                  お問い合わせ <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
