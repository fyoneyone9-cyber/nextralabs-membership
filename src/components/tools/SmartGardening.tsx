'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, Upload, Camera, Droplets, Sun, Zap, RotateCcw, CheckCircle2, AlertTriangle, Loader2, ImageIcon, Heart, SwitchCamera, X } from 'lucide-react'

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

type InputMode = 'upload' | 'camera'
type CameraFacing = 'environment' | 'user'

export default function SmartGardening() {
  const router = useRouter()

  // 繝悶Λ繧ｦ繧ｶ繝舌ャ繧ｯ繝ｻ繝槭え繧ｹ繧ｵ繧､繝峨・繧ｿ繝ｳ蟇ｾ蠢・  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('繝・・繝ｫ繧堤ｵゆｺ・＠縺ｾ縺吶°・・)
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // 繧ｿ繝夜哩縺倥・URL逶ｴ謇薙■蟇ｾ蠢・  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('繝・・繝ｫ繧堤ｵゆｺ・＠縺ｾ縺吶°・・)
    if (ok) router.push('/dashboard')
  }, [router])

  const [inputMode, setInputMode] = useState<InputMode>('upload')
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 繧ｫ繝｡繝ｩ髢｢騾｣
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<CameraFacing>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 繧ｫ繝｡繝ｩ襍ｷ蜍・
  const startCamera = useCallback(async (facing: CameraFacing = facingMode) => {
    setCameraError(null)
    // 譌｢蟄倥せ繝医Μ繝ｼ繝繧貞●豁｢
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        await videoRef.current.play()
      }
      setIsCameraActive(true)
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('繧ｫ繝｡繝ｩ縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ縺梧拠蜷ｦ縺輔ｌ縺ｾ縺励◆縲ゅヶ繝ｩ繧ｦ繧ｶ縺ｮ險ｭ螳壹°繧峨き繝｡繝ｩ繧定ｨｱ蜿ｯ縺励※縺上□縺輔＞縲・)
      } else if (err.name === 'NotFoundError') {
        setCameraError('繧ｫ繝｡繝ｩ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縲・)
      } else {
        setCameraError(`繧ｫ繝｡繝ｩ繧定ｵｷ蜍輔〒縺阪∪縺帙ｓ縺ｧ縺励◆・・{err.name}・荏)
      }
    }
  }, [facingMode])

  // 繧ｫ繝｡繝ｩ蛛懈ｭ｢
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setIsCameraActive(false)
  }, [])

  // 繧ｫ繝｡繝ｩ蛻・崛
  const flipCamera = useCallback(() => {
    const next: CameraFacing = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    startCamera(next)
  }, [facingMode, startCamera])

  // 謦ｮ蠖ｱ
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setImage(dataUrl)
    setPreview(dataUrl)
    setResult(null)
    setError(null)
    stopCamera()
    setTimeout(() => setIsCapturing(false), 300)
  }, [facingMode, stopCamera])

  // 繧ｿ繝門・譖ｿ譎ゅ↓繧ｫ繝｡繝ｩ蛛懈ｭ｢
  const switchMode = (mode: InputMode) => {
    if (mode !== inputMode) {
      stopCamera()
      setIsCameraActive(false)
      setCameraError(null)
      setInputMode(mode)
    }
  }

  // 繧ｫ繝｡繝ｩ繧ｿ繝悶ｒ驕ｸ繧薙□縺ｨ縺崎・蜍戊ｵｷ蜍・
  useEffect(() => {
    if (inputMode === 'camera' && !preview && !result) {
      startCamera(facingMode)
    }
    return () => {
      if (inputMode !== 'camera') stopCamera()
    }
  }, [inputMode]) // eslint-disable-line

  // 繧｢繝ｳ繝槭え繝ｳ繝域凾縺ｫ蠢・★繧ｫ繝｡繝ｩ蛛懈ｭ｢
  useEffect(() => () => stopCamera(), [stopCamera])

  // 繝輔ぃ繧､繝ｫ繧｢繝・・繝ｭ繝ｼ繝牙・逅・
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

  // API騾∽ｿ｡
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
      if (!res.ok || data.error) throw new Error(data.error || '隗｣譫仙､ｱ謨・)
      setResult(data)
    } catch (e: any) {
      setError(e.message || '隗｣譫舌↓螟ｱ謨励＠縺ｾ縺励◆縲ゅｂ縺・ｸ蠎ｦ縺願ｩｦ縺励￥縺縺輔＞縲・)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
    stopCamera()
    // 繧ｫ繝｡繝ｩ繧ｿ繝悶・縺ｾ縺ｾ縺ｪ繧牙・襍ｷ蜍・
    if (inputMode === 'camera') {
      setTimeout(() => startCamera(facingMode), 300)
    }
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
      {/* hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 繝倥ャ繝繝ｼ */}
      <div className="rounded-2xl mx-4 mt-6 mb-8 p-6 md:p-10 bg-[#0a0a0c] max-w-4xl md:mx-auto border border-white/5">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-500 rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.4)]">
            <Sprout className="h-7 w-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">AI繧ｹ繝槭・繝医ぎ繝ｼ繝・ル繝ｳ繧ｰ</h1>
            <p className="text-sm text-slate-400 font-normal mt-0.5">讀咲黄縺ｮ蜀咏悄繧呈聴繧九□縺代〒縲、I縺悟▼蠎ｷ險ｺ譁ｭ縺励∪縺・/p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-6">

        {/* 險ｺ譁ｭ蜑搾ｼ壼・蜉婉I */}
        {!result && (
          <div className="bg-[#13141f] rounded-xl border border-white/5 p-6 md:p-8 space-y-5">

            {/* 繧ｿ繝門・譖ｿ */}
            <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
              <button
                onClick={() => switchMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  inputMode === 'upload'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Upload size={15} />
                逕ｻ蜒上い繝・・繝ｭ繝ｼ繝・
              </button>
              <button
                onClick={() => switchMode('camera')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  inputMode === 'camera'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Camera size={15} />
                繧ｫ繝｡繝ｩ縺ｧ謦ｮ蠖ｱ
              </button>
            </div>

            {/* 笏笏 繧｢繝・・繝ｭ繝ｼ繝峨Δ繝ｼ繝・笏笏 */}
            {inputMode === 'upload' && (
              <>
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
                      繧ｯ繝ｪ繝・け縺ｾ縺溘・繝峨Λ繝・げ・・ラ繝ｭ繝・・縺ｧ逕ｻ蜒上ｒ繧｢繝・・繝ｭ繝ｼ繝・
                    </p>
                    <p className="text-xs text-slate-600 mt-1">JPG / PNG / HEIC 蟇ｾ蠢・/p>
                  </div>
                ) : (
                  <PreviewAndAnalyze
                    preview={preview}
                    isAnalyzing={isAnalyzing}
                    error={error}
                    onReset={handleReset}
                    onAnalyze={handleAnalyze}
                  />
                )}
              </>
            )}

            {/* 笏笏 繧ｫ繝｡繝ｩ繝｢繝ｼ繝・笏笏 */}
            {inputMode === 'camera' && (
              <>
                {!preview ? (
                  <div className="space-y-4">
                    {/* 繧ｫ繝｡繝ｩ繧ｨ繝ｩ繝ｼ */}
                    {cameraError && (
                      <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        {cameraError}
                      </div>
                    )}

                    {/* 繝ｩ繧､繝悶ン繝･繝ｼ */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-white/5">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-opacity duration-500 ${
                          isCameraActive ? 'opacity-100' : 'opacity-0'
                        } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                      />

                      {!isCameraActive && !cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
                          <p className="text-sm text-slate-500">繧ｫ繝｡繝ｩ繧定ｵｷ蜍穂ｸｭ...</p>
                        </div>
                      )}

                      {!isCameraActive && cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Camera className="h-10 w-10 text-slate-700" />
                          <button
                            onClick={() => startCamera(facingMode)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                          >
                            蜀崎ｵｷ蜍輔☆繧・
                          </button>
                        </div>
                      )}

                      {/* 繧ｫ繝｡繝ｩ蛻・崛繝懊ち繝ｳ */}
                      {isCameraActive && (
                        <button
                          onClick={flipCamera}
                          className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-lg transition-all backdrop-blur-sm"
                          title="繧ｫ繝｡繝ｩ蛻・崛"
                        >
                          <SwitchCamera size={18} />
                        </button>
                      )}

                      {/* 繧ｬ繧､繝画棧 */}
                      {isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            className="w-48 h-48 rounded-2xl"
                            style={{ border: '2px solid rgba(16,185,129,0.5)' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* 謦ｮ蠖ｱ繝懊ち繝ｳ */}
                    <button
                      onClick={capturePhoto}
                      disabled={!isCameraActive || isCapturing}
                      className="w-full h-14 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: '#10b981' }}
                      onMouseEnter={e => { if (isCameraActive) { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'scale(1.01)' }}}
                      onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      <Camera size={16} />
                      {isCapturing ? '謦ｮ蠖ｱ荳ｭ...' : '讀咲黄繧呈聴蠖ｱ縺吶ｋ'}
                    </button>

                    <p className="text-center text-xs text-slate-600">
                      讀咲黄蜈ｨ菴薙′繝輔Ξ繝ｼ繝縺ｫ蜿弱∪繧九ｈ縺・↓謦ｮ蠖ｱ縺励※縺上□縺輔＞
                    </p>
                  </div>
                ) : (
                  <PreviewAndAnalyze
                    preview={preview}
                    isAnalyzing={isAnalyzing}
                    error={error}
                    onReset={handleReset}
                    onAnalyze={handleAnalyze}
                    resetLabel="謦ｮ繧顔峩縺・
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* 隗｣譫蝉ｸｭ */}
        {isAnalyzing && !result && (
          <div className="bg-[#13141f] rounded-xl border border-emerald-500/20 p-10 text-center">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-white">AI縺梧､咲黄繧定ｧ｣譫舌＠縺ｦ縺・∪縺・..</p>
            <p className="text-xs text-slate-500 mt-2">Gemini 2.5 Flash 縺ｧ鬮倡ｲｾ蠎ｦ險ｺ譁ｭ荳ｭ</p>
          </div>
        )}

        {/* 險ｺ譁ｭ邨先棡 */}
        {result && (
          <div className="space-y-4">
            {/* 讀咲黄蜷・+ 繧ｹ繧ｳ繧｢ */}
            <div className="bg-[#13141f] rounded-xl border border-white/5 p-6">
              {preview && (
                <img src={preview} alt="險ｺ譁ｭ縺励◆讀咲黄" className="w-full max-h-48 object-cover rounded-lg mb-5 opacity-80" />
              )}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">險ｺ譁ｭ邨先棡</p>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">{result.plantName}</h2>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{result.diagnosis}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 mb-1">蛛･蠎ｷ繧ｹ繧ｳ繧｢</p>
                  <p className={`text-4xl font-semibold ${getScoreColor(result.healthScore)}`}>{result.healthScore}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{result.healthLabel}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getScoreBg(result.healthScore)}`}
                  style={{ width: `${result.healthScore}%` }}
                />
              </div>
            </div>

            {/* 豌ｴ繧・ｊ繝ｻ譌･辣ｧ */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#13141f] rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-400">豌ｴ繧・ｊ</span>
                </div>
                <p className="text-base font-semibold text-white">{result.waterStatus}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{result.waterComment}</p>
              </div>
              <div className="bg-[#13141f] rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium text-slate-400">譌･蠖薙◆繧・/span>
                </div>
                <p className="text-base font-semibold text-white">{result.sunStatus}</p>
              </div>
            </div>

            {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ */}
            <div className="bg-[#13141f] rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                莉翫☆縺舌〒縺阪ｋ繧ｱ繧｢
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

            {/* 繝励Ο縺ｮ繝偵Φ繝・*/}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">繝励Ο縺ｮ繝ｯ繝ｳ繝昴う繝ｳ繝・/span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{result.tip}</p>
            </div>

            {/* 蜀崎ｨｺ譁ｭ繝懊ち繝ｳ */}
            <button
              onClick={handleReset}
              className="w-full h-12 border border-white/10 hover:border-emerald-500/40 text-slate-400 hover:text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              蛻･縺ｮ讀咲黄繧定ｨｺ譁ｭ縺吶ｋ
            </button>
          </div>
        )}

        {/* 繝壹・繧ｸ荳矩Κ 隱ｬ譏取ｬ・*/}
        <div className="mt-10 border-t border-white/5 pt-10 space-y-8">

          {/* 縺薙・繝・・繝ｫ縺ｫ縺､縺・※ */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 tracking-tight">諺 AI繧ｹ繝槭・繝医ぎ繝ｼ繝・ル繝ｳ繧ｰ縺ｨ縺ｯ・・/h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              讀咲黄縺ｮ蜀咏悄繧・譫壽聴繧九□縺代〒縲、I縺瑚痩縺ｮ濶ｲ繝ｻ蠖｢繝ｻ雉ｪ諢溘↑縺ｩ繧定ｧ｣譫舌＠縲∝▼蠎ｷ迥ｶ諷九・豌ｴ繧・ｊ縺ｮ繧ｿ繧､繝溘Φ繧ｰ繝ｻ譌･蠖薙◆繧翫・驕ｩ蜷ｦ繧貞叉蠎ｧ縺ｫ險ｺ譁ｭ縺励∪縺吶・
              蝨定敢蛻晏ｿ・・°繧我ｸ顔ｴ夊・∪縺ｧ縲∵､咲黄繧偵ｈ繧企聞縺上・蜈・ｰ励↓閧ｲ縺ｦ繧九◆繧√・繝代・繝医リ繝ｼ縺ｨ縺励※縺疲ｴｻ逕ｨ縺上□縺輔＞縲・
            </p>
          </div>

          {/* 迚ｹ蠕ｴ繧ｫ繝ｼ繝・*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '萄',
                title: '蜀咏悄1譫壹〒蜊ｳ險ｺ譁ｭ',
                desc: '繧ｹ繝槭・繝医ヵ繧ｩ繝ｳ繧・き繝｡繝ｩ縺ｧ謦ｮ蠖ｱ縺励◆讀咲黄縺ｮ逕ｻ蜒上ｒ繧｢繝・・繝ｭ繝ｼ繝峨☆繧九□縺代り､・尅縺ｪ謫堺ｽ懊・荳蛻・ｸ崎ｦ√〒縺吶・,
              },
              {
                icon: '､・,
                title: 'Gemini 2.5 Flash 謳ｭ霈・,
                desc: 'Google縺ｮ譛譁ｰAI繝｢繝・Ν縺碁ｫ倡ｲｾ蠎ｦ縺ｧ讀咲黄繧定ｭ伜挨縲ら羅螳ｳ陌ｫ縺ｮ繧ｵ繧､繝ｳ繧・・､贋ｸ崎ｶｳ縺ｾ縺ｧ邏ｰ縺九￥讀懃衍縺励∪縺吶・,
              },
              {
                icon: '庁',
                title: '繧ｱ繧｢繧｢繝峨ヰ繧､繧ｹ莉倥″',
                desc: '險ｺ譁ｭ邨先棡縺縺代〒縺ｪ縺上御ｻ翫☆縺舌〒縺阪ｋ繧ｱ繧｢縲阪ｒ蜈ｷ菴鍋噪縺ｫ繝ｪ繧ｹ繝亥ｽ｢蠑上〒謠千､ｺ縲ゅ☆縺舌↓陦悟虚縺ｫ遘ｻ縺帙∪縺吶・,
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#13141f] rounded-xl border border-white/5 p-5 space-y-2">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 菴ｿ縺・婿繧ｹ繝・ャ繝・*/}
          <div>
            <h2 className="text-base font-semibold text-white mb-4 tracking-tight">搭 菴ｿ縺・婿</h2>
            <ol className="space-y-3">
              {[
                '縲檎判蜒上い繝・・繝ｭ繝ｼ繝峨阪∪縺溘・縲後き繝｡繝ｩ縺ｧ謦ｮ蠖ｱ縲阪ｒ驕ｸ繧薙〒縺上□縺輔＞縲・,
                '讀咲黄蜈ｨ菴薙′蜀吶ｋ繧医≧縺ｫ逕ｻ蜒上ｒ貅門ｙ縺励√い繝・・繝ｭ繝ｼ繝峨∪縺溘・謦ｮ蠖ｱ縺励∪縺吶・,
                '縲梧､咲黄繧定ｨｺ譁ｭ縺吶ｋ縲阪・繧ｿ繝ｳ繧呈款縺励※AI隗｣譫舌ｒ髢句ｧ九＠縺ｾ縺吶・,
                '蛛･蠎ｷ繧ｹ繧ｳ繧｢繝ｻ豌ｴ繧・ｊ繝ｻ譌･辣ｧ繝ｻ繧ｱ繧｢繧｢繝峨ヰ繧､繧ｹ縺瑚｡ｨ遉ｺ縺輔ｌ縺ｾ縺吶・,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-400 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 豕ｨ諢丈ｺ矩・*/}
          <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">縺疲ｳｨ諢・/h3>
            <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
              <li>譛ｬ繝・・繝ｫ縺ｯAI縺ｫ繧医ｋ蜿り・ｨｺ譁ｭ縺ｧ縺吶よｷｱ蛻ｻ縺ｪ逞・ｮｳ縺ｯ蟆る摩螳ｶ縺ｫ縺皮嶌隲・￥縺縺輔＞縲・/li>
              <li>逕ｻ蜒上・魄ｮ譏弱〒譏弱ｋ縺・腸蠅・〒謦ｮ蠖ｱ縺吶ｋ縺ｨ縲√ｈ繧頑ｭ｣遒ｺ縺ｪ險ｺ譁ｭ縺悟ｾ励ｉ繧後∪縺吶・/li>
              <li>1譌･縺ゅ◆繧翫・險ｺ譁ｭ蝗樊焚縺ｫ縺ｯ荳企剞縺後≠繧翫∪縺呻ｼ亥茜逕ｨ隕冗ｴ・↓貅匁侠・峨・/li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}

// 笏笏 繝励Ξ繝薙Η繝ｼ・玖ｨｺ譁ｭ繝懊ち繝ｳ蜈ｱ騾壹さ繝ｳ繝昴・繝阪Φ繝・笏笏
function PreviewAndAnalyze({
  preview,
  isAnalyzing,
  error,
  onReset,
  onAnalyze,
  resetLabel = '螟画峩',
}: {
  preview: string
  isAnalyzing: boolean
  error: string | null
  onReset: () => void
  onAnalyze: () => void
  resetLabel?: string
}) {
  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden aspect-video max-h-72 bg-black/30 flex items-center justify-center">
        <img src={preview} alt="plant" className="object-contain w-full h-full max-h-72" />
        <button
          onClick={onReset}
          className="absolute top-3 right-3 bg-black/60 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
        >
          <X size={12} />
          {resetLabel}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm rounded-lg shadow-[0_0_16px_rgba(16,185,129,0.15)] hover:shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        style={{ background: '#10b981' }}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            AI縺瑚ｧ｣譫蝉ｸｭ...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            讀咲黄繧定ｨｺ譁ｭ縺吶ｋ 竊・
          </>
        )}
      </button>
    </div>
  )
}
