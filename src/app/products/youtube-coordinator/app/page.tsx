'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import { AccessGate } from '@/components/tools/AccessGate'
import YoutubeCoordinatorSystem from '@/components/tools/YoutubeCoordinatorSystem'

export default function YoutubeCoordinatorAppPage() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応（バックガード）
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？（入力内容は保存されません）')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    if (window.confirm('ツールを終了してダッシュボードに戻りますか？')) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <AccessGate productId="youtube-coordinator">
      <YoutubeCoordinatorSystem />
    </AccessGate>
  )
}
