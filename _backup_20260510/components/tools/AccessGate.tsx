'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

// =============================================
// 🔒 プラン別ツール分類 (MEMORY.md 正式版と統一)
// =============================================

// プレミアム専用ツール (¥1,980/月)
const PREMIUM_IDS = [
  'inbox-organizer',
  'prompt-master',
  'youtube-producer',
  'pet-translator',
  'ai-select-shop',
  'staysee-ai-finder',
  'ai-sidejob',
  'interior-coordinator',
  'youtube-coordinator',
]

// スタンダード以上で使えるツール (¥980/月〜)
const STANDARD_IDS = [
  'buy-smart-nav',
  'scam-defender',
  'shopping-stopper',
  'closet-coach',
  'buzz-writer',
  'comm-coach',
  'resignation-assistant',
  'money-guard',
  'shio-taiou',
  'trend-stock',
]

// ライト以上で使えるツール (¥480/月〜)
const LIGHT_IDS = [
  'expense-sync',
  'contact-sync',
  'price-tracker',
]

// 無料ツール（ログインのみ必要）
// office-politics-graph, moving-checker, evidence-manager など上記に含まれないもの

export function AccessGate({ children, productId }: { children: React.ReactNode, productId: string }) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading')
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

        // 👑 管理者（NextraLabs様）は常に全パス通過
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

        if (PREMIUM_IDS.includes(productId)) {
          setStatus(userPlan === 'premium' ? 'authorized' : 'unauthorized')
        } else if (STANDARD_IDS.includes(productId)) {
          setStatus(['premium', 'standard'].includes(userPlan) ? 'authorized' : 'unauthorized')
        } else if (LIGHT_IDS.includes(productId)) {
          setStatus(['premium', 'standard', 'light'].includes(userPlan) ? 'authorized' : 'unauthorized')
        } else {
          // 無料ツール：ログインしていれば通過
          setStatus('authorized')
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
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Verifying Intelligence Access...</p>
      </div>
    )
  }

  if (status === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-8 bg-slate-950 border-2 border-red-600/20 rounded-[3rem] shadow-2xl animate-in zoom-in-95">
        <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center border-2 border-red-600/20 shadow-inner">
          <ShieldAlert className="w-12 h-12 text-red-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Access Forbidden</h2>
          <p className="text-slate-500 font-bold italic">上位プランへのアップグレードが必要です。</p>
        </div>
        <div className="flex flex-col w-full max-w-xs gap-3">
          <Button onClick={() => router.push('/pricing')} className="bg-red-600 hover:bg-red-500 text-white font-black h-16 rounded-2xl text-xl shadow-xl transition-all active:scale-95 uppercase italic">Unlock Now</Button>
          <Button onClick={() => router.push('/products')} variant="ghost" className="text-slate-600 hover:text-white font-black uppercase text-[10px] tracking-widest underline">Return to Catalogue</Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
