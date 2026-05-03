'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Camera, Loader2, CheckCircle2, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 位置情報の取得と地域名の特定
  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("位置情報をサポートしていません");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lng: longitude });
      
      // 緯度経度からおおまかな地域名を取得（逆ジオコーディング）
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setLocationName(data.address.city || data.address.province || "取得した地域");
        toast.success(`${locationName || '現在地'}の天気を連携します`);
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
        const scale = Math.min(600 / img.width, 600 / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/jpeg', 0.6)); // 軽量化して送信
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("写真を選んでください");
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
      if (!response.ok) throw new Error(data.error || "サーバーエラー");
      setResult(data);
      toast.success("AIの回答が届きました");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-green-600 bg-white shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-green-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Droplets className="w-10 h-10" />
            <div>
              <CardTitle className="text-2xl font-bold">AI水やり守護神</CardTitle>
              <CardDescription className="text-green-50 font-sans">カメラ撮影 × リアルタイム天気解析</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 写真エリア */}
            <div className="space-y-4">
              <div 
                className="aspect-square border-4 border-dashed border-green-100 rounded-3xl bg-green-50/50 flex items-center justify-center overflow-hidden relative"
              >
                {image ? (
                  <img src={image} alt="Plant" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-20 h-20 text-green-200" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-green-600 hover:bg-green-700 font-bold" onClick={() => cameraInputRef.current?.click()}>
                  <Camera className="mr-2 w-4 h-4" /> カメラ起動
                </Button>
                <Button variant="outline" className="border-green-200 text-green-700 font-bold" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 w-4 h-4" /> 写真を選択
                </Button>
              </div>
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
            </div>

            {/* 情報エリア */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                    <MapPin className="w-4 h-4" /> 地域の天気連携
                  </div>
                  <Button size="sm" variant="link" className="text-blue-600 h-auto p-0" onClick={requestLocation}>取得</Button>
                </div>
                <div className="bg-white p-2 rounded border border-blue-100 text-blue-900 font-black text-center">
                  {locationName ? locationName : "未取得（全国の天気で判断）"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">植物の悩み（黒文字で入力されます）</label>
                <Textarea 
                  className="bg-slate-50 border-slate-200 text-black min-h-[120px] rounded-xl text-lg p-4"
                  placeholder="例：葉が萎れてきました。"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-16 text-xl font-black rounded-2xl shadow-lg"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "診断を開始する"}
              </Button>
            </div>
          </div>

          {/* 結果表示 */}
          {result && (
            <div className="mt-6 p-8 bg-green-50 rounded-3xl border-2 border-green-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4 text-green-800">
                <CheckCircle2 className="w-8 h-8" />
                <h3 className="text-2xl font-black">AIガーデナーの回答</h3>
              </div>
              <div className="text-slate-900 whitespace-pre-wrap leading-relaxed font-medium text-lg">
                {result.advice}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
