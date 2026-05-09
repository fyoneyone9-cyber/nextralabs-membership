'use client'
import React, { useState, useRef, useCallback } from 'react'
import { Sprout, Upload, Droplets, Sun, Zap, RotateCcw, CheckCircle2, AlertTriangle, Loader2, ImageIcon, Heart } from 'lucide-react'

interface DiagnosisResult {
  plantName: string
  healthScore: number
  healthLabel: string
  waterStatus: string
  waterComment: string
  sunStatus: string
  diagnosis: string
  actions: string[]
  tip: string
}

export default function SmartGardening() {
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImage(dataUrl)
      setPreview(dataUrl)
      setResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleAnalyze = async () => {
    if (!image) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/tools/smart-gardening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || '解析失敗')
      setResult(data)
    } catch (e: any) {
      setError(e.message || '解析に失敗しました。もう一度お試しください。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">
      {/* ヘッダー */}
      <div className="border-2 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.15)] rounded-2xl mx-4 mt-6 mb-8 p-6 md:p-10 bg-[#0a0a0c] max-w-4xl md:mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-500 rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.4)]">
            <Sprout className="h-7 w-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AIスマートガーデニング</h1>
            <p className="text-sm text-slate-400 font-normal mt-0.5">植物の写真を撮るだけで、AIが健康診断します</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-6">

        {/* 画像アップロードエリア */}
        {!result && (
          <div className="bg-[#13141f] rounded-xl border border-white/5 p-6 md:p-8 space-y-5">
            <h2 className="text-base font-semibold text-white">① 植物の写真をアップロード</h2>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/5'
                    : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
                <ImageIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-400">
                  クリックまたはドラッグ＆ドロップで画像をアップロード
                </p>
                <p className="text-xs text-slate-600 mt-1">JPG / PNG / HEIC 対応</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden aspect-video max-h-72 bg-black/30 flex items-center justify-center">
                  <img src={preview} alt="plant" className="object-contain w-full h-full max-h-72" />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                  >
                    変更
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm rounded-lg shadow-[0_0_16px_rgba(16,185,129,0.15)] hover:shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AIが解析中...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      植物を診断する →
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 解析結果 */}
        {result && (
          <div className="space-y-4">
            {/* 植物名 + スコア */}
            <div className="bg-[#13141f] rounded-xl border border-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">診断結果</p>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{result.plantName}</h2>
                  <p className="text-sm text-slate-400 mt-1">{result.diagnosis}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 mb-1">健康スコア</p>
                  <p className={`text-4xl font-bold ${getScoreColor(result.healthScore)}`}>{result.healthScore}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{result.healthLabel}</p>
                </div>
              </div>
              {/* スコアバー */}
              <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getScoreBg(result.healthScore)}`}
                  style={{ width: `${result.healthScore}%` }}
                />
              </div>
            </div>

            {/* 水やり・日照 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#13141f] rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-400">水やり</span>
                </div>
                <p className="text-base font-semibold text-white">{result.waterStatus}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{result.waterComment}</p>
              </div>
              <div className="bg-[#13141f] rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium text-slate-400">日当たり</span>
                </div>
                <p className="text-base font-semibold text-white">{result.sunStatus}</p>
              </div>
            </div>

            {/* アクション */}
            <div className="bg-[#13141f] rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                今すぐできるケア
              </h3>
              <ul className="space-y-3">
                {result.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-slate-300 leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* プロのヒント */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">プロのワンポイント</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{result.tip}</p>
            </div>

            {/* 再診断ボタン */}
            <button
              onClick={handleReset}
              className="w-full h-12 border border-white/10 hover:border-emerald-500/40 text-slate-400 hover:text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              別の植物を診断する
            </button>
          </div>
        )}

        {/* ローディング中オーバーレイ的表示 */}
        {isAnalyzing && !result && (
          <div className="bg-[#13141f] rounded-xl border border-emerald-500/20 p-10 text-center">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-white">AIが植物を解析しています...</p>
            <p className="text-xs text-slate-500 mt-2">Gemini 2.5 Flash で高精度診断中</p>
          </div>
        )}
      </div>
    </div>
  )
}
