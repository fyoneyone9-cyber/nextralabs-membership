'use client'
import React from 'react'
export function AccessGate({ children, productId }: { children: React.ReactNode, productId: string }) {
  // 🛡️ 簡易版アクセスゲート: とりあえず全員通すが、型定義とエクスポートを完璧にする
  return <>{children}</>
}