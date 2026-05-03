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
  const [dishName, setDishName] = useState(''); // 空文字で初期化
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [weatherInfo, setWeatherInfo] = useState<string>('晴れ / 24°C');
  const [isCopied, setIsCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 撮影後の自動スキャン
  useEffect(() => {
    if (image && !isScanning && !dishName) {
      autoScanRecipe();
    }
  }, [image]);

  const autoScanRecipe = async () => {
    setIsScanning(true);
    setDishName(''); // リセット
    try {
      const response = await fetch('/api/tools/ai-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      // 解析結果を即座にセット
      if (data.dishName && data.dishName !== "絶品レシピ") {
        setDishName(data.dishName);
        toast.success(`食材を特定しました：${data.dishName}`);
      } else {
        setDishName("絶品料理");
      }
    } catch (err) {
      setDishName("絶品料理");
    } finally {
      setIsScanning(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      setDishName('');
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
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `recipe-scan-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("写真を端末に保存しました");
  };

  // YouTube検索URLを動的に生成する関数
  const openYouTube = () => {
    const query = dishName || "料理";
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+作り方`;
    window.open(url, '_blank');
  };

  const handleAutoCopyAndGo = (url: string) => {
    if (!image) return toast.error("対象を撮影してください");
    const target = plantName || dishName || "食材";
    const magicPrompt = `
あなたは世界中の食材を知り尽くした天才シェフです。写真を分析し、最高のレシピを提案してください。
【食材特定】: ${target}
【地域/天気】: ${locationName} / ${weatherInfo}
【相談】: ${prompt || "この食材で作れる最高に美味しい料理を教えてください。"}
【指示】:
1. 写真の食材をすべて特定し、それらを活かした具体的な調理手順を教えてください。
2. 今日の天気 (${weatherInfo}) に合わせた、最適な味付けや食感を提案してください。
3. 初心者でも失敗しないためのプロのコツを添え、温かい言葉で締めてください。
`;
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("レシピ鑑定文を自動コピーしました！");
    setTimeout(() => { window.open(url, '_blank'); }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          {/* 左半分 */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-red-600 rounded-2xl shadow-lg"><Zap className="w-8 h-8" /></div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">AI RECIPE SCOPE</h1>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-20 w-20 rounded-full bg-white border-8 border-red-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                    <div className="h-12 w-12 bg-red-500 rounded-full" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-10 h-10" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-500">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce text-lg">1. 写真を保存（必須）</Button>
                  <Button onClick={() => {setImage(null); setDishName(''); setIsCopied(false);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20"><X className="w-8 h-8" /></Button>
                </div>
                {isScanning && (
                  <div className="absolute inset-0 bg-red-600/30 backdrop-blur-md flex flex-col items-center justify-center animate-pulse text-white font-black text-2xl uppercase italic tracking-widest">Scanning...</div>
                )}
                {dishName && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 animate-in slide-in-from-top-4 shadow-2xl text-left">
                    <p className="text-[11px] text-red-400 font-black uppercase mb-4 tracking-[0.3em]"><Zap className="w-4 h-4 inline mr-2" /> Identification Success</p>
                    <p className="text-3xl font-black tracking-tighter mb-6 text-white uppercase italic">{dishName}</p>
                    <div className="p-6 bg-green-500/20 border-2 border-green-500/40 rounded-3xl animate-pulse">
                      <p className="text-xl font-black leading-tight text-white">鑑定文はコピー済みです。右下のAIボタンをクリックし、写真を添付して貼り付けるだけで最高のレシピが届きます！</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-10 animate-in fade-in">
                <div className="h-40 w-40 bg-red-500/5 rounded-full flex items-center justify-center mx-auto border border-red-500/10 relative"><Search className="w-20 h-20 text-red-500/20" /><div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-ping" /></div>
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-red-600 hover:bg-red-500 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-xl active:scale-95 transition-all italic tracking-tighter uppercase">Fridge Scan</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 h-16 px-10 rounded-2xl font-black uppercase tracking-widest">Import Image</Button>
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
            <div className="flex-1 space-y-12">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] border-2 border-red-100 shadow-sm transition-all hover:shadow-md">
                <div className="h-10 w-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><HelpCircle className="w-6 h-6 text-white" /></div>
                <div className="space-y-1">
                  <p className="text-sm text-red-900 font-black tracking-tight leading-snug">写真を保存してAIボタンを押すだけ！</p>
                  <p className="text-[12px] text-red-700 font-bold opacity-70 leading-relaxed tracking-tight">鑑定文は自動でコピーされます。あとはAIに「写真」を渡して「貼り付け」るだけ。</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner space-y-4 text-left">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Plant/Ingredient Context</label>
                <input className="bg-transparent border-none p-0 font-black text-2xl text-slate-900 w-full focus:ring-0 tracking-tighter" placeholder="対象の名称（例：残り野菜）" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
                <div className="h-px bg-slate-200 w-full" />
                <Textarea className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full min-h-[100px] resize-none focus:ring-0 leading-relaxed placeholder:text-slate-300" placeholder="今の困りごとを入力..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>

              <section className="space-y-6 pt-8 border-t border-slate-100 text-center">
                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Launch Analysis</p>
                  <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleAutoCopyAndGo('https://gemini.google.com/')} disabled={!image || isScanning} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-4 text-3xl font-black italic tracking-tighter uppercase z-10"><Sparkles className="w-8 h-8 text-amber-300" /> Geminiで鑑定</div>
                      <span className="text-[11px] text-blue-100 font-black uppercase z-10">画像解析・Google検索に最適</span>
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleAutoCopyAndGo('https://chatgpt.com/')} disabled={!image || isScanning} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Bot className="w-6 h-6 text-white" /> ChatGPT</Button>
                      <Button onClick={() => handleAutoCopyAndGo('https://claude.ai/')} disabled={!image || isScanning} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Heart className="w-6 h-6 fill-white" /> Claude</Button>
                    </div>
                  </div>
                </div>

                {/* YouTubeセクション: 解析が完了し、料理名が決まっている時だけ表示 */}
                {dishName && dishName !== "絶品料理" && (
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
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-16 h-16 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8">
                     <div className="flex items-center gap-3 text-red-700 font-black italic text-2xl uppercase tracking-tighter">鑑定アプリでの操作</div>
                     <p className="text-red-600 font-black text-xs tracking-widest uppercase opacity-70">鑑定文はすでにコピー済みです！</p>
                   </div>
                   <div className="space-y-5 text-[15px] text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 text-left"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">1</span><span>入力欄の <span className="bg-red-200 px-2 py-0.5 rounded-lg text-red-600">「＋」</span> をタップ</span></p>
                     <p className="flex items-start gap-4 text-left"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">2</span><span>保存した <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">現場写真</span> を選択</span></p>
                     <p className="flex items-start gap-4 text-left"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">3</span><span>そのまま <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">「貼り付け」</span> して送信！</span></p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] font-sans">
              <span>NextraLabs Context Mastery</span>
              <span>Final Release v3.5</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
