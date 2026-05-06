'use client'
import React, { useState, useEffect } from 'react'

/**
 * 🛠️ AI Sidejob Engine v1.1-STABLE
 * SSR完全排除・依存関係をネイティブ要素に純化。
 */

export default function AiSidejob() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [roadmapInput, setRoadmapInput] = useState('');
  const [roadmapResult, setRoadmapResult] = useState('');
  const [price, setPrice] = useState(5000);
  const [count, setCount] = useState(10);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) return <div className="min-h-screen bg-[#050507]" />;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-4 md:p-10 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">AI SIDEJOB</h1>
          <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm tracking-widest shadow-2xl">MASTER v1.1</div>
        </div>

        {/* 🛠️ TAB NAVIGATION (RAW HTML) */}
        <div className="flex gap-1 bg-[#1a1b26]/50 p-1 rounded-2xl border border-white/5 max-w-4xl mx-auto">
          {[
            { id: 'audit', label: '① 適性診断' },
            { id: 'roadmap', label: '② ロードマップ' },
            { id: 'calc', label: '③ 収益計算' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          {activeTab === 'audit' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative animate-in fade-in">
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">🎯 副業適性診断</h2>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  {QUESTIONS.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-[#0a0b14] border border-white/5 rounded-2xl cursor-pointer" onClick={() => setAnswers(prev => ({...prev, [i]: !prev[i]}))}>
                      <span className="font-bold text-slate-300">{q}</span>
                      <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${answers[i] ? 'bg-[#5845e0] border-white' : 'border-white/10'}`}>
                        {answers[i] && <span className="text-white">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center justify-center space-y-6">
                   <button onClick={() => handleCopy("診断プロンプト")} className={`w-full h-20 text-xl font-black rounded-2xl transition-all ${copied ? 'bg-emerald-500' : 'bg-[#5845e0]'} text-white`}>
                      {copied ? '✅ COPIED' : '診断指示をコピー'}
                   </button>
                   <div className="grid grid-cols-3 gap-2 w-full">
                      {['CHATGPT', 'GEMINI', 'CLAUDE'].map(ai => <button key={ai} onClick={() => window.open('https://google.com')} className="h-10 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500">{ai}</button>)}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 animate-in fade-in">
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">🚀 0→1ロードマップ</h2>
              <div className="grid lg:grid-cols-2 gap-12 text-left">
                 <textarea value={roadmapInput} onChange={(e) => setRoadmapInput(e.target.value)} placeholder="AIの回答を入力..." className="h-64 bg-[#0a0b14] border border-white/10 rounded-3xl p-8 text-white outline-none" />
                 <textarea value={roadmapResult} onChange={(e) => setRoadmapResult(e.target.value)} placeholder="ロードマップを戻す..." className="h-64 bg-[#0a0b14] border border-white/10 rounded-3xl p-8 text-slate-400 outline-none" />
              </div>
            </div>
          )}

          {activeTab === 'calc' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 animate-in fade-in">
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">💰 収益シミュレーター</h2>
              <div className="max-w-md mx-auto space-y-10">
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black text-slate-500"><span>単価: ¥{price.toLocaleString()}</span></div>
                    <input type="range" min="1000" max="50000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-[#5845e0]" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black text-slate-500"><span>件数: {count} 件</span></div>
                    <input type="range" min="1" max="100" step="1" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-[#5845e0]" />
                 </div>
                 <div className="bg-[#0a0b14] p-10 rounded-[2.5rem] border border-white/5 text-center">
                    <p className="text-[10px] font-black text-slate-600 mb-2 uppercase">Monthly Income</p>
                    <p className="text-6xl font-black text-white italic">¥{(price * count).toLocaleString()}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
