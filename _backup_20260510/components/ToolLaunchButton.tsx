'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ToolLaunchButtonProps {
  productId: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ToolLaunchButton({
  productId,
  className = '',
  size = 'lg',
}: ToolLaunchButtonProps) {
  const [hasAccess, setHasAccess] = useState(false)
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
        setHasAccess(data.hasAccess)
      } catch {
        setHasAccess(false)
      } finally {
        setChecking(false)
      }
    }
    checkAccess()
  }, [productId])

  if (checking || !hasAccess) return null

  return (
    <Link href={`/products/${productId}/app`}>
      <Button size={size} className={`bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 gap-2 ${className}`}>
        🚀 ツールを使う
      </Button>
    </Link>
  )
}
