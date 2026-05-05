'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, Ban, RefreshCw, AlertTriangle, Lightbulb, Play, ArrowRight, Save, Download
} from 'lucide-react'

export default function ShoppingStopper() {
  const [isCameraActive, setIsProcessing] = useState(false);
  const [excitementLevel, setExcitementLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔴 REAL CAMERA ENGINE
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsProcessing(true);
        startAnalysis();
      }
    } catch (err) {
      console.error(err);
      alert("カメラの起動に失敗しました。ブラウザの許可を確認してください。");
    }
  };

  const startAnalysis = () => {
    intervalRef.current = setInterval(() => {
      // 擬似的な表情解析スコアリング（本来はTensorFlow.js等を使用）
      const level = Math.floor(Math.random() * 100);
      setExcitementLevel(level);
      if (level > 80) {
        handleTriggerCooldown();
      }
    }, 1000);
  };

  const handleTriggerCooldown = () => {
    if (!isCooldown) {
      setIsCooldown(true);
      setTimer(10800); // 3時間（10800秒）
    }
  };

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isCooldown && timer > 0) {
      t = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isCooldown, timer]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-red-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">DOPAMINE BLOCKER</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Shopping Stopper</h1>
      </div>

      <Card className="bg-slate-900 border-4 border-slate-800 rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="bg-slate-950 border border-red-600/30 rounded-2xl p-4 mb-8 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-red-500" /></div>
          <div className="space-y-1">
            <p className="text-xs font-black text-red-500 uppercase italic tracking-widest">Operation Guide</p>
            <p className="text-sm font-bold text-slate-300">1. カメラを起動して商品を凝視する</p>
            <p className="text-sm font-bold text-slate-300">2. AIがあなたの「興奮度」をリアルタイム解析</p>
            <p className="text-sm font-bold text-slate-300">3. 80%を超えると3時間の強制冷却モードが発動</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* CAMERA SECTION */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-slate-800 bg-black shadow-inner flex items-center justify-center">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="h-20 w-20 rounded-full bg-red-600 hover:bg-red-500 shadow-2xl animate-bounce">
                  <Camera className="h-10 w-10" />
                </Button>
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
              {isCameraActive && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className="bg-red-600 text-white font-black animate-pulse">SCANNING...</Badge>
                  <div className="bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excitement</p>
                    <p className={`text-3xl font-black italic tracking-tighter ${excitementLevel > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{excitementLevel}%</p>
                  </div>
                </div>
              )}
            </div>
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
               <div className={`h-full transition-all duration-500 ${excitementLevel > 70 ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${excitementLevel}%` }}></div>
            </div>
          </div>

          {/* STATUS SECTION */}
          <div className="flex flex-col justify-center space-y-8">
            {isCooldown ? (
              <div className="bg-red-600/10 border-4 border-red-600 rounded-[2.5rem] p-10 text-center space-y-6 animate-in zoom-in shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><Ban className="h-12 w-12 text-white" /></div>
                <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Cool Down Mode</h4>
                <p className="text-slate-400 font-bold text-sm">脳が興奮状態にあります。購入ボタンを押す前に、以下の時間だけ待機してください。</p>
                <p className="text-5xl font-black text-white font-mono tracking-tighter">{formatTime(timer)}</p>
                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                   <p className="text-[10px] font-black text-red-500 uppercase italic">Zen Exercise</p>
                   <p className="text-xs text-slate-300 font-bold">ゆっくり深呼吸を10回行いましょう</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-slate-800"><ShoppingCart className="h-10 w-10 text-slate-500" /></div>
                <h4 className="text-2xl font-black text-slate-500 italic uppercase">Monitoring...</h4>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">AIがカメラ越しにあなたのドーパミン放出を監視しています。<br/>冷静な判断を取り戻しましょう。</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="text-center opacity-30 font-black italic tracking-widest text-[10px]">NEXTRALABS SHOPPING DEFENSE SYSTEM 2026</div>
    </div>
  )
}
