'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ShieldAlert, MapPin, ListChecks, Siren, Siren as SirenIcon
} from 'lucide-react'

const TABS = [
  { id: 'scan', label: '① 地域リスク', icon: MapPin },
  { id: 'advice', label: '② 防災プラン', icon: ShieldAlert },
];

export default function DisasterGuard() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [areaInfo, setAreaInfo] = useState('');
  const [guardPlan, setGuardPlan] = useState('');

  const FINAL_PROMPT = `あなたは危機管理と災害対策の専門家です。
以下の【居住地域と現在の備え】を分析し、あなた専用の「生存戦略レポート」を作成してください。

1. 【潜在リスク】: 地域特性（ハザードマップ等）から予測される災害リスク。
2. 【カスタマイズ備蓄リスト】: 家族構成や環境に合わせた、本当に必要な備品と数量。
3. 【避難・行動指針】: 発災から3時間以内に取るべき具体的アクション。

命を守るための、具体的かつ妥協のないアドバイスをお願いします。

【地域・備え情報】:
${areaInfo || '（ここに住んでいる場所の特性や現在の備蓄状況を入力してください）'}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">SURVIVAL ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 防災守護神</h1>
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
        {activeTab === 'scan' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><MapPin className="text-red-500" /> ① 地域リスク診断</h3>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 text-left">
                 <textarea value={areaInfo} onChange={(e) => setAreaInfo(e.target.value)} placeholder="例：川の近くのマンション3階。非常食は3日分あるが水が不安..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-red-600 outline-none font-medium shadow-inner" />
                 {areaInfo && (
                    <div className="space-y-4">
                       <Button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>診断指示をコピー</Button>
                       <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button><Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button></div>
                    </div>
                 )}
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center text-left">
                 <div className="flex items-center gap-3"><ClipboardPaste className="h-6 w-6 text-red-500" /><h3 className="text-lg font-black text-white italic uppercase">AIの診断を戻す</h3></div>
                 <textarea value={guardPlan} onChange={(e) => setGuardPlan(e.target.value)} placeholder="AIからのアドバイスをペースト..." className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-[10px] text-slate-300 focus:border-red-600 outline-none font-medium leading-relaxed" />
              </div>
            </div>
            {guardPlan && <Button onClick={() => setActiveTab('advice')} className="w-full h-16 mt-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic group">② 防災プランを確認 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}
        {activeTab === 'advice' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-l-8 border-l-red-600 text-left">
               <h3 className="text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><SirenIcon className="text-red-600 animate-pulse" /> 生存戦略レポート</h3>
               <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner italic">{guardPlan || "データがありません。"}</div>
            </Card>
            <Button onClick={() => { setAreaInfo(''); setGuardPlan(''); setActiveTab('scan'); }} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 別の拠点を診断する</Button>
          </div>
        )}
      </div>
    </div>
  )
}
