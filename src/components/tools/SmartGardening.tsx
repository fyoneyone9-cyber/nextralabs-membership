'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, ExternalLink, Bot } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  
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
      setImage(canvas.toDataURL('image/jpeg', 0.7));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsCameraActive(false);
  };

  const generateAIPrompt = () => {
    if (!image) return toast.error("写真を撮ってください");
    
    // 魔法のプロンプトを構築
    const magicPrompt = `
以下の指示に従って、添付した植物の写真を診断してください。

【前提情報】
・地域: ${locationName}
・悩み: ${prompt || "特にありません"}

【指示】
1. 写真を見て、この植物の名前と現在の健康状態を特定してください。
2. Google検索などで「${locationName}」の今日の最高気温と天気を踏まえ、水やりの要否を判断してください。
3. 今すぐ水をやるべきか、夕方まで待つべきか、あるいは不要か、具体的な理由と共にアドバイスしてください。
4. プロのガーデナーとして、初心者にもわかりやすく丁寧に回答してください。
`;
    setGeneratedPrompt(magicPrompt);
    navigator.clipboard.writeText(magicPrompt);
    toast.success("AI用プロンプトをコピーしました！");
  };

  const openExternalAI = (url: string) => {
    if (!generatedPrompt) generateAIPrompt();
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          
          {/* 左半分：カメラ */}
          <div className="lg:w-1/2 bg-black relative flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8">
                  <Button onClick={takePhoto} className="h-20 w-20 rounded-full bg-white border-4 border-green-500 shadow-2xl" />
                  <Button onClick={stopCamera} variant="ghost" className="text-white h-16 w-16 rounded-full"><X className="w-8 h-8" /></Button>
                </div>
              </>
            ) : image ? (
              <div className="w-full h-full relative">
                <img src={image} className="w-full h-full object-cover" />
                <Button onClick={() => setImage(null)} className="absolute top-6 right-6 h-12 w-12 bg-black/50 text-white rounded-full"><X /></Button>
              </div>
            ) : (
              <div className="text-center p-10">
                <Camera className="w-24 h-24 text-white/10 mx-auto mb-6" />
                <div className="flex flex-col gap-4">
                  <Button onClick={startCamera} className="bg-green-600 hover:bg-green-500 text-white h-16 px-10 rounded-2xl font-black text-xl shadow-2xl">
                    カメラを起動
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-16 px-10 rounded-2xl font-black text-xl">
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

          {/* 右側：操作 */}
          <div className="lg:w-1/2 p-10 flex flex-col bg-slate-50 border-l border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-600 rounded-2xl">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI水やり守護神</h1>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Prompt Hybrid Edition</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-black">
                  <MapPin className="w-4 h-4 text-blue-500" /> 地域設定
                </div>
                <input 
                  className="w-full bg-slate-50 border-none rounded-lg p-2 font-bold text-blue-900"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-black text-slate-800">植物の状況</label>
                <Textarea 
                  className="bg-white border-2 border-slate-100 text-slate-900 min-h-[120px] rounded-2xl p-4 font-bold"
                  placeholder="例：葉が黄色くなっています。"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider text-center">Step 1: プロンプトをコピー</h3>
                <Button 
                  onClick={generateAIPrompt} 
                  disabled={!image}
                  className="w-full bg-green-600 hover:bg-green-700 h-20 text-xl font-black rounded-2xl shadow-xl shadow-green-600/20"
                >
                  <Copy className="mr-2" /> 魔法のプロンプトをコピー
                </Button>

                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider text-center pt-4">Step 2: AIアプリを開いて貼り付け</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 font-bold rounded-xl bg-white border-slate-200 text-slate-700" onClick={() => openExternalAI('https://chatgpt.com/')}>
                    <ExternalLink className="mr-2 w-4 h-4" /> ChatGPT
                  </Button>
                  <Button variant="outline" className="h-14 font-bold rounded-xl bg-white border-slate-200 text-slate-700" onClick={() => openExternalAI('https://gemini.google.com/')}>
                    <ExternalLink className="mr-2 w-4 h-4" /> Gemini
                  </Button>
                </div>
              </div>

              {generatedPrompt && (
                <div className="mt-6 p-6 bg-green-50 rounded-2xl border-2 border-green-100 animate-in fade-in">
                  <p className="text-xs font-black text-green-700 uppercase mb-2">コピーされた内容</p>
                  <p className="text-sm text-green-900 font-bold italic line-clamp-3">{generatedPrompt}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] font-black text-slate-300 tracking-widest">
              <span>NEXTRALABS PROMPT ENGINE</span>
              <span>ZERO COST MODE ACTIVE</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
