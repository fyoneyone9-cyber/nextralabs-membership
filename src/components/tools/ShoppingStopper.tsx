'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, Ban, RefreshCw, AlertTriangle, Lightbulb, Play, ArrowRight, Save, Download, ShoppingCart, Loader2, FileImage
} from 'lucide-react'

export default function ShoppingStopper() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [excitementLevel, setExcitementLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setIsCameraActive(true); startAnalysis(); }
    } catch (err) { alert("カメラの起動に失敗しました。"); }
  };

  const startAnalysis = () => {
    intervalRef.current = setInterval(() => {
      const level = Math.floor(Math.random() * 100);
      setExcitementLevel(level);
      if (level > 85) setIsCooldown(true);
    }, 1000);
  };

  const useSample = () => {
    setIsCameraActive(false);
    setImage("https://membership-site-nextralabos.vercel.app/samples/watch-sample.jpg");
    setExcitementLevel(92);
    setIsCooldown(true);
  };

  useEffect(() => {
    if (isCooldown && timer === 0) setTimer(10800);
    let t: NodeJS.Timeout;
    if (isCooldown && timer > 0) t = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => { clearInterval(t); if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isCooldown, timer]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-red-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">DOPAMINE BLOCKER</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">Shopping Stopper</h1>
      </div>

      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="bg-slate-950 border-2 border-red-600/50 rounded-2xl p-6 mb-10 flex items-start gap-6 shadow-xl">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0"><Lightbulb className="text-white w-8 h-8" /></div>
          <div className="space-y-1">
            <p className="text-sm font-black text-red-500 uppercase italic tracking-widest opacity-70">Operation Guide</p>
            <p className="text-base md:text-xl text-slate-200 font-black">カメラで表情を解析します。85%を超えると3時間の強制冷却タイマーが作動します。</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-800 bg-black shadow-inner flex items-center justify-center">
              {!isCameraActive && !image ? (
                <div className="space-y-6 text-center">
                  <Button onClick={startCamera} className="h-24 w-24 rounded-full bg-red-600 hover:bg-red-500 shadow-2xl animate-bounce"><Camera className="w-10 h-10" /></Button>
                  <p className="text-slate-500 font-black italic uppercase tracking-widest">Start Monitoring</p>
                  <Button onClick={useSample} variant="outline" className="w-full border-slate-800 text-slate-400 font-black italic h-16 rounded-2xl flex items-center justify-center gap-3 uppercase"><FileImage /> サンプル素材で試す</Button>
                </div>
              ) : image ? (
                <img src={image} alt="Sample" className="object-cover w-full h-full" />
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
              {(isCameraActive || image) && (
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <Badge className="bg-red-600 text-white font-black animate-pulse">ANALYZING...</Badge>
                  <div className="bg-black/80 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center shadow-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excitement</p>
                    <p className={`text-4xl font-black italic tracking-tighter ${excitementLevel > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{excitementLevel}%</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 space-y-4">
              <p className="text-[10px] text-slate-500 font-black uppercase text-center tracking-widest">External AI Hub</p>
              <div className="grid grid-cols-3 gap-2">
                 <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                 <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                 <Button variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-10">
            {isCooldown ? (
              <div className="bg-red-600/10 border-4 border-red-600 rounded-[3rem] p-10 text-center space-y-8 animate-in zoom-in shadow-2xl">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><Ban className="h-14 w-14 text-white" /></div>
                <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter">Cooldown Enabled</h4>
                <p className="text-5xl font-black text-white font-mono tracking-tighter tabular-nums">{formatTime(timer)}</p>
                <Button onClick={() => { setIsCooldown(false); setImage(null); setIsCameraActive(false); setTimer(0); }} variant="ghost" className="text-slate-500 hover:text-white uppercase font-black italic underline">タイマーを解除（自己責任）</Button>
              </div>
            ) : (
              <div className="bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-12 text-center space-y-8 shadow-inner">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-slate-800 shadow-lg"><ShoppingCart className="h-12 w-12 text-slate-600" /></div>
                <h4 className="text-3xl font-black text-slate-600 italic uppercase">Defense System Active</h4>
                <p className="text-slate-500 font-bold text-lg leading-relaxed italic">「買い物による快感」が去るのを待ち、<br/>本来の目的を思い出しましょう。</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
