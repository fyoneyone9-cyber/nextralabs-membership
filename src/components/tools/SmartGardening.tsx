'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, ExternalLink, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [weatherInfo, setWeatherInfo] = useState<string>('晴れ / 24°C');
  const [isCopied, setIsCopied] = useState(false);
  
  // 位置情報と天気のリアルタイム取得
  const syncRealtimeData = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        // 地域名と天気を同時に取得（簡易的にNominatimとOpen-Meteoを使用）
        const [geoRes, weatherRes] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`),
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        ]);
        const geoData = await geoRes.json();
        const weatherData = await weatherRes.json();
        
        const city = geoData.address.city || geoData.address.town || geoData.address.province || "現在地";
        const temp = weatherData.current_weather.temperature;
        const code = weatherData.current_weather.weathercode;
        
        // 天気コードを日本語に簡易変換
        const weatherMap: Record<number, string> = { 0: "快晴", 1: "晴れ", 2: "一部曇り", 3: "曇り", 45: "霧", 48: "霧", 51: "小雨", 61: "雨", 71: "雪", 95: "雷雨" };
        const condition = weatherMap[code] || "不明";
        
        setLocationName(city);
        setWeatherInfo(`${condition} / ${temp}°C`);
        toast.success("最新の天気情報を同期しました");
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("写真を撮ってください");
    
    const magicPrompt = `
あなたは慈愛に満ちた植物の専門家（植物カウンセラー）です。
添付された写真を詳細に分析し、ユーザーの不安に寄り添いながら診断結果を伝えてください。

【診断リクエスト】
・地域: ${locationName}
・現在の天気: ${weatherInfo}
・ユーザーの悩み: ${prompt || "特にありません"}

【実行指示】
1. 写真を見て、植物の種類（品種）を特定し、その特徴を優しく解説してください。
2. 葉の萎れ、変色、茎の状態、土の乾き具合をプロの視点で精密に読み取ってください。
3. 今の「${locationName}」の天気（${weatherInfo}）を踏まえ、「今すぐやるべきこと」を具体的に教えてください。
4. 単なる指示ではなく、「大切に育てている植物への想い」を汲み取った温かい言葉で回答を締めくくってください。
5. 「いつ、どのくらいの量」の水をやるべきか、具体的な数値でアドバイスしてください。
`;
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

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("写真を撮ってください");
    
    const magicPrompt = `
あなたは慈愛に満ちた植物の専門家（植物カウンセラー）です。
添付された写真を詳細に分析し、ユーザーの不安に寄り添いながら診断結果を伝えてください。

【診断リクエスト】
・ユーザーの悩み: ${prompt || "特にありません"}
・栽培地域: ${locationName}

【実行指示】
1. 写真を見て、植物の種類（品種）を特定し、その特徴を優しく解説してください。
2. 葉の萎れ、変色、茎の状態、土の乾き具合をプロの視点で精密に読み取ってください。
3. 今の「${locationName}」の天気を検索し、それに基づいた「今すぐやるべきこと」を具体的に教えてください。
4. 単なる指示ではなく、「大切に育てている植物への想い」を汲み取った温かい言葉で回答を締めくくってください。
5. 「いつ、どのくらいの量」の水をやるべきか、具体的な数値でアドバイスしてください。

