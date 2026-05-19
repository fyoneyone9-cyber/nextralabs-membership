'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, ShieldAlert, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PREMIUM_IDS, STANDARD_IDS, LIGHT_IDS } from '@/lib/plan-ids'

// IDリストは src/lib/plan-ids.ts で一元管理。ここは編集しない。

export function AccessGate({ children, productId }: { children: React.ReactNode, productId: string }) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'trial' | 'unauthorized' | 'trial_limit'>('loading')
  const [trialRemaining, setTrialRemaining] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login?returnTo=' + encodeURIComponent(pathname))
          return
        }

        const user = session.user

        // ?? 管理者は常に全パス通過
        if (user.email === 'f.yoneyone9@gmail.com') {
          setStatus('authorized')
          return
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle()

        const userPlan = subscription?.plan || 'free'

        // プラン判定
        let hasPlanAccess = false
        const isPaidTool = [...PREMIUM_IDS, ...STANDARD_IDS, ...LIGHT_IDS].includes(productId)

        if (PREMIUM_IDS.includes(productId)) {
          hasPlanAccess = userPlan === 'premium'
        } else if (STANDARD_IDS.includes(productId)) {
          hasPlanAccess = ['premium', 'standard'].includes(userPlan)
        } else if (LIGHT_IDS.includes(productId)) {
          hasPlanAccess = ['premium', 'standard', 'light'].includes(userPlan)
        } else {
          // FREEツール
          setStatus('authorized')
          return
        }

        if (hasPlanAccess) {
          setStatus('authorized')
          return
        }

        // 有料プランなし → トライアル確認（STANDARDツールのみ）
        if (STANDARD_IDS.includes(productId)) {
          const res = await fetch(`/api/trial?productId=${productId}`)
          const trial = await res.json()
          if (trial.canTry) {
            // トライアル使用を記録
            await fetch('/api/trial', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId }),
            })
            setTrialRemaining(trial.remaining - 1)
            setStatus('trial')
          } else {
            setStatus('trial_limit')
          }
        } else {
          setStatus('unauthorized')
        }
      } catch (e) {
        console.error('[ACCESS_GATE_ERROR]', e)
        setStatus('unauthorized')
      }
    }
    checkAccess()
  }, [productId, pathname, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-slate-950 rounded-[3rem]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-tight text-[10px]">Verifying Intelligence Access...</p>
      </div>
    )
  }

  if (status === 'unauthorized' || status === 'trial_limit') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-8 bg-slate-950 border-2 border-red-600/20 rounded-[3rem] shadow-2xl animate-in zoom-in-95">
        <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center border-2 border-red-600/20 shadow-inner">
          <ShieldAlert className="w-12 h-12 text-red-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          {status === 'trial_limit' ? (
            <>
              <h2 className="text-3xl font-bold text-white tracking-tighter">無料体験の上限に達しました</h2>
              <p className="text-slate-400 text-sm leading-relaxed">月3回の無料体験を使い切りました。<br />続けて使うには有料プランへどうぞ。</p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-white uppercase tracking-tighter">Access Forbidden</h2>
              <p className="text-slate-500 font-bold">上位プランへのアップグレードが必要です。</p>
            </>
          )}
        </div>
        <div className="flex flex-col w-full max-w-xs gap-3">
          <Button onClick={() => router.push('/pricing')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-12 rounded-2xl text-base shadow-xl transition-all active:scale-95">プランを見る（\980/月?）</Button>
          <Button onClick={() => router.push('/products')} variant="ghost" className="text-slate-600 hover:text-white font-bold text-xs tracking-tight underline">ツール一覧に戻る</Button>
        </div>
      </div>
    )
  }

  // トライアルモード: ツールの上にバナーを表示
  if (status === 'trial') {
    return (
      <>
        <div className="mb-4 mx-auto max-w-2xl bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300 font-medium">
              無料体験中 ? 今月あと <span className="font-bold text-white">{trialRemaining}回</span> 使えます
            </p>
          </div>
          <Button
            onClick={() => router.push('/pricing')}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-8 px-4 rounded-xl text-xs shrink-0"
          >
            無制限にする
          </Button>
        </div>
        {children}
      </>
    )
  }

  return <>{children}</>
}
