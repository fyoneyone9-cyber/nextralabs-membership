'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Mail, MessageSquare, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, ClipboardPaste, Inbox, Send, ListChecks, Filter
} from 'lucide-react'

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
以下の【受信メール一覧】を解析し、最速で仕事を終わらせるためのアウトプットをお願いします。

1. 【重要度ランク】: 即レス必須、本日中、後日で全メールを分類。
2. 【返信ドラフト】: 特に重要な3件に対し、相手を感動させる完璧な返信文を作成してください。
3. 【TODOリスト】: メールから発生するタスクを箇条書きで。

【受信メール一覧】:
${rawEmails.substring(0, 3000)}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-blue-600/30 rounded-xl p-4 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-blue-500" /></div>
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Accelerator Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs text-slate-300 font-bold leading-tight flex items-center gap-2"><span className="text-blue-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">GMAIL AI ACCELERATOR</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Inbox Organizer</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Filter className="text-blue-500" /> ① 受信トレイ解析</h3>
            {renderGuide(['Gmail等の受信トレイを全選択してコピー', 'ここに貼り付けてAI解析指示をコピー', 'AI（Gemini推奨）に投げて優先順位と返信案を右に戻す'])}
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <div className="flex items-center gap-2 font-black text-xs uppercase text-slate-500"><Mail className="w-4 h-4" /> Raw Email Data</div>
                 <textarea value={rawEmails} onChange={(e) => setRawEmails(e.target.value)} placeholder="Gmailのリストをそのままコピペ..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:border-blue-500 outline-none font-medium leading-relaxed" />
                 {rawEmails && (
                    <div className="space-y-4">
                       <Button onClick={() => { handleCopy(FINAL_PROMPT); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white'}`}>加速指示をコピー</Button>
                       <Button variant="outline" className="w-full h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI (Google連携推奨) ↗</Button>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-blue-500" /><h3 className="text-lg font-black text-white italic uppercase">AIの分析を戻す</h3></div>
                 <textarea value={priorityAdvice} onChange={(e) => setPriorityAdvice(e.target.value)} placeholder="AIからの返信案をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-blue-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {priorityAdvice && (
               <Button onClick={() => setActiveTab('action')} className="w-full h-16 mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">
                  ② 返信加速モードへ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'action' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-blue-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-yellow-500 animate-pulse" /> 優先順位 ＆ 返信ドラフト</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">
                  {priorityAdvice || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setRawEmails(''); setPriorityAdvice(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 受信トレイをリセット</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">Workload Zero — NextraLabs 2026</p></div>
    </div>
  )
}
