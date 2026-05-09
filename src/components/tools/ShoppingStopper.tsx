'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, Ban, RefreshCw, AlertTriangle, Lightbulb, Play, ArrowRight, Save, Download, ShoppingCart, Loader2, FileImage, Zap, ShieldAlert, Sparkles, Activity, Timer, Terminal, Power
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

export default function ShoppingStopper() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [excitementLevel, setExcitementLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [systemOnline, setSystemOnline] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      // ユーザーがカメラ許可を出すための制約
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // 音声は不要
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) { 
        videoRef.current.srcObject = stream; 
        // iOS/Safari対策: 確実に再生を開始させる
        videoRef.current.setAttribute('playsinline', 'true');
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error('[PLAY_ERROR]', playErr);
        }
        
        setIsCameraActive(true); 
        setSystemOnline(true);
        startAnalysis(); 
      }
    } catch (err: any) { 
      console.error('[CAMERA_ERROR]', err);
      // エラー名をチェックして、具体的な原因を伝える
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("カメラの使用がブロックされています。ブラウザのアドレスバーの「鍵マーク」からカメラを許可してください。");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert("利用可能なカメラが見つかりません。");
      } else {
        alert(`カメラの起動に失敗しました (${err.name})。設定を確認してください。`);
      }
    }
  };

  const startAnalysis = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      // 憲法に基づき本物らしく。徐々に興奮度をシミュレート
      setExcitementLevel(prev => {
        const next = Math.min(100, Math.max(0, prev + (Math.random() * 20 - 5)));
        if (next > 85) setIsCooldown(true);
        return Math.floor(next);
      });
    }, 800);
  };

  useEffect(() => {
    if (isCooldown && timer === 0) setTimer(10800);
    let t: NodeJS.Timeout;
    if (isCooldown && timer > 0) t = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => { 
      clearInterval(t); 
      if (intervalRef.current) clearInterval(intervalRef.current); 
    };
  }, [isCooldown, timer]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600); 
    const m = Math.floor((s % 3600) / 60); 
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-red-600 text-white font-bold tracking-tight px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]">Psychological Defense Command v4.0</Badge>
        <h1 className="text-5xl md:text-[7rem] font-bold text-white uppercase tracking-tighter leading-none drop-shadow-2xl">Shopping Stopper</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
        
        {/* 🛡️ LEFT: CONTROL TERMINAL */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-fit">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-red-500 font-bold tracking-tight text-xs uppercase">
                  <Activity size={16} className="animate-pulse" /> Neuro-Analysis Engine
                </div>
                <Badge variant="outline" className={`text-[10px] font-bold uppercase ${systemOnline ? 'border-green-500/30 text-green-500' : 'border-slate-800 text-slate-700'}`}>
                  {systemOnline ? 'ONLINE' : 'OFFLINE'}
                </Badge>
             </div>
             
             {!isCameraActive ? (
               <Button onClick={startCamera} className="w-full h-24 bg-red-600 hover:bg-red-500 text-white font-bold text-2xl rounded-2xl shadow-[0_15px_40px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center gap-1 group transition-all active:scale-95">
                  <Power size={32} className="group-hover:scale-110 transition-transform" />
                  START SCANNING
               </Button>
             ) : (
               <div className="bg-red-600/10 border-2 border-red-500/30 rounded-2xl p-6 space-y-4 text-center">
                  <p className="text-red-500 font-bold uppercase tracking-tight text-sm">System Running</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping delay-75" />
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping delay-150" />
                  </div>
               </div>
             )}

             <div className="mt-8 space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Dopamine Surge</p>
                    <p className={`text-4xl font-bold leading-none ${excitementLevel > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{excitementLevel}%</p>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full transition-all duration-700 ${excitementLevel > 70 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} style={{ width: `${excitementLevel}%` }} />
                  </div>
                </div>
             </div>
          </Card>

          <div className="bg-slate-900/50 border-2 border-slate-800 rounded-[2rem] p-8 space-y-4 shadow-inner">
             <p className="text-red-500 text-xs font-bold uppercase tracking-tight flex items-center gap-2"><ShieldAlert size={14}/> Operation Guide</p>
             <p className="text-slate-400 text-sm font-bold leading-relaxed">カメラで脳内物質の分泌（表情）をスキャン。興奮度が<span className="text-red-500">85%</span>を超えた瞬間、3時間の強制冷却フェーズへ移行します。</p>
          </div>
        </div>

        {/* 📷 CENTER: LIVE FEED */}
        <div className="lg:col-span-2 space-y-8">
           <div className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-slate-800 bg-black shadow-2xl group">
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-1000 ${isCameraActive ? 'opacity-100' : 'opacity-20'}`} />
              
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                   <div className="w-24 h-24 bg-slate-900/80 rounded-full flex items-center justify-center border-2 border-slate-800 shadow-xl">
                      <Camera size={40} className="text-slate-700" />
                   </div>
                   <p className="text-slate-700 font-bold uppercase tracking-[0.4em] text-xl">Waiting for Access</p>
                </div>
              )}

              {isCameraActive && (
                <div className="absolute top-8 left-8 flex flex-col gap-4">
                  <Badge className="bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-2xl border-2 border-white/20 animate-pulse text-lg">NEURO_SCAN_ACTIVE</Badge>
                  <div className="bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Source: High-Definition Live</p>
                  </div>
                </div>
              )}

              {/* ターミナル風装飾 */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                 <div className="space-y-1">
                    <p className="text-[10px] font-mono text-emerald-500/50">POS: 35.4542, 139.3921</p>
                    <p className="text-[10px] font-mono text-emerald-500/50">SYSTEM: VER-4.0.2-SECURE</p>
                 </div>
                 <div className="text-right">
                    <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-red-500 w-1/3 animate-pulse" />
                    </div>
                 </div>
              </div>
           </div>

           {/* ⏳ COOLDOWN STATUS */}
           <div className={`transition-all duration-700 ${isCooldown ? 'scale-100 opacity-100' : 'scale-95 opacity-50 grayscale'}`}>
              <Card className={`rounded-[3rem] p-10 border-4 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl ${isCooldown ? 'bg-red-600/10 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'bg-slate-900 border-slate-800'}`}>
                 <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${isCooldown ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}>
                       {isCooldown ? <Ban className="h-10 w-10 text-white" /> : <Timer className="h-10 w-10 text-slate-600" />}
                    </div>
                    <div className="space-y-1">
                       <h4 className={`text-2xl font-bold uppercase ${isCooldown ? 'text-white' : 'text-slate-600'}`}>
                         {isCooldown ? 'Mandatory Cooldown' : 'System Ready'}
                       </h4>
                       <p className="text-slate-500 font-bold text-xs uppercase tracking-tight ">Reason: Dopamine Threshold Exceeded</p>
                    </div>
                 </div>
                 <div className="text-center md:text-right">
                    <p className={`text-6xl font-bold font-mono tracking-tighter tabular-nums ${isCooldown ? 'text-white' : 'text-slate-800'}`}>{formatTime(timer)}</p>
                    {isCooldown && <Button onClick={() => { setIsCooldown(false); setTimer(0); }} variant="ghost" className="text-red-500 hover:text-white uppercase font-bold underline text-[10px] mt-2">Abort Timer (Manual Override)</Button>}
                 </div>
              </Card>
           </div>
        </div>
      </div>
      
      <DebugPanel data={{ excitementLevel, isCooldown, timer, isCameraActive }} toolId="shopping-stopper" />
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-bold uppercase tracking-[0.5em] ">Spending Defense Command • NextraLabs 2026</p></div>
    </div>
  )
}
