'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Download, Check, Loader2 } from 'lucide-react'

interface PurchaseButtonProps {
  productId: string
  label?: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function PurchaseButton({
  productId,
  label = '購入する',
  className = '',
  size = 'lg',
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  const [access, setAccess] = useState<{ hasAccess: boolean; reason: string } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch('/api/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        const data = await res.json()
        setAccess(data)
      } catch {
        setAccess({ hasAccess: false, reason: 'error' })
      } finally {
        setChecking(false)
      }
    }
    checkAccess()
  }, [productId])

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        console.error('Checkout error:', data.error)
        alert(data.error)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('購入処理中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  // アクセス確認中
  if (checking) {
    return (
      <Button type="button" size={size} className={className} disabled>
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        確認中...
      </Button>
    )
  }

  // 全ツール使い放題プランまたは単品購入済み
  if (access?.hasAccess) {
    return (
      <Button
        type="button"
        size={size}
        className={className}
        onClick={() => alert('購入済みです！ダウンロードリンクはメールで送信されています。')}
      >
        {access.reason === 'subscription' ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            プラン会員 — アクセス可能
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            購入済み — ダウンロード
          </>
        )}
      </Button>
    )
  }

  // 未購入
  return (
    <Button
      type="button"
      size={size}
      className={className}
      onClick={handlePurchase}
      disabled={loading}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {loading ? '処理中...' : label}
    </Button>
  )
}
