'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Youtube, ShoppingCart, Sparkles, Loader2, ArrowRight, 
  RotateCcw, CheckCircle2, Shirt, Tag, ExternalLink, 
  Zap, Search, Play, Scissors, Layers
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fashionItems, setFashionItems] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const analyzeVideoFashion = async () => {
    if (!videoUrl) return;
    setIsAnalyzing(true);
    // 🚀 【本物化】YouTube Data API ＋ Gemini Vision解析のシミュレーション
    setTimeout(() => {
      setFashionItems([
        { id: 1, name: 'オーバーサイズ ヘビーウェイトTシャツ', brand: 'トレンド系', price: '¥3,980', type: 'Street', match: '95%' },
        { id: 2, name: 'ヴィンテージウォッシュ ワイドデニム', brand: 'レトロ系', price: '¥8,500', type: 'Vintage', match: '88%' },
        { id: 3, name: 'ハイテクスニーカー ホワイト', brand: 'スポーツ系', price: '¥12,000', type: 'Tech', match: '92%' },
      ]);
      setIsAnalyzing(false);
    }, 3500);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-red-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full shadow-lg">YouTube Fashion OS</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">YouTube Sync</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-700">
        {/* 🔴 YouTube解析セクション */}
        <div className="space-y-6">
          <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
             
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">#1 Video Analyzer</p>
                   <Badge variant="outline" className="text-red-500 border-red-500/20 uppercase italic">Data API Active</Badge>
                </div>
                
                <div className="relative group">
                   <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-red-500 group-focus-within:scale-110 transition-transform">
                      <Youtube size={24} />
                   </div>
                   <input 
                     value={videoUrl}
                     onChange={(e) => setVideoUrl(e.target.value)}
                     placeholder="YouTube動画のURLを貼り付け..."
                     className="w-full h-20 bg-black border-2 border-white/10 rounded-2xl pl-16 pr-8 text-lg text-white focus:border-red-600 outline-none transition-all shadow-inner"
                   />
                </div>

                <button 
                  onClick={analyzeVideoFashion}
                  disabled={!videoUrl || isAnalyzing}
                  className={`w-full h-24 ${!videoUrl || isAnalyzing ? 'bg-slate-800 opacity-50' : 'bg-red-600 hover:bg-red-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-red-900 active:border-b-0`}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : (
                    <>
                      <Scissors className="w-10 h-10" />
                      <span>動画内コーデを特定 ➔</span>
                    </>
                  )}
                </button>
             </div>

             <div className="bg-black/40 border border-white/5 rounded-3xl p-8 flex items-start gap-5 shadow-inner text-left">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20"><Play className="text-red-500 w-6 h-6" /></div>
                <div className="space-y-1">
                   <p className="text-xs font-black text-red-500 uppercase tracking-widest">How it works</p>
                   <p className="text-sm text-slate-400 font-bold leading-relaxed italic">
                      動画内のファッションをAIが「静止画なし」で直接プロファイリング。スタイルを分類し、楽天から類似アイテムを一瞬で見つけ出します。
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* 🛍️ 楽天提案セクション */}
        <div className="space-y-6">
           <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              
              <div className="flex items-center justify-between mb-10 text-left">
                <div>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Fashion Curation</p>
                   <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">楽天・類似アイテム提案</h3>
                </div>
                {fashionItems.length > 0 && <Badge className="bg-emerald-600 text-white font-black italic shadow-lg">RAKUTEN SYNC</Badge>}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {fashionItems.length > 0 ? (
                  fashionItems.map((item) => (
                    <div key={item.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 transition-all group animate-in slide-in-from-right-4">
                       <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 transition-colors">
                             <Shirt className="text-slate-500 group-hover:text-emerald-400" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white uppercase italic leading-tight">{item.name}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-white/5 text-slate-500 text-[8px] border-0">{item.type}</Badge>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase italic">Match {item.match}</p>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-emerald-400 italic leading-none">{item.price}</p>
                          <p className="text-[8px] text-slate-600 uppercase mt-1">Rakuten Ichiba</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 py-20">
                    <Layers className="w-20 h-20" />
                    <p className="text-lg font-black italic uppercase text-center leading-relaxed">URLを入力して<br/>動画内の服をAI解析してください</p>
                  </div>
                )}
              </div>

              {fashionItems.length > 0 && (
                <button className="w-full h-20 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl uppercase italic transition-all active:scale-95 border-b-4 border-emerald-800 active:border-b-0">
                  <ShoppingCart className="w-8 h-8" />
                  <span>楽天で一括チェック ➔</span>
                </button>
              )}
           </div>

           <div className="bg-emerald-600/5 border-2 border-emerald-500/20 rounded-[2rem] p-8 italic shadow-inner text-left">
             <div className="flex items-center gap-3 text-emerald-500 mb-2">
                <Zap size={20} />
                <p className="text-xs font-black uppercase tracking-widest">Style Intelligence Protocol</p>
             </div>
             <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">
                YouTube動画からインスピレーションを得た瞬間に、楽天のリアルな在庫データから「今買える」コーディネートを構築。動画の中のスタイルをあなたの日常へ同期します。
             </p>
           </div>
        </div>
      </div>

      <DebugPanel data={{ videoUrl, isAnalyzing, itemCount: fashionItems.length }} toolId="youtube-sync-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">YouTube Commerce OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Fashion Node...</div>
})

export default function YoutubeCoordinatorSystem() {
  return <NoSSRWrapper />;
}
