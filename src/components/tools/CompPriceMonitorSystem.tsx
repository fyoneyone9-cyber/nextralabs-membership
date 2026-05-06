'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, BarChart, Settings, Loader2, ArrowRight, 
  Search, Building2, Zap, Globe, RefreshCw, CheckCircle2,
  TrendingDown, LineChart, AlertCircle
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [targetArea, setTargetArea] = useState('神奈川県 海老名市');
  const [currentPrice, setCurrentPrice] = useState(12000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await fetch('/api/tools/comp-price-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetArea, currentPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      alert('分析エラーが発生しました。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-blue-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Revenue Optimization Engine</Badge>
        <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl text-center">競合価格監視</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden">
          <div className="absolute top-2 right-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter italic">API: CONNECTED (RAKUTEN_TRAVEL)</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-500 font-bold text-2xl bg-blue-500/5">!</div>
          <div className="space-y-3 text-left">
            <p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] italic mb-2 text-left">運用プロトコル / REVENUE SYNC</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-blue-500 italic text-2xl">#1</span> 監視したい周辺エリアと現在の自館価格を設定</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-blue-500 italic text-2xl">#2</span> 楽天APIで周辺の競合価格・需給バランスをリアルタイム取得</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-blue-600 italic text-2xl">#3</span> AIがStaysee（ステイシー）の最適な販売価格を提案</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">監視ターゲットエリア</label>
              <input value={targetArea} onChange={(e) => setTargetArea(e.target.value)} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">現在の自館販売価格（円）</label>
              <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm text-white focus:border-blue-500 outline-none font-mono" />
            </div>
          </div>

          <button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={`w-full h-24 ${isAnalyzing ? 'bg-slate-800 opacity-50' : 'bg-blue-600 hover:bg-blue-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-blue-900 active:border-b-0`}
          >
            {isAnalyzing ? <Loader2 className="animate-spin w-10 h-10" /> : <LineChart className="w-10 h-10" />}
            <span>競合価格を分析 ➔</span>
          </button>
        </div>

        {analysis && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8">
            <div className="grid md:grid-cols-3 gap-6">
               <div className="bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-center space-y-2 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Comp. Average</p>
                  <p className="text-3xl font-black text-white italic">¥{analysis.compAverage.toLocaleString()}</p>
               </div>
               <div className="bg-emerald-600/10 border-2 border-emerald-500/50 p-6 rounded-3xl text-center space-y-2 shadow-xl">
                  <p className="text-[10px] font-black text-emerald-500 uppercase">Recommended</p>
                  <p className="text-3xl font-black text-white italic">¥{analysis.recommendedPrice.toLocaleString()}</p>
               </div>
               <div className="bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-center space-y-2 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Trend Mode</p>
                  <p className="text-sm font-black text-blue-400 uppercase italic">{analysis.marketTrend}</p>
               </div>
            </div>

            <div className="bg-[#1a1c2e] border-4 border-blue-500/30 p-10 rounded-[3rem] relative overflow-hidden shadow-inner text-left">
               <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Building2 size={120} className="text-white" /></div>
               <div className="flex items-center gap-4 mb-6">
                  <Zap className="text-blue-400 animate-pulse" />
                  <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Master Revenue Advice</h4>
               </div>
               <p className="text-2xl font-black text-white italic leading-relaxed mb-8">「{analysis.strategicAdvice}」</p>
               
               <div className="bg-emerald-600 border-4 border-emerald-500 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
                  <p className="text-[10px] font-black text-slate-950 uppercase mb-3 italic tracking-widest">Required Staysee Action</p>
                  <p className="text-lg font-black text-white leading-relaxed flex items-start gap-4">
                     <CheckCircle2 className="shrink-0 mt-1" />
                     {analysis.stayseeAction}
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-600/5 border-2 border-blue-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-blue-500 mb-2">
            <TrendingUp size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Yield Management Protocol</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            周辺競合の動向を24時間AIが監視。需要の波を読み取り、ADR（平均客室単価）を最大化させるための精密な価格変更案を提示します。ステイシーの「価格カレンダー」と連動し、ホテルの収益力をマスタ化します。
         </p>
      </div>

      <DebugPanel data={{ hasAnalysis: !!analysis }} toolId="comp-price-monitor-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Revenue Intelligence OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-blue-500 animate-pulse uppercase tracking-[0.5em]">Initializing Revenue Node...</div>
})

export default function CompPriceMonitorSystem() {
  return <NoSSRWrapper />;
}
