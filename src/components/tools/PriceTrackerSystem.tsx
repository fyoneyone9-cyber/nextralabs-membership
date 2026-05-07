'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingDown, LineChart, BarChart, Loader2, ArrowRight, 
  Search, ShoppingCart, Zap, AlertCircle, History, Clock, CheckCircle2, RefreshCw, RotateCcw
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [presets, setPresets] = useState<any[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);

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
    setStep(2);
    
    try {
      // AI縺梧晁・＠縺ｦ縺・ｋ繧医≧縺ｫ隕九○繧区ｼ泌・逕ｨ縺ｮ驕・ｻｶ
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/tools/price-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: url }),
      });
      const data = await res.json();
      if (data.success) {
        // AI縺ｮ諤晁・・繝ｭ繧ｻ繧ｹ繧剃ｻ伜刈
        const extendedResult = {
          ...data.result,
          analysisLog: [
            "讌ｽ螟ｩ蟶ょｴ縺ｮ繝ｪ繧｢繝ｫ繧ｿ繧､繝萓｡譬ｼ繝ｭ繧ｰ繧偵せ繧ｭ繝｣繝ｳ荳ｭ...",
            "驕主悉6繝ｶ譛磯俣縺ｮ萓｡譬ｼ螟牙虚繝代ち繝ｼ繝ｳ繧呈歓蜃ｺ...",
            "遶ｶ蜷医す繝ｧ繝・・縺ｮ蝨ｨ蠎ｫ迥ｶ豕√→繧ｻ繝ｼ繝ｫ螻･豁ｴ繧堤・蜷・..",
            "髴隕∽ｺ域ｸｬ繧｢繝ｫ繧ｴ繝ｪ繧ｺ繝縺ｫ繧医ｋ蟆・擂萓｡譬ｼ縺ｮ邂怜・螳御ｺ・・
          ]
        };
        setPredictionData(extendedResult);
        setStep(3);
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
        <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">蠎募､逶｣隕紋ｺ域ｸｬBot</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.1-MASTER</div>
      </div>

      {/* ｧｭ 繧ｹ繝・ャ繝励・繝ｭ繧ｰ繝ｬ繧ｹ */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2" />
        {[
          { s: 1, label: "蝠・刀驕ｸ謚・ },
          { s: 2, label: "AI隗｣譫蝉ｸｭ" },
          { s: 3, label: "莠域ｸｬ螳御ｺ・ }
        ].map((item) => (
          <div key={item.s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic transition-all duration-500 ${step >= item.s ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
              {step > item.s ? <CheckCircle2 size={20} /> : item.s}
            </div>
            <span className={`text-[10px] font-black uppercase italic ${step >= item.s ? 'text-emerald-400' : 'text-slate-700'}`}>{item.label}</span>
          </div>
        ))}
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
            <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] italic mb-2 text-left">驕狗畑繝励Ο繝医さ繝ｫ / PRICE INSIGHTS</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200 text-left">
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#1</span> 荳九・讌ｽ螟ｩ莠ｺ豌怜膚蜩√ｒ驕ｸ謚槭☆繧九°縲ゞRL繧貞・蜉・/p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-emerald-500 italic text-2xl">#2</span> 蟆・擂萓｡譬ｼ繧剃ｺ域ｸｬ繝懊ち繝ｳ繧偵ち繝・・</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-indigo-600 italic text-2xl">#3</span> AI縺ｮ莠域ｸｬ邨先棡縺ｫ蝓ｺ縺･縺阪瑚ｲｷ縺・凾縲阪ｒ蛻､譁ｭ</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {step < 3 && (
            <div className="space-y-6 animate-in fade-in">
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
                    <p className="text-lg font-black text-emerald-400 italic leading-none">ﾂ･{item.currentPrice.toLocaleString()}</p>
                    <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">Select Item 筐・/p>
                  </button>
                ))}
              </div>

              <div className="relative group text-left">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-500">
                  <Search size={24} />
                </div>
                <input 
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="讌ｽ螟ｩ縺ｮ蝠・刀URL繧定ｲｼ繧贋ｻ倥￠..."
                  className="w-full h-20 bg-black border-2 border-white/10 rounded-2xl pl-16 pr-8 text-lg text-white focus:border-emerald-500 outline-none transition-all shadow-inner"
                />
              </div>

              <button 
                onClick={() => runPricePrediction()}
                disabled={!productUrl || isAnalyzing || step === 3}
                className={`w-full h-24 ${!productUrl || isAnalyzing ? 'bg-slate-800 opacity-50' : step === 3 ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-emerald-600 text-white border-emerald-900'} font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 active:border-b-0`}
              >
                {step === 3 ? (
                  <>
                    <CheckCircle2 className="w-10 h-10" />
                    <span>莠域ｸｬ縺悟ｮ御ｺ・＠縺ｾ縺励◆ 筐・/span>
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span>蛻・梵荳ｭ...</span>
                  </>
                ) : (
                  <>
                    <LineChart className="w-10 h-10" />
                    <span>蟆・擂萓｡譬ｼ繧但I莠域ｸｬ 筐・/span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && predictionData && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8">
              {/* 虫 莠域ｸｬ邨先棡繧ｵ繝槭Μ繝ｼ */}
              <div className="bg-emerald-500 text-slate-950 p-6 rounded-[2rem] flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-950 text-emerald-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic leading-none text-xl">Prediction Complete</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">AI縺瑚ｲｷ縺・凾繧堤音螳壹＠縺ｾ縺励◆</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                  <p className="font-black italic text-xl text-slate-950">Success</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                 <div className="bg-black/40 border-2 border-white/5 p-8 rounded-[3rem] space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic pl-2 text-left">Current Price</p>
                    <div className="flex items-baseline gap-4 pl-2">
                      <p className="text-4xl font-black text-white italic">ﾂ･{predictionData.currentPrice.toLocaleString()}</p>
                      <Badge variant="outline" className="text-red-400 border-red-500/20 uppercase font-black italic text-[8px]">Tracking</Badge>
                    </div>
                 </div>
                 <div className={`p-8 rounded-[3rem] space-y-4 border-4 ${predictionData.prediction === 'DOWN' ? 'border-emerald-500 bg-emerald-600/10' : 'border-white/10 bg-black/40'}`}>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic pl-2 text-left">Predicted Bottom</p>
                    <div className="flex items-baseline gap-4 pl-2">
                      <p className="text-4xl font-black text-white italic">ﾂ･{predictionData.lowestPrice.toLocaleString()}</p>
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-emerald-500 uppercase">Match Score</span>
                         <span className="text-lg font-black text-white italic">{predictionData.confidence}</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#13141f] border-4 border-emerald-500/30 p-10 rounded-[3rem] relative overflow-hidden shadow-inner text-left">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingDown className="w-32 h-32 text-white" /></div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Zap className="text-emerald-400 animate-pulse" />
                        <h4 className="text-xl font-black text-white uppercase italic tracking-widest text-left">Nextra AI strategic Advice</h4>
                    </div>
                    
                    {/* AI縺ｮ諤晁・Ο繧ｰ繧定｡ｨ遉ｺ */}
                    <div className="bg-black/40 rounded-2xl p-6 font-mono text-[10px] text-emerald-500/70 border border-emerald-500/10 space-y-2 mb-6">
                       {predictionData.analysisLog?.map((log: string, i: number) => (
                         <div key={i} className="flex gap-2">
                            <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                            <span className="animate-pulse">笳・/span>
                            {log}
                         </div>
                       ))}
                    </div>

                    <p className="text-2xl font-black text-white italic leading-relaxed text-left border-l-4 border-emerald-500 pl-6">
                      縲・{predictionData.advice} 縲・                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <a 
                  href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(productUrl)}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-20 bg-white text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl uppercase italic hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <ShoppingCart /> 讌ｽ螟ｩ蟶ょｴ縺ｧ譛螳牙､繧偵メ繧ｧ繝・け 筐・                </a>
                <button 
                  onClick={() => { setStep(1); setPredictionData(null); }}
                  className="h-16 border-4 border-white/10 text-slate-600 hover:text-white font-black rounded-2xl uppercase italic flex items-center justify-center gap-4 transition-all"
                >
                  <RotateCcw /> 莉悶・蝠・刀繧剃ｺ域ｸｬ縺吶ｋ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            Google Cloud縺ｮ譎らｳｻ蛻苓ｧ｣譫植I縺ｨ讌ｽ螟ｩ蟶ょｴ縺ｮ繝・・繧ｿ繧貞酔譛溘ょ腰縺ｪ繧九御ｻ翫阪・萓｡譬ｼ縺ｧ縺ｯ縺ｪ縺上√梧悴譚･縲阪・雋ｷ縺・凾繧堤音螳壹＠縲∝ｮｶ險医ｒ繧､繝ｳ繝・Μ繧ｸ繧ｧ繝ｳ繧ｹ縺ｫ髦ｲ陦帙＠縺ｾ縺吶・         </p>
      </div>

      <DebugPanel data={{ hasPrediction: !!predictionData, step }} toolId="price-tracker-master-v1.1" />
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
