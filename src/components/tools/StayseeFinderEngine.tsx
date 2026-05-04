'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Loader2, Mail, CheckCircle2, AlertCircle, Building2, PackageSearch } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

export default function StayseeFinderEngine() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [debugData, setDebugData] = useState<any>(null)

  // 画像圧縮 (413エラー対策 - 維持)
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = base64Str
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width; let height = img.height
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
        else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target?.result as string
        const compressed = await compressImage(base64)
        setImage(compressed)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDebugData(null);

    try {
      const response = await fetch("/api/analyze-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      setDebugData(data); // デバッグ用

      if (!response.ok) {
        throw new Error(data.message || data.error || "解析失敗");
      }
      
      setAnalysisResult({
        ...data,
        suggestedGuests: [
          { name: "ヨネヤマ フミタカ 様", room: "302", date: "2026/05/03" }
        ]
      });
    } catch (error: any) {
      console.error(error);
      alert(`エラー: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 min-h-screen text-slate-200">
      
      <Card className="border-0 shadow-2xl overflow-hidden bg-[#1a1b23] rounded-[3rem]">
        <CardHeader className="bg-blue-600 p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-3xl">
              <PackageSearch className="h-10 w-10" />
            </div>
            <div>
              <CardTitle className="text-4xl font-black tracking-tight">Staysee AI Finder</CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-2 font-medium">拾得物を撮影して持ち主を特定</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-10">
          {!image ? (
            <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 transition-all cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleFileUpload}
                className="hidden" 
              />
              <div className="h-28 w-28 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-8 group-hover:scale-110 transition-transform flex shadow-inner">
                <Camera className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-black text-white">拾得物を撮影する</h3>
              <p className="text-slate-500 mt-4 text-xl font-medium">ここをタップしてカメラを起動</p>
            </label>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-slate-800 bg-black flex items-center justify-center shadow-inner">
                  <img src={image} alt="Uploaded" className="max-h-full max-w-full object-contain" />
                  <Button 
                    variant="destructive" 
                    className="absolute top-6 right-6 rounded-2xl font-black px-6 py-4 h-auto shadow-xl"
                    onClick={() => {setImage(null); setAnalysisResult(null); setDebugData(null)}}
                  >
                    削除
                  </Button>
                </div>
                {!analysisResult && (
                  <Button 
                    className="w-full h-24 text-3xl bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-600/30 gap-4 transition-transform active:scale-95" 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="h-10 w-10 animate-spin" /> 解析中...</>
                    ) : (
                      <><Search className="h-10 w-10" /> 持ち主を特定する</>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-8">
                {analysisResult ? (
                  <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="p-8 bg-green-500/10 border-2 border-green-500/20 rounded-[2.5rem]">
                      <h4 className="font-black text-green-400 flex items-center gap-3 text-2xl mb-6">
                        <CheckCircle2 className="h-8 w-8" /> AI解析完了
                      </h4>
                      <div className="space-y-4 text-xl">
                        <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-bold">品目</span><span className="font-black text-white">{analysisResult.item}</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-bold">カラー</span><span className="font-black text-white">{analysisResult.color}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-bold">ブランド</span><span className="font-black text-white">{analysisResult.brand}</span></div>
                      </div>
                    </div>

                    <div className="p-8 bg-blue-500/10 border-2 border-blue-500/20 rounded-[2.5rem]">
                      <h4 className="font-black text-blue-400 mb-6 text-2xl tracking-tighter">特定された宿泊客</h4>
                      {analysisResult.suggestedGuests.map((guest: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-white text-slate-900 p-6 rounded-[1.5rem] border-0 shadow-xl">
                          <div>
                            <div className="font-black text-2xl">{guest.name}</div>
                            <div className="text-sm text-slate-500 font-bold mt-1 uppercase">{guest.room}号室 / {guest.date} OUT</div>
                          </div>
                          <Badge className="bg-blue-600 text-white font-black text-xl px-5 py-2 rounded-xl">{analysisResult.matchConfidence}%</Badge>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full h-24 bg-white hover:bg-slate-100 text-slate-950 font-black text-2xl rounded-[2rem] gap-4 shadow-2xl">
                      <Mail className="h-8 w-8" /> 写真付きで自動連絡する
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border-4 border-dashed border-slate-800 rounded-[3rem] p-12 text-center text-slate-700">
                    <div className="space-y-6">
                      <Building2 className="h-24 w-24 mx-auto opacity-10" />
                      <p className="text-2xl font-bold leading-tight">解析を実行すると、<br/>宿泊データと<br/>自動照合されます</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DebugPanel data={debugData} toolId="staysee-ai-finder" />
    </div>
  )
}
