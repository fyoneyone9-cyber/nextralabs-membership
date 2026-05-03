'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, Loader2, CheckCircle2, MapPin, Upload, X, Scissors } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('海老名市');
  
  // カメラ制御用
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // カメラを起動する
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("カメラの起動に失敗しました。ファイル選択をお使いください。");
      setIsCameraActive(false);
    }
  };

  // シャッターを切る
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 送信用にリサイズ
      const resizedCanvas = document.createElement('canvas');
      const MAX_SIZE = 600;
      let w = canvas.width;
      let h = canvas.height;
      if (w > h) { h *= MAX_SIZE / w; w = MAX_SIZE; } else { w *= MAX_SIZE / h; h = MAX_SIZE; }
      resizedCanvas.width = w;
      resizedCanvas.height = h;
      resizedCanvas.getContext('2d')?.drawImage(canvas, 0, 0, w, h);
      
      setImage(resizedCanvas.toDataURL('image/jpeg', 0.8));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("写真が必要です");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, location: locationName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
      toast.success("AI診断が完了しました");
      
      // 結果表示までスクロール
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      toast.error(error.message || "解析エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card className="border-green-600 bg-white shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-green-600 text-white p-8">
          <div className="flex items-center gap-4">
            <Droplets className="w-12 h-12" />
            <div>
              <CardTitle className="text-3xl font-black">AI水やり守護神 PRO</CardTitle>
              <CardDescription className="text-green-50 text-lg">カメラ解析 ＋ リアルタイム天気 ＝ 植物の命を守る</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 左側：入力・カメラ */}
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner">
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                      <Button onClick={takePhoto} className="bg-white text-black h-16 w-16 rounded-full border-4 border-green-500 hover:bg-slate-100 shadow-2xl">
                        <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
                      </Button>
                      <Button onClick={stopCamera} variant="destructive" size="icon" className="h-12 w-12 rounded-full"><X /></Button>
                    </div>
                  </div>
                ) : image ? (
                  <div className="relative w-full h-full">
                    <img src={image} className="w-full h-full object-cover" />
                    <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 text-white rounded-full h-10 w-10"><X /></Button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                    <Camera className="w-20 h-20 text-slate-700" />
                    <p className="text-slate-500 font-bold">カメラで撮影してください</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-4">
                <Button onClick={startCamera} className="flex-1 bg-green-600 hover:bg-green-700 h-14 text-lg font-black rounded-2xl shadow-lg">
                  <Camera className="mr-2" /> カメラを起動
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 border-2 border-green-200 text-green-700 h-14 text-lg font-black rounded-2xl">
                  <Upload className="mr-2" /> 写真を選択
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" />
                    <span className="font-black text-blue-900">{locationName}の天気を参照中</span>
                  </div>
                </div>
                <Textarea 
                  className="min-h-[120px] rounded-2xl border-2 border-slate-100 bg-slate-50 text-black text-lg p-5 font-bold focus:ring-4 focus:ring-green-500/10"
                  placeholder="植物の現在の悩み（葉の色など）があれば入力してください..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button onClick={handleAnalyze} disabled={loading || !image} className="w-full bg-green-600 hover:bg-green-700 h-20 text-2xl font-black rounded-2xl shadow-xl shadow-green-600/20">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : "診断を開始する"}
                </Button>
              </div>
            </div>

            {/* 右側：出力エリア（あらかじめ配置） */}
            <div className="space-y-4">
              <div className="h-full min-h-[400px] border-4 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-100">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">AI Gardener Report</h3>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {result ? (
                    <div className="text-slate-900 text-xl font-bold leading-relaxed whitespace-pre-wrap animate-in fade-in duration-500">
                      {result.advice}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                      <Loader2 className={`w-12 h-12 ${loading ? 'animate-spin text-green-500' : ''}`} />
                      <p className="font-black">{loading ? 'AIが写真を精査しています...' : '診断結果がここに表示されます'}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400">
                  <span>NEXTRALABS GUARDIAN ENGINE v1.2</span>
                  <span>AI: {result?.model || 'READY'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
