'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, 
  ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, 
  Search, Zap, Loader2, Download, HelpCircle, Utensils, Play, Video
} from "lucide-react";
import { toast } from "sonner";

export default function AiRecipeScope() {
  const [plantName, setPlantName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [dishName, setDishName] = useState('');
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [weatherInfo, setWeatherInfo] = useState<string>('晴れ / 24°C');
  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image && status === 'idle') {
      autoScanRecipe();
    }
  }, [image]);

  const autoScanRecipe = async () => {
    setStatus('scanning');
    setDishName('');
    try {
      const response = await fetch('/api/tools/ai-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      if (data.dishName && data.dishName !== "絶品料理" && data.dishName !== "解析エラー") {
        setDishName(data.dishName);
        setStatus('done');
        toast.success(`食材を特定：${data.dishName}`);
      } else {
        setDishName("絶品料理");
        setStatus('done');
      }
    } catch (err) {
      setDishName("絶品料理");
      setStatus('done');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera failed, fallback to file upload.");
      toast.error("カメラを起動できませんでした。写真を選択してください。");
      fileInputRef.current?.click();
    }
  };

  const [isCameraActive, setIsCameraActive] = useState(false);

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
        const temp = weatherData.current_weather.temperature;
        setLocationName(city);
        setWeatherInfo(`晴れ / ${temp}°C`);
        toast.success("環境情報を同期しました");
      } catch (err) { console.error(err); }
    });
  };

  const openYouTube = () => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName || plantName || "料理")}+作り方`;
    window.open(url, '_blank');
  };

  const handleAutoCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    const target = plantName || dishName || "写真の食材";
    const magicPrompt = `重要：このテキストと一緒に、私が今撮影した写真を1枚送信しています。まずその画像を詳細に確認してください。\nあなたは天才シェフです。\n【現場データ】\n・対象の食材: ${target}\n・環境情報: ${weatherInfo}\n・ユーザー相談: ${prompt || "この食材で作れる最高に美味しい料理のレシピを教えてください。"}\n\n【実行指示】\n1. 写真を精査し、何の食材がどれくらいあるか特定してください。\n2. 地域環境（${locationName}の${weatherInfo}）に合わせた、今最も美味しいレシピを考案してください。\n3. 手順、コツ、盛り付けまで具体的にアドバイスしてください。`;
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("鑑定文を自動コピーしました！貼り付けるだけです。");
    setTimeout(() => { window.open(url, '_blank'); }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg animate-pulse"><Zap className="w-8 h-8" /></div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter leading-none">AI リアルタイム・スコープ</h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] mt-1">NEXTRALABS INTELLIGENCE</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-blue-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all"><div className="h-14 w-14 bg-red-500 rounded-full" /></Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-8 h-8" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce text-lg">1. 写真を保存（必須）</Button>
                  <Button onClick={() => {setImage(null); setDishName(''); setStatus('idle'); setIsCopied(false);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20 transition-colors"><X className="w-8 h-8" /></Button>
                </div>
                {status === 'scanning' && (
                  <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center animate-pulse text-white font-black text-2xl uppercase italic">Scanning...</div>
                )}
                {status === 'done' && dishName && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 animate-in slide-in-from-top-4 shadow-2xl text-left text-white">
                    <p className="text-3xl font-black tracking-tighter mb-6 uppercase italic leading-none">{dishName}</p>
                    <p className="text-lg font-black leading-tight animate-pulse text-white">鑑定文はコピー済みです。右下のAIボタンをクリック！</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-10 animate-in fade-in duration-1000">
                <div className="h-48 w-48 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto border border-blue-500/10 relative"><Search className="w-24 h-24 text-blue-500/20" /><div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" /></div>
                <div className="flex flex-col gap-5 max-w-sm mx-auto">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-24 px-12 rounded-[2rem] font-black text-3xl shadow-2xl transition-all active:scale-95 italic tracking-tighter uppercase">スコープを起動</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 h-16 px-10 rounded-2xl font-black text-lg transition-all tracking-widest uppercase">保存した写真を選択</Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { const r = new FileReader(); r.onload = (ev) => setImage(ev.target?.result as string); r.readAsDataURL(file); }
                  }} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* 右半分 */}
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto border-l border-slate-100 text-left">
            <div className="flex-1 space-y-10">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] border-2 border-blue-200 shadow-sm transition-all hover:shadow-md">
                <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><HelpCircle className="w-6 h-6 text-white" /></div>
                <div className="space-y-1"><p className="text-sm text-blue-900 font-black">写真を保存してAIボタンを押すだけ！</p><p className="text-[12px] text-blue-700 font-bold opacity-70 leading-relaxed tracking-tight">鑑定文は自動でコピーされます。あとはAIに「写真」を渡して「貼り付け」るだけ。</p></div>
              </div>

              <section className="space-y-6">
                <div className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-blue-900 font-black"><MapPin className="text-blue-500 w-6 h-6" /><div><input className="bg-transparent border-none p-0 font-black text-2xl w-full focus:ring-0 tracking-tighter" value={locationName} onChange={(e) => setLocationName(e.target.value)} /><p className="text-[11px] font-black text-blue-500 uppercase italic tracking-widest mt-1">{weatherInfo}</p></div></div>
                  <Button size="icon" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-2xl h-14 w-14 shadow-sm" onClick={syncRealtimeData}><RefreshCw className="w-6 h-6" /></Button>
                </div>
                <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner space-y-4">
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1. 対象の名前</label><input className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full focus:ring-0" placeholder="例：バナナ" value={plantName} onChange={(e) => setPlantName(e.target.value)} /></div>
                  <div className="h-px bg-slate-200 w-full" /><div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">2. 相談内容</label><Textarea className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full min-h-[80px] resize-none focus:ring-0 leading-relaxed placeholder:text-slate-300" placeholder="今の困りごとを入力..." value={prompt} onChange={(e) => setPrompt(e.target.value)} /></div>
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-slate-100 text-center">
                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">2. AIを選んで鑑定開始</p>
                  <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleAutoCopyAndGo('https://gemini.google.com/')} disabled={!image || status === 'scanning'} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase relative z-10 text-white"><Sparkles className="w-8 h-8 text-amber-300" /> Geminiで鑑定</div>
                      <span className="text-[11px] text-blue-100 font-black uppercase relative z-10 opacity-80">画像解析に最も強い推奨AI</span>
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleAutoCopyAndGo('https://chatgpt.com/')} disabled={!image || status === 'scanning'} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Bot className="w-6 h-6 text-white" /> ChatGPT</Button>
                      <Button onClick={() => handleAutoCopyAndGo('https://claude.ai/')} disabled={!image || status === 'scanning'} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Heart className="w-6 h-6 fill-white" /> Claude</Button>
                    </div>
                  </div>
                </div>

                {status === 'done' && (dishName || plantName) && (
                  <div className="pt-8 border-t border-slate-100 space-y-4 text-left animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><div className="p-2 bg-red-100 rounded-xl shadow-sm"><Video className="text-red-600 w-5 h-5" /></div><h3 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase">Cook Videos</h3></div>
                      <Button variant="ghost" className="text-blue-600 font-black text-xs h-auto p-0" onClick={openYouTube}>YouTubeで詳しく</Button>
                    </div>
                    <Card className="bg-slate-950 border-none rounded-3xl overflow-hidden shadow-xl cursor-pointer group shadow-red-600/10" onClick={openYouTube}>
                      <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/30 group-hover:scale-125 transition-all" />
                        <div className="absolute bottom-6 left-6 right-6 font-black text-white text-lg tracking-tight line-clamp-1">{(dishName && dishName !== "絶品料理") ? dishName : plantName || "料理"} のプロレシピ動画</div>
                      </div>
                    </Card>
                  </div>
                )}
              </section>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-12 h-12 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8 text-left"><div className="flex items-center gap-3 text-red-700 font-black italic text-xl uppercase tracking-tight text-left">鑑定アプリでの操作</div><p className="text-red-600 font-black text-xs">※鑑定文はすでにコピー済みです！</p></div>
                   <div className="space-y-5 text-[15px] text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md">1</span><span>入力欄の <span className="bg-red-200 px-2 py-0.5 rounded-lg text-red-600">「＋」</span> をタップ</span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md">2</span><span>保存した <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">現場写真</span> を選択</span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md">3</span><span>そのまま <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">「貼り付け」</span> して送信！</span></p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
