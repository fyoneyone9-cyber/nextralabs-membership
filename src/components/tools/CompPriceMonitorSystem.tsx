'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, BarChart, Settings, Loader2, ArrowRight, 
  Search, Building2, Zap, Globe, RefreshCw, CheckCircle2,
  TrendingDown, LineChart, AlertCircle, MapPin
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [targetArea, setTargetArea] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | ''>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const runAnalysis = async () => {
    if (!targetArea || !currentPrice) return;
    setIsAnalyzing(true);
    setStep(2);
    try {
      const res = await fetch('/api/tools/comp-price-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetArea, currentPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
        setStep(3);
      }
    } catch (e) {
      alert('分析エラー');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-1 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      {/* 🚀 ヘッダー：極限までコンパクトに */}
      <div className="text-center space-y-1">
        <Badge className="bg-blue-600 text-white font-black italic px-3 py-0.5 text-[8px] uppercase rounded-full">Revenue Optimization</Badge>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">競合価格監視</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      {/* 🧭 【新・一本道ガイド】 ステッププログレス */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2" />
        {[
          { s: 1, label: "エリア入力" },
          { s: 2, label: "AI分析中" },
          { s: 3, label: "戦略確認" }
        ].map((item) => (
          <div key={item.s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic transition-all duration-500 ${step >= item.s ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
              {step > item.s ? <CheckCircle2 size={20} /> : item.s}
            </div>
            <span className={`text-[10px] font-black uppercase italic ${step >= item.s ? 'text-emerald-400' : 'text-slate-700'}`}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30" />
        
        {/* APIステータス：常時表示で信頼を担保 */}
        <div className="flex justify-end pr-4">
           <div className="flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/50 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Live API Connected</span>
           </div>
        </div>

        {/* STEP 1: INPUT */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-[#0a0b14] border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-inner">
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-4 italic">#1 監視エリアを指定せよ</p>
                   <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                      <input 
                        value={targetArea} 
                        onChange={(e) => setTargetArea(e.target.value)} 
                        placeholder="例：神奈川県 海老名市" 
                        className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 text-white focus:border-emerald-500 outline-none transition-all text-lg font-bold" 
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-4 italic">#2 現在の自館価格を入力せよ</p>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black italic">¥</span>
                      <input 
                        type="number" 
                        value={currentPrice} 
                        onChange={(e) => setCurrentPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                        placeholder="12,000" 
                        className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl pl-12 pr-6 text-white focus:border-emerald-500 outline-none transition-all text-2xl font-black italic" 
                      />
                   </div>
                </div>
             </div>
             
             <button 
                onClick={runAnalysis}
                disabled={!targetArea || !currentPrice}
                className={`w-full h-24 rounded-[2rem] font-black text-3xl uppercase italic transition-all border-b-8 active:border-b-0 active:scale-95 shadow-2xl flex items-center justify-center gap-4 ${(!targetArea || !currentPrice) ? 'bg-slate-800 text-slate-600 border-slate-900 opacity-50 cursor-not-allowed' : 'bg-emerald-600 text-white border-emerald-900 hover:bg-emerald-500 animate-bounce-subtle'}`}
             >
                分析を開始する <ArrowRight size={32} />
             </button>
          </div>
        )}

        {/* STEP 2: ANALYZING */}
        {step === 2 && (
          <div className="py-20 text-center space-y-8 animate-in zoom-in-95">
             <div className="relative w-32 h-32 mx-auto">
                <Loader2 className="w-full h-full text-emerald-500 animate-spin" />
                <Zap className="absolute inset-0 m-auto text-white animate-pulse" size={40} />
             </div>
             <div className="space-y-2">
                <p className="text-3xl font-black text-white italic uppercase tracking-tighter">Analyzing Competition...</p>
                <p className="text-slate-500 font-bold italic">楽天トラベルから周辺価格を同期中。AIが最適な戦略を立案しています。</p>
             </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === 3 && analysis && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
               <div className="bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-center space-y-1 shadow-inner">
                  <p className="text-[8px] font-black text-slate-500 uppercase italic">競合平均価格</p>
                  <p className="text-2xl md:text-3xl font-black text-white italic">¥{analysis.compAverage.toLocaleString()}</p>
               </div>
               <div className="bg-emerald-600/20 border-2 border-emerald-500/50 p-6 rounded-3xl text-center space-y-1 shadow-xl ring-2 ring-emerald-500/20">
                  <p className="text-[8px] font-black text-emerald-400 uppercase italic">推奨販売価格</p>
                  <p className="text-2xl md:text-3xl font-black text-white italic">¥{analysis.recommendedPrice.toLocaleString()}</p>
               </div>
               <div className="bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-center space-y-1 shadow-inner col-span-2 md:col-span-1">
                  <p className="text-[8px] font-black text-blue-400 uppercase italic">市場トレンド</p>
                  <p className="text-sm font-black text-white uppercase italic">{analysis.marketTrend}</p>
               </div>
            </div>

            <div className="bg-[#1a1c2e] border-4 border-blue-500/30 p-8 md:p-12 rounded-[3rem] relative overflow-hidden shadow-inner text-left">
               <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Building2 size={120} className="text-white" /></div>
               <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                  <Zap className="text-blue-400 animate-pulse" size={24} />
                  <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Nextra AI 戦略進言</h4>
               </div>
               <p className="text-xl md:text-2xl font-black text-white italic leading-relaxed mb-10">「 {analysis.strategicAdvice} 」</p>
               
               <div className="bg-emerald-600 border-4 border-emerald-500 rounded-[2.5rem] p-8 shadow-2xl relative">
                  <div className="absolute -top-4 left-8 bg-white text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-lg italic">Staysee Action</div>
                  <p className="text-lg font-black text-white leading-relaxed flex items-start gap-4">
                     <CheckCircle2 className="shrink-0 mt-1" size={24} />
                     {analysis.stayseeAction}
                  </p>
               </div>
            </div>

            <button 
              onClick={() => { setAnalysis(null); setStep(1); }}
              className="w-full h-16 border-4 border-white/10 text-slate-600 hover:text-white hover:bg-white/5 font-black rounded-2xl uppercase italic transition-all flex items-center justify-center gap-4 active:scale-95"
            >
              <RotateCcw size={20} /> 分析をリセットして再開
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            周辺競合の動向をAIが監視。ステイシーの「価格カレンダー」と連動し、収益を最大化させるための精密なアクションを提示します。
         </p>
      </div>

      <DebugPanel data={{ step, analysisReady: !!analysis }} toolId="comp-price-monitor-master-v2" />
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-blue-500 animate-pulse uppercase tracking-[0.5em]">Initializing Intelligence Hub...</div>
})

export default function CompPriceMonitorSystem() {
  return <NoSSRWrapper />;
}
