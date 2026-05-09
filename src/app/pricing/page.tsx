'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Loader2, Wrench, ArrowRight, Wallet } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

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

  const handleCheckout = async (plan: 'light' | 'standard' | 'premium' = 'standard') => {
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

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 px-4 py-10 md:py-16 font-sans">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight text-white mb-4">料金プラン</h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            ¥480のライトから始めて、必要に応じてアップグレード。全プランいつでも解約OK。
          </p>
        </div>

        {/* コスト分解バナー */}
        <div className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-3xl font-bold text-white leading-relaxed mb-2">
            スタバのラテ<span className="text-violet-400">1杯</span>より安い。
          </p>
          <p className="text-3xl font-bold text-white">
            でも、毎日<span className="text-cyan-400">2時間</span>を取り戻せる。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <span>🍬 ライト ¥480 = <strong className="text-cyan-400">1日16円</strong>（飴玉1個）</span>
            <span>🍫 スタンダード ¥980 = <strong className="text-violet-400">1日32円</strong>（チロルチョコ1個）</span>
            <span>☕ プレミアム ¥1,980 = <strong className="text-amber-400">コーヒー2杯/月</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 max-w-7xl mx-auto">
          {/* Free Plan */}
          <Card className="relative flex flex-col bg-[#13141f] border border-white/10 rounded-2xl md:rounded-3xl">
            <CardContent className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 text-slate-100">無料プラン</h3>
              <p className="text-slate-400 text-sm mb-4">まずはお試しで</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-100">¥0</span>
                <span className="text-base text-slate-400 font-normal shrink-0">/月</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {['ツールの詳細閲覧', '無料ツール利用', 'メール通知'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-100">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
                {['有料ツール利用', 'プレミアムツール', '優先サポート'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400/50">
                    <span className="h-4 w-4 shrink-0 text-center">✕</span>{f}
                  </li>
                ))}
              </ul>
              {!user ? (
                <Button className="w-full h-14 border-2 border-emerald-500/40 text-emerald-400 font-black rounded-2xl hover:border-emerald-400 bg-transparent transition-all" onClick={() => window.location.href = '/signup'}>無料で始める</Button>
              ) : !isPaid ? (
                <Button className="w-full h-14 border-2 border-emerald-500/40 text-emerald-400 font-black rounded-2xl bg-transparent transition-all" disabled>現在のプラン</Button>
              ) : null}
            </CardContent>
          </Card>

          {/* Light Plan */}
          <Card className="relative border-cyan-500/50 shadow-lg flex flex-col bg-[#13141f] rounded-2xl md:rounded-3xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-cyan-500 text-white px-4 py-1 whitespace-nowrap">⚡ ライト</Badge>
            </div>
            <CardContent className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 text-slate-100">ライトプラン</h3>
              <p className="text-slate-400 text-sm mb-1">気軽に始める入門プラン</p>
              <p className="text-xs text-cyan-400 mb-4">🍬 1日16円 — 飴玉1個分</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-100">¥480</span>
                <span className="text-base text-slate-400 font-normal shrink-0">/月</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {['Expense Sync', 'Contact Sync', 'Price Tracker', '+ 無料ツール全て'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-100">
                    <Check className="h-4 w-4 text-cyan-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {isPaid ? (
                <Button className="w-full h-14 border-2 border-cyan-500/50 text-cyan-400 font-black rounded-2xl hover:border-cyan-400 bg-transparent transition-all" onClick={handleManage} disabled={loadingPlan === 'manage'}>
                  {loadingPlan === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}プラン管理
                </Button>
              ) : (
                <Button className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all" onClick={() => handleCheckout('light')} disabled={loadingPlan === 'light'}>
                  {loadingPlan === 'light' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}ライトプランに登録
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Standard Plan */}
          <Card className="relative flex flex-col bg-[#13141f] border border-emerald-500/60 rounded-2xl md:rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white px-4 py-1 whitespace-nowrap">
                <Crown className="h-3 w-3 mr-1" />おすすめ
              </Badge>
            </div>
            <CardContent className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 text-slate-100">スタンダードプラン</h3>
              <p className="text-slate-400 text-sm mb-1">プレミアム以外の全ツール使い放題</p>
              <p className="text-xs text-violet-400 mb-4">🍫 1日32円 — チロルチョコ1個分</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-100">¥980</span>
                <span className="text-base text-slate-400 font-normal shrink-0">/月</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {['プレミアム以外の全ツール使い放題', '無料・ライト・スタンダードツール全て', '優先サポート', '新ツールの先行アクセス', '商用利用OK', 'アップデート通知'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-100">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
                {['プレミアムツール（Gmail AI等）'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400/50">
                    <span className="h-4 w-4 shrink-0 text-center">✕</span>{f}
                  </li>
                ))}
              </ul>
              {isPaid ? (
                <Button className="w-full h-14 border-2 border-emerald-500/40 text-emerald-400 font-black rounded-2xl hover:border-emerald-400 bg-transparent transition-all" onClick={handleManage} disabled={loadingPlan === 'manage'}>
                  {loadingPlan === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}プラン管理
                </Button>
              ) : (
                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all" onClick={() => handleCheckout('standard')} disabled={loadingPlan === 'standard'}>
                  {loadingPlan === 'standard' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}スタンダードプランに登録
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-violet-500/50 shadow-lg flex flex-col bg-[#13141f] rounded-2xl md:rounded-3xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-violet-500 text-white px-4 py-1 whitespace-nowrap">
                <Crown className="h-3 w-3 mr-1" />プレミアム
              </Badge>
            </div>
            <CardContent className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 text-slate-100">プレミアムプラン</h3>
              <p className="text-slate-400 text-sm mb-1">AI API連携ツール含む</p>
              <p className="text-xs text-amber-400 mb-4">☕ コーヒー2杯分/月</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-100">¥1,980</span>
                <span className="text-base text-slate-400 font-normal shrink-0">/月</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {['全ツール使い放題プランの全機能', 'Gmail AI Accelerator', 'Staysee AI Finder', 'Interior Sync', 'YouTube Sync', 'AI副業スタートダッシュ', 'AI YouTubeプロデューサー', '最優先サポート'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-100">
                    <Check className="h-4 w-4 text-violet-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {isPaid ? (
                <Button className="w-full h-14 border-2 border-violet-500/50 text-violet-400 font-black rounded-2xl hover:border-violet-400 bg-transparent transition-all" onClick={handleManage} disabled={loadingPlan === 'manage'}>
                  {loadingPlan === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}プラン管理
                </Button>
              ) : (
                <Button className="w-full h-14 bg-violet-500 hover:bg-violet-600 text-white font-black rounded-2xl transition-all" onClick={() => handleCheckout('premium')} disabled={loadingPlan === 'premium'}>
                  {loadingPlan === 'premium' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}プレミアムプランに登録
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Custom Development Plan */}
          <Card className="relative border-amber-500/50 flex flex-col bg-[#13141f] rounded-2xl md:rounded-3xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber-500 text-white px-4 py-1 whitespace-nowrap">
                <Wrench className="h-3 w-3 mr-1" />法人向け
              </Badge>
            </div>
            <CardContent className="p-8 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 text-slate-100">カスタマイズ<br />ツール開発</h3>
              <p className="text-slate-400 mb-4">御社専用のAIツールを開発</p>
              <div className="text-2xl font-bold mb-1 text-amber-400">お見積り</div>
              <p className="text-sm text-slate-400 mb-6">ご要件に応じて個別にご提案</p>
              <ul className="space-y-3 flex-1 mb-8">
                {['御社業務に特化したAIツール開発', '既存ツールのカスタマイズ', '社内システムとのAPI連携', 'デザイン・UI/UXのカスタマイズ', '導入サポート・研修', '保守・運用サポート'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-100">
                    <Check className="h-4 w-4 text-amber-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl gap-2 transition-all">
                  お問い合わせ<ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
