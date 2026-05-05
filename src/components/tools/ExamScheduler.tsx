'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Calendar, BookOpen, Clock, Target, ListChecks, CheckCircle2, Download, MousePointerClick } from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 目標設定', icon: BookOpen },
  { id: 'schedule', label: '② 最適日程', icon: Calendar },
];

const PRESETS = [
  'ITパスポート', '基本情報技術者', '応用情報技術者', 'CompTIA Security+', 'AWS認定', 'TOEIC 800点'
];

export default function ExamScheduler() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [examGoal, setExamGoal] = useState('');
  const [scheduleResult, setScheduleResult] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは難関資格を数多く突破してきた超効率学習スケジューラーです。
以下の【目標試験と現在のレベル】に基づき、最短合格のための「逆算スケジュール」をGoogleカレンダー形式で作成してください。

1. 【フェーズ別計画】: 基礎固め、演習、総仕上げの具体的期間。
2. 【週間ルーティン】: 平日・休日の学習配分。
3. 【Googleカレンダー登録データ】: 
   ・MM/DD: [学習内容] (h)
   
の形式で、主要なマイルストーンを出力してください。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-emerald-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-emerald-500 uppercase italic tracking-widest">Scheduler Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-base text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-emerald-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">STUDY ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Exam Scheduler</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-500"><BookOpen /> ① 目標設定</h3>
            {renderGuide(['試験名と現在のレベルを選択または入力', '逆算指示をコピーしてAIへ投げ、日程を作らせる', 'AIが返したスケジュールを右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {PRESETS.map(p => (
                      <button key={p} onClick={() => {setSelectedPreset(p); setExamGoal(p)}} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${selectedPreset === p ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}>{p}</button>
                    ))}
                 </div>
                 <textarea value={examGoal} onChange={(e) => setExamGoal(e.target.value)} placeholder="受験する試験と現在の知識レベルを入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-emerald-500 outline-none font-medium shadow-inner" />
                 <Button onClick={() => handleCopy(FINAL_PROMPT)} className={`w-full h-20 font-black text-2xl rounded-2xl shadow-2xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>計画指示をコピー</Button>
                 <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                    <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button>
                 </div>
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-emerald-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">日程表を戻す</h3></div>
                 <textarea value={scheduleResult} onChange={(e) => setScheduleResult(e.target.value)} placeholder="AIから届いた日程案をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-emerald-500 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {scheduleResult && (
               <Button onClick={() => setActiveTab('schedule')} className="w-full h-20 mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 逆算スケジュールを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'schedule' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Calendar className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Clock className="text-emerald-500 animate-pulse w-12 h-12" /> 最短合格ロードマップ</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner font-mono relative z-10">
                  {scheduleResult || "データがありません。"}
               </div>
               <div className="mt-12 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl relative z-10 flex items-center justify-between">
                  <div className="text-left"><p className="text-emerald-500 font-black uppercase italic tracking-widest text-lg">Calendar Integration</p><p className="text-slate-400 text-sm font-bold">この計画をGoogleカレンダーに自動登録して、毎日リマインドを受け取れます。</p></div>
                  <Button variant="outline" className="h-16 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white font-black px-10 rounded-2xl transition-all flex items-center gap-2 uppercase italic"><MousePointerClick /> Google登録</Button>
               </div>
            </Card>
            <Button onClick={() => { setExamGoal(''); setScheduleResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 計画を立て直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
