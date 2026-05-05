'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, Ban, RefreshCw, AlertTriangle, Lightbulb, Play, ArrowRight, Save, Download, ShoppingCart, Loader2
} from 'lucide-react'

export default function ShoppingStopper() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [excitementLevel, setExcitementLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        startAnalysis();
      }
    } catch (err) {
      alert("カメラの起動に失敗しました。");
    }
  };

  const startAnalysis = () => {
    intervalRef.current = setInterval(() => {
      const level = Math.floor(Math.random() * 100);
      setExcitementLevel(level);
      if (level > 85) setIsCooldown(true);
    }, 1000);
  };

  useEffect(() => {
    if (isCooldown && timer === 0) setTimer(10800); // 3時間
    let t: NodeJS.Timeout;
    if (isCooldown && timer > 0) {
      t = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => { clearInterval(t); if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isCooldown, timer]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-red-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full">DOPAMINE BLOCKER</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">Shopping Stopper</h1>
      </div>

      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="bg-slate-950 border-2 border-red-600/50 rounded-2xl p-6 mb-10 flex items-start gap-6">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-8 h-8 text-white" /></div>
          <div className="space-y-1">
            <p className="text-sm font-black text-white uppercase italic tracking-widest opacity-70">Operation Guide</p>
            <p className="text-base md:text-xl text-slate-200 font-black flex items-center gap-3">1. カメラを起動して商品を凝視する</p>
            <p className="text-base md:text-xl text-slate-200 font-black flex items-center gap-3">2. AIがあなたの「興奮度」をリアルタイム解析</p>
            <p className="text-base md:text-xl text-slate-200 font-black flex items-center gap-3">3. 興奮しすぎると3時間の強制冷却モードが発動</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-800 bg-black shadow-inner flex items-center justify-center">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="h-24 w-24 rounded-full bg-red-600 hover:bg-red-500 shadow-2xl animate-bounce">
                  <Camera className="h-12 w-12" />
                </Button>
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
              {isCameraActive && (
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <Badge className="bg-red-600 text-white font-black animate-pulse">MONITORING...</Badge>
                  <div className="bg-black/70 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excitement</p>
                    <p className={`text-4xl font-black italic tracking-tighter ${excitementLevel > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{excitementLevel}%</p>
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
               <div className={`h-full transition-all duration-500 ${excitementLevel > 70 ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${excitementLevel}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-10">
            {isCooldown ? (
              <div className="bg-red-600/10 border-4 border-red-600 rounded-[3rem] p-10 text-center space-y-8 animate-in zoom-in shadow-2xl">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><Ban className="h-14 w-14 text-white" /></div>
                <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter">Cooldown Enabled</h4>
                <p className="text-slate-300 font-bold text-lg">脳が興奮しています。以下の時間が経過するまで、購入を控えてください。</p>
                <p className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums">{formatTime(timer)}</p>
                <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10">
                   <p className="text-xs font-black text-red-500 uppercase italic mb-2 tracking-widest">Zen Meditation</p>
                   <p className="text-base text-slate-300 font-bold leading-relaxed italic">「これは本当に必要なのか、それともただ脳が快感を求めているだけか」と自問してください。</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-12 text-center space-y-8 shadow-inner">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-slate-800 shadow-lg"><ShoppingCart className="h-12 w-12 text-slate-600" /></div>
                <h4 className="text-3xl font-black text-slate-600 italic uppercase">Security Filter</h4>
                <p className="text-slate-500 font-bold text-lg leading-relaxed">AIがカメラを通して、あなたの衝動買いを阻止します。<br/>レンズを見つめて、冷静な心を取り戻しましょう。</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="text-center opacity-20 font-black italic tracking-widest text-xs uppercase">Powered by NextraLabs — Shopping Addiction Shield</div>
    </div>
  )
}
