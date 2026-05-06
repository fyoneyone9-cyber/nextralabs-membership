'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Scale, ShoppingCart, Zap, Loader2, ArrowRight, 
  Search, Package, BarChart3, Rocket, Globe, 
  CheckCircle2, RefreshCw, AlertCircle, ShoppingBag
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const PRESETS = [
  { id: 'iphone', name: 'iPhone 15 Pro', query: 'iPhone 15 Pro 128GB MTUA3J/A' },
  { id: 'macbook', name: 'MacBook Air M3', query: 'MacBook Air M3 8GB 256GB' },
  { id: 'switch', name: 'Nintendo Switch', query: 'Nintendo Switch 有機ELモデル' },
];

const MasterEngine = () => {
  const [productName, setProductName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const runComparison = async (targetQuery?: string) => {
    const query = targetQuery || productName;
    if (!query) return;
    
    setIsAnalyzing(true);
    setCompareData(null); // 前の結果をクリアして「リアルタイム感」を出す
    
    try {
      const res = await fetch('/api/tools/buy-smart-nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setCompareData(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full shadow-lg">Purchase Smart Engine</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">中古・新品比較ナビ</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.1-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden">
          <div className="absolute top-2 right-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter italic">API: CONNECTED (RAKUTEN_LIVE)</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-500 font-bold text-2xl bg-indigo-500/5">!</div>
          <div className="space-y-3">
            <p className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.3em] italic mb-2 text-left">運用プロトコル / SMART PURCHASE</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200">
              <p className="flex items-center gap-4 leading-snug"><span className="text-indigo-500 italic text-2xl">#1</span> 下のプリセットを選択、または商品名を入力</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-indigo-500 italic text-2xl">#2</span> 楽天・ラクマの最新市場価格をリアルタイム収集</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-indigo-600 italic text-2xl">#3</span> AIが「今どちらを買うべきか」を即座に判定</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 🚀 楽天APIプリセットボタン */}
          <div className="grid grid-cols-3 gap-3">
             {PRESETS.map(item => (
               <button 
                 key={item.id} 
                 onClick={() => { setProductName(item.query); runComparison(item.query); }}
                 className={`h-16 md:h-20 bg-white/5 border-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-lg ${productName === item.query ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}
               >
                 <span className="text-[10px] md:text-xs font-black text-white uppercase italic">{item.name}</span>
                 <span className="text-[8px] font-bold text-slate-500 uppercase">One-Tap Analysis</span>
               </button>
             ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-indigo-500">
               <ShoppingBag size={24} />
            </div>
            <input 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="商品名や型番を入力..."
              className="w-full h-20 bg-black border-2 border-white/10 rounded-2xl pl-16 pr-8 text-lg text-white focus:border-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => runComparison()}
            disabled={!productName || isAnalyzing}
            className={`w-full h-24 ${!productName || isAnalyzing ? 'bg-slate-800 opacity-50' : 'bg-indigo-600 hover:bg-indigo-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-indigo-900 active:border-b-0`}
          >
            {isAnalyzing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Scale className="w-10 h-10" />}
            <span>市場価値を比較 ➔</span>
          </button>
        </div>

        {compareData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
            <div className="grid md:grid-cols-2 gap-6 text-left">
               <div className="bg-black/40 border-2 border-white/5 p-8 rounded-[3rem] space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic pl-2">Market New Price</p>
                  <div className="flex items-baseline gap-4 pl-2">
                    <p className="text-4xl font-black text-white italic">¥{compareData.newPrice.toLocaleString()}</p>
                    <Badge variant="outline" className="text-slate-500 border-white/10 uppercase italic">Retail</Badge>
                  </div>
               </div>
               <div className={`p-8 rounded-[3rem] space-y-4 border-4 ${compareData.judgment === 'USED_WIN' ? 'border-emerald-500 bg-emerald-500/10' : 'border-indigo-500 bg-indigo-500/10'}`}>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic pl-2">Smart Choice Price</p>
                  <div className="flex items-baseline gap-4 pl-2">
                    <p className="text-4xl font-black text-white italic">¥{compareData.usedPrice.toLocaleString()}</p>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Match Score</span>
                       <span className="text-lg font-black text-white italic">{compareData.confidence}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold pl-2 uppercase tracking-widest">{compareData.condition}</p>
               </div>
            </div>

            <div className="bg-[#13141f] border-4 border-emerald-500/30 p-10 rounded-[3rem] relative overflow-hidden shadow-inner text-left">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32 text-white" /></div>
               <div className="flex items-center gap-4 mb-6">
                  <Badge className="bg-emerald-600 text-white font-black px-4 py-1 text-lg">AI JUDGMENT: {compareData.judgment}</Badge>
               </div>
               <p className="text-2xl font-black text-white italic leading-relaxed mb-6">「{compareData.advice}」</p>
               <div className="space-y-2">
                  {compareData.points.map((p: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-400">
                       <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                       <span>{p}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <a 
                 href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(compareData.target)}/`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="h-16 bg-white/5 border-2 border-white/10 rounded-2xl font-black text-white uppercase italic hover:bg-white/10 transition-all flex items-center justify-center gap-2"
               >
                  <ShoppingCart size={20} /> 楽天で新品を見る
               </a>
               <a 
                 href={`https://fril.jp/search/${encodeURIComponent(compareData.target)}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="h-16 bg-[#c62828]/10 border-2 border-[#c62828]/30 rounded-2xl font-black text-[#f44336] uppercase italic hover:bg-[#c62828] hover:text-white transition-all flex items-center justify-center gap-2"
               >
                  <ShoppingBag size={20} /> ラクマで中古を探す
               </a>
            </div>
          </div>
        )}
      </div>

      <div className="bg-indigo-600/5 border-2 border-indigo-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-indigo-500 mb-2">
            <Rocket size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Master Value Protocol</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            新品の安心感か、中古の圧倒的コストパフォーマンスか。AIが「ポイント還元率」「将来の売却価値」「出品者の信頼度」をすべて計算。あなたにとっての「真の最安値」を導き出します。
         </p>
      </div>

      <DebugPanel data={{ productName, hasResult: !!compareData }} toolId="buy-smart-nav-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Smart Commerce OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-indigo-500 animate-pulse uppercase tracking-[0.5em]">Syncing Market Data...</div>
})

export default function BuySmartNavWrapper() {
  return <NoSSRWrapper />;
}
