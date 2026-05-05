'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Loader2, Mail, CheckCircle2, Building2, PackageSearch, HelpCircle, Zap } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

export default function StayseeFinderEngine() {
  const [image, setImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [debugData, setDebugData] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
        setDebugData({ status: "IMAGE_LOADED" })
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    setIsAnalyzing(true)
    setDebugData({ status: "STARTING_ANALYSIS" })
    try {
      const res = await fetch("/api/analyze-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      })
      const data = await res.json()
      setDebugData(data)
      if (res.ok) setAnalysisResult(data)
    } catch (err) {
      setDebugData({ error: err.message })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Staysee AI Finder</h1>
      </div>
      
      <div className="max-w-4xl mx-auto mb-16 bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-blue-600 font-black px-6 py-2 text-xl rounded-full shadow-lg">STEP 01</Badge>
            <h3 className="text-3xl font-black italic uppercase">拾得物の撮影と解析</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">拾得物をカメラで撮影してください。AIが特徴を抽出し、宿泊客データと照合します。</p>
        </div>
      </div>

      <Card className="border-0 shadow-2xl overflow-hidden bg-[#1a1b23] rounded-[3rem]">
        <CardHeader className="bg-blue-600 p-10 text-white">
          <CardTitle className="text-4xl font-black tracking-tight">AI解析エンジン</CardTitle>
          <CardDescription className="text-blue-100 text-lg mt-2 font-medium italic">Professional B2B Suite</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          {!image ? (
            <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 transition-all cursor-pointer group">
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
              <Camera className="h-24 w-24 mx-auto mb-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white">撮影を開始</h3>
            </label>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6 text-center">
                <img src={image} alt="Uploaded" className="rounded-3xl border-4 border-slate-800 w-full aspect-square object-contain" />
                {!analysisResult && (
                  <Button onClick={analyzeImage} disabled={isAnalyzing} className="w-full h-24 bg-blue-600 text-white font-black text-3xl rounded-[2rem] shadow-xl">
                    {isAnalyzing ? "解析中..." : "持ち主を特定"}
                  </Button>
                )}
                <Button onClick={() => setImage(null)} variant="ghost" className="text-slate-500 underline">画像を削除</Button>
              </div>
              <div className="space-y-6">
                {analysisResult && (
                  <div className="p-8 bg-green-500/10 border-2 border-green-500/20 rounded-[2.5rem] animate-in zoom-in duration-500">
                    <h4 className="text-2xl font-black text-green-400 mb-4">解析結果</h4>
                    <div className="text-xl space-y-2">
                      <p>品目: {analysisResult.item}</p>
                      <p>カラー: {analysisResult.color}</p>
                      <p>ブランド: {analysisResult.brand}</p>
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