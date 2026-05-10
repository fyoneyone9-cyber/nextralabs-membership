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
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left md:">

      {/* ヘッダー */}
      <div className="text-center space-y-2 md:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Spatial AI Coordinator</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">Interior Sync</h1>
        <div className="inline-block bg-emerald-600 text-white font-medium px-4 py-0.5 rounded-full text-xs shadow-lg">v1.0-MASTER</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-700">

        {/* 空間スキャンエリア */}
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden border-2 border-white/5 bg-black shadow-2xl flex items-center justify-center">
            {cameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 border-[20px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="text-center p-10 space-y-5">
                <Sofa className="w-14 h-14 text-slate-700 mx-auto" />
                <p className="text-lg text-slate-400 font-semibold leading-relaxed">空間スキャン待機中</p>
                <button
                  onClick={startCamera}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-emerald-400 font-semibold hover:bg-white/10 transition-all"
                >
                  空間 AR モードを起動
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-xl font-semibold text-white">空間を解析しています...</p>
              </div>
            )}
          </div>

          <button
            onClick={analyzeSpace}
            disabled={!cameraActive || isAnalyzing}
            className={`w-full h-12 flex items-center justify-center gap-3 rounded-xl font-semibold text-base transition-all
              ${!cameraActive || isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)] hover:scale-[1.02]'
              }`}
          >
            <Eye className="w-5 h-5" />
            <span>空間を AI 分析する</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* コーディネート結果 */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="bg-[#13141f] border border-white/5 p-6 md:p-8 relative shadow-2xl overflow-hidden min-h-[440px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-medium text-emerald-400 mb-1">Coordinate Set</p>
                <h3 className="text-xl font-bold text-white tracking-tight">楽天一括コーディネート</h3>
              </div>
              {suggestions.length > 0 && (
                <Badge className="bg-emerald-600/20 text-emerald-400 border font-medium text-xs">
                  楽天 API 連動中
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-emerald-500/40 transition-all group animate-in slide-in-from-right-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 transition-colors shrink-0">
                        <Box className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.shop} — 適合率 {item.match}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-emerald-400 shrink-0 ml-3">{item.price}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20 py-16">
                  <Palette className="w-16 h-16" />
                  <p className="text-base font-medium text-center leading-relaxed">
                    空間をスキャンして<br />調和する家具を提案します
                  </p>
                </div>
              )}
            </div>

            {suggestions.length > 0 && (
              <button className="w-full h-12 mt-6 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl shadow-xl flex items-center justify-center gap-3 text-base transition-all hover:scale-[1.02] shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                <ShoppingCart className="w-5 h-5" />
                <span>楽天でまとめて購入する</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="bg-[#0a0b14] border border-white/5 rounded-2xl p-5 flex items-start gap-4 shadow-inner">
            <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 border">
              <Zap className="text-emerald-500 w-4 h-4" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              今の部屋の「色・質感・サイズ」をAIが視覚的に把握。楽天の膨大な商品群から、あなたの空間に最も馴染むコーディネートを瞬時にセットアップします。
            </p>
          </div>
        </div>
      </div>

      <DebugPanel data={{ cameraActive, isAnalyzing, suggestionCount: suggestions.length }} toolId="interior-sync-master" />
      <div className="text-center opacity-10 mt-10 text-xs font-medium">Spatial Commerce OS · NextraLabs 2026</div>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center text-emerald-500 font-medium text-sm">
      Initializing Spatial Node...
    </div>
  )
})

export default function InteriorCoordinatorSystem() {
  return <NoSSRWrapper />;
}
