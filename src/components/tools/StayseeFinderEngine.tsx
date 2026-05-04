'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Loader2, Mail, CheckCircle2, AlertCircle, Building2, PackageSearch, Terminal, ChevronDown, ChevronUp } from 'lucide-react'

export default function StayseeFinderEngine() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [debugInfo, setDebugInfo] = useState<any | null>(null)
  const [showDebug, setShowDebug] = useState(false)

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
        setDebugInfo({ message: "Image compressed successfully", sizeKB: (compressed.length/1024).toFixed(1) })
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDebugInfo(null);

    try {
      const response = await fetch("/api/analyze-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      setDebugInfo(data);

      if (!response.ok) {
        throw new Error(data.message || data.details || data.error || "解析失敗");
      }
      
      setAnalysisResult({ ...data, suggestedGuests: [{ name: "ヨネヤマ フミタカ 様", room: "302", date: "2026/05/03" }] });
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      <Card className="border-2 border-blue-100 shadow-xl overflow-hidden bg-white text-slate-900 rounded-[2rem]">
        <CardHeader className="bg-blue-600 text-white p-8">
          <CardTitle className="text-3xl font-black flex items-center gap-3">
            <PackageSearch className="h-8 w-8" /> Staysee AI Finder
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            拾得物を撮影 ➔ AI解析 ➔ 宿泊者特定を一本道で。
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-10 space-y-8">
          {!image ? (
            <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center hover:bg-slate-50 transition-all cursor-pointer relative group">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Camera className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-700">拾得物を撮影して開始</h3>
              <p className="text-slate-400 mt-3 text-lg">スマホカメラを起動、または画像を選択</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                  <img src={image} alt="Uploaded" className="max-h-full max-w-full object-contain" />
                  <Button variant="destructive" size="sm" className="absolute top-4 right-4 rounded-xl font-bold" onClick={() => {setImage(null); setAnalysisResult(null); setDebugInfo(null)}}>削除</Button>
                </div>
                {!analysisResult && (
                  <Button className="w-full h-24 text-2xl bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 gap-3" onClick={analyzeImage} disabled={isAnalyzing}>
                    {isAnalyzing ? <><Loader2 className="h-8 w-8 animate-spin" /> 解析中...</> : <><Search className="h-8 w-8" /> 持ち主を特定する</>}
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {analysisResult ? (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="p-6 bg-green-50 border-2 border-green-100 rounded-3xl">
                      <h4 className="font-black text-green-900 flex items-center gap-2 text-lg mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" /> AI解析が完了しました
                      </h4>
                      <div className="grid grid-cols-2 gap-y-4 text-base bg-white/50 p-4 rounded-2xl">
                        <span className="text-slate-500 font-bold">品目:</span><span className="font-black text-slate-900">{analysisResult.item}</span>
                        <span className="text-slate-500 font-bold">カラー:</span><span className="font-black text-slate-900">{analysisResult.color}</span>
                        <span className="text-slate-500 font-bold">ブランド:</span><span className="font-black text-slate-900">{analysisResult.brand}</span>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl">
                      <h4 className="font-black text-blue-900 mb-4 text-lg">特定された宿泊客</h4>
                      {analysisResult.suggestedGuests.map((guest: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-md">
                          <div>
                            <div className="font-black text-xl text-slate-900">{guest.name}</div>
                            <div className="text-sm text-slate-500 font-bold">{guest.room}号室 / {guest.date} OUT</div>
                          </div>
                          <Badge className="bg-blue-600 text-white font-black text-lg px-4 py-1">{analysisResult.matchConfidence}%</Badge>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full h-20 bg-slate-900 hover:bg-black text-white font-black text-xl rounded-3xl gap-3 shadow-xl">
                      <Mail className="h-6 w-6" /> 写真付きで自動連絡する
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border-4 border-dashed border-slate-50 rounded-[2rem] p-10 text-center text-slate-300">
                    <div className="space-y-4 font-bold">
                      <Building2 className="h-20 w-20 mx-auto opacity-10" />
                      <p className="text-xl leading-relaxed">解析を実行すると、<br/>Stayseeの宿泊データと<br/>自動的に照合されます</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🛠️ DEBUG PANEL - NextraLabs Special */}
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setShowDebug(!showDebug)} className="flex items-center gap-2 text-slate-500 text-xs font-bold hover:text-slate-700 transition-colors mb-2">
          <Terminal className="h-3 w-3" /> {showDebug ? "デバッグパネルを閉じる" : "デバッグログを表示"} {showDebug ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {showDebug && (
          <div className="bg-slate-950 text-emerald-400 p-6 rounded-2xl font-mono text-[10px] border border-emerald-500/20 shadow-2xl overflow-x-auto">
            <p className="mb-2 border-b border-emerald-500/10 pb-1 text-white opacity-50 uppercase tracking-widest">--- System Debug Logs ---</p>
            {debugInfo ? (
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            ) : (
              <p className="italic opacity-50">No logs yet. Try performing an action...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
