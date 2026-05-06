'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [copied, setCopied] = useState(false);
  
  // Audit State
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  
  // Roadmap State
  const [roadmapInput, setRoadmapInput] = useState('');
  const [roadmapResult, setRoadmapResult] = useState('');

  // Simulation State
  const [price, setPrice] = useState(5000);
  const [count, setCount] = useState(10);

  const QUESTIONS = [
    "コツコツと文章を書くのが苦ではない",
    "デザインや美しいものを作るのが好きだ",
    "SNSで発信することに抵抗がない",
    "プログラミングやITツールを触るのが好きだ",
    "人の悩みを聞いて解決策を考えるのが得意だ"
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PROMPTS = {
    audit: `あなたはプロのキャリア副業コンサルタントです。私の適性を分析し、稼げるAI副業を3つ提案してください。
【自己分析データ】:
${QUESTIONS.map((q, i) => `- ${q}: ${answers[i] ? 'YES' : 'NO'}`).join('\n')}`,
    roadmap: `選んだ副業「${roadmapInput}」で月5万円稼ぐための、0→1ロードマップをステップバイステップで作成してください。`
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI SIDEJOB</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm tracking-widest shadow-2xl">v1.0-MASTER</div>
      </div>

      {/* 🛠️ NAVIGATION: スクショ通りのタブ */}
      <div className="flex gap-1 bg-[#1a1b26]/50 p-1 rounded-2xl border border-white/5 mb-12 max-w-4xl mx-auto">
        {[
          { id: 'audit', label: '① 適性診断', icon: '🎯' },
          { id: 'roadmap', label: '② ロードマップ', icon: '📋' },
          { id: 'calc', label: '③ 収益計算', icon: '💰' },
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex-1 py-4 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 ${
              activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>{tab.icon} {tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 max-w-5xl mx-auto">
        {/* ① 適性診断 */}
        {activeTab === 'audit' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center justify-center gap-6">
               🎯 ① 副業適性診断
            </h2>
            
            <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 mb-12 flex items-start gap-6 shadow-inner">
              <div className="w-10 h-10 rounded-full border border-[#5845e0]/30 flex items-center justify-center shrink-0 text-[#5845e0]">!</div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#5845e0] uppercase tracking-[0.2em] italic mb-2">STARTUP PROTOCOL</p>
                <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400">
                  <p>#1 質問に答えて強みを可視化する</p>
                  <p>#2 診断指示をコピーしてAI三台体制へ投げる</p>
                  <p>#3 AIの診断結果をロードマップ画面へ戻す</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-[#0a0b14] border border-white/5 rounded-2xl shadow-inner group hover:border-[#5845e0]/50 transition-all cursor-pointer" onClick={() => setAnswers(prev => ({...prev, [i]: !prev[i]}))}>
                    <span className="font-bold text-slate-300 group-hover:text-white">{q}</span>
                    <div className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${answers[i] ? 'bg-[#5845e0] border-white' : 'border-white/10 bg-black/50'}`}>
                      {answers[i] && <span className="text-white text-xs font-black">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 shadow-inner flex flex-col items-center justify-center space-y-10 relative">
                 <div className="w-full h-full bg-black/40 absolute inset-0 rounded-[2.5rem] z-0" />
                 <Button onClick={() => handleCopy(PROMPTS.audit)} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl relative z-10 ${copied ? 'bg-emerald-500' : 'bg-[#5845e0] text-white'}`}>
                    {copied ? '✅ 指示をコピー完了' : '診断指示をコピー'}
                 </Button>
                 <div className="grid grid-cols-3 gap-3 w-full relative z-10">
                    {['CLAUDE', 'GEMINI', 'CHATGPT'].map(ai => <button key={ai} className="h-12 bg-black border border-white/10 rounded-xl text-[9px] font-black text-slate-500 hover:text-white transition-all uppercase">{ai}</button>)}
                 </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab('roadmap')} className="w-full h-16 mt-12 bg-[#5845e0]/10 hover:bg-[#5845e0]/20 text-[#5845e0] font-black rounded-2xl italic flex items-center justify-center gap-3">
               ② ロードマップへ進む <ArrowRight />
            </Button>
          </div>
        )}

        {/* ② 0→1ロードマップ */}
        {activeTab === 'roadmap' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center justify-center gap-6">
               🚀 ② 0→1ロードマップ
            </h2>
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <textarea 
                    value={roadmapInput} onChange={(e) => setRoadmapInput(e.target.value)}
                    placeholder="AIから返ってきたジャンル等を入力..." 
                    className="w-full h-64 bg-[#0a0b14] border border-white/10 rounded-[2rem] p-8 text-sm text-white outline-none shadow-inner" 
                  />
                  <Button onClick={() => handleCopy(PROMPTS.roadmap)} className="w-full h-16 bg-red-600 text-white font-black rounded-xl">計画指示をコピー</Button>
               </div>
               <div className="bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 shadow-inner flex flex-col gap-6">
                  <div className="flex items-center gap-3"><span className="text-indigo-500">📋</span> <h3 className="font-black uppercase text-xs tracking-widest">AIの回答を戻す</h3></div>
                  <textarea value={roadmapResult} onChange={(e) => setRoadmapResult(e.target.value)} placeholder="AIが作ったロードマップをペースト..." className="flex-1 bg-[#13141f] border border-white/5 rounded-2xl p-6 text-sm text-slate-400 outline-none h-64" />
               </div>
            </div>
            <Button onClick={() => setActiveTab('calc')} className="w-full h-16 mt-12 bg-[#5845e0] text-white font-black rounded-2xl italic flex items-center justify-center gap-3">
               ③ 収益計算へ進む <ArrowRight />
            </Button>
          </div>
        )}

        {/* ③ 収益シミュレーター */}
        {activeTab === 'calc' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center justify-center gap-6">
               $ ③ 収益シミュレーター
            </h2>
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-12 py-10">
                  <div className="space-y-4">
                     <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest px-2"><span>単価: ¥{price.toLocaleString()}</span></div>
                     <input type="range" min="1000" max="50000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-indigo-500 cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest px-2"><span>件数: {count} 件</span></div>
                     <input type="range" min="1" max="100" step="1" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-indigo-500 cursor-pointer" />
                  </div>
                  <div className="bg-[#0a0b14] p-10 rounded-[2.5rem] border border-white/5 shadow-inner text-center space-y-2">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">MONTHLY INCOME</p>
                     <p className="text-7xl font-black text-white italic tracking-tighter">¥{(price * count).toLocaleString()}</p>
                  </div>
               </div>
               <div className="bg-[#0a0b14] rounded-[2.5rem] p-12 border border-white/5 shadow-inner flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-lg"><BarChart3 size={32}/></div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white italic uppercase italic">Reality Check</h4>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed italic">まずは小さく始め、AIを使いこなして時給単価を上げていきましょう。</p>
                  </div>
                  <button onClick={() => { setActiveTab('audit'); setAnswers({}); setRoadmapInput(''); setRoadmapResult(''); }} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl text-slate-500 font-black uppercase italic hover:text-white transition-all">最初からやり直す</button>
               </div>
            </div>
          </div>
        )}
      </div>
      <DebugPanel data={{ activeTab, price, count }} toolId="ai-sidejob-master" />
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

import { ArrowRight as ArrowRightIcon, BarChart3 as BarChart3Icon } from 'lucide-react'

export default function AiSidejob() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <NoSSRWrapper />
    </div>
  );
}
