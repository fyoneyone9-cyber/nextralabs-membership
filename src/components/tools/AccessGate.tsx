'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AccessGate({ children, productId }: { children: React.ReactNode, productId: string }) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading')
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // 未ログインならログイン画面へ（戻り先をクエリパラメータに保持）
        router.push(`/login?returnTo=${encodeURIComponent(pathname)}`)
        return
      }

      // 管理者(NextraLabs様)は無条件でパス
      if (session.user.email === 'f.yoneyone9@gmail.com') {
        setStatus('authorized')
        return
      }

      // プレミアム会員チェック (本来はDBのsubscriptionテーブル等を参照)
      // 今回はログイン済みであれば一旦パスさせるが、特定のツールはさらにガード可能
      setStatus('authorized')
    }
    
    checkAccess()
  }, [supabase, router, pathname])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest">Checking Access...</p>
      </div>
    )
  }

  // 万が一エラー等で認可されなかった場合の表示
  if (status === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center"><Lock className="w-10 h-10 text-red-600" /></div>
        <h2 className="text-3xl font-black text-white uppercase italic">Access Denied</h2>
        <p className="text-slate-400 max-w-md">このツールの利用には、適切なプランへの加入が必要です。</p>
        <Button onClick={() => router.push('/pricing')} className="bg-red-600 hover:bg-red-500 text-white font-black px-10 h-14 rounded-2xl shadow-xl">プランを見る</Button>
      </div>
    )
  }

  return <>{children}</>
}
