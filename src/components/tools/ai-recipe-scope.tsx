'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, 
  Sparkles, Heart, Bot, RefreshCw, AlertCircle, 
  Search, Zap, Loader2, Download, HelpCircle, Utensils, Play, Youtube
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
  const [isScanning, setIsScanning] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image && !isScanning && !dishName) {
      const runScan = async () => {
        setIsScanning(true);
        try {
          const response = await fetch('/api/tools/ai-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image }),
          });
          const data = await response.json();
          if (data.dishName) setDishName(data.dishName);
        } catch (err) {
          setDishName("おすすめ料理");
        } finally {
          setIsScanning(false);
        }
      };
      runScan();
    }
  }, [image]);

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

  const handleCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    const magicPrompt = `
あなたは世界中の食材を知り尽くした天才シェフです。写真を分析し、最高のレシピを提案してください。
【食材特定】: ${dishName || "写真から特定してください"}
【地域/天気】: ${locationName} / ${weatherInfo}
【相談】: ${prompt || "この食材で作れる最高に美味しい料理を教えてください。"}
【指示】:
1. 写真の食材をすべて特定し、それらを活かした具体的な調理手順を教えてください。
2. 今日の天気 (${weatherInfo}) に合わせた、最適な味付けや食感を提案してください。
3. 初心者でも失敗しないためのコツを添え、温かい言葉で締めてください。
`;
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("レシピ鑑定文をコピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          {/* 左半分 */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-2xl shadow-lg"><Zap className="w-8 h-8" /></div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">AI RECIPE SCOPE</h1>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-red-500/30 flex items-center justify-center active:scale-90 transition-all shadow-2xl">
                    <div className="h-14 w-14 bg-red-500 rounded-full" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-10 h-10" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce">1. 写真を保存（必須）</Button>
                  <Button onClick={() => {setImage(null); setDishName(''); setIsCopied(false);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20"><X /></Button>
                </div>
                {isScanning && (
                  <div className="absolute inset-0 bg-red-600/30 backdrop-blur-md flex flex-col items-center justify-center animate-pulse text-white">
                    <RefreshCw className="w-20 h-20 animate-spin mb-6" /><p className="font-black tracking-widest text-2xl uppercase italic">Scanning...</p>
                  </div>
                )}
                {dishName && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 animate-in slide-in-from-top-4 shadow-2xl text-white">
                    <p className="text-[11px] text-red-400 font-black uppercase mb-4 tracking-[0.3em]"><Zap className="w-4 h-4 inline mr-2" /> Identification Success</p>
                    <p className="text-3xl font-black tracking-tighter mb-6">{dishName}</p>
                    <div className="p-6 bg-green-500/20 border-2 border-green-500/40 rounded-3xl animate-pulse">
                      <p className="text-lg font-black leading-tight text-white">鑑定文はコピー済みです。AIアプリに写真を添付して貼り付けるだけで最高のレシピが届きます！</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-10 animate-in fade-in">
                <div className="h-40 w-40 bg-red-500/5 rounded-full flex items-center justify-center mx-auto border border-red-500/10 relative"><Search className="w-20 h-20 text-red-500/20" /><div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-ping" /></div>
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-red-600 hover:bg-red-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-xl active:scale-95 transition-all italic tracking-tighter">Fridge Scan</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 h-16 px-10 rounded-2xl font-black uppercase">Import Image</Button>
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
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto border-l border-slate-100 text-left">
            <div className="flex-1 space-y-10">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] border-2 border-red-100 shadow-sm">
                <div className="h-10 w-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><HelpCircle className="w-6 h-6 text-white" /></div>
                <div className="space-y-1">
                  <p className="text-sm text-red-900 font-black leading-snug">写真を保存してAIボタンを押すだけ！</p>
                  <p className="text-[12px] text-red-700 font-bold opacity-70 leading-tight">鑑定文は自動でコピーされます。AIに写真と鑑定文を渡すだけで完了します。</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Identification: {dishName || "食材スキャン待ち"}</label>
                <Textarea className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full min-h-[100px] resize-none focus:ring-0 leading-relaxed placeholder:text-slate-300" placeholder="アレルギーや苦手なものがあれば教えてください..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>

              <section className="space-y-6 pt-6 border-t border-slate-100 text-center">
                <div className="grid grid-cols-1 gap-4">
                  <Button onClick={() => handleCopyAndGo('https://gemini.google.com/')} disabled={!image || isScanning} className="h-24 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                    <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase z-10"><Sparkles className="w-8 h-8 text-amber-300" /> Geminiで鑑定</div>
                    <span className="text-[10px] text-blue-100 font-black uppercase z-10">Google検索レシピに最適</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} className="h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-black transition-all border-none">ChatGPT</Button>
                    <Button onClick={() => handleCopyAndGo('https://claude.ai/')} className="h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-black transition-all border-none">Claude</Button>
                  </div>
                </div>

                {dishName && (
                  <div className="pt-8 border-t border-slate-100 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-xl"><Youtube className="text-red-600 w-5 h-5" /></div>
                      <h3 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase">Cook Videos</h3>
                    </div>
                    <Card className="bg-slate-950 border-none rounded-3xl overflow-hidden shadow-xl cursor-pointer group" onClick={() => window.open(`https://www.youtube.com/results?search_query=${dishName}+作り方`, '_blank')}>
                      <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/50 group-hover:scale-125 transition-all" />
                        <div className="absolute bottom-4 left-4 right-4"><p className="text-white font-black text-xs">{dishName}の作り方をYouTubeで開く</p></div>
                      </div>
                    </Card>
                  </div>
                )}
              </section>

              {isCopied && (
                <div className="p-8 bg-red-50 rounded-[2.5rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-12 h-12 text-red-500" /></div>
                   <div className="space-y-4 text-[15px] text-red-950 font-black leading-tight">
                     <p className="flex items-start gap-3"><span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span><span>AIアプリで <span className="bg-red-200 px-1.5 rounded text-red-600">「＋」</span> をタップ</span></p>
                     <p className="flex items-start gap-3"><span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span><span>さっき保存した <span className="underline decoration-red-500 decoration-2">冷蔵庫写真</span> を選択</span></p>
                     <p className="flex items-start gap-3"><span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span><span>そのまま <span className="underline decoration-red-500 decoration-2 font-black">「貼り付け」</span> して送信！</span></p>
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
