'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Palette, Rocket, ChevronRight, Settings, Info, ShoppingCart, HelpCircle, Zap, CheckCircle2 } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

export default function AISelectShop() {
  const [currentStep, setCurrentStep] = useState(1)
  const [designKeyword, setDesignKeyword] = useState('')
  const canvasRef = useRef(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 md:p-10 font-sans">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">AI Select Shop</h1>
      </div>
      <div className="max-w-5xl mx-auto mb-16 bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 text-left">
          <div className="flex items-center gap-4"><Badge className="bg-white text-emerald-600 font-black px-6 py-2 text-lg rounded-full shadow-lg">STEP 0{currentStep}</Badge></div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">キーワードを選んでデザインを生成し、在庫ゼロの物販を開始しましょう。</p>
        </div>
      </div>
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-white mb-6 uppercase">現在、物販エンジンを稼働させています...</h2>
        <Button onClick={() => setCurrentStep(1)} className="bg-emerald-500 text-slate-950 font-black px-12 h-20 rounded-3xl">初期化して開始</Button>
      </Card>
      <DebugPanel data={null} toolId="ai-select-shop" />
    </div>
  )
}