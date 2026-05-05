'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, DoorOpen, ShieldCheck, FileText, ListChecks, CheckCircle2 } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 状況相談', icon: FileText },
  { id: 'plan', label: '② 退職プラン', icon: ShieldCheck },
];

export default function ResignationAssistant() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [resignationInfo, setResignationInfo] = useState('');
  const [finalAdvice, setFinalAdvice] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは労働法務とキャリア戦略に精通した専門家です。
以下の【現在の状況・悩み】を分析し、円満かつ安全に退職するための戦略を提示してください。

1. 【リスク診断】: 現在の状況から懸念される法的・感情的トラブル。
2. 【退職スケジュール】: 誰に、いつ、どのように伝えるべきかのステップ。
3. 【交渉の台本】: 引き止めに遭った際の切り返しや、退職理由の具体的な伝え方。

新しい人生を始めるための「守りの計画」をお願いします。

【状況・悩み】:
${resignationInfo || '（未入力）'}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-indigo-400 uppercase italic tracking-widest opacity-70">Liberation Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight"><span className="text-indigo-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">CAREER SHIELD</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">退職あんしんAI</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[500px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><FileText /> ① 状況相談</h3>
            {renderGuide(['今の仕事の不満や契約条件を入力する', '戦略指示をコピーしてAI（Claude推奨）へ投げる', 'AIから届いた退職戦略を右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={resignationInfo} onChange={(e) => setResignationInfo(e.target.value)} placeholder="不満点、有給消化、競合避止義務などの気になる点を入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-indigo-500 outline-none font-medium shadow-inner leading-relaxed" />
                 {resignationInfo && (
                    <div className="space-y-4">
                       <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>戦略指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button>
                          <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-indigo-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">戦略レポートを戻す</h3></div>
                 <textarea value={finalAdvice} onChange={(e) => setFinalAdvice(e.target.value)} placeholder="AIが提案した退職戦略をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {finalAdvice && (
               <Button onClick={() => setActiveTab('plan')} className="w-full h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 退職プランを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'plan' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><DoorOpen className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse w-12 h-12" /> Graduation Roadmap</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10 font-medium">
                  {finalAdvice || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setResignationInfo(''); setFinalAdvice(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
