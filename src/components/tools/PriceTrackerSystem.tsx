'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingDown, LineChart, BarChart, Loader2, ArrowRight, 
  Search, ShoppingCart, Zap, AlertCircle, History, Clock, CheckCircle2, RefreshCw
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [presets, setPresets] = useState<any[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    setIsLoadingPresets(true);
    try {
      const res = await fetch('/api/tools/price-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-presets' }),
      });
      const data = await res.json();
      if (data.success) setPresets(data.presets);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPresets(false);
    }
  };

  const runPricePrediction = async (targetUrl?: string) => {
    const url = targetUrl || productUrl;
    if (!url) return;
    setIsAnalyzing(true);
    setPredictionData(null);
    
    try {
      const res = await fetch('/api/tools/price-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: url }),
      });
      const data = await res.json();
      if (data.success) {
        setPredictionData(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-10 space-y-4 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-1 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-emerald-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full shadow-lg">Price Forecasting OS</Badge>
        <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">底値監視予測Bot</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v1.1-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden">
          <div className="absolute top-2 right-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter italic">API: CONNECTED (RAKUTEN_PRICING)</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-500 font-bold text-2xl bg-emerald-500/5">!</div>
          <div className="space-y-3 text-left">
            <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] italic mb-2">運用プロトコル / PRICE INSIGHTS</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#1</span> 下の楽天人気商品を選択するか、URLを入力</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#2</span> Google時系列解析AIが将来の価格変動を予測</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-indigo-600 italic text-2xl">#3</span> 最安値（底値）のタイミングをリアルタイム通知</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 🚀 楽天商品APIプリセット */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {isLoadingPresets ? (
               Array(6).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
             ) : presets.map(item => (
               <button 
                 key={item.id} 
                 onClick={() => { setProductUrl(item.url); runPricePrediction(item.url); }}
                 className={`p-4 bg-white/5 border-2 rounded-2xl flex flex-col items-start justify-center gap-1 transition-all active:scale-95 shadow-lg group ${productUrl === item.url ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 hover:border-emerald-500/30'}`}
               >
                 <div className="flex justify-between w-full items-center mb-1">
                    <span className="text-[10px] font-black text-white uppercase italic truncate pr-2">{item.name}</span>
                    <Badge className="bg-red-500/20 text-red-500 text-[8px] font-black">{item.trend}</Badge>
                 </div>
                 <p className="text-lg font-black text-emerald-400 italic leading-none">¥{item.currentPrice.toLocaleString()}</p>
                 <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">Market Analysis Data</p>
               </button>
             ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-500">
               <Search size={24} />
            </div>
            <input 
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="楽天の商品URLを貼り付け..."
              className="w-full h-20 bg-black border-2 border-white/10 rounded-2xl pl-16 pr-8 text-lg text-white focus:border-emerald-500 outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => runPricePrediction()}
            disabled={!productUrl || isAnalyzing}
            className={`w-full h-24 ${!productUrl || isAnalyzing ? 'bg-slate-800 opacity-50' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-emerald-900 active:border-b-0`}
          >
            {isAnalyzing ? <Loader2 className="w-10 h-10 animate-spin" /> : <LineChart className="w-10 h-10" />}
            <span>将来価格をAI予測 ➔</span>
          </button>
        </div>

        {predictionData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-black/40 border-2 border-white/5 p-8 rounded-[3rem] space-y-4 text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic pl-2">Current Market Price</p>
                  <div className="flex items-baseline gap-4 pl-2">
                    <p className="text-5xl font-black text-white italic">¥{predictionData.currentPrice.toLocaleString()}</p>
                    <Badge variant="outline" className="text-red-400 border-red-500/20 uppercase font-black italic">Tracking</Badge>
                  </div>
               </div>
               <div className="bg-emerald-600/10 border-2 border-emerald-500/50 p-8 rounded-[3rem] space-y-4 text-left">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic pl-2">Predicted Bottom Price</p>
                  <div className="flex items-baseline gap-4 pl-2">
                    <p className="text-5xl font-black text-emerald-400 italic">¥{predictionData.lowestPrice.toLocaleString()}</p>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Match Score</span>
                       <span className="text-lg font-black text-white italic">{predictionData.confidence}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#13141f] border-4 border-emerald-500/30 p-10 rounded-[3rem] relative overflow-hidden shadow-inner text-left">
               <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingDown className="w-32 h-32 text-white" /></div>
               <div className="flex items-center gap-4 mb-4">
                  <Zap className="text-emerald-400 animate-pulse" />
                  <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Nextra AI strategic Advice</h4>
               </div>
               <p className="text-2xl font-black text-white italic leading-relaxed">「 {predictionData.advice} 」</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <p className="text-slate-400 text-sm font-bold leading-relaxed">
            Google Cloudの時系列解析AIと楽天市場の膨大な在庫データを同期。単なる「今」の価格ではなく、「未来」の買い時を特定し、あなたの家計をインテリジェンスに防衛します。
         </p>
      </div>

      <DebugPanel data={{ hasPrediction: !!predictionData }} toolId="price-tracker-master-v1.1" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Financial Intelligence OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Syncing Prediction Node...</div>
})

export default function PriceTrackerWrapper() {
  return <NoSSRWrapper />;
}
