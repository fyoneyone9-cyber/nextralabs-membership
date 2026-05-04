'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Palette, Rocket, ChevronRight, Settings, Info, ShoppingCart } from 'lucide-react'
import { DebugPanel } from './DebugPanel' // 🛠️ 共通デバッグパネル

export default function AISelectShop() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<any[]>([])
  const [designs, setDesigns] = useState<any[]>([])
  const [debugData, setDebugData] = useState<any>(null) // 🛠️ デバッグデータ
  
  const [designKeyword, setDesignKeyword] = useState('')
  const [designStyle, setDesignStyle] = useState('minimal')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // トレンド取得のデバッグ記録
    setDebugData({ status: "initializing", timestamp: new Date().toISOString() });
    setTrends([
      { id: '1', name: '猫耳サイバーパンク', traffic: '500K' },
      { id: '2', name: '昭和レトロポップ', traffic: '200K' }
    ]);
  }, [])

  const selectTrend = (name: string) => {
    setDesignKeyword(name);
    setDebugData({ action: "trend_selected", keyword: name });
    setCurrentStep(2);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 md:p-8 font-sans">
      {/* 🔴 HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <h1 className="text-3xl font-black text-white uppercase italic">AI Select Shop</h1>
        <Badge className="bg-emerald-500/10 text-emerald-400">Step {currentStep} of 3</Badge>
      </div>

      <div className="max-w-6xl mx-auto">
        {currentStep === 1 && (
          <div className="space-y-12 animate-in fade-in">
            <h2 className="text-5xl font-black text-white text-center tracking-tighter uppercase italic">1. Choose Trend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {trends.map(kw => (
                <Card key={kw.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 cursor-pointer shadow-2xl rounded-[2.5rem]" onClick={() => selectTrend(kw.name)}>
                  <CardContent className="p-10 flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-black text-white mb-2">{kw.name}</h3>
                      <p className="text-slate-500 text-lg">{kw.traffic}+ Searches</p>
                    </div>
                    <ChevronRight className="h-10 w-10 text-emerald-500" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
            <h2 className="text-5xl font-black text-white text-center tracking-tighter uppercase italic">2. Finalize Design</h2>
            <Card className="bg-slate-900 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
              <div className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-slate-400 uppercase">Design Keyword</Label>
                  <Input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="bg-slate-950 border-slate-800 h-20 text-3xl font-black text-white rounded-3xl px-8" />
                </div>
                <Button onClick={() => setCurrentStep(3)} className="w-full h-24 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-3xl rounded-[2rem] shadow-2xl shadow-emerald-500/20 gap-3">
                  ショップへ出品する <Rocket className="h-10 w-10" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-12 animate-in fade-in">
            <h2 className="text-5xl font-black text-white text-center tracking-tighter uppercase italic">3. Shop Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="col-span-full py-40 text-center bg-slate-900/30 border-4 border-dashed border-slate-800 rounded-[3rem]">
                  <p className="text-slate-600 font-black text-2xl">READY TO LAUNCH</p>
                  <Button onClick={() => setCurrentStep(1)} className="mt-8 bg-slate-800 text-white px-12 h-20 rounded-2xl font-bold text-xl">最初から作り直す</Button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* 🛠️ SYSTEM DEBUG LOGS */}
      <DebugPanel data={debugData} />
    </div>
  )
}
