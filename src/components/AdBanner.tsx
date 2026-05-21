'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdBannerProps {
  slot: string
  format?: string
  style?: React.CSSProperties
}

export default function AdBanner({ slot, format = 'auto', style }: AdBannerProps) {
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        // 未ログイン → 広告表示
        setShowAd(true)
        return
      }
      // subscriptionsテーブルでプラン確認
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle()

      const isPaid = sub && ['light', 'standard', 'premium', 'enterprise'].includes(sub.plan)
      setShowAd(!isPaid)
    })
  }, [])

  useEffect(() => {
    if (!showAd) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // AdSense not loaded yet
    }
  }, [showAd])

  if (!showAd) return null

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-5929585030139547"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
