'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DebugPanel } from './DebugPanel'
import { Sparkles, Home, ArrowRight } from 'lucide-react'

export default function DisasterGuard() {
  return (
    <div className="max-w-6xl mx-auto p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl text-4xl">🛡️</div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">AI防災ガイド</h1>
      </div>
      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl mb-12">
        <h3 className="text-3xl font-black italic uppercase">一本道UIへ刷新中</h3>
        <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-95">AI防災ガイドの機能を、最高の使い心地で準備しています。</p>
      </div>
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center">
        <Sparkles className="h-16 w-16 text-emerald-400 mx-auto animate-pulse mb-6" />
        <h2 className="text-3xl font-black text-white">COMING SOON</h2>
      </Card>
      <DebugPanel data={null} toolId="disasterguard.tsx" />
    </div>
  )
}