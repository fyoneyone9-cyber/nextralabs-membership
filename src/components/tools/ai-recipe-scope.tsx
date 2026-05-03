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
  
  // 状態管理
  const [status, setStatus] = useState<'idle' | 'uploading' | 'scanning' | 'done'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 撮影後の自動スキャン
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
      if (data.dishName && data.dishName !== "絶品レシピ") {
        setDishName(data.dishName);
        setStatus('done');
        toast.success(`解析完了：${data.dishName}`);
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
      toast.error("カメラの起動に失敗しました");
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
    link.download = `recipe-scan-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("写真を保存しました");
  };

  const openYouTube = () => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName || "料理")}+作り方`;
    window.open(url, '_blank');
  };

  const handleAutoCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    const target = plantName || dishName || "食材";
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
    toast.success("レシピ鑑定文を自動コピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* 左半分：カメラ・解析結果 */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-2xl shadow-lg animate-pulse"><Zap className="w-8 h-8" /></div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter leading-none uppercase">AI RECIPE SCOPE</h1>
                   <p className="text-red-400 text-[10px] font-black tracking-[0.4em] mt-1">NEXTRALABS INTELLIGENCE</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-red-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                    <div className="h-14 w-14 bg-white rounded-full" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-8 h-8" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce text-lg">1. 写真を保存（必須）</Button>
                  <Button onClick={() => {setImage(null); setDishName(''); setStatus('idle'); setIsCopied(false);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20 transition-colors"><X className="w-8 h-8" /></Button>
                </div>

                {status === 'scanning' && (
                  <div className="absolute inset-0 bg-red-600/30 backdrop-blur-md flex flex-col items-center justify-center animate-pulse text-white">
                    <RefreshCw className="w-20 h-20 animate-spin mb-6" /><p className="font-black tracking-widest text-2xl uppercase italic">Scanning Ingredients...</p>
                  </div>
                )}
                
                {status === 'done' && dishName && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 animate-in slide-in-from-top-4 shadow-2xl text-white">
                    <p className="text-[11px] text-red-400 font-black uppercase mb-4 tracking-[0.3em]"><Zap className="w-4 h-4 inline mr-2" /> Identification Success</p>
                    <p className="text-3xl font-black tracking-tighter mb-6 uppercase italic tracking-tight">{dishName}</p>
                    <div className="p-6 bg-green-500/20 border-2 border-green-500/40 rounded-3xl animate-pulse">
                      <p className="text-xl font-black leading-tight text-white tracking-tight">
                        鑑定文はコピー済みです。右下のAIボタンをクリックし、写真を添付して貼り付けるだけで最高のレシピが届きます！
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-10 animate-in fade-in duration-1000">
                <div className="h-48 w-48 bg-red-500/5 rounded-full flex items-center justify-center mx-auto border border-red-500/10 relative"><Search className="w-24 h-24 text-red-500/20" /><div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-ping" /></div>
                <div className="flex flex-col gap-5 max-w-sm mx-auto">
                  <Button onClick={startCamera} className="bg-red-600 hover:bg-red-500 text-white h-24 px-12 rounded-[2rem] font-black text-3xl shadow-2xl transition-all active:scale-95 italic tracking-tighter uppercase">Fridge Scan</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white h-16 px-10 rounded-2xl font-black text-lg transition-all uppercase">Import Image</Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { const r = new FileReader(); r.onload = (ev) => setImage(ev.target?.result as string); r.readAsDataURL(f); }
                  }} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* 右半分 */}
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto border-l border-slate-100">
            <div className="flex-1 space-y-10">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] border-2 border-red-100 shadow-sm transition-all hover:shadow-md">
                <div className="h-10 w-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><HelpCircle className="w-6 h-6 text-white" /></div>
                <div className="space-y-1 text-left">
                  <p className="text-sm text-red-900 font-black tracking-tight leading-snug">写真を保存してAIボタンを押すだけ！</p>
                  <p className="text-[12px] text-red-700 font-bold opacity-70 leading-relaxed tracking-tight text-left">鑑定文は自動でコピーされます。あとはAIに「写真」を渡して「貼り付け」るだけ。</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner space-y-4 text-left">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Recipe Identification</label>
                <div className="flex items-center gap-3">
                   <div className={`h-2 w-2 rounded-full ${status === 'scanning' ? 'bg-amber-500 animate-ping' : status === 'done' ? 'bg-green-500' : 'bg-slate-300'}`} />
                   <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{status === 'scanning' ? '分析中...' : dishName || '待機中'}</p>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <Textarea className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full min-h-[100px] resize-none focus:ring-0 leading-relaxed placeholder:text-slate-300" placeholder="アレルギーや今の困りごとを入力してください..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>

              <section className="space-y-6 pt-8 border-t border-slate-100 text-center">
                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">2. AIを選んで鑑定開始</p>
                  <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleAutoCopyAndGo('https://gemini.google.com/')} disabled={!image || status === 'scanning'} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-4 text-3xl font-black italic tracking-tighter uppercase relative z-10"><Sparkles className="w-8 h-8 text-amber-300 shadow-sm" /> Geminiで鑑定</div>
                      <span className="text-[11px] text-blue-100 font-black uppercase tracking-[0.2em] relative z-10">画像解析に最も強い推奨AI</span>
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleAutoCopyAndGo('https://chatgpt.com/')} disabled={!image || status === 'scanning'} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Bot className="w-6 h-6 text-white" /> ChatGPT</Button>
                      <Button onClick={() => handleAutoCopyAndGo('https://claude.ai/')} disabled={!image || status === 'scanning'} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Heart className="w-6 h-6 fill-white" /> Claude</Button>
                    </div>
                  </div>
                </div>

                {status === 'done' && dishName && (
                  <div className="pt-8 border-t border-slate-100 space-y-4 text-left animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-xl shadow-sm"><Video className="text-red-600 w-5 h-5" /></div>
                        <h3 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase">Cook Videos</h3>
                      </div>
                      <Button variant="ghost" className="text-blue-600 font-black text-xs h-auto p-0" onClick={openYouTube}>YouTubeで詳しく</Button>
                    </div>
                    <Card className="bg-slate-950 border-none rounded-3xl overflow-hidden shadow-xl cursor-pointer group" onClick={openYouTube}>
                      <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/30 group-hover:scale-125 transition-all" />
                        <div className="absolute bottom-6 left-6 right-6">
                           <p className="text-white font-black text-lg tracking-tight line-clamp-1">{dishName} のプロレシピ</p>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Tap to search on YouTube</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </section>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-12 h-12 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8">
                     <div className="flex items-center gap-3 text-red-700 font-black italic text-2xl uppercase tracking-tighter">鑑定アプリでの操作</div>
                     <p className="text-red-600 font-black text-xs tracking-widest uppercase opacity-70">鑑定文はすでにコピー済みです！</p>
                   </div>
                   <div className="space-y-5 text-[15px] text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">1</span><span>入力欄の <span className="bg-red-200 px-2 py-0.5 rounded-lg text-red-600">「＋」</span> をタップ</span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">2</span><span>保存した <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">現場写真</span> を選択</span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">3</span><span>そのまま <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">「貼り付け」</span> して送信！</span></p>
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
