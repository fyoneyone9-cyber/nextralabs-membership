'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, FileText, Layout, FileSearch, Send, Sparkles, CheckCircle2 } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 素材入力', icon: FileText },
  { id: 'report', label: '② レポート完成', icon: Layout },
];

export default function AiReportGenerator() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [rawNotes, setRawNotes] = useState('');
  const [finalReport, setFinalReport] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたはビジネスドキュメンテーションのプロです。以下の【メモ】を元に、高品質レポートを作成してください。

1. 【要旨】: 結論。
2. 【課題分析】: ロジカルな事実整理。
3. 【ネクストアクション】: 具体的な計画、期限。

【メモ】:
${rawNotes || '（未入力）'}`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white"><Lightbulb /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-white uppercase italic tracking-widest opacity-70">Documentation Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 leading-tight"><span className="text-slate-500 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-slate-700 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">BUSINESS DOCUMENT ENGINE</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI レポート作成</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-slate-200 text-slate-950 shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-slate-400"><FileSearch /> ① 素材入力</h3>
            {renderGuide(['会議メモや録音データを貼り付ける', '指示をコピーしてAIへ投げ、清書させる', 'AIの結果を右側のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={rawNotes} onChange={(e) => setRawNotes(e.target.value)} placeholder="断片的な情報をペースト..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-slate-500 outline-none font-medium shadow-inner" />
                 {rawNotes && (
                    <div className="space-y-4">
                       <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-950'}`}>清書指示をコピー</Button>
                       <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                          <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-slate-400" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">清書レポートを戻す</h3></div>
                 <textarea value={finalReport} onChange={(e) => setFinalReport(e.target.value)} placeholder="AIからの回答をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-slate-500 outline-none font-medium" />
              </div>
            </div>
            {finalReport && (
               <Button onClick={() => setActiveTab('report')} className="w-full h-20 mt-10 bg-slate-200 hover:bg-white text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic group">
                  ② 最終ドキュメントを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'report' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-slate-400 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Layout className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse w-12 h-12" /> Final Business Report</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner relative z-10">
                  {finalReport || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setRawNotes(''); setFinalReport(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
