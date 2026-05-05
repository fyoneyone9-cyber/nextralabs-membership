'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, TrendingUp, Send, PenTool, MessageSquare
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 下書き入力', icon: PenTool },
  { id: 'coach', label: '② バズ添削', icon: TrendingUp },
];

export default function BuzzWriter() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState('');
  const [buzzResult, setBuzzResult] = useState('');

  const FINAL_PROMPT = `あなたはSNSマーケティングとコピーライティングの天才です。
以下の【投稿の下書き】を分析し、バズるための3つの改善案を出力してください。

1. 【フックの強化】: 1行目でスクロールを止めるための、強烈な書き出し案（3つ）。
2. 【共感の設計】: 読み手が「自分のことだ」と思うための心理的トリガーの挿入。
3. 【バズる完成稿】: 元の意図を活かしつつ、拡散されやすい形式に整えた最終稿。

【投稿の下書き】:
${draft || '（ここに投稿したい文章を入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">VIRAL ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI バズ文章コーチ</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><PenTool className="text-red-500" /> ① 下書き入力</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="SNSに投稿したい下書きをペースト..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-red-500 outline-none font-medium shadow-inner" />
                 {draft && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>バズ指示をコピー</Button>
                       <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>GPT-4o</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-red-500" /><h3 className="text-lg font-black text-white italic uppercase">AIの添削を戻す</h3></div>
                 <textarea value={buzzResult} onChange={(e) => setBuzzResult(e.target.value)} placeholder="AIからの添削結果をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-red-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {buzzResult && <Button onClick={() => setActiveTab('coach')} className="w-full h-16 mt-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② バズる文章を確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'coach' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-red-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Sparkles className="text-yellow-500 animate-pulse" /> バズ文章完成レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{buzzResult || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setDraft(''); setBuzzResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 次の文章を添削する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
