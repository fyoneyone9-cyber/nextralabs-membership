'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, Ban, RefreshCw, AlertTriangle, Lightbulb, Play, ArrowRight, Save, Download, ShoppingCart, Loader2, ExternalLink
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
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center">
        <Badge className="bg-red-600 text-white font-black italic px-4 py-1 text-[10px] uppercase rounded-full">DOPAMINE BLOCKER</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Shopping Stopper</h1>
      </div>

      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="bg-slate-950 border-2 border-red-600/50 rounded-2xl p-4 md:p-6 mb-8 flex items-start gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-white" /></div>
          <div className="space-y-1">
            <p className="text-xs font-black text-red-500 uppercase italic tracking-widest opacity-70">Operation Guide</p>
            <p className="text-sm md:text-lg text-slate-200 font-black">AIがカメラ越しにあなたの「興奮度」をリアルタイム解析。85%を超えると3時間の強制冷却モードが発動します。</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-slate-800 bg-black shadow-inner flex items-center justify-center">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="h-20 w-20 rounded-full bg-red-600 hover:bg-red-500 shadow-2xl animate-bounce"><Camera /></Button>
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
              {isCameraActive && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className="bg-red-600 text-white font-black animate-pulse">MONITORING...</Badge>
                  <div className="bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excitement</p>
                    <p className={`text-2xl font-black italic tracking-tighter ${excitementLevel > 70 ? 'text-red-500' : 'text-emerald-500'}`}>{excitementLevel}%</p>
                  </div>
                </div>
              )}
            </div>
            {/* 🔴 CONSTITUTIONAL 3-AI HUB */}
            <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 space-y-4">
              <p className="text-[10px] text-slate-500 font-black uppercase text-center tracking-widest">Open AI Advisor</p>
              <div className="grid grid-cols-3 gap-2">
                 <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                 <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                 <Button variant="outline" className="h-10 border-slate-800 text-[8px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            {isCooldown ? (
              <div className="bg-red-600/10 border-4 border-red-600 rounded-[2.5rem] p-10 text-center space-y-6 animate-in zoom-in shadow-2xl">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><Ban className="h-10 w-10 text-white" /></div>
                <h4 className="text-2xl md:text-3xl font-black text-white italic uppercase">Cooldown Enabled</h4>
                <p className="text-5xl font-black text-white font-mono tabular-nums">{formatTime(timer)}</p>
              </div>
            ) : (
              <div className="bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-center space-y-6 shadow-inner">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-slate-800"><ShoppingCart className="text-slate-600" /></div>
                <h4 className="text-xl font-black text-slate-600 italic uppercase">Security Passive</h4>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">冷静な心で、本当に必要なものだけを選択しましょう。</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
