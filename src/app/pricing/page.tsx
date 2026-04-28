'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PricingPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/signup'
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('チェックアウトの作成に失敗しました')
      }
    } catch {
      toast.error('エラーが発生しました')
    }
    setLoading(false)
  }

  const handleManage = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('エラーが発生しました')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">料金プラン</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          単品購入もできます。全ツール使い放題プランならすべてのツールが使い放題。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-2">無料プラン</h3>
            <p className="text-muted-foreground mb-4">まずはお試しで</p>
            <div className="text-5xl font-bold mb-6">
              ¥0
              <span className="text-lg text-muted-foreground font-normal">/月</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'ツールの詳細閲覧',
                '無料ツールのダウンロード',
                'メール通知',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
              {[
                '有料ツールのダウンロード',
                '優先サポート',
                '新ツールの先行アクセス',
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

        {/* Paid Plan */}
        <Card className="relative border-primary shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              おすすめ
            </Badge>
          </div>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-2">全ツール使い放題プラン</h3>
            <p className="text-muted-foreground mb-4">すべてのツールが使い放題</p>
            <div className="text-5xl font-bold mb-6">
              ¥980
              <span className="text-lg text-muted-foreground font-normal">/月</span>
            </div>
            <ul className="space-y-3 mb-8">
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
            </ul>
            {isPaid ? (
              <Button variant="outline" className="w-full" onClick={handleManage} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                サブスクリプション管理
              </Button>
            ) : (
              <Button className="w-full" onClick={handleCheckout} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                全ツール使い放題プランに登録
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
