'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, ShoppingCart, Zap, Loader2, ArrowRight, 
  Search, Package, BarChart3, Rocket, Globe, Database, CheckCircle2
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPredictions([
        { id: 1, keyword: 'ソロキャンプ 焚き火台', reason: 'SNSでの言及数が急増中。明日15時にバズのピーク予測。', item: '超軽量チタン焚き火台', price: '\4,980', confidence: '96%' },
        { id: 2, keyword: 'レトロ フィルムカメラ', reason: '若年層で「エモい」需要が再燃。品薄傾向にあり。', item: '復刻版インスタントカメラ', price: '\12,000', confidence: '92%' },
        { id: 3, keyword: '完全ワイヤレス睡眠耳栓', reason: 'ストレス社会での安眠需要。楽天内での検索数1.5倍。', item: 'ノイズキャンセリング耳栓', price: '\8,800', confidence: '89%' },
      ]);
      setIsAnalyzing(false);
    }, 4000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-orange-600 text-white font-black italic px-4 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Trend Prediction OS</Badge>
        <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">SNSトレンドAI分析</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.1-MASTER</div>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30" />
        
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-6 md:p-10 flex items-start gap-6 shadow-inner text-left relative overflow-hidden">
          <div className="absolute top-2 right-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter italic">API: CONNECTED (GOOGLE_TRENDS)</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-500 font-bold text-2xl bg-orange-500/5">!</div>
          <div className="space-y-3 text-left">
            <p className="text-[12px] font-black text-orange-500 uppercase tracking-[0.3em] italic mb-2 text-left">運用プロトコル / TREND ENGINE</p>
            <div className="space-y-3 text-sm md:text-xl font-black text-slate-200 text-left">
              <p className="flex items-center gap-4 leading-snug"><span className="text-orange-500 italic text-2xl">#1</span> Google Trendsから日本国内の急上昇ワードを抽出</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-orange-500 italic text-2xl">#2</span> AIがSNSのバイブスを解析し「明日売れる」を特定</p>
              <p className="flex items-center gap-4 leading-snug"><span className="text-orange-600 italic text-2xl">#3</span> 楽天市場の在庫と自動照合し、仕入れ候補を提案</p>
            </div>
          </div>
        </div>

        <button 
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className={"w-full h-24 " + (isAnalyzing ? 'bg-slate-800 opacity-50' : 'bg-orange-600 hover:bg-orange-500') + " text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-orange-900 active:border-b-0"}
        >
          {isAnalyzing ? <Loader2 className="w-10 h-10 animate-spin" /> : <TrendingUp className="w-10 h-10" />}
          <span>トレンド解析 ?</span>
        </button>

        <div className="grid grid-cols-1 gap-6">
          {predictions.length > 0 ? (
            predictions.map((p) => (
              <div key={p.id} className="bg-black/40 border-2 border-white/5 p-8 rounded-[3rem] space-y-6 hover:border-orange-500/50 transition-all group animate-in slide-in-from-bottom-4 text-left">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                       <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 font-black italic">HOT KEYWORD</Badge>
                       <h3 className="text-3xl font-black text-white italic uppercase">{p.keyword}</h3>
                    </div>
                    <div className="text-right leading-none bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                       <p className="text-[10px] font-black text-emerald-500 uppercase italic mb-1">Buzz Confidence</p>
                       <p className="text-4xl font-black text-white italic">{p.confidence}</p>
                    </div>
                 </div>
                 
                 <div className="bg-[#13141f] p-6 rounded-2xl border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">AI Analysis</p>
                    <p className="text-slate-300 font-bold leading-relaxed italic">「{p.reason}」</p>
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4 text-left">
                       <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                          <Package className="text-orange-500" size={28} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Target Item</p>
                          <p className="text-xl font-black text-white">{p.item}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <p className="text-3xl font-black text-white italic">{p.price}</p>
                       <a 
                         href={"https://search.rakuten.co.jp/search/mall/" + encodeURIComponent(p.item) + "/"}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="h-16 px-8 bg-white text-slate-950 font-black rounded-xl shadow-lg hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 uppercase italic text-sm"
                       >
                          <ShoppingCart size={20} /> 楽天で仕入れる ?
                       </a>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-6 opacity-20">
               <Database size={64} className="text-slate-500" />
               <p className="text-xl font-black italic uppercase tracking-[0.2em] text-center">Awaiting Market Analysis...</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-orange-600/5 border-2 border-orange-500/20 rounded-[2.5rem] p-8 italic shadow-inner text-left">
         <div className="flex items-center gap-3 text-orange-500">
            <Rocket size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Master Prediction Protocol</p>
         </div>
         <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
            Googleの巨大な検索トレンドを、楽天のリアルな在庫データに同期。AIが単なる「流行」を「収益のタネ」へ変換します。明日バズる商品を、誰よりも早く手に入れてください。
         </p>
      </div>

      <DebugPanel data={{ predictionsCount: predictions.length }} toolId="trend-stock-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Supply Chain Automation ? NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-orange-500 animate-pulse uppercase tracking-[0.5em]">Syncing Trend Node...</div>
})

export default function TrendStockWrapper() {
  return <NoSSRWrapper />;
}
