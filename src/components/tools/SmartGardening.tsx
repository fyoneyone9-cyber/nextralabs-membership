'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, CloudSun, Camera, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SmartGardening() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
      toast.error("植物の写真を撮影、またはアップロードしてください");
      return;
    }
    setLoading(true);
    setResult(null); // 前回の結果をクリア
    try {
      const response = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
      toast.success("AIによる診断が完了しました！");
    } catch (error: any) {
      toast.error(error.message || "通信エラーが発生しました");
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
              <CardTitle className="text-3xl font-black tracking-tight">AI水やり守護神</CardTitle>
              <CardDescription className="text-green-50 text-lg opacity-90 font-medium">植物の状態を視覚的に解析し、リアルタイム天気と連動</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 写真アップロード・プレビューエリア */}
            <div 
              className="aspect-square border-4 border-dashed border-green-100 rounded-[2.5rem] flex flex-col items-center justify-center bg-green-50/30 cursor-pointer hover:bg-green-50 transition-all overflow-hidden relative group shadow-inner"
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <>
                  <img src={image} alt="Plant" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-xl">
                      写真を変更する
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Camera className="w-12 h-12 text-green-300" />
                  </div>
                  <p className="text-xl font-black text-green-900">植物を撮る / 選ぶ</p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold h-12"
                      onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                    >
                      カメラを起動
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-green-200 text-green-700 rounded-xl font-bold h-12 bg-white"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      ライブラリから選択
                    </Button>
                  </div>
                </div>
              )}
              {/* Hidden Inputs */}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />
            </div>

            {/* 入力・ステータスエリア */}
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex items-center gap-5 shadow-sm">
                <div className="p-3 bg-amber-100 rounded-2xl">
                  <CloudSun className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-amber-700 font-black uppercase tracking-widest">Real-time Weather</p>
                  <p className="text-xl font-black text-amber-950">Googleの最新天気を取得中...</p>
                  <p className="text-xs text-amber-600/70 mt-1">※AIが現在地の予報をリアルタイム参照します</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-black text-slate-800 flex items-center gap-2">
                  植物への相談 <span className="text-xs font-normal text-slate-400 font-sans">（任意）</span>
                </label>
                <Textarea 
                  placeholder="例：葉先が茶色くなってきた気がします。最近の暑さで水やりを増やすべきですか？"
                  className="bg-slate-50 border-slate-200 min-h-[140px] rounded-[1.5rem] focus:ring-4 focus:ring-green-500/20 text-lg p-5 transition-all shadow-sm"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-20 text-2xl font-black rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span>AIが解析中...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Droplets className="w-8 h-8" />
                    <span>診断を開始する</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* 結果表示エリア */}
          {result && (
            <div className="mt-8 p-8 bg-green-50/50 rounded-[2.5rem] border-2 border-green-100 animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CheckCircle2 className="w-24 h-24 text-green-600" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-500 rounded-2xl shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-green-900">AIガーデナーの診断結果</h3>
              </div>
              <div className="prose prose-green max-w-none prose-lg">
                <div className="text-green-950 whitespace-pre-wrap leading-relaxed font-semibold">
                  {result.advice}
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-green-200 flex justify-between items-center text-xs font-black text-green-600/40 tracking-tighter">
                <span>SYSTEM: NEXTRALABS GUARDIAN ENGINE</span>
                <span className="uppercase">AI MODEL: {result.model}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-center text-slate-400 text-sm font-medium">© 2026 NextraLabs - Empowering Nature with AI</p>
    </div>
  );
}
