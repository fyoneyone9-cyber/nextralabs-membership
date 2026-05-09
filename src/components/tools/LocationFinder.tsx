'use client'
import React, { useState, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { MapPin, Camera, Loader2, RotateCcw, ExternalLink, Search, Upload } from 'lucide-react'

interface LocationResult {
  locationName: string
  lat: number
  lng: number
  confidence: string
  reasoning: string
}

export default function LocationFinder() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<LocationResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const analyze = async () => {
    if (!imageFile) return
    setIsAnalyzing(true)
    setError('')
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      const res = await fetch('/api/tools/location-finder', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '解析に失敗しました')
      setResult(data)
    } catch (e: any) {
      setError(e.message || '解析中にエラーが発生しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setImage(null)
    setImageFile(null)
    setResult(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const mapsUrl = result
    ? `https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lng}`
    : ''
  const embedUrl = result
    ? `https://www.google.com/maps?q=${result.lat},${result.lng}&z=15&output=embed`
    : ''

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 min-h-screen text-slate-200 pb-24 rounded-2xl bg-[#050507]">

      {/* ヘッダー */}
      <div className="text-center space-y-2 pt-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-4 py-1 rounded-full">AI位置情報解析</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          ロケーション<span className="text-emerald-400">ファインダー</span>
        </h1>
        <p className="text-slate-400 text-sm">写真をアップロードするだけで、AIが撮影場所を特定します</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* 左：画像アップロード */}
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !image && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 overflow-hidden flex items-center justify-center transition-all
              ${image ? 'border-emerald-500/30 bg-black/20' : 'border-dashed border-white/10 bg-[#0d0f1a] hover:border-emerald-500/40 cursor-pointer'}
              aspect-video`}
          >
            {image ? (
              <img src={image} alt="解析対象" className="object-contain w-full h-full" />
            ) : (
              <div className="text-center space-y-3 p-8">
                <Upload size={32} className="text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">クリックまたはドラッグ＆ドロップ</p>
                <p className="text-xs text-slate-600">JPG / PNG / WEBP</p>
              </div>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                <Loader2 size={40} className="text-emerald-400 animate-spin" />
                <p className="text-sm font-semibold text-emerald-400">AIが画像を解析中...</p>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#0d0f1a] border border-white/10 hover:border-emerald-500/30 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-all"
            >
              <Camera size={15} /> 画像を選択
            </button>
            <button
              onClick={analyze}
              disabled={!imageFile || isAnalyzing}
              className="flex-1 flex items-center justify-center gap-2 h-11 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all shadow-lg"
            >
              {isAnalyzing ? <><Loader2 size={15} className="animate-spin" /> 解析中</> : <><Search size={15} /> 場所を特定</>}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* 右：結果 */}
        <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
          {result ? (
            <div className="flex flex-col h-full">
              {/* 場所名 */}
              <div className="p-5 border-b border-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mb-1">特定された場所</p>
                    <p className="font-bold text-white text-base leading-tight">{result.locationName}</p>
                    <Badge className={`mt-1 text-[9px] font-semibold border ${
                      result.confidence === '高' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      result.confidence === '中' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>確信度：{result.confidence}</Badge>
                  </div>
                </div>
                {result.reasoning && (
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">{result.reasoning}</p>
                )}
              </div>

              {/* 地図 */}
              <div className="flex-1 relative min-h-[200px]">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* ボタン */}
              <div className="p-3 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => window.open(mapsUrl, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold text-white transition-all"
                >
                  <ExternalLink size={13} /> Google マップで開く
                </button>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 h-10 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-400 transition-all"
                >
                  <RotateCcw size={13} /> リセット
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <MapPin size={32} className="text-slate-700" />
              <p className="text-sm font-semibold text-slate-600">写真をアップロードして</p>
              <p className="text-sm font-semibold text-slate-600">「場所を特定」を押してください</p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-[#0d0f1a] border border-white/5 rounded-xl p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 mb-1">緯度</p>
            <p className="text-sm font-bold text-white">{result.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 mb-1">経度</p>
            <p className="text-sm font-bold text-white">{result.lng.toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
