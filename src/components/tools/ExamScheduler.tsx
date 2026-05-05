'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, Calendar, BookOpen, Clock, Target, ListChecks
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 目標設定', icon: BookOpen },
  { id: 'schedule', label: '② 最適日程', icon: Calendar },
];

export default function ExamScheduler() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [examGoal, setExamGoal] = useState('');
  const [finalSchedule, setFinalSchedule] = useState('');

  const FINAL_PROMPT = `あなたは難関資格試験を数多く突破してきた、超効率的学習スケジューラーです。
以下の【目標試験と現在のレベル】に基づき、逆算した「最短合格スケジュール」を作成してください。

1. 【学習フェーズ】: 基礎固め、演習、直前対策の具体的な期間と重点項目。
2. 【週間ルーティン】: 平日・休日の時間配分と、科目別の配分比率。
3. 【学習のハック】: 暗記を爆速にする方法や、モチベーション維持の秘策。

【目標試験と現在のレベル】:
${examGoal || '（ここに受験する試験名と、現在の理解度を入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-emerald-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">LEARNING OPTIMIZER</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 試験スケジューラー</h1>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[400px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Target className="text-emerald-500" /> ① 目標設定</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={examGoal} onChange={(e) => setExamGoal(e.target.value)} placeholder="例：ITパスポート試験、1ヶ月で合格したい。現在は参考書を読み始めたばかり..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-emerald-500 outline-none font-medium shadow-inner" />
                 {examGoal && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>計画指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-emerald-500" /><h3 className="text-lg font-black text-white italic uppercase">AIの計画を戻す</h3></div>
                 <textarea value={finalSchedule} onChange={(e) => setFinalSchedule(e.target.value)} placeholder="AIからのスケジュール案をペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-emerald-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {finalSchedule && <Button onClick={() => setActiveTab('schedule')} className="w-full h-16 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 最適日程を確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'schedule' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-emerald-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Clock className="text-emerald-500 animate-pulse" /> 逆算合格ロードマップ</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{finalSchedule || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setExamGoal(''); setFinalSchedule(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の計画を立てる</Button>
          </div>
        )}
      </div>
    </div>
  )
}
