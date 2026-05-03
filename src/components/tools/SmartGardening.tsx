'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, ExternalLink, Sparkles, Heart, Bot, RefreshCw, Sprout, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [plantName, setPlantName] = useState('');
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
        toast.success("最新の天気情報を同期しました");
      } catch (err) { console.error(err); }
    });
  };

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("写真を撮ってください");
    
    const magicPrompt = `
重要：このテキストと一緒に、私が撮影した植物の写真を1枚送信しています。まずその画像を詳細に確認してから、以下の診断を開始してください。

あなたは慈愛に満ちた植物の専門家です。
【診断対象】
・植物の名前/種類: ${plantName || "（写真から特定してください）"}
・地域: ${locationName}
・現在の天気: ${weatherInfo}
・ユーザーの相談: ${prompt || "特にありません。現状を診てください。"}

【実行指示】
1. 添付された写真から植物の種類を特定し、その品種に合った適切なケア（日当たりや温度など）を解説してください。
2. 写真に写っている葉・茎・土の状態を精査し、健康か、水不足や病気などのトラブルがあるかプロの視点で判断してください。
3. 今の地域の天気（${weatherInfo}）を踏まえ、「今すぐお水をあげるべきか」「夕方まで待つべきか」など、今日のアクションを具体的に指示してください。
4. ユーザーの植物への想いに寄り添う、温かい言葉で締めくくってください。
`;
    navigator.clipboard.writeText(magicPrompt);
    setIsCopied(true);
    toast.success("プロンプトをコピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-2xl shadow-lg">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white italic">AI WATERING GUARDIAN</h1>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-20 w-20 rounded-full bg-white border-8 border-green-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                    <div className="h-12 w-12 bg-red-500 rounded-full" />
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
                <Camera className="w-24 h-24 text-white/10 mx-auto" />
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-green-600 hover:bg-green-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-xl active:scale-95 transition-all">カメラ起動</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-20 px-10 rounded-3xl font-black text-xl">写真を選択</Button>
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
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2 font-sans">Environmental Data</label>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Plant Identity</label>
                  <div className="flex items-center gap-3">
                    <Sprout className="text-green-500 w-5 h-5" />
                    <input className="bg-transparent border-none p-0 font-bold text-lg text-slate-900 focus:ring-0 w-full" placeholder="名前や種類（不明でもOK）" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-sans">Advice Context</label>
                  <Textarea className="bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 w-full min-h-[60px] resize-none text-lg" placeholder="葉が枯れてきた、元気がない等..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </section>

              <section className="space-y-6 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 gap-4">
                  <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} disabled={!image} className="h-24 bg-slate-900 hover:bg-black text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center group active:scale-95 transition-all">
                    <div className="flex items-center gap-3"><Bot className="w-8 h-8" /><span className="text-2xl font-black italic tracking-tighter uppercase">Use ChatGPT</span></div>
                    <span className="text-[10px] opacity-50 font-bold">Recommended for Vision Analysis</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => handleCopyAndGo('https://gemini.google.com/')} disabled={!image} className="h-16 border-2 border-slate-100 hover:border-blue-500 rounded-2xl font-black text-slate-600 active:scale-95 transition-all"><Sparkles className="mr-2 w-5 h-5 text-blue-500" /> GEMINI</Button>
                    <Button variant="outline" onClick={() => handleCopyAndGo('https://claude.ai/')} disabled={!image} className="h-16 border-2 border-slate-100 hover:border-orange-500 rounded-2xl font-black text-slate-600 active:scale-95 transition-all"><Heart className="mr-2 w-5 h-5 text-orange-500" /> CLAUDE</Button>
                  </div>
                </div>
              </section>

              {isCopied && (
                <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-200 animate-in fade-in slide-in-from-top-4 shadow-lg">
                   <div className="flex items-center gap-3 text-red-700 mb-2 font-black italic text-lg">
                     <AlertCircle className="w-6 h-6" />
                     重要：必ず写真を添付してください！
                   </div>
                   <p className="text-sm text-red-900 leading-relaxed font-bold">
                     1. AIアプリが開いたら、「＋」ボタンやカメラアイコンから先ほど撮った植物の<span className="underline decoration-red-500 decoration-2 underline-offset-4">写真を選択</span>してください。<br />
                     2. その後、コピーしたプロンプトを貼り付けて送信してください。
                   </p>
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">
              <span>NextraLabs Mastery</span>
              <span>Build 1.2.5 Stable</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
