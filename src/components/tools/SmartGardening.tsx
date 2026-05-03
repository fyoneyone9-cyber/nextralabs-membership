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
        body: JSON.stringify({ prompt, image }),
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
      <Card className="border-green-800 bg-slate-900 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-green-500" />
            <div>
              <CardTitle className="text-2xl font-bold">AI水やり守護神</CardTitle>
              <CardDescription className="text-slate-400">植物の写真と天気から、水やりの最適解を導き出します</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="aspect-square border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-black cursor-pointer hover:border-green-500 transition-all overflow-hidden"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              {image ? (
                <img src={image} alt="Plant" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">写真をアップロード</p>
                </div>
              )}
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black rounded-xl border border-slate-800 flex items-center gap-3">
                <CloudSun className="w-6 h-6 text-orange-400" />
                <div className="text-sm">
                  <p className="text-slate-500">外部データ連携済み</p>
                  <p className="font-bold">Google天気情報を取得中</p>
                </div>
              </div>
              <Textarea 
                placeholder="植物の種類や、気になっている症状があれば入力してください..."
                className="bg-black border-slate-800 min-h-[120px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Droplets className="w-5 h-5 mr-2" />}
                診断を開始する
              </Button>
            </div>
          </div>

          {result && (
            <div className="p-6 bg-black rounded-xl border border-green-900 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-green-500">AIガーデナーの回答</h3>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
