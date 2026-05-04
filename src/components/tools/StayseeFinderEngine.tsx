'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Loader2, Mail, CheckCircle2, AlertCircle, Building2, PackageSearch } from 'lucide-react'

export default function StayseeFinderEngine() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)

  // 🛠️ 画像のリサイズ処理 (413 Payload Too Large 対策)
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = base64Str
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        // 画質を0.7に落として軽量化
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

    try {
      const response = await fetch("/api/analyze-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.details || "解析に失敗しました");
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="border-2 border-blue-100 shadow-xl overflow-hidden bg-white text-slate-900">
        <CardHeader className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                <PackageSearch className="h-6 w-6" /> Staysee AI Finder
              </CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                拾得物の撮影・解析・照合コックピット
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {!image ? (
            <div className="border-4 border-dashed border-slate-100 rounded-3xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                <Camera className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">拾得物を撮影・アップロード</h3>
              <p className="text-slate-400 mt-2">スマホカメラを起動、または画像を選択してください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden border bg-slate-50 flex items-center justify-center">
                  <img src={image} alt="Uploaded" className="max-h-full max-w-full object-contain" />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {setImage(null); setAnalysisResult(null)}}
                  >
                    削除
                  </Button>
                </div>
                {!analysisResult && (
                  <Button 
                    className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold" 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> AI解析中...</>
                    ) : (
                      <><Search className="mr-2 h-5 w-5" /> 持ち主を特定する</>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {analysisResult ? (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-bold text-green-900 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600" /> AI解析完了
                      </h4>
                      <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-slate-500">品目:</span>
                        <span className="font-bold">{analysisResult.item}</span>
                        <span className="text-slate-500">カラー:</span>
                        <span className="font-bold">{analysisResult.color}</span>
                        <span className="text-slate-500">ブランド:</span>
                        <span className="font-bold">{analysisResult.brand}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <h4 className="font-bold text-blue-900 mb-3 text-sm">特定された宿泊客候補</h4>
                      {analysisResult.suggestedGuests.map((guest: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                          <div>
                            <div className="font-bold text-sm text-slate-800">{guest.name}</div>
                            <div className="text-[10px] text-slate-500">{guest.room}号室 / {guest.date} チェックアウト</div>
                          </div>
                          <Badge className="bg-blue-600 text-white font-mono text-[10px]">{analysisResult.matchConfidence}%</Badge>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                      <Mail className="h-5 w-5" /> 写真付きで自動連絡する
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center text-slate-400">
                    <div>
                      <Building2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">解析を実行すると<br/>Stayseeのデータと照合されます</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] py-4">
        <AlertCircle className="h-3 w-3" />
        <span>Staysee API Version 2.4 Connected | Powered by NextraLabs AI</span>
      </div>
    </div>
  )
}
