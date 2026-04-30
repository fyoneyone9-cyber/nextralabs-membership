'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Loader2, Wrench, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PricingPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

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
          .single()
        setIsPaid(!!data)
      }
    }
    check()
  }, [])

  const handleCheckout = async (plan: 'standard' | 'premium' = 'standard') => {
    if (!user) {
      window.location.href = '/signup'
      return
    }

    setLoadingPlan(plan)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, access_token: session?.access_token }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'チェックアウトの作成に失敗しました')
      }
    } catch {
      toast.error('エラーが発生しました')
    }
    setLoadingPlan(null)
  }

  const handleManage = async () => {
    setLoadingPlan('manage')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: session?.access_token }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('エラーが発生しました')
    }
    setLoadingPlan(null)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">料金プラン</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          スタンダードで全ツール使い放題。プレミアムならGmail AI連携ツールも。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">無料プラン</h3>
            <p className="text-muted-foreground text-sm mb-4">まずはお試しで</p>
            <div className="text-4xl font-bold mb-6">
              ¥0
              <span className="text-base text-muted-foreground font-normal">/月</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                'ツールの詳細閲覧',
                '無料ツール利用',
                'メール通知',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
              {[
                '有料ツール利用',
                'プレミアムツール',
                '優先サポート',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                  <span className="h-4 w-4 shrink-0 text-center">✕</span>
                  {feature}
                </li>
              ))}
            </ul>
            {!user ? (
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/signup'}>
                無料で始める
              </Button>
            ) : !isPaid ? (
              <Button variant="outline" className="w-full" disabled>
                現在のプラン
              </Button>
            ) : null}
          </CardContent>
        </Card>

        {/* Standard Plan */}
        <Card className="relative border-primary shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              おすすめ
            </Badge>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">スタンダードプラン</h3>
            <p className="text-muted-foreground text-sm mb-4">全ツール使い放題</p>
            <div className="text-4xl font-bold mb-6">
              ¥980
              <span className="text-base text-muted-foreground font-normal">/月</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                'すべてのツール使い放題',
                'ソースコード完全アクセス',
                '優先サポート',
                '新ツールの先行アクセス',
                '商用利用OK',
                'アップデート通知',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
              {[
                'プレミアムツール（Gmail AI等）',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                  <span className="h-4 w-4 shrink-0 text-center">✕</span>
                  {feature}
                </li>
              ))}
            </ul>
            {isPaid ? (
              <Button variant="outline" className="w-full" onClick={handleManage} disabled={!!loadingPlan}>
                {loadingPlan === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                サブスクリプション管理
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleCheckout('standard')} disabled={!!loadingPlan}>
                {loadingPlan === 'standard' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                スタンダードプランに登録
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-violet-500/50 shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-violet-500 text-white px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              プレミアム
            </Badge>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">プレミアムプラン</h3>
            <p className="text-muted-foreground text-sm mb-4">AI API連携ツール含む</p>
            <div className="text-4xl font-bold mb-6">
              ¥1,980
              <span className="text-base text-muted-foreground font-normal">/月</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                '全ツール使い放題プランの全機能',
                'Gmail AI Accelerator',
                'Gmail連携・AI返信生成',
                'API連携ツール（今後追加予定）',
                '最優先サポート',
                '機能リクエスト優先対応',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-violet-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            {isPaid ? (
              <Button variant="outline" className="w-full border-violet-500/50 text-violet-400" onClick={handleManage} disabled={!!loadingPlan}>
                {loadingPlan === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                プラン管理
              </Button>
            ) : (
              <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white" onClick={() => handleCheckout('premium')} disabled={!!loadingPlan}>
                {loadingPlan === 'premium' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                プレミアムプランに登録
              </Button>
            )}
            <p className="text-xs text-muted-foreground text-center mt-3">
              Gmail AI Accelerator を含む上位プラン
            </p>
          </CardContent>
        </Card>

        {/* Custom Development Plan */}
        <Card className="relative border-amber-500/50">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-amber-500 text-white px-4 py-1">
              <Wrench className="h-3 w-3 mr-1" />
              法人向け
            </Badge>
          </div>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-2">カスタマイズ<br />ツール開発</h3>
            <p className="text-muted-foreground mb-4">御社専用のAIツールを開発</p>
            <div className="text-5xl font-bold mb-2">
              お見積り
            </div>
            <p className="text-sm text-muted-foreground mb-6">ご要件に応じて個別にお見積り</p>
            <ul className="space-y-3 mb-8">
              {[
                '御社業務に特化したAIツール開発',
                '既存ツールのカスタマイズ',
                '社内システムとのAPI連携',
                'デザイン・UI/UXのカスタマイズ',
                '導入サポート・研修',
                '保守・運用サポート',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2">
                お問い合わせ
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">
              まずはお気軽にご相談ください
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
