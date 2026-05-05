'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, ClipboardPaste, Zap, ChevronRight, Copy, ExternalLink, Sparkles, RotateCcw, Lightbulb, Network, ShieldAlert, Target
} from 'lucide-react'

const TABS = [
  { id: 'input', label: '① 情報入力', icon: ClipboardPaste },
  { id: 'analyze', label: '② AI分析', icon: Zap },
  { id: 'graph', label: '③ 相関図作成', icon: Network },
];

export default function OfficePoliticsGraph() {
  const [activeTab, setActiveTab] = useState('input');
  const [copied, setCopied] = useState(false);
  const [rawInfo, setRawInfo] = useState('');
  const [analysisResult, setAnalyzeResult] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPTS = {
    analyze: `あなたは組織心理学と社内政治に精通したコンサルタントです。以下の【社内状況メモ】を分析し、以下の項目を特定してください。

1. 主要な派閥とそのリーダー
2. 隠れたキーマン（意思決定に影響力を持つ人物）
3. あなたが取るべき「最も安全で効果的な立ち回り方」

【社内状況メモ】:
${rawInfo || '（ここに社内の人間関係や出来事を入力してください）'}

具体的かつ辛辣なほどリアルな分析をお願いします。`,
    graph: `前述の分析結果をもとに、Mermaid.js形式、または視覚的に分かりやすいテキスト形式で「組織相関図」を描画してください。誰が誰を支持し、誰と誰が対立しているかを明確に可視化してください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border border-red-600/30 rounded-xl p-4 md:p-6 mb-6 flex items-start gap-4 shadow-xl">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600/10 rounded-lg flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-red-500" /></div>
      <div className="space-y-1">
        <p className="text-[10px] md:text-xs font-black text-red-500 uppercase tracking-widest italic">Operation Guide</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-sm text-slate-300 font-bold leading-tight flex items-center gap-2">
            <span className="text-red-500 italic">#{i+1}</span> {s}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-1">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-3 py-0.5 text-[8px] uppercase rounded-full">POLITICS ENGINE</Badge>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Office Lens AI</h1>
      </div>

      {/* CONSTITUTIONAL TABS */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[500px] md:min-w-full rounded-xl shadow-xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-1 rounded-lg font-black text-[9px] md:text-xs uppercase italic transition-all flex flex-col items-center justify-center gap-1 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'input' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-2"><ClipboardPaste className="text-indigo-500" /> ① 情報入力</h3>
            {renderGuide(['社内の人間関係や最近の出来事を入力する', '「分析プロンプトをコピー」する', 'AIを開いて貼り付け、分析結果を右側に持ち帰る'])}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-2"><Target className="h-4 w-4 text-red-500" /><p className="text-[10px] text-slate-500 font-black uppercase">Internal Memo</p></div>
                 <textarea value={rawInfo} onChange={(e) => setRawInfo(e.target.value)} placeholder="例：営業部長のAさんと人事のBさんは不仲らしい。新人のCさんはAさんの派閥に入った..." className="w-full h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:border-indigo-500 outline-none font-medium shadow-inner" />
              </div>
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-center">
                 <div className="flex items-center gap-2"><ClipboardPaste className="h-4 w-4 text-indigo-500" /><h3 className="text-sm md:text-lg font-black text-white italic uppercase">AIの分析を戻す</h3></div>
                 <textarea value={analysisResult} onChange={(e) => setAnalyzeResult(e.target.value)} placeholder="AIからの回答をここにペースト..." className="w-full h-48 md:h-64 bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-300 focus:border-indigo-500 outline-none font-mono" />
              </div>
            </div>
            {rawInfo && (
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Button onClick={() => handleCopy(PROMPTS.analyze)} className={`h-14 font-black rounded-xl shadow-lg transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-white text-black'}`}>分析指示をコピー</Button>
                <Button variant="outline" onClick={() => window.open('https://claude.ai', '_blank')} className="h-14 border-slate-800 text-slate-300 font-black rounded-xl hover:bg-slate-800 uppercase italic">CLAUDEを開く ↗</Button>
              </div>
            )}
            {analysisResult && (
               <Button onClick={() => setActiveTab('analyze')} className="w-full h-14 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase italic text-xs group">② 詳細分析へ進む <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></Button>
            )}
          </Card>
        )}

        {activeTab === 'analyze' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl animate-in fade-in zoom-in">
             <h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-yellow-500" /> ② AI詳細分析</h3>
             {renderGuide(['分析された派閥構造をさらに深掘りする', '「立ち回り指示をコピー」してAIへ投げる'])}
             <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 whitespace-pre-wrap">{PROMPTS.analyze}</div>
             <Button onClick={() => handleCopy(PROMPTS.analyze)} className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl transition-all mb-4">分析を継続コピー</Button>
             <Button onClick={() => setActiveTab('graph')} className="w-full h-14 bg-indigo-800 text-white font-black rounded-xl flex items-center justify-center gap-2 italic uppercase text-xs group">③ 相関図作成へ <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Button>
          </Card>
        )}

        {activeTab === 'graph' && (
          <Card className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl animate-in fade-in zoom-in text-center">
             <h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-8 flex items-center justify-center gap-3"><Network className="text-emerald-500" /> ③ 組織相関図を可視化</h3>
             {renderGuide(['相関図描画指示をコピーする', 'AIに投げてビジュアル化された図を受け取る'])}
             <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic mb-6 whitespace-pre-wrap">{PROMPTS.graph}</div>
             <Button onClick={() => handleCopy(PROMPTS.graph)} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all mb-8">相関図指示をコピー</Button>
             <Button onClick={() => { setRawInfo(''); setAnalyzeResult(''); setActiveTab('input'); }} variant="outline" className="w-full h-12 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-xl italic flex items-center justify-center gap-2"><RotateCcw className="h-4 w-4" /> 最初からやり直す</Button>
          </Card>
        )}
      </div>
      <div className="mt-12 text-center text-slate-500"><p className="text-[8px] font-black uppercase tracking-widest italic opacity-20">Office Politics Analyzer — Powered by NextraLabs</p></div>
    </div>
  )
}
