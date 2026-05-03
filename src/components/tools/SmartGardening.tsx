'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, Loader2, CheckCircle2, MapPin, Upload, X, Bot } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt'>('gemini');
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1920 } } });
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

  const handleAnalyze = async () => {
    if (!image) return toast.error("写真を撮ってください");
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, location: locationName, modelType: selectedModel }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
      toast.success("AI診断が完了しました");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          
          {/* 左半分：カメラ・写真（全画面級） */}
          <div className="lg:w-3/5 bg-black relative flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white flex items-center justify-center group active:scale-90 transition-all">
                    <div className="h-16 w-16 bg-white rounded-full group-hover:bg-red-50" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-8 h-8" /></Button>
                </div>
              </>
            ) : image ? (
              <div className="w-full h-full relative">
                <img src={image} className="w-full h-full object-cover" />
                <Button onClick={() => setImage(null)} className="absolute top-10 right-10 h-14 w-14 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-red-500"><X /></Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="h-32 w-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Camera className="w-16 h-16 text-white/20" />
                </div>
                <h2 className="text-white text-3xl font-black italic tracking-tighter">PREPARE CAMERA</h2>
                <div className="flex gap-4 justify-center">
                  <Button onClick={startCamera} className="bg-green-600 hover:bg-green-500 text-white h-16 px-8 rounded-2xl font-black text-xl shadow-2xl">
                    カメラを起動
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/20 text-white hover:bg-white/5 h-16 px-8 rounded-2xl font-black text-xl">
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

          {/* 右側：操作・結果エリア */}
          <div className="lg:w-2/5 p-10 flex flex-col bg-slate-50 border-l border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-600 rounded-2xl shadow-xl shadow-green-600/20">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI水やり守護神</h1>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Version 2.0 Professional</p>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              {/* モデル選択 */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex gap-2">
                <Button 
                  onClick={() => setSelectedModel('gemini')}
                  className={`flex-1 rounded-xl font-bold h-12 transition-all ${selectedModel === 'gemini' ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  <Bot className="mr-2 w-4 h-4" /> Gemini 1.5 Pro
                </Button>
                <Button 
                  onClick={() => setSelectedModel('gpt')}
                  disabled
                  className={`flex-1 rounded-xl font-bold h-12 transition-all ${selectedModel === 'gpt' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 opacity-50'}`}
                >
                  GPT-4o (近日対応)
                </Button>
              </div>

              <div className="space-y-4">
                <label className="font-black text-slate-800 flex items-center justify-between">
                  植物の悩み・相談
                  <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full uppercase">Optional</span>
                </label>
                <Textarea 
                  className="bg-white border-2 border-slate-100 text-slate-900 min-h-[160px] rounded-3xl p-6 font-bold text-lg focus:border-green-600 transition-all shadow-sm"
                  placeholder="例：葉先が茶色くなってきました。"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !image}
                className="w-full bg-green-600 hover:bg-green-500 h-24 text-3xl font-black rounded-[2rem] shadow-2xl shadow-green-600/30 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : "診断を開始する"}
              </Button>

              {/* 結果エリア */}
              <div className="mt-8 p-8 bg-white rounded-[2.5rem] border-2 border-green-100 shadow-xl min-h-[200px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className={`w-8 h-8 ${result ? 'text-green-500' : 'text-slate-200'}`} />
                  <h3 className="text-2xl font-black text-slate-900">診断レポート</h3>
                </div>
                
                <div className="flex-1">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
                      <RefreshCw className="w-12 h-12 text-green-500 animate-spin" />
                      <p className="text-slate-400 font-bold animate-pulse">AIが写真を解析して天気を調べています...</p>
                    </div>
                  ) : result ? (
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed font-bold text-lg animate-in fade-in">
                      {result.advice}
                    </div>
                  ) : (
                    <div className="text-slate-300 text-center py-10 font-bold">
                      カメラを起動して植物を撮影し、診断を開始してください。
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-black uppercase tracking-tighter">{locationName}</span>
              </div>
              <span className="text-[10px] font-black text-slate-300 tracking-widest">NEXTRALABS AI ENGINE</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
