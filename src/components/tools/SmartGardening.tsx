'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
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

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const [inputMode, setInputMode] = useState<InputMode>('upload')
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // カメラ関連
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<CameraFacing>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // カメラ起動
  const startCamera = useCallback(async (facing: CameraFacing = facingMode) => {
    setCameraError(null)
    // 既存ストリームを停止
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
        setCameraError('カメラへのアクセスが拒否されました。ブラウザの設定からカメラを許可してください。')
      } else if (err.name === 'NotFoundError') {
        setCameraError('カメラが見つかりません。')
      } else {
        setCameraError(`カメラを起動できませんでした（${err.name}）`)
      }
    }
  }, [facingMode])

  // カメラ停止
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setIsCameraActive(false)
  }, [])

  // カメラ切替
  const flipCamera = useCallback(() => {
    const next: CameraFacing = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    startCamera(next)
  }, [facingMode, startCamera])

  // 撮影
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

  // タブ切替時にカメラ停止
  const switchMode = (mode: InputMode) => {
    if (mode !== inputMode) {
      stopCamera()
      setIsCameraActive(false)
      setCameraError(null)
      setInputMode(mode)
    }
  }

  // カメラタブを選んだとき自動起動
  useEffect(() => {
    if (inputMode === 'camera' && !preview && !result) {
      startCamera(facingMode)
    }
    return () => {
      if (inputMode !== 'camera') stopCamera()
    }
  }, [inputMode]) // eslint-disable-line

  // アンマウント時に必ずカメラ停止
  useEffect(() => () => stopCamera(), [stopCamera])

  // ファイルアップロード処理
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

  // API送信
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
    stopCamera()
    // カメラタブのままなら再起動
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

      {/* ヘッダー */}
      <div className="rounded-2xl mx-4 mt-6 mb-8 p-6 md:p-10 bg-[#0a0a0c] max-w-4xl md:mx-auto border border-white/5">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-500 rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.4)]">
            <Sprout className="h-7 w-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">AIスマートガーデニング</h1>
            <p className="text-sm text-slate-400 font-normal mt-0.5">植物の写真を撮るだけで、AIが健康診断します</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-6">

        {/* 診断前：入力UI */}
        {!result && (
          <div className="bg-[#13141f] rounded-xl border border-white/5 p-6 md:p-8 space-y-5">

            {/* タブ切替 */}
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
                画像アップロード
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
                カメラで撮影
              </button>
            </div>

            {/* ── アップロードモード ── */}
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
                      クリックまたはドラッグ＆ドロップで画像をアップロード
                    </p>
                    <p className="text-xs text-slate-600 mt-1">JPG / PNG / HEIC 対応</p>
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

            {/* ── カメラモード ── */}
            {inputMode === 'camera' && (
              <>
                {!preview ? (
                  <div className="space-y-4">
                    {/* カメラエラー */}
                    {cameraError && (
                      <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        {cameraError}
                      </div>
                    )}

                    {/* ライブビュー */}
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
                          <p className="text-sm text-slate-500">カメラを起動中...</p>
                        </div>
                      )}

                      {!isCameraActive && cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Camera className="h-10 w-10 text-slate-700" />
                          <button
                            onClick={() => startCamera(facingMode)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                          >
                            再起動する
                          </button>
                        </div>
                      )}

                      {/* カメラ切替ボタン */}
                      {isCameraActive && (
                        <button
                          onClick={flipCamera}
                          className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-lg transition-all backdrop-blur-sm"
                          title="カメラ切替"
                        >
                          <SwitchCamera size={18} />
                        </button>
                      )}

                      {/* ガイド枠 */}
                      {isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            className="w-48 h-48 rounded-2xl"
                            style={{ border: '2px solid rgba(16,185,129,0.5)' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* 撮影ボタン */}
                    <button
                      onClick={capturePhoto}
                      disabled={!isCameraActive || isCapturing}
                      className="w-full h-14 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: '#10b981' }}
                      onMouseEnter={e => { if (isCameraActive) { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'scale(1.01)' }}}
                      onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      <Camera size={16} />
                      {isCapturing ? '撮影中...' : '植物を撮影する'}
                    </button>

                    <p className="text-center text-xs text-slate-600">
                      植物全体がフレームに収まるように撮影してください
                    </p>
                  </div>
                ) : (
                  <PreviewAndAnalyze
                    preview={preview}
                    isAnalyzing={isAnalyzing}
                    error={error}
                    onReset={handleReset}
                    onAnalyze={handleAnalyze}
                    resetLabel="撮り直す"
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* 解析中 */}
        {isAnalyzing && !result && (
          <div className="bg-[#13141f] rounded-xl border border-emerald-500/20 p-10 text-center">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-white">AIが植物を解析しています...</p>
            <p className="text-xs text-slate-500 mt-2">Gemini 2.5 Flash で高精度診断中</p>
          </div>
        )}

        {/* 診断結果 */}
        {result && (
          <div className="space-y-4">
            {/* 植物名 + スコア */}
            <div className="bg-[#13141f] rounded-xl border border-white/5 p-6">
              {preview && (
                <img src={preview} alt="診断した植物" className="w-full max-h-48 object-cover rounded-lg mb-5 opacity-80" />
              )}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">診断結果</p>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">{result.plantName}</h2>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{result.diagnosis}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 mb-1">健康スコア</p>
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

        {/* ページ下部 説明欄 */}
        <div className="mt-10 border-t border-white/5 pt-10 space-y-8">

          {/* このツールについて */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 tracking-tight">🌿 AIスマートガーデニングとは？</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              植物の写真を1枚撮るだけで、AIが葉の色・形・質感などを解析し、健康状態・水やりのタイミング・日当たりの適否を即座に診断します。
              園芸初心者から上級者まで、植物をより長く・元気に育てるためのパートナーとしてご活用ください。
            </p>
          </div>

          {/* 特徴カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '📸',
                title: '写真1枚で即診断',
                desc: 'スマートフォンやカメラで撮影した植物の画像をアップロードするだけ。複雑な操作は一切不要です。',
              },
              {
                icon: '🤖',
                title: 'Gemini 2.5 Flash 搭載',
                desc: 'Googleの最新AIモデルが高精度で植物を識別。病害虫のサインや栄養不足まで細かく検知します。',
              },
              {
                icon: '💡',
                title: 'ケアアドバイス付き',
                desc: '診断結果だけでなく「今すぐできるケア」を具体的にリスト形式で提示。すぐに行動に移せます。',
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#13141f] rounded-xl border border-white/5 p-5 space-y-2">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 使い方ステップ */}
          <div>
            <h2 className="text-base font-semibold text-white mb-4 tracking-tight">📋 使い方</h2>
            <ol className="space-y-3">
              {[
                '「画像アップロード」または「カメラで撮影」を選んでください。',
                '植物全体が写るように画像を準備し、アップロードまたは撮影します。',
                '「植物を診断する」ボタンを押してAI解析を開始します。',
                '健康スコア・水やり・日照・ケアアドバイスが表示されます。',
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

          {/* 注意事項 */}
          <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">ご注意</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
              <li>本ツールはAIによる参考診断です。深刻な病害は専門家にご相談ください。</li>
              <li>画像は鮮明で明るい環境で撮影すると、より正確な診断が得られます。</li>
              <li>1日あたりの診断回数には上限があります（利用規約に準拠）。</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}

// ── プレビュー＋診断ボタン共通コンポーネント ──
function PreviewAndAnalyze({
  preview,
  isAnalyzing,
  error,
  onReset,
  onAnalyze,
  resetLabel = '変更',
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
            AIが解析中...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            植物を診断する →
          </>
        )}
      </button>
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="smart-gardening" />
</div>
  )
}
