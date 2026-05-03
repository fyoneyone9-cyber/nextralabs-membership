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
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
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
      // 本来はここでGoogle天気RSS等から取得
      const mockWeather = { temp: "24°C", condition: "晴れのち雨", rainProbability: "60%" };

      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, weatherData: mockWeather }),
      });

      const data = await response.json();
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
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-green-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-green-900">AI水やり守護神</CardTitle>
              <CardDescription>写真と天気から、最適な水やりタイミングを判定します</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div 
                className="aspect-square border-2 border-dashed border-green-300 rounded-xl flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-green-50 transition-colors overflow-hidden"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {image ? (
                  <img src={image} alt="Plant" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-green-400 mb-2" />
                    <p className="text-sm text-green-600">植物の写真を撮る / アップ</p>
                  </>
                )}
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-green-100 flex items-center gap-3">
                <CloudSun className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">現在の予報</p>
                  <p className="text-sm font-bold">24°C / 降水確率 60%</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">気になる症状（任意）</label>
                <Textarea 
                  placeholder="例：最近、葉の先が茶色くなってきた..."
                  className="bg-white border-green-200"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-xl shadow-lg"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Droplets className="w-5 h-5 mr-2" />}
                水やりが必要か聞く
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-green-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-green-900">AIガーデナーの診断結果</h3>
              </div>
              <div className="prose prose-green max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {result.response}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                <span>Model: {result.model}</span>
                {result.cached && <span className="text-green-500 font-bold">● Cache Hit (Cost: $0)</span>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
