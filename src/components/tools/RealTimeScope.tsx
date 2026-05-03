'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, 
  ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, 
  Search, Zap, Loader2, Download, HelpCircle
} from "lucide-react";
import { toast } from "sonner";

export default function RealTimeScope() {
  const [plantName, setPlantName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [weatherInfo, setWeatherInfo] = useState<string>('晴れ / 24°C');
  const [isCopied, setIsCopied] = useState(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{name:string, status:string} | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image && !isScanning && !scanResult) {
      const runScan = async () => {
        setIsScanning(true);
        try {
          const response = await fetch('/api/tools/smart-gardening', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, location: locationName }),
          });
          const data = await response.json();
          const finalName = (data.name && data.name !== "解析完了") ? data.name : "現場写真";
          setScanResult({ name: finalName, status: data.status || "解析完了" });
        } catch (err) {
          setScanResult({ name: "現場写真", status: "解析準備完了" });
        } finally {
          setIsScanning(false);
        }
      };
      runScan();
    }
  }, [image]);

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

  const downloadImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `nextralabs-capture-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("写真を端末に保存しました");
  };

  const syncRealtimeData = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const [geoRes, weatherRes] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`),
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        ]);
        const geoData = await geoRes.json();
        const weatherData = await weatherRes.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.province || "現在地";
        setLocationName(city);
        setWeatherInfo(`晴れ / ${weatherData.current_weather.temperature}°C`);
        toast.success("環境データを同期しました");
      } catch (err) { console.error(err); }
    });
  };

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    const target = plantName || scanResult?.name || "現場写真";
    const magicPrompt = [
      `重要：このテキストと一緒に、私が今撮影した【${target}】の写真を1枚送信しています。まずその画像をピクセル単位で詳細に確認し、以下のプロフェッショナル分析を開始してください。`,
      ``,
      `あなたは世界中のあらゆる事象に精通した、慈愛に満ちた「超一流現場鑑定士」です。`,
      ``,
      `【現場コンテクスト】`,
      `・対象の識別: ${target}`,
      `・観測地点: ${locationName}`,
      `・環境データ: ${weatherInfo}`,
      `・ユーザーからの相談: ${prompt || "この状況において、今私が知るべきことと、すべきことを教えてください。"}`,
      ``,
      `【鑑定・実行指示】`,
      `1. 写真を精査し、対象物の微細な変化（色、形、テクスチャ、不自然な箇所）をプロの視点で特定・解説してください。`,
      `2. 周辺環境（${locationName}の${weatherInfo}）との相関関係を分析し、現在起きている事象の原因を論理的に導き出してください。`,
      `3. 今、この瞬間に実行すべき「具体的かつ即効性のあるアクション」を、数値や手順を交えて指示してください。`,
      `4. 持ち主の不安を解消し、前向きな希望を持てるような「温かく、格調高い言葉」で回答を締めくくってください。`
    ].join('\n');

    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("鑑定プロンプトをコピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* 左半分：ビジュアルセクション */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg animate-pulse"><Zap className="w-8 h-8" /></div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">AI REAL-TIME SCOPE</h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] mt-1">NEXTRALABS INTELLIGENCE</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-blue-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.4)] active:scale-90 transition-all">
                    <div className="h-14 w-14 bg-white rounded-full border-2 border-slate-200" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white bg-red-500/20 hover:bg-red-500/40 h-16 w-16 rounded-full border border-red-500/50"><X className="w-8 h-8" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in zoom-in-95 duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-[0_15px_40px_rgba(37,99,235,0.4)] border-2 border-white/20 animate-bounce text-lg">
                    1. 写真を保存（必須）
                  </Button>
                  <Button onClick={() => {setImage(null); setScanResult(null);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20 transition-colors"><X className="w-8 h-8" /></Button>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center">
                    <RefreshCw className="w-20 h-20 text-white animate-spin mb-6" />
                    <p className="text-white font-black tracking-[0.5em] text-2xl italic">AI ANALYZING...</p>
                  </div>
                )}
                
                {scanResult && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2rem] border border-white/20 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase mb-4 tracking-[0.2em]"><Zap className="w-4 h-4" /> Real-time Analysis Success</div>
                    <div className="grid grid-cols-2 gap-8 text-white">
                      <div><p className="text-[10px] opacity-40 font-black uppercase mb-1">Target Identity</p><p className="text-2xl font-black tracking-tight">{scanResult.name}</p></div>
                      <div><p className="text-[10px] opacity-40 font-black uppercase mb-1">Live Status</p><p className="text-2xl font-black text-green-400 tracking-tight">{scanResult.status}</p></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-10 p-10 animate-in fade-in duration-1000">
                <div className="h-48 w-48 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto border border-blue-500/10 relative">
                   <Search className="w-24 h-24 text-blue-500/20" />
                   <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" />
                </div>
                <div className="flex flex-col gap-5 max-w-sm mx-auto">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-24 px-12 rounded-[2rem] font-black text-3xl shadow-[0_20px_60px_rgba(37,99,235,0.3)] transition-all active:scale-95 uppercase italic tracking-tighter">Start Scope</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white h-16 px-10 rounded-2xl font-black text-lg transition-all uppercase tracking-widest">Import Local Image</Button>
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

          {/* 右半分：コントロールセクション */}
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto border-l border-slate-100">
            <div className="flex-1 space-y-12">
              
              {/* ステップ説明 */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <HelpCircle className="w-5 h-5 text-slate-400" />
                <p className="text-[13px] text-slate-500 font-bold leading-snug">
                  現場の写真を保存し、プロンプトを最強AIに貼り付けるだけで、プロ級の鑑定が始まります。
                </p>
              </div>

              <section className="space-y-6">
                <div className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-[2rem] relative shadow-sm transition-all hover:shadow-md">
                  <label className="text-[10px] font-black text-blue-500 uppercase mb-3 block tracking-[0.2em] font-sans">1. Environmental Sync</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <MapPin className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <input className="bg-transparent border-none p-0 font-black text-2xl text-blue-900 focus:ring-0 w-full leading-none" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                        <p className="text-[11px] font-black text-blue-500 mt-1 uppercase italic tracking-widest">{weatherInfo}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-2xl h-12 w-12" onClick={syncRealtimeData}><RefreshCw className="w-5 h-5" /></Button>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">2. Identify Target</label>
                    <input className="bg-transparent border-none p-0 font-black text-xl text-slate-900 focus:ring-0 w-full placeholder:text-slate-300" placeholder="対象の名称（例：ダリア）" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">3. Personal Request</label>
                    <Textarea className="bg-transparent border-none p-0 font-bold text-lg text-slate-900 focus:ring-0 w-full min-h-[80px] resize-none placeholder:text-slate-300" placeholder="知りたいこと、今の困りごと..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="space-y-5 pt-6 border-t border-slate-100 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Step 2: Choose AI & Launch Analysis</p>
                  <p className="text-[11px] text-slate-400 font-bold">プロンプトをコピーしてAIアプリへ移動します</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   {/* Gemini: 最も明るく、Vision推奨 */}
                  <Button onClick={() => handleCopyAndGo('https://gemini.google.com/')} disabled={!image || isScanning} className="h-24 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                    <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase relative z-10"><Sparkles className="w-8 h-8 text-amber-300" /> 2-A. Geminiで診断</div>
                    <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest relative z-10 italic">Recommended for Visual Analysis</span>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>

                  {/* ChatGPT: 安定の強力モデル */}
                  <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} disabled={!image || isScanning} className="h-20 w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center group active:scale-95 transition-all border-none">
                    <div className="flex items-center gap-3 text-xl font-black italic tracking-tighter uppercase"><Bot className="w-6 h-6 text-white" /> 2-B. ChatGPTで診断</div>
                    <span className="text-[10px] text-emerald-100 font-black uppercase tracking-widest italic opacity-80">Robust Reasoning & Logic</span>
                  </Button>

                  {/* Claude: 美しい文章 */}
                  <Button onClick={() => handleCopyAndGo('https://claude.ai/')} disabled={!image || isScanning} className="h-16 w-full bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-black active:scale-95 transition-all uppercase text-sm tracking-widest italic border-none">
                    <Heart className="w-5 h-5 fill-white" /> 2-C. Claudeで診断
                  </Button>
                </div>
              </section>

              {isCopied && (
                <div className="p-8 bg-red-50 rounded-[2.5rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-12 h-12 text-red-500" /></div>
                   <div className="flex items-center gap-3 text-red-700 mb-6 font-black italic text-xl uppercase tracking-tight">AI App Instructions</div>
                   <div className="space-y-4 text-[15px] text-red-950 font-black leading-tight">
                     <p className="flex items-start gap-3">
                       <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                       <span>AIアプリで <span className="bg-red-200 px-1.5 rounded text-red-600">「＋」</span> やカメラをタップ</span>
                     </p>
                     <p className="flex items-start gap-3">
                       <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                       <span>さっき <span className="underline decoration-red-500 decoration-2 underline-offset-4">保存した現場写真</span> を選択</span>
                     </p>
                     <p className="flex items-start gap-3">
                       <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                       <span>入力欄にプロンプトを <span className="underline decoration-red-500 decoration-2 underline-offset-4">貼り付けて</span> 送信！</span>
                     </p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] font-sans">
              <span>NextraLabs Context Mastery</span>
              <span>Final Verified v3.5</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
