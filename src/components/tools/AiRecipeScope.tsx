'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, Search, Zap, Loader2, Download, HelpCircle, Youtube, Utensils, Play } from "lucide-react";
import { toast } from "sonner";

export default function AiRecipeScope() {
  const [image, setImage] = useState<string | null>(null);
  const [dishName, setDishName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
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
      const canvas = canvasRef.current;
      const video = videoRef.current;
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

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `fridge-scan-${Date.now()}.jpg`;
    link.click();
    toast.success("写真を保存しました");
  };

  const handleCopyAndGo = () => {
    const magicPrompt = `
あなたは世界中の食材を知り尽くした天才シェフです。
添付された写真（冷蔵庫の残り物）から、最高に美味しい「${dishName || "絶品料理"}」のレシピを提案してください。

【実行指示】
1. 写真を精査し、写っている食材をすべてリストアップしてください。
2. Google検索で今の季節のトレンドレシピや、余り物で作れる時短テクを考慮してください。
3. 材料、分量、失敗しないためのプロのコツをステップバイステップで詳しく教えてください。
4. 最後に、この料理が完成した時のワクワクするような一言を添えてください。

※重要：画像をまず最初に解析すること。
`;
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("レシピ鑑定文をコピーしました！");
    setTimeout(() => {
      window.open('https://gemini.google.com/', '_blank');
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 antialiased text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* 左：スキャンセクション */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center min-h-[500px] overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-8 z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-2xl shadow-lg"><Zap className="w-8 h-8 text-white" /></div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">AI RECIPE SCOPE</h1>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 z-20">
                  <Button onClick={takePhoto} className="h-20 w-20 rounded-full bg-white border-8 border-red-500/20 active:scale-90 transition-all shadow-2xl" />
                  <Button onClick={stopCamera} variant="ghost" className="text-white h-16 w-16 rounded-full"><X className="w-8 h-8" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute top-8 right-8 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce">1. 写真を保存（必須）</Button>
                  <Button onClick={() => {setImage(null); setDishName(''); setIsCopied(false);}} className="h-14 w-14 bg-black/50 text-white rounded-full hover:bg-red-500 border-2 border-white/20"><X /></Button>
                </div>
                {isScanning && (
                  <div className="absolute inset-0 bg-red-600/20 backdrop-blur-md flex flex-col items-center justify-center">
                    <RefreshCw className="w-16 h-16 text-white animate-spin mb-4" />
                    <p className="text-white font-black tracking-widest text-xl uppercase italic">Scanning Ingredients...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-8">
                <div className="h-32 w-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20"><Camera className="w-12 h-12 text-red-500/40" /></div>
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-red-600 hover:bg-red-700 text-white h-20 px-12 rounded-3xl font-black text-2xl shadow-2xl active:scale-95 transition-all italic tracking-tighter">冷蔵庫をスキャン</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white h-16 px-10 rounded-2xl font-black">画像を選択</Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { const r = new FileReader(); r.onload = (ev) => setImage(ev.target?.result as string); r.readAsDataURL(f); }
                  }} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* 右：操作・動画セクション */}
          <div className="lg:w-2/5 p-10 flex flex-col bg-white overflow-y-auto border-l border-slate-100">
            <div className="flex-1 space-y-10">
              
              <section className="space-y-6">
                <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Identification</label>
                  <div className="flex items-center gap-3">
                     <Sparkles className="text-red-500 w-6 h-6" />
                     <p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">{dishName || "食材を分析中..."}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleCopyAndGo} 
                  disabled={!image || isScanning} 
                  className="h-28 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase relative z-10"><Sparkles className="w-8 h-8 text-amber-300 shadow-sm" /> 2. Geminiで鑑定</div>
                  <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest relative z-10">写真を添付して貼り付けるだけ！</span>
                </Button>
              </section>

              {isCopied && (
                <div className="p-8 bg-red-50 rounded-[2.5rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-4 shadow-xl">
                   <div className="flex items-center gap-3 text-red-700 mb-4 font-black italic text-xl uppercase tracking-tight"><AlertCircle className="w-6 h-6" />貼り付け手順</div>
                   <div className="space-y-3 text-[14px] text-red-950 font-black leading-tight">
                     <p>1. 入力欄の <span className="bg-red-200 px-1.5 rounded text-red-600">「＋」</span> をタップ</p>
                     <p>2. 保存した <span className="underline decoration-red-500 decoration-2">冷蔵庫の写真</span> を選択</p>
                     <p>3. 入力欄にプロンプトを <span className="underline decoration-red-500 decoration-2">貼り付けて</span> 送信！</p>
                   </div>
                </div>
              )}

              {/* YouTubeセクション */}
              {dishName && (
                <section className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-xl"><Youtube className="text-red-600 w-6 h-6" /></div>
                      <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">Cooking Video</h3>
                    </div>
                    <Button variant="ghost" className="text-blue-600 font-black text-xs" onClick={() => window.open(`https://www.youtube.com/results?search_query=${dishName}+作り方`, '_blank')}>すべて見る</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-slate-950 border-none rounded-3xl overflow-hidden shadow-xl group cursor-pointer" onClick={() => window.open(`https://www.youtube.com/results?search_query=${dishName}+作り方`, '_blank')}>
                      <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/50 group-hover:scale-125 transition-all" />
                        <div className="absolute bottom-4 left-4 right-4"><p className="text-white font-black text-sm line-clamp-1">{dishName}のプロ級レシピを検索しました</p></div>
                      </div>
                    </Card>
                  </div>
                </section>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              <span>NextraLabs Chef System</span>
              <span>Final Release v2.0</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
