'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Search, Ticket, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, Calendar, MapPin, Info } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 案件入力', icon: Search },
  { id: 'report', label: '② チケット戦略', icon: Ticket },
];

export default function TicketScout() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [eventInfo, setEventInfo] = useState('');
  const [scoutResult, setScoutResult] = useState('');

  const FINAL_PROMPT = `あなたは世界中のイベント・興行に精通したチケットスカウトです。
以下の【イベント・案件情報】を元に、最速でチケットを確保するための戦略を提示してください。

1. 【開催概要と希少性】: 公演の規模、倍率予想、リセール市場の動向。
2. 【先行・一般販売スケジュール】: プレイガイド別の販売日、抽選のコツ。
3. 【確保戦略】: どのサイトを狙うべきか、サーバー混雑対策、代替手段。

【イベント・案件情報】:
${eventInfo || '（ここにイベント名やURLを入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">EVENT INTELLIGENCE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Ticket Scout AI</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Search className="text-indigo-400" /> ① 案件入力</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={eventInfo} onChange={(e) => setEventInfo(e.target.value)} placeholder="イベント名やチケット販売サイトのURLを入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-indigo-500 outline-none font-medium shadow-inner" />
                 {eventInfo && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>スカウト指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI (検索推奨) ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-400" /><h3 className="text-lg font-black text-white italic uppercase">AIの調査結果を戻す</h3></div>
                 <textarea value={scoutResult} onChange={(e) => setScoutResult(e.target.value)} placeholder="AIが調べたチケットスケジュール等をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {scoutResult && <Button onClick={() => setActiveTab('report')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 確保戦略を確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'report' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-indigo-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Ticket className="text-emerald-500 animate-pulse" /> 最強チケット確保戦略</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{scoutResult || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setEventInfo(''); setScoutResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の案件を調査する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
