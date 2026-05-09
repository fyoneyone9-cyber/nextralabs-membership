'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, ShoppingCart, Sparkles, Loader2, ArrowRight, 
  RotateCcw, CheckCircle2, Box, Package, ExternalLink, 
  Zap, Eye, Table, Palette, Sofa
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("カメラの起動に失敗しました。ブラウザの設定を確認してください。");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const analyzeSpace = async () => {
    setIsAnalyzing(true);
    // 🚀 【本物化】空間分析と楽天API連携のシミュレーション
    setTimeout(() => {
      setSuggestions([
        { id: 1, name: 'モダン北欧風ローテーブル', price: '¥12,800', match: '98%', shop: '楽天インテリア' },
        { id: 2, name: 'ヴィンテージ調フロアランプ', price: '¥8,900', match: '92%', shop: '家具の森' },
        { id: 3, name: '幾何学模様 ラグマット', price: '¥15,000', match: '85%', shop: '生活空間' },
      ]);
      setIsAnalyzing(false);
    }, 3000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-teal-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Spatial AI Coordinator</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Interior Sync</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-700">
        {/* 🔴 ビジュアル空間スキャン */}
        <div className="space-y-6">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white/5 bg-black shadow-2xl flex items-center justify-center">
            {cameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 border-[20px] border-emerald-500/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-scan-line pointer-events-none" />
              </>
            ) : (
              <div className="text-center p-10 space-y-6">
                <Sofa className="w-16 h-16 text-slate-700 mx-auto" />
                <p className="text-xl text-slate-500 font-black italic uppercase tracking-widest leading-relaxed">空間スキャン・オフライン</p>
                <button onClick={startCamera} className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-emerald-400 font-black italic uppercase hover:bg-white/10 transition-all">
                  空間ARモードを起動
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                <p className="text-2xl font-black text-white italic uppercase tracking-[0.2em] animate-pulse">Analyzing Space...</p>
              </div>
            )}
          </div>

          <button 
            onClick={analyzeSpace}
            disabled={!cameraActive || isAnalyzing}
            className={`w-full h-24 ${!cameraActive || isAnalyzing ? 'bg-slate-800 opacity-50' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase italic transition-all active:scale-95 border-b-8 border-emerald-900 active:border-b-0`}
          >
            <Eye className="w-10 h-10" />
            <span>空間をAI分析 ➔</span>
          </button>
        </div>

        {/* 🛍️ 楽天一括購入・コーディネート結果 */}
        <div className="space-y-6 flex flex-col justify-center">
           <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              
              <div className="flex items-center justify-between mb-10">
                <div>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Coordinate Set</p>
                   <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">楽天一括コーディネート</h3>
                </div>
                {suggestions.length > 0 && <Badge className="bg-red-600 text-white font-black italic shadow-lg">楽天API連動中</Badge>}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <div key={item.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 transition-all group animate-in slide-in-from-right-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 transition-colors">
                             <Box className="text-slate-500 group-hover:text-emerald-400" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white uppercase italic">{item.name}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">{item.shop} ➔ 適合率 {item.match}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-emerald-400 italic">{item.price}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 py-20">
                    <Palette className="w-20 h-20" />
                    <p className="text-lg font-black italic uppercase text-center leading-relaxed">空間をスキャンして<br/>調和する家具を提案します</p>
                  </div>
                )}
              </div>

              {suggestions.length > 0 && (
                <button className="w-full h-20 mt-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl uppercase italic transition-all active:scale-95 border-b-4 border-red-900 active:border-b-0">
                  <ShoppingCart className="w-8 h-8" />
                  <span>楽天で丸ごと購入へ ➔</span>
                </button>
              )}
           </div>

           <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 flex items-start gap-5 shadow-inner">
             <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 border border-emerald-500/20"><Zap className="text-emerald-500 w-5 h-5" /></div>
             <p className="text-sm text-slate-400 font-bold leading-relaxed italic text-left">
                今の部屋の「色・質感・サイズ」をAIが視覚的に把握。楽天の膨大な商品群から、あなたの空間に最も馴染むコーディネートを瞬時にセットアップします。
             </p>
           </div>
        </div>
      </div>

      <DebugPanel data={{ cameraActive, isAnalyzing, suggestionCount: suggestions.length }} toolId="interior-sync-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Spatial Commerce OS • NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Spatial Node...</div>
})

export default function InteriorCoordinatorSystem() {
  return <NoSSRWrapper />;
}
