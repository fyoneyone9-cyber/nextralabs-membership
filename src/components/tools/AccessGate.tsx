'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Lock, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
          router.push("/login?returnTo=" + encodeURIComponent(pathname))
          return
        }

        const user = session.user;

        // 👑 憲法：管理者（NextraLabs様）は常に全パスを通過
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

        const userPlan = subscription?.plan || 'free';

        // プレミアムツール一覧
        const premiumIds = [
          'ai-select-shop', 'youtube-producer', 'scam-defender', 
          'vintage-hunter', 'inbox-organizer', 'staysee-ai-finder',
          'comp-price-monitor', 'interior-coordinator', 'youtube-coordinator'
        ];
        // スタンダードツール一覧
        const standardIds = [
          'pr-command', 'ai-konkatsu', 'money-guard', 
          'disaster-guard', 'shopping-stopper', 'hotel-affiliate', 'trend-stock'
        ];
        // ライトプランツール一覧
        const lightIds = [
          'sns-auto-poster', 'expense-sync', 'contact-sync', 'price-tracker', 'ai-sidejob', 'prompt-master'
        ];

        if (premiumIds.includes(productId)) {
          if (userPlan === 'premium') setStatus('authorized');
          else setStatus('unauthorized');
        } else if (standardIds.includes(productId)) {
          if (userPlan === 'premium' || userPlan === 'standard') setStatus('authorized');
          else setStatus('unauthorized');
        } else if (lightIds.includes(productId)) {
          if (userPlan === 'premium' || userPlan === 'standard' || userPlan === 'light') setStatus('authorized');
          else setStatus('unauthorized');
        } else {
          setStatus('authorized');
        }
      } catch (e) {
        console.error('[ACCESS_GATE_ERROR]', e);
        setStatus('authorized');
      }
    }
    checkAccess()
  }, [productId, pathname, router, supabase.auth])

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