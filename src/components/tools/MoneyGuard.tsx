'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DebugPanel } from './DebugPanel'
import { Sparkles } from 'lucide-react'

export default function MoneyGuard() {
  const [step, setStep] = useState(1)
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 rounded-[2rem] bg-amber-600 flex items-center justify-center mx-auto shadow-2xl text-4xl">💰</div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">AI家計防衛</h1>
      </div>
      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <Badge className="bg-white text-indigo-600 font-black px-4 py-1 text-lg rounded-full">STEP 0${step}</Badge>
          <h3 className="text-3xl font-black italic uppercase">AIが解析準備中</h3>
          <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-95">AI家計防衛の最強プロンプトを現在構築しています。</p>
        </div>
      </div>
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
        <div className="text-center py-20">
          <Sparkles className="h-16 w-16 text-emerald-400 mx-auto animate-pulse mb-6" />
          <h2 className="text-3xl font-black text-white uppercase">COMING SOON</h2>
          <p className="text-slate-500 text-lg">NextraLabsは「一本道UI」への完全移行に伴い、このツールをさらに磨き上げています。</p>
        </div>
      </Card>
      <DebugPanel data={null} toolId="moneyguard" />
    </div>
  )
}