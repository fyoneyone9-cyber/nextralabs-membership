'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, DoorOpen, ShieldCheck, FileText, ListChecks
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 状況相談', icon: FileText },
  { id: 'advice', label: '② 退職プラン', icon: ShieldCheck },
];

export default function ResignationAssistant() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [resignationInfo, setResignationInfo] = useState('');
  const [finalAdvice, setFinalAdvice] = useState('');

  const FINAL_PROMPT = `あなたはキャリアコンサルタントと労働法務に精通した専門家です。
以下の【現在の状況・悩み】を分析し、円満かつ安全に退職するための戦略を提示してください。

1. 【リスク診断】: 現在の状況から懸念される法的・感情的トラブル。
2. 【退職スケジュール】: 誰に、いつ、どのように伝えるべきかのステップ。
3. 【円満退職の台本】: 引き止めに遭った際の切り返しや、退職理由の伝え方の例文。

今の会社を卒業し、新しい人生を始めるための「守りの計画」をお願いします。

【現在の状況・悩み】:
${resignationInfo || '（ここに現在の悩みや会社との契約状況を入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">CAREER LIBERATION</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">退職あんしんAI</h1>
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
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><FileText className="text-indigo-500" /> ① 状況相談</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <p className="font-black text-xs uppercase text-slate-500 italic">Current Situation</p>
                 <textarea value={resignationInfo} onChange={(e) => setResignationInfo(e.target.value)} placeholder="今の仕事の不満や、契約書の内容などを入力..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-indigo-500 outline-none font-medium shadow-inner" />
                 {resignationInfo && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>退職戦略プロンプトをコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-indigo-500" /><h3 className="text-lg font-black text-white italic uppercase">AIの戦略を戻す</h3></div>
                 <textarea value={finalAdvice} onChange={(e) => setFinalAdvice(e.target.value)} placeholder="AIからのアドバイスをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {finalAdvice && <Button onClick={() => setActiveTab('advice')} className="w-full h-16 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 退職プランを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'advice' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-indigo-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><DoorOpen className="text-emerald-500" /> 安心の卒業ロードマップ</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{finalAdvice || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setResignationInfo(''); setFinalAdvice(''); setActiveTab('input'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初からやり直す</Button>
          </div>
        )}
      </div>
    </div>
  )
}
