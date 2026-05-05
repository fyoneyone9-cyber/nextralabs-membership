'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Copy, HelpCircle, Zap, CheckCircle2, Globe, Video, FileText, Users, ImageIcon, Music, Type } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'STEP 01', what: '初期設定', how: '情報を入力してください。' },
  { id: 2, label: 'STEP 02', what: 'AI解析', how: 'プロンプトをAIに渡して実行してください。' },
  { id: 3, label: 'STEP 03', what: '結果出力', how: '最終成果物を確認・保存します。' }
];

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎' },
  { id: 'chatgpt', name: 'GPT', url: 'https://chatgpt.com', icon: '🟢' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠' }
];

export default function ShioTaiou() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("詳細に漏れのないように抜き出して下さい。:" + inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentInfo = STEPS[currentStep - 1] || STEPS[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">ShioTaiou</h1>
      </div>

      {/* 🟢 PROGRESS BAR - MANDATORY IN ALL TOOLS */}
      <div className="flex items-center justify-center max-w-5xl mx-auto overflow-x-auto pb-10 px-10">
        <div className="flex items-center justify-between w-full min-w-[600px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none cursor-pointer" onClick={() => setCurrentStep(s.id)}>
              <div className={"flex flex-col items-center gap-3 transition-all " + (currentStep === s.id ? 'opacity-100 scale-125' : 'opacity-20')}>
                <div className={"w-12 h-12 rounded-2xl flex items-center justify-center border-2 " + (currentStep === s.id ? 'bg-red-600 border-red-400 text-white shadow-xl' : currentStep > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700')}>
                  {currentStep > s.id ? <CheckCircle2 className="h-6 w-6" /> : <span className="font-bold text-sm">{s.id}</span>}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={"h-1 flex-1 mx-4 rounded-full transition-all " + (currentStep > s.id ? 'bg-emerald-500' : 'bg-slate-800')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-2xl shadow-xl">STEP 0{currentStep}</Badge>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">{currentInfo.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto overflow-hidden">
          <div className="space-y-12">
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="情報を入力..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
            <Button onClick={handleCopy} className={"w-full h-32 font-black text-4xl rounded-[2rem] shadow-2xl transition-all " + (copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100')}>
               {copied ? '✅ COPIED!' : '指示をコピー'}
            </Button>
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/5">
              {MAJOR_AI.map(ai => (
                <a key={ai.id} href={ai.url} target="_blank" className="h-24 bg-slate-900 border-2 border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl group text-slate-400 hover:text-white">
                  <span className="text-3xl">{ai.icon}</span><span className="font-black text-xs uppercase tracking-tighter">{ai.name}</span>
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <DebugPanel data={null} toolId="shiotaiou" />
    </div>
  )
}
