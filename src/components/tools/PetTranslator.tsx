'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, 
  Lightbulb, ClipboardPaste, Dog, Cat, MessageCircle, Heart, Camera, 
  Loader2, Download, Mic, Activity, Video, VideoOff
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [analysisLevel, setAnalysisLevel] = useState(0);
  const [translationResult, setTranslationResult] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("カメラまたはマイクの起動に失敗しました。ブラウザの設定を確認してください。");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // 🔴 REAL-TIME AUDIO ANALYSIS SIMULATION
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAnalysisLevel(Math.floor(Math.random() * 100));
      }, 100);
    } else {
      setAnalysisLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startVoiceAnalysis = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }
    setIsRecording(true);
    setTranslationResult('');
    setTimeout(() => {
      setIsRecording(false);
      setTranslationResult("「ねぇ、遊んで！今は最高にワクワクしてるんだ。そのボールを投げてくれたら、全力で追いかけるよ！」");
    }, 4000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left md:">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-yellow-500 text-black font-bold px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">ANIMAL EMOTION ENGINE</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none drop-shadow-2xl">AIペット翻訳モニター</h1>
        <div className="inline-block bg-emerald-600 text-white font-bold px-4 py-0.5 rounded-full uppercase text-[8px] md:text-[10px] tracking-tight shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-700">
        {/* 🔴 SENSORY INPUT SECTION (VIDEO) */}
        <div className="space-y-6">
          <div className="relative aspect-video md:aspect-square rounded-[2.5rem] overflow-hidden border-white/5 bg-black shadow-2xl flex items-center justify-center">
            {cameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-6 p-10">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-white/10">
                  <Video className="w-12 h-12 text-slate-700" />
                </div>
                <p className="text-xl text-slate-500 font-bold uppercase tracking-tight">Sensory Feed Offline</p>
                <button 
                  onClick={startCamera}
                  className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-emerald-400 font-bold uppercase hover:bg-white/10 transition-all"
                >
                  Activate Video Feed
                </button>
              </div>
            )}

            {/* Scanning Overlay */}
            {isRecording && (
              <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center space-y-6 backdrop-blur-sm z-20">
                 <div className="relative">
                    <Activity className="w-24 h-24 text-emerald-500 animate-pulse" />
                    <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
                 </div>
                 <div className="space-y-2 text-center">
                    <p className="text-2xl font-bold text-white uppercase tracking-[0.2em] animate-bounce">Analyzing Vibe...</p>
                    <div className="w-64 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-emerald-500 transition-all duration-100 shadow-[0_0_15px_rgba(16,185,129,0.8)]" style={{ width: `${analysisLevel}%` }}></div>
                    </div>
                 </div>
              </div>
            )}

            {/* Corner Badges */}
            {cameraActive && !isRecording && (
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-tight drop-shadow-md">LIVE FEED</span>
              </div>
            )}
          </div>

          <button 
            onClick={startVoiceAnalysis} 
            disabled={isRecording}
            className={`w-full h-24 ${isRecording ? 'bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-bold shadow-2xl flex items-center justify-center gap-6 text-3xl uppercase transition-all active:scale-95 border-b-8 border-emerald-900 active:border-b-0`}
          >
            {isRecording ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : (
              <>
                <Mic className="w-10 h-10" /> 
                <span>Translate vibe</span>
              </>
            )}
          </button>
          
          {cameraActive && (
            <button 
              onClick={stopCamera}
              className="w-full text-[10px] font-bold text-slate-700 hover:text-red-500 uppercase tracking-[0.3em] transition-colors"
            >
              Terminate Sensory Feed
            </button>
          )}
        </div>

        {/* 🔴 RESULT / INTERFACE SECTION */}
        <div className="flex flex-col justify-center space-y-8">
           <div className="bg-[#13141f] border-2 border-white/5 p-10 relative shadow-2xl overflow-hidden min-h-[450px] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              <div className="absolute -top-4 -left-4 bg-red-600 text-white p-4 rounded-3xl shadow-xl z-10">
                <Heart className="w-8 h-8 fill-white" />
              </div>
              
              <div className="mb-10 pt-4">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em] ">Emotion Report</p>
                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">AI Translation</h3>
              </div>

              <div className="flex-1 flex items-center justify-center bg-black/40 border border-white/5 p-8 shadow-inner">
                {translationResult ? (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-500 text-center">
                    <p className="text-2xl md:text-4xl font-bold text-white leading-relaxed tracking-tight">
                      {translationResult}
                    </p>
                    <div className="flex justify-center gap-2">
                       {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 opacity-20">
                    <Dog className="w-16 h-12 mx-auto mb-4" />
                    <p className="text-lg font-bold uppercase tracking-tight">Awaiting Sensory Input...</p>
                  </div>
                )}
              </div>

              {translationResult && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(translationResult); alert('感情レポートをコピーしました'); }}
                    className="h-14 bg-white/5 border-2 border-white/10 text-slate-400 font-bold rounded-2xl hover:text-white transition-all uppercase text-xs"
                  >
                    Copy Report
                  </button>
                  <button className="h-14 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-xs">
                    Save Emotion Log
                  </button>
                </div>
              )}
           </div>

           <div className="bg-emerald-600/5 border-2 p-8 space-y-4 shadow-inner">
             <div className="flex items-center gap-3 text-emerald-500">
                <Zap size={20} />
                <p className="text-xs font-bold uppercase tracking-tight">Master Protocol</p>
             </div>
             <p className="text-slate-400 text-sm font-bold leading-relaxed">
                ビデオフィードを通じてペットのわずかな表情や鳴き声をキャッチ。Nextra Emotion Engineがその深層心理をリアルタイムで言語化します。
             </p>
           </div>
        </div>
      </div>

      <DebugPanel data={{ cameraActive, isRecording, hasResult: !!translationResult }} toolId="pet-translator-master" />
      <div className="text-center opacity-10 mt-10 font-bold uppercase tracking-[0.5em] text-[10px]">Animal Emotion OS • NextraLabs 2026</div>
    </div>
  )
}

const PetTranslatorWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-bold text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Emotion Engine...</div>
})

export default function NoSSRWrapper() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  return <PetTranslatorWithNoSSR />;
}
