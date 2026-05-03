'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, CloudSun, Camera, Loader2, CheckCircle2, RefreshCw, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 位置情報の取得
  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("お使いのブラウザは位置情報をサポートしていません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("位置情報を取得しました。天気に反映します。");
      },
      () => toast.error("位置情報の取得に失敗しました。デフォルト設定で診断します。")
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 画像のリサイズ（Vercelのペイロード制限対策）
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setImage(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("写真を撮影または選択してください");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, location }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast.success("AI診断が完了しました！");
    } catch (error: any) {
      toast.error("診断エラー: 写真を小さくして再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-green-600 bg-white shadow-2xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <Droplets className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black">AI水やり守護神 PRO</CardTitle>
              <CardDescription className="text-green-50 text-lg opacity-90 font-medium font-sans">視覚解析 × 位置情報天気連動システム</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div 
              className="aspect-square border-4 border-dashed border-green-100 rounded-[2.5rem] flex flex-col items-center justify-center bg-green-50/30 cursor-pointer hover:bg-green-50 transition-all overflow-hidden relative shadow-inner"
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Plant" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8 space-y-6">
                  <Camera className="w-16 h-16 text-green-200 mx-auto" />
                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 font-bold" onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}>カメラ撮影</Button>
                    <Button variant="outline" className="w-full bg-white border-green-200 text-green-700 font-bold" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>ファイル選択</Button>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <p className="font-black text-blue-950">位置情報連携</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs bg-white border-blue-200" onClick={requestLocation}>取得する</Button>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {location ? `現在地を取得済み (Lat: ${location.lat.toFixed(2)})` : "位置情報を許可すると、その場所の最新天気をAIが自動で確認します。"}
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-black text-slate-800">植物の悩み</label>
                <Textarea 
                  placeholder="例：葉に元気がない気がします。"
                  className="bg-slate-50 border-slate-200 min-h-[120px] rounded-2xl p-5"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-20 text-2xl font-black rounded-2xl shadow-xl shadow-green-600/20"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : "診断を開始する"}
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-8 p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 shadow-sm">
              <h3 className="text-2xl font-black text-green-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" /> AIガーデナーの回答
              </h3>
              <div className="text-green-950 whitespace-pre-wrap leading-relaxed font-semibold text-lg">{result.advice}</div>
              <div className="mt-8 pt-4 border-t border-green-200 flex justify-between items-center text-[10px] text-green-600/40 font-bold uppercase">
                <span>Location Tracking Active</span>
                <span>Powered by Gemini 1.5 Pro</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
