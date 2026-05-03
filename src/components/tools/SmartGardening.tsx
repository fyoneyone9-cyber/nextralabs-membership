'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, CloudSun, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("植物の写真をアップロードしてください");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, weatherData: { condition: "Sunny", temp: "22°C" } }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast.success("診断が完了しました！");
    } catch (error) {
      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-green-600 bg-white shadow-xl">
        <CardHeader className="bg-green-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">AI水やり守護神</CardTitle>
              <CardDescription className="text-green-100">カメラで植物の状態を読み取り、最適な水やりを判定します</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="aspect-square border-4 border-dashed border-green-100 rounded-3xl flex flex-col items-center justify-center bg-green-50/50 cursor-pointer hover:bg-green-50 transition-all overflow-hidden relative group"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              {image ? (
                <>
                  <img src={image} alt="Plant" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-12 h-12 text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-16 h-16 text-green-200 mx-auto mb-4" />
                  <p className="text-lg font-bold text-green-800">植物の写真を撮影・アップ</p>
                  <p className="text-sm text-green-600 mt-2">カメラアイコンをタップしてください</p>
                </div>
              )}
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
                <CloudSun className="w-10 h-10 text-orange-500" />
                <div>
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Weather Insight</p>
                  <p className="text-lg font-black text-orange-950">晴れ / 22°C (水分の蒸発に注意)</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">植物への悩み (任意)</label>
                <Textarea 
                  placeholder="例：葉っぱが少し黄色くなってきました。元気がありません。"
                  className="bg-slate-50 border-slate-200 min-h-[120px] rounded-xl focus:ring-green-500"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-16 text-xl font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Droplets className="w-6 h-6 mr-2" />}
                診断を開始する
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-6 p-8 bg-green-50 rounded-3xl border-2 border-green-100 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-green-900">AIアドバイス</h3>
              </div>
              <div className="prose prose-green max-w-none">
                <p className="text-lg text-green-950 whitespace-pre-wrap leading-relaxed font-medium">
                  {result.advice}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-green-200 flex justify-between items-center text-[10px] text-green-600/50 font-bold">
                <span>GUARDIAN ENGINE ACTIVE</span>
                <span>MODEL: {result.model}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
