'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ShieldAlert, MapPin, ListChecks, Siren, Siren as SirenIcon, CheckCircle2 } from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 地域リスク', icon: MapPin },
  { id: 'advice', label: '② 生存戦略', icon: ShieldAlert },
];

export default function DisasterGuard() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [areaInfo, setAreaInfo] = useState('');
  const [guardPlan, setGuardPlan] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FINAL_PROMPT = `あなたは危機管理と災害対策の専門家です。
以下の【居住地域と現在の備え】を分析し、あなた専用の「生存戦略レポート」を作成してください。

1. 【潜在リスク】: 地域特性（ハザードマップ等）から予測される致命的な災害リスク。
2. 【カスタマイズ備蓄リスト】: 家族構成や環境に合わせた、本当に必要な備品と数量。
3. 【避難・行動指針】: 発災から3時間以内に取るべき具体的アクション。

命を守るための、具体的かつ妥協のないアドバイスをお願いします。`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-red-400 uppercase italic tracking-widest opacity-70">Survival Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight"><span className="text-red-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">SURVIVAL ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Disaster Guard AI</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-2 flex min-w-[500px] md:min-w-full rounded-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-red-500"><MapPin /> ① 地域リスク診断</h3>
            {renderGuide(['居住地域の情報と現在の備蓄状況を入力', '診断指示をコピーしてAI（Gemini推奨）へ投げる', 'AIが作成した生存戦略を右のエリアに戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                 <textarea value={areaInfo} onChange={(e) => setAreaInfo(e.target.value)} placeholder="例：川の近くの低地。非常食3日分。家族は3人..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-base text-slate-200 focus:border-red-600 outline-none font-medium shadow-inner leading-relaxed" />
                 {areaInfo && (
                    <div className="space-y-4">
                       <Button onClick={() => { handleCopy(FINAL_PROMPT + `\n\n【地域・備え情報】:\n${areaInfo}`); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white hover:bg-red-500'}`}>診断指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI (検索最強) ↗</Button>
                          <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                       </div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-red-500" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">AIの戦略を戻す</h3></div>
                 <textarea value={guardPlan} onChange={(e) => setGuardPlan(e.target.value)} placeholder="AIから届いた生存戦略をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-red-600 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {guardPlan && (
               <Button onClick={() => setActiveTab('advice')} className="w-full h-20 mt-10 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group">
                  ② 生存戦略レポートを確認 <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            )}
          </Card>
        )}

        {activeTab === 'advice' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-red-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><SirenIcon className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse w-12 h-12" /> Survival Strategy</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 leading-relaxed text-left whitespace-pre-wrap shadow-inner italic relative z-10 font-medium">
                  {guardPlan || "データがありません。"}
               </div>
            </Card>
            <Button onClick={() => { setAreaInfo(''); setGuardPlan(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の条件で診断する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
