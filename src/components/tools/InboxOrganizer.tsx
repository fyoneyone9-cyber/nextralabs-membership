'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Mail, MessageSquare, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Inbox, Send, ListChecks, Filter, CheckCircle2 } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 受信トレイ解析', icon: Inbox },
  { id: 'action', label: '② 返信加速', icon: Send },
];

export default function InboxOrganizer() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [rawEmails, setRawEmails] = useState('');
  const [priorityAdvice, setPriorityAdvice] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは超一流の経営者秘書です。
以下の【メール一覧】を分析し、最速で仕事を終わらせるためのアウトプットを提示してください。

1. 【優先順位】: 即レス必須、本日中、後日で全メールを格付け。
2. 【返信ドラフト】: 特に重要な3件に対し、相手を感動させる丁寧な返信案。
3. 【TODOリスト】: メールから発生するネクストタスク。

【受信メール一覧】:
${rawEmails.substring(0, 3000)}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-blue-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-blue-400 uppercase italic tracking-widest opacity-70">Inbox Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-blue-500 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">GMAIL AI ACCELERATOR</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Inbox Organizer</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[500px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-blue-500"><Filter /> ① 受信トレイ解析</h3>
            {renderGuide(['Gmailの受信一覧を全選択してコピーする', '加速指示をコピーしてAI（Gemini推奨）へ投げ込む', 'AIから返ってきた返信案を右側のエリアに戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={rawEmails} onChange={(e) => setRawEmails(e.target.value)} placeholder="受信トレイの内容をペースト..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-blue-500 outline-none font-medium shadow-inner leading-relaxed" />
                 {rawEmails && (
                    <div className="space-y-4">
                       <Button onClick={() => { handleCopy(FINAL_PROMPT); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>加速指示をコピー</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic w-full" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI (推奨) ↗</Button>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-blue-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">分析結果を戻す</h3></div>
                 <textarea value={priorityAdvice} onChange={(e) => setPriorityAdvice(e.target.value)} placeholder="AIから届いた返信案をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-blue-500 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {priorityAdvice && (
               <Button onClick={() => setActiveTab('action')} className="w-full h-20 mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 返信加速モードへ <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'action' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-blue-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Send className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse w-12 h-12" /> Accelerator Report</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10 font-medium">
                  {priorityAdvice || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setRawEmails(''); setPriorityAdvice(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
