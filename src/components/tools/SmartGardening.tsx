'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, Search, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [targetName, setTargetName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [weatherInfo, setWeatherInfo] = useState<string>('晴れ / 24°C');
  const [isCopied, setIsCopied] = useState(false);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
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
        const weatherMap: Record<number, string> = { 0: "快晴", 1: "晴れ", 2: "一部曇り", 3: "曇り", 45: "霧", 48: "霧", 51: "小雨", 61: "雨", 71: "雪", 95: "雷雨" };
        const condition = weatherMap[weatherData.current_weather.weathercode] || "不明";
        setLocationName(city);
        setWeatherInfo(`${condition} / ${weatherData.current_weather.temperature}°C`);
        toast.success("環境データを同期しました");
      } catch (err) { console.error(err); }
    });
  };

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    
    const magicPrompt = `
重要：このテキストと一緒に、私が今撮影した現場の写真を1枚送信しています。まずその画像を詳細に確認してから、以下の高度な分析を開始してください。

あなたは世界中のあらゆる事象に精通した「万能現場アナリスト」です。
写真と位置情報、環境データを統合し、解決策を提示してください。

【現場コンテクスト】
・対象物/名称: ${targetName || "（写真から特定してください）"}
・地域: ${locationName}
・環境状況: ${weatherInfo}
・相談内容: ${prompt || "この状況を詳しく分析してください。"}

【分析・実行指示】
1. 写真を精査し、対象物の種類、状態、起きている問題をプロの視点で特定してください。
2. 地域環境（${locationName}、${weatherInfo}）が対象物に与える影響（熱、湿度、風、歴史的背景等）を考察してください。
3. 今、この瞬間に実行すべき「最適解」を具体的にアドバイスしてください。
4. 専門家として信頼感があり、かつユーザーの不安を解消するようなポジティブな口調で回答してください。
`;
    navigator.clipboard.writeText(magicPrompt);
    setIsCopied(true);
    toast.success("スコーププロンプトをコピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">AI REAL-TIME SCOPE</h1>
                  <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase">Context Awareness System</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-20 w-20 rounded-full bg-white border-8 border-blue-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                    <div className="h-12 w-12 bg-blue-500 rounded-full animate-pulse" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-10 h-10" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-500">
                <img src={image} className="w-full h-full object-cover" />
                <Button onClick={() => setImage(null)} className="absolute top-32 right-10 h-14 w-14 bg-black/50 text-white rounded-full hover:bg-red-500"><X /></Button>
              </div>
            ) : (
              <div className="text-center space-y-8 p-10">
                <div className="h-40 w-40 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 relative">
                   <Search className="w-20 h-20 text-blue-500/40" />
                   <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" />
                </div>
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-xl active:scale-95 transition-all">スコープを起動</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-20 px-10 rounded-3xl font-black text-xl">画像を選択</Button>
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
            <div className="flex-1 space-y-8">
              <section className="space-y-6">
                <div className="p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl relative shadow-sm">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2 font-sans">Environmental Sync</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-blue-500 w-5 h-5" />
                      <div>
                        <input className="bg-transparent border-none p-0 font-black text-xl text-blue-900 focus:ring-0 w-full" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                        <p className="text-xs font-bold text-blue-600">{weatherInfo}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-xl" onClick={syncRealtimeData}><RefreshCw className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Target Identity</label>
                  <div className="flex items-center gap-3">
                    <Zap className="text-amber-500 w-5 h-5" />
                    <input className="bg-transparent border-none p-0 font-bold text-lg text-slate-900 focus:ring-0 w-full" placeholder="対象の名称（植物、建物、家電等）" value={targetName} onChange={(e) => setTargetName(e.target.value)} />
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Analysis Request</label>
                  <Textarea className="bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 w-full min-h-[60px] resize-none text-lg" placeholder="知りたいこと、困っていること..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </section>

              <section className="space-y-6 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 gap-4">
                  <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} disabled={!image} className="h-24 bg-slate-900 hover:bg-black text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center group active:scale-95 transition-all">
                    <div className="flex items-center gap-3"><Bot className="w-8 h-8" /><span className="text-2xl font-black italic tracking-tighter uppercase">Scope by ChatGPT</span></div>
                    <span className="text-[10px] opacity-50 font-bold italic">Perfect for Professional Field Analysis</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => handleCopyAndGo('https://gemini.google.com/')} disabled={!image} className="h-16 border-2 border-slate-100 hover:border-blue-500 rounded-2xl font-black text-slate-600 active:scale-95 transition-all">GEMINI</Button>
                    <Button variant="outline" onClick={() => handleCopyAndGo('https://claude.ai/')} disabled={!image} className="h-16 border-2 border-slate-100 hover:border-orange-500 rounded-2xl font-black text-slate-600 active:scale-95 transition-all">CLAUDE</Button>
                  </div>
                </div>
              </section>

              {isCopied && (
                <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-200 animate-in fade-in slide-in-from-top-4 shadow-lg">
                   <div className="flex items-center gap-3 text-red-700 mb-2 font-black italic text-lg">
                     <AlertCircle className="w-6 h-6" />
                     重要：写真を添付して送信！
                   </div>
                   <p className="text-sm text-red-900 leading-relaxed font-bold">
                     AIアプリが開いたら、<span className="underline decoration-red-500 decoration-2 underline-offset-4 font-black">撮影した写真を添付</span>してからプロンプトを送信してください。
                   </p>
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase font-sans">
              <span>NextraLabs Context Engine</span>
              <span>v2.5 Field Ready</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
