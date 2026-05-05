'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Copy, HelpCircle, Zap, CheckCircle2, Globe } from 'lucide-react'

export default function InboxOrganizer() {
  const [inputText, setInputText] = useState('')
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText("スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。:" + inputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="max-w-7xl mx-auto p-10 space-y-16 min-h-screen text-slate-200 font-sans pb-40">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl text-5xl">📧</div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">Gmail AI Accelerator</h1>
      </div>
      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-full">STEP 01</Badge>
            <h3 className="text-3xl font-black italic uppercase">受信トレイ整理</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">メールの要約を入力してください。</p>
          <div className="bg-black/20 p-4 rounded-2xl flex items-center gap-2"><Zap className="h-5 w-5 text-emerald-400" /><p className="text-sm font-bold tracking-widest uppercase">Expected Success: Highest Precision</p></div>
        </div>
      </div>
      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto">
        <div className="space-y-12">
          <div className="space-y-6">
            <Label className="text-emerald-400 font-black uppercase text-sm tracking-widest flex items-center gap-2 italic"><Zap className="h-5 w-5" /> 1. Input Source and Copy Command</Label>
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="情報を貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-indigo-600 text-white shadow-inner" />
            <Button onClick={handleCopy} className={"w-full h-32 font-black text-4xl rounded-[2rem] shadow-2xl transition-all mt-4 " + (copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100')}>
              {copied ? '✅ COPIED!' : '指示をコピー'}
            </Button>
          </div>
          <div className="space-y-8 pt-12 border-t border-white/5">
            <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2 italic"><Globe className="h-5 w-5" /> 2. Process with Global AI Networks</Label>
            
            {/* 🛠️ 【新ルール】黄金の御三家ボタン */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="https://gemini.google.com" target="_blank" className="p-10 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                <span className="text-5xl">💎</span><span className="font-black text-white text-2xl">GEMINI</span>
              </a>
              <a href="https://chatgpt.com" target="_blank" className="p-10 rounded-[2.5rem] border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                <span className="text-5xl">🟢</span><span className="font-black text-white text-2xl">GPT</span>
              </a>
              <a href="https://claude.ai" target="_blank" className="p-10 rounded-[2.5rem] border-2 border-orange-500/50 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                <Badge className="bg-orange-600 text-white border-0 font-black mb-1">Recommended</Badge>
                <span className="text-5xl">🟠</span><span className="font-black text-orange-400 text-2xl">CLAUDE</span>
              </a>
            </div>

            {/* 🛠️ 【新ルール】その他のAI選択肢 */}
            <div className="pt-8 space-y-4">
              <p className="text-slate-500 font-black text-xs uppercase tracking-widest text-center">その他の AI プラットフォームを選択</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="https://www.perplexity.ai" target="_blank" className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-center text-xs font-bold hover:bg-slate-800 transition-all text-slate-400">Perplexity</a>
                <a href="https://grok.com" target="_blank" className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-center text-xs font-bold hover:bg-slate-800 transition-all text-slate-400">Grok (X)</a>
                <a href="https://www.deepseek.com" target="_blank" className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-center text-xs font-bold hover:bg-slate-800 transition-all text-slate-400">DeepSeek</a>
                <a href="https://poe.com" target="_blank" className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-center text-xs font-bold hover:bg-slate-800 transition-all text-slate-400">Poe</a>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <DebugPanel data={null} toolId="inboxorganizer" />
    </div>
  )
}