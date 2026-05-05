'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Palette, Rocket, ChevronRight, Settings, Info, ShoppingCart, HelpCircle, Zap } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

const STEPS = [
  { id: 1, what: "トレンドをキャッチ", how: "AIが解析した最新の検索トレンドから、今売れるキーワードを選択しましょう。", result: "物販の核心となる「売れるテーマ」が決まります。" },
  { id: 2, what: "デザインを確定", how: "選んだキーワードに基づき、AIがTシャツデザインを自動生成。スタイルや色を調整して仕上げます。", result: "ショップに出品可能なオリジナルデザインが完成します。" },
  { id: 3, what: "ショップ管理", how: "完成したデザインの確認と、Shopify/Printfulへの出品・同期を行います。", result: "あなたのネットショップに商品が並び、販売がスタートします。" }
]

export default function AISelectShop() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [trends, setTrends] = useState<any[]>([])
  const [designKeyword, setDesignKeyword] = useState('')
  const [debugData, setDebugData] = useState<any>(null)
  
  useEffect(() => {
    setTrends([
      { id: '1', name: '猫耳サイバーパンク', traffic: '500K' },
      { id: '2', name: '昭和レトロポップ', traffic: '200K' }
    ]);
  }, [])

  const currentInfo = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 md:p-10 font-sans">
      
      {/* 🔴 HEADER */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">AI Select Shop</h1>
        <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">3-Step Business Launcher</p>
      </div>

      {/* 💡 INTUITIVE GUIDE PANEL (MANDATORY STANDARDIZATION) */}
      <div className="max-w-5xl mx-auto mb-16 bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-emerald-600 font-black px-6 py-2 text-lg rounded-full">STEP 0{currentStep}</Badge>
            <h3 className="text-3xl font-black italic uppercase">{currentInfo.what}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
          <div className="flex items-center gap-3 text-slate-900 font-black text-lg bg-emerald-400/50 w-fit px-6 py-2 rounded-2xl border border-white/20">
            <Zap className="h-6 w-6 fill-current" /> 成功報酬：{currentInfo.result}
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA (Linear Flow) --- */}
      <div className="max-w-6xl mx-auto space-y-12">
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in fade-in">
            {trends.map(kw => (
              <Card key={kw.id} className="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 rounded-[2.5rem] cursor-pointer shadow-2xl" onClick={() => { setDesignKeyword(kw.name); setCurrentStep(2) }}>
                <CardContent className="p-10 flex justify-between items-center">
                  <h3 className="text-3xl font-black text-white">{kw.name}</h3>
                  <ChevronRight className="h-10 w-10 text-emerald-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-12 shadow-2xl max-w-4xl mx-auto animate-in fade-in">
            <div className="space-y-10">
              <div className="space-y-4">
                <Label className="text-2xl font-black text-white uppercase">Keyword Input</Label>
                <Input value={designKeyword} onChange={(e) => setDesignKeyword(e.target.value)} className="bg-slate-950 border-slate-700 h-24 text-4xl font-black text-white rounded-3xl px-10 focus:border-emerald-500 transition-all" />
              </div>
              <Button onClick={() => setCurrentStep(3)} className="w-full h-32 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-4xl rounded-[3rem] shadow-2xl shadow-emerald-500/30 gap-4">
                完成：ショップへ出品する <Rocket className="h-12 w-12" />
              </Button>
              <button onClick={() => setCurrentStep(1)} className="w-full text-slate-500 text-lg font-bold hover:text-white transition-colors underline">← トレンド選択に戻る</button>
            </div>
          </Card>
        )}

        {currentStep === 3 && (
          <div className="text-center py-32 space-y-10 animate-in fade-in">
             <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20"><CheckCircle2 className="h-12 w-12 text-slate-950" /></div>
             <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Successfully Ready!</h2>
             <Button onClick={() => setCurrentStep(1)} className="bg-white text-slate-950 px-16 h-24 rounded-3xl font-black text-2xl hover:bg-slate-200 shadow-xl transition-all hover:scale-105">最初から作り直す</Button>
          </div>
        )}
      </div>

      <DebugPanel data={debugData} toolId="ai-select-shop" />
    </div>
  )
}
