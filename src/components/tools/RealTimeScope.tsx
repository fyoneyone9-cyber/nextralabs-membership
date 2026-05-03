'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, 
  ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, 
  Search, Zap, Loader2, Download 
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
    link.download = `scope-capture-${Date.now()}.jpg`;
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
    toast.success("プロンプトをコピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/60 to-transparent text-white">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Zap className="w-8 h-8" /></div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">AI REAL-TIME SCOPE</h1>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-blue-500/20 shadow-2xl active:scale-90 transition-all">
                    <div className="h-14 w-14 bg-white rounded-full border-2 border-slate-100" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white h-16 w-16 rounded-full"><X className="w-10 h-10" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-500">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce">
                    1. 写真を保存（必須）
                  </Button>
                  <Button onClick={() => {setImage(null); setScanResult(null);}} className="h-14 w-14 bg-black/50 text-white rounded-full hover:bg-red-500 border-2 border-white/20"><X /></Button>
                </div>
                {isScanning && (
                  <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse">
                    <RefreshCw className="w-16 h-16 text-white animate-spin mb-4" />
                    <p className="text-white font-black tracking-widest text-xl">AI SCANNING...</p>
                  </div>
                )}
                {scanResult && (
                  <div className="absolute top-32 left-10 right-10 p-6 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 animate-in zoom-in-95">
                    <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase mb-3"><Zap className="w-4 h-4" /> ANALYSIS RESULT</div>
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div><p className="text-[10px] opacity-50 font-bold uppercase">Identity</p><p className="text-lg font-black">{scanResult.name}</p></div>
                      <div><p className="text-[10px] opacity-50 font-bold uppercase">Status</p><p className="text-lg font-black text-green-400">{scanResult.status}</p></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-8 animate-in fade-in">
                <div className="h-32 w-32 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20"><Search className="w-12 h-12 text-blue-500/40" /></div>
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-2xl transition-all active:scale-95 uppercase italic tracking-tighter">Start Scope</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-16 px-10 rounded-3xl font-black text-lg transition-all uppercase tracking-widest">Import Image</Button>
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
              <section className="space-y-6">
                <div className="p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl relative shadow-sm">
                  <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block tracking-widest font-sans font-black">Environment</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-blue-500 w-5 h-5" />
                      <div><input className="bg-transparent border-none p-0 font-black text-xl text-blue-900 focus:ring-0 w-full" value={locationName} onChange={(e) => setLocationName(e.target.value)} /><p className="text-xs font-bold text-blue-600">{weatherInfo}</p></div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-xl" onClick={syncRealtimeData}><RefreshCw className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest font-sans font-black">Target Identity</label>
                  <input className="bg-transparent border-none p-0 font-bold text-lg text-slate-900 focus:ring-0 w-full" placeholder="対象の名称（例：ダリア）" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest font-sans font-black">User Context</label>
                  <Textarea className="bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 w-full min-h-[60px] resize-none text-lg" placeholder="知りたいこと、困っていること..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Step 2: Copy & Launch Analysis</p>
                <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} disabled={!image || isScanning} className="h-24 w-full bg-slate-900 hover:bg-black text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center group active:scale-95 transition-all">
                  <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase"><Bot className="w-6 h-6 text-blue-400" /> 2. ChatGPTで診断</div>
                  <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest">プロンプトをコピーしてアプリを起動</span>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleCopyAndGo('https://gemini.google.com/')} disabled={!image} className="h-16 border-2 border-slate-100 hover:border-blue-500 rounded-2xl font-black text-slate-600 active:scale-95 transition-all uppercase tracking-widest italic">Geminiへ</Button>
                  <Button variant="outline" onClick={() => handleCopyAndGo('https://claude.ai/')} disabled={!image} className="h-16 border-2 border-slate-100 hover:border-orange-500 rounded-2xl font-black text-slate-600 active:scale-95 transition-all uppercase tracking-widest italic">Claudeへ</Button>
                </div>
              </section>

              {isCopied && (
                <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-200 animate-in fade-in slide-in-from-top-4 shadow-xl">
                   <div className="flex items-center gap-3 text-red-700 mb-4 font-black italic text-lg"><AlertCircle className="w-6 h-6" />AIアプリでの操作手順</div>
                   <div className="space-y-3 text-[13px] text-red-900 font-bold leading-tight">
                     <p className="flex gap-2"><span>1.</span><span>アプリ画面下の <span className="bg-red-200 px-1 rounded">「＋」</span> をタップ</span></p>
                     <p className="flex gap-2"><span>2.</span><span>さっき <span className="underline decoration-red-500 decoration-2 underline-offset-2">保存した写真</span> を選択</span></p>
                     <p className="flex gap-2"><span>3.</span><span>入力欄にプロンプトを <span className="underline decoration-red-500 decoration-2 underline-offset-2">貼り付け</span></span></p>
                     <p className="flex gap-2"><span>4.</span><span>送信ボタンを押して鑑定開始！</span></p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest font-sans">
              <span>NextraLabs Mastery</span>
              <span>Final Release v3.0</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
