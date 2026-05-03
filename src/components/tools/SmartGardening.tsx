'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, Search, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [targetName, setTargetName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [weatherInfo, setWeatherInfo] = useState<string>('晴れ / 24°C');
  const [isCopied, setIsCopied] = useState(false);
  
  // プレ解析用
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{name:string, status:string, environment:string, confidence:string} | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 撮影後の自動スキャン
  useEffect(() => {
    if (image && !isScanning && !scanResult) {
      autoScanImage();
    }
  }, [image]);

  const autoScanImage = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, location: locationName }),
      });
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      setScanResult(data);
      if (data.name) setTargetName(data.name);
    } catch (err) {
      console.error(err);
      setScanResult({ name: "解析失敗", status: "手動入力してください", environment: locationName, confidence: "0" });
    } finally {
      setIsScanning(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      setScanResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("カメラの起動に失敗しました");
      setIsCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg', 0.8));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsCameraActive(false);
  };

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    const magicPrompt = `
重要：このテキストと一緒に、今撮影した現場の写真を1枚送信しています。まずその画像を詳細に確認してください。
あなたは万能現場アナリストです。
【現場データ】
・対象: ${targetName}
・地域: ${locationName}
・環境: ${weatherInfo}
・相談: ${prompt || "詳細分析をお願いします。"}
【指示】
1. 写真の状態を詳しく解析し、トラブルの有無を特定してください。
2. 地域環境を考慮した解決策を具体的に提示してください。
3. ポジティブで温かいアドバイスをお願いします。
`;
    navigator.clipboard.writeText(magicPrompt);
    setIsCopied(true);
    toast.success("最強プロンプトをコピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden group">
            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-blue-500/20 flex items-center justify-center active:scale-90 transition-all shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                    <div className="h-14 w-14 bg-white rounded-full" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative">
                <img src={image} className="w-full h-full object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse">
                    <RefreshCw className="w-16 h-16 text-white animate-spin mb-4" />
                    <p className="text-white font-black tracking-widest text-xl">AI SCANNING...</p>
                  </div>
                )}
                {scanResult && (
                  <div className="absolute top-10 left-10 right-10 p-6 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase mb-3 tracking-widest">
                      <Zap className="w-4 h-4" /> Live Analysis Result
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <p className="text-[10px] opacity-50 font-bold">IDENTITY</p>
                        <p className="text-lg font-black text-blue-100">{scanResult.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-50 font-bold">STATUS</p>
                        <p className="text-lg font-black text-green-400">{scanResult.status}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                       <span className="text-[10px] text-white/40 font-bold">AI Confidence: {scanResult.confidence}%</span>
                       <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: `${scanResult.confidence}%`}} />
                       </div>
                    </div>
                  </div>
                )}
                <Button onClick={() => {setImage(null); setScanResult(null);}} className="absolute top-10 right-10 h-14 w-14 bg-black/50 text-white rounded-full hover:bg-red-500"><X /></Button>
              </div>
            ) : (
              <div className="text-center p-10">
                <div className="h-32 w-32 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                  <Search className="w-12 h-12 text-blue-500/40" />
                </div>
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-2xl transition-all active:scale-95">スコープを起動</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-16 px-10 rounded-3xl font-black text-lg">画像を選択</Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = (ev) => setImage(ev.target?.result as string);
                      r.readAsDataURL(file);
                    }
                  }} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto">
            <div className="flex-1 space-y-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-2xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">AI Real-time Scope</h1>
                  <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Context Awareness v3.0</p>
                </div>
              </div>

              <section className="space-y-6">
                <div className="p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl relative shadow-sm">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2 font-sans">Cultivation Area</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-blue-500 w-5 h-5" />
                      <input className="bg-transparent border-none p-0 font-black text-xl text-blue-900 focus:ring-0 w-full" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Identified Target</label>
                  <div className="flex items-center gap-3 text-slate-900 font-black text-xl italic">
                    <Bot className="text-blue-500 w-6 h-6" />
                    <input className="bg-transparent border-none p-0 focus:ring-0 w-full" value={targetName} onChange={(e) => setTargetName(e.target.value)} placeholder="AI分析中..." />
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Custom Request</label>
                  <Textarea className="bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 w-full min-h-[60px] resize-none text-lg" placeholder="特に知りたいことは？" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </section>

              <section className="space-y-6 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 gap-4 text-center">
                   <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Get Deep Analysis</p>
                  <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} disabled={!image || isScanning} className="h-24 bg-slate-900 hover:bg-black text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center group active:scale-95 transition-all">
                    <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase"><Bot className="w-6 h-6 text-blue-400" /> ChatGPT</div>
                    <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Copy Prompt & Go</span>
                  </Button>
                </div>
              </section>

              {isCopied && (
                <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-200 animate-in fade-in slide-in-from-top-4 shadow-xl">
                   <div className="flex items-center gap-3 text-red-700 mb-2 font-black italic text-lg"><AlertCircle className="w-6 h-6" />重要：写真を添付！</div>
                   <p className="text-sm text-red-900 leading-relaxed font-bold">AIアプリが開いたら、<span className="underline decoration-red-500 decoration-4 underline-offset-4">撮った写真を添付</span>して貼り付けてください。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
