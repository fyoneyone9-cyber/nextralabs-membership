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
  const [debugData, setDebugData] = useState<any>(null)

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
        setDebugData({ status: "IMAGE_LOADED", size_kb: (compressed.length/1024).toFixed(1) });
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDebugData({ status: "ANALYSIS_STARTING", timestamp: new Date().toISOString() });

    try {
      const response = await fetch("/api/analyze-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      // 屏・・縺ｩ繧薙↑邨先棡(繧ｨ繝ｩ繝ｼ蜷ｫ繧)縺ｧ繧ょｿ・★繝・ヰ繝・げ繝・・繧ｿ縺ｫ菫晏ｭ・      setDebugData({ status: "API_RESPONSE_RECEIVED", http_status: response.status, payload: data });

      if (!response.ok) {
        throw new Error(data.message || data.error || "隗｣譫仙､ｱ謨・);
      }
      
      setAnalysisResult({
        ...data,
        suggestedGuests: [{ name: "繝ｨ繝阪Ζ繝・繝輔Α繧ｿ繧ｫ 讒・, room: "302", date: "2026/05/03" }]
      });
    } catch (error: any) {
      console.error("[Staysee_Error]", error.message);
      setDebugData({ status: "EXCEPTION_CAUGHT", error_message: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 min-h-screen text-slate-200">
      
      <Card className="border-0 shadow-2xl overflow-hidden bg-[#1a1b23] rounded-[3rem]">
        <CardHeader className="bg-blue-600 p-10 text-white">
          <CardTitle className="text-4xl font-black tracking-tight">Staysee AI Finder</CardTitle>
          <CardDescription className="text-blue-100 text-lg mt-2 font-medium">諡ｾ蠕礼黄繧呈聴蠖ｱ縺励※謖√■荳ｻ繧堤音螳・/CardDescription>
        </CardHeader>
        
        <CardContent className="p-10">
          {!image ? (
            <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 transition-all cursor-pointer group">
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
              <div className="h-28 w-28 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-8 group-hover:scale-110 transition-transform flex"><Camera className="h-12 w-12" /></div>
              <h3 className="text-3xl font-black text-white">諡ｾ蠕礼黄繧呈聴蠖ｱ縺吶ｋ</h3>
              <p className="text-slate-500 mt-4 text-xl font-medium">縺薙％繧偵ち繝・・縺励※繧ｫ繝｡繝ｩ繧定ｵｷ蜍・/p>
            </label>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-4 border-slate-800 bg-black flex items-center justify-center">
                  <img src={image} alt="Uploaded" className="max-h-full max-w-full object-contain" />
                  <Button variant="destructive" className="absolute top-6 right-6 rounded-2xl font-black px-6 py-4 h-auto shadow-xl" onClick={() => {setImage(null); setAnalysisResult(null); setDebugData(null)}}>蜑企勁</Button>
                </div>
                {!analysisResult && (
                  <Button className="w-full h-24 text-3xl bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-600/30 gap-4" onClick={analyzeImage} disabled={isAnalyzing}>
                    {isAnalyzing ? <><Loader2 className="h-10 w-10 animate-spin" /> 隗｣譫蝉ｸｭ...</> : <><Search className="h-10 w-10" /> 謖√■荳ｻ繧堤音螳壹☆繧・/>}
                  </Button>
                )}
              </div>

              <div className="space-y-8">
                {analysisResult && (
                  <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="p-8 bg-green-500/10 border-2 border-green-500/20 rounded-[2.5rem]">
                      <h4 className="font-black text-green-400 flex items-center gap-3 text-2xl mb-6">AI隗｣譫仙ｮ御ｺ・/h4>
                      <div className="space-y-4 text-xl text-white">
                        <div>蜩∫岼: {analysisResult.item}</div>
                        <div>繧ｫ繝ｩ繝ｼ: {analysisResult.color}</div>
                        <div>繝悶Λ繝ｳ繝・ {analysisResult.brand}</div>
                      </div>
                    </div>
                    <Button className="w-full h-24 bg-white text-slate-950 font-black text-2xl rounded-[2rem]">閾ｪ蜍暮｣邨｡縺吶ｋ</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      
    </div>
  )
}



