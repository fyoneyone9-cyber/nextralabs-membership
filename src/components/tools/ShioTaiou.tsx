'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Copy, HelpCircle, Zap, CheckCircle2, Globe } from 'lucide-react'

export default function ShioTaiou() {
  const [inputText, setInputText] = useState('')
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText("スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。:" + inputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="max-w-7xl mx-auto p-10 space-y-16 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl text-5xl">🧂</div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">塩対応代行AI</h1>
      </div>
      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="relative z-10 space-y-4">
          <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-full">STEP 01</Badge>
          <h3 className="text-3xl font-black italic uppercase">丁寧な断り文生成</h3>
          <p className="text-2xl font-bold leading-relaxed opacity-95">断りたい連絡内容を貼り付けてください。</p>
        </div>
      </div>
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto">
        <div className="space-y-12">
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="情報を入力..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-indigo-500 text-white shadow-inner" />
          <Button onClick={handleCopy} className={"w-full h-32 font-black text-4xl rounded-[2rem] shadow-2xl transition-all " + (copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100')}>
            {copied ? '✅ COPIED!' : 'プロンプトをコピー'}
          </Button>
          <div className="grid grid-cols-3 gap-6 text-center">
            <a href="https://gemini.google.com" target="_blank" className="p-8 rounded-3xl border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all opacity-80 shadow-xl">💎 GEMINI</a>
            <a href="https://chatgpt.com" target="_blank" className="p-8 rounded-3xl border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all opacity-80 shadow-xl">🟢 GPT</a>
            <a href="https://claude.ai" target="_blank" className="p-8 rounded-3xl border-2 border-orange-500/50 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">🟠 CLAUDE</a>
          </div>
        </div>
      </Card>
      <DebugPanel data={null} toolId="shiotaiou" />
    </div>
  )
}