※写真に写っているあらゆる予兆（害虫の卵、病気の初期段階、新芽の兆しなど）も見逃さずに。
`;
    navigator.clipboard.writeText(magicPrompt);
    setIsCopied(true);
    toast.success("最強診断プロンプトをコピーしました！");
    
    setTimeout(() => {
      window.open(url, '_blank');
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          
          {/* 左：巨大ビジュアルエリア */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-2xl shadow-lg">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tighter italic">AI WATERING GUARDIAN</h1>
                  <p className="text-green-400 text-xs font-black tracking-[0.3em] uppercase">Professional Hybrid Analysis</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[16px] border-white/5 pointer-events-none" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-green-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] active:scale-90 transition-all">
                    <div className="h-14 w-14 bg-white rounded-full border-2 border-slate-200" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-10 h-10" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in zoom-in-95 duration-500">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-green-900/10 mix-blend-overlay" />
                <Button onClick={() => setImage(null)} className="absolute top-32 right-10 h-14 w-14 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors"><X /></Button>
                <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
                   <div className="flex items-center gap-3 text-white font-bold">
                     <Sparkles className="text-green-400 animate-pulse" />
                     写真をセット完了。右側のステップへお進みください。
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 animate-in fade-in duration-1000">
                <div className="h-40 w-40 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 relative">
                   <Camera className="w-20 h-20 text-white/10" />
                   <div className="absolute inset-0 border-2 border-green-500/20 rounded-full animate-ping" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-white text-4xl font-black italic tracking-tighter">PHOTO ANALYSIS</h2>
                  <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm">植物に寄り添うAI診断を開始するために、写真を撮影してください。</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={startCamera} className="bg-green-600 hover:bg-green-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] transition-all active:scale-95">
                    カメラを起動
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-20 px-10 rounded-3xl font-black text-xl">
                    写真を選択
                  </Button>
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

          {/* 右：直感的なステップエリア */}
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto">
            <div className="flex-1 space-y-10">
              
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">1</div>
                   <h3 className="text-lg font-black text-slate-900 uppercase">Context</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl relative">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Realtime Environment</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-blue-500 w-5 h-5" />
                        <div>
                          <input 
                            className="bg-transparent border-none p-0 font-black text-xl text-blue-900 focus:ring-0 w-full"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                          />
                          <p className="text-xs font-bold text-blue-600">{weatherInfo}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-xl" onClick={syncRealtimeData}>
                        <RefreshCw className="w-4 h-4 mr-1" /> 同期
                      </Button>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Message to AI</label>
                    <Textarea 
                      className="bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 w-full min-h-[80px] resize-none text-lg"
                      placeholder="例：数日前から元気がなく、葉が丸まっています..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">2</div>
                   <h3 className="text-lg font-black text-slate-900 uppercase">Analysis</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 mb-4">下のボタンを押すとプロンプトがコピーされ、外部AIが開きます</p>
                    <div className="grid grid-cols-1 gap-4">
                      <Button 
                        onClick={() => handleCopyAndGo('https://chatgpt.com/')} 
                        disabled={!image}
                        className="h-24 bg-slate-900 hover:bg-black text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center gap-1 group transition-all active:scale-95"
                      >
                        <div className="flex items-center gap-2">
                          <Bot className="w-6 h-6" />
                          <span className="text-2xl font-black italic tracking-tighter uppercase">Use ChatGPT</span>
                        </div>
                        <span className="text-[10px] opacity-50 font-bold">Copy Prompt & Launch App</span>
                      </Button>

                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="outline"
                          onClick={() => handleCopyAndGo('https://gemini.google.com/')} 
                          disabled={!image}
                          className="h-16 border-2 border-slate-100 hover:border-blue-500 rounded-2xl font-black text-slate-600 transition-all active:scale-95"
                        >
                          <Sparkles className="mr-2 w-5 h-5 text-blue-500" /> GEMINI
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleCopyAndGo('https://claude.ai/')} 
                          disabled={!image}
                          className="h-16 border-2 border-slate-100 hover:border-orange-500 rounded-2xl font-black text-slate-600 transition-all active:scale-95"
                        >
                          <Heart className="mr-2 w-5 h-5 text-orange-500" /> CLAUDE
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {isCopied && (
                <div className="p-6 bg-green-50 rounded-3xl border-2 border-green-100 animate-in fade-in slide-in-from-top-4">
                   <div className="flex items-center gap-3 text-green-700 mb-2 font-black">
                     <CheckCircle2 className="w-5 h-5" />
                     PROMPT COPIED!
                   </div>
                   <p className="text-xs text-green-900 leading-relaxed font-medium">
                     AIアプリが起動しました。カメラアイコンから撮影した写真を選択し、プロンプトを貼り付けて送信してください。
                   </p>
                </div>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">
              <span>NextraLabs Guardian Engine v2.5</span>
              <span>Zero-Cost Mastery</span>
            </div>
          </div>
        </div>
      </Card>
      
      <p className="text-center text-slate-400 text-xs font-black mt-8 uppercase tracking-widest opacity-50 italic">
        Powered by NextraLabs Intelligence System
      </p>
    </div>
  );
}
