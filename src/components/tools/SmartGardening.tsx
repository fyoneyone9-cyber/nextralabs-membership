'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, Loader2, CheckCircle2, MapPin, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('海老名市'); // デフォルト設定
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("位置情報をサポートしていません");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.province || "取得地域";
        setLocationName(city);
        toast.success(`${city}の天気を取得しました`);
      } catch {
        setLocationName("現在地周辺");
      }
    });
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500; // 通信エラーを防ぐため小さくリサイズ
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // 重要: ヘッダーを除去した純粋なBase64のみにする
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImage(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("写真を選択してください");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      // 500エラー対策: 確実に届くようタイムアウトを長くし、エラーをキャッチ
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, location: locationName }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "サーバーエラーが発生しました");
      
      setResult(data);
      toast.success("AI診断が完了しました");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "解析に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-green-600 bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-green-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Droplets className="w-10 h-10" />
            <div>
              <CardTitle className="text-2xl font-bold">AI水やり守護神</CardTitle>
              <CardDescription className="text-green-50">【正式版】カメラ解析 × 地域天気連動システム</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 写真エリア */}
            <div className="space-y-4">
              <div 
                className="aspect-square border-4 border-dashed border-green-100 rounded-3xl bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner"
              >
                {image ? (
                  <img src={image} alt="Plant" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Camera className="w-20 h-20 text-green-100 mx-auto mb-2" />
                    <p className="text-slate-400 font-bold">写真を撮るか選んでください</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-green-600 hover:bg-green-700 h-12 font-black" onClick={() => cameraInputRef.current?.click()}>
                  <Camera className="mr-2 w-5 h-5" /> カメラ起動
                </Button>
                <Button variant="outline" className="border-green-200 text-green-700 h-12 font-black bg-white" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 w-5 h-5" /> 写真を選択
                </Button>
              </div>
              {/* 隠しインプット: これで確実に起動させる */}
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
            </div>

            {/* 診断エリア */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl relative">
                <MapPin className="absolute top-4 right-4 w-5 h-5 text-blue-400" />
                <p className="text-blue-800 font-black text-sm mb-1 uppercase tracking-wider">Target Weather</p>
                <div className="text-2xl font-black text-blue-900 flex items-baseline gap-2">
                  {locationName}
                  <button onClick={requestLocation} className="text-xs font-normal text-blue-500 hover:underline">（更新）</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700">植物の悩みや相談（黒文字）</label>
                <Textarea 
                  className="bg-slate-50 border-2 border-slate-100 text-slate-900 min-h-[140px] rounded-2xl text-lg p-5 font-bold focus:border-green-500 transition-colors"
                  placeholder="例：葉が萎れて元気がない..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-20 text-2xl font-black rounded-2xl shadow-xl shadow-green-600/20 active:scale-95 transition-all"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>解析中...</span>
                  </div>
                ) : "診断を開始する"}
              </Button>
            </div>
          </div>

          {/* 出力UIを強化: スクロールで見逃さないように独立させる */}
          {result && (
            <div className="mt-10 p-8 bg-green-50 rounded-[2.5rem] border-4 border-green-200 animate-in fade-in zoom-in-95 duration-500 shadow-inner">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500 rounded-full shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-green-900 italic">Gardener's Report</h3>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100">
                <div className="text-slate-900 whitespace-pre-wrap leading-relaxed font-bold text-xl font-sans">
                  {result.advice}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center text-[10px] font-black text-green-700/30 tracking-widest">
                <span>NEXTRALABS GUARDIAN ENGINE ACTIVE</span>
                <span>AI: {result.model}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
