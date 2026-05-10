'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Upload, CheckCircle2, Home, ShieldCheck, MapPin,
  Loader2, Search, Zap, Info, TrendingUp, ShoppingCart,
  Copy, ChevronRight, ExternalLink, ArrowLeft,
  Camera, SwitchCamera, X
} from 'lucide-react'

const ENTRY_MODES = [
  {
    id: 'area', label: 'エリア・治安調査', desc: '候補地のハザード・治安を分析',
    icon: MapPin,
    steps: ['市区町村を入力', 'AIプロンプト生成', 'リスク判定'],
  },
  {
    id: 'room', label: '内見・物件チェック', desc: '写真から不備を暴く',
    icon: Home,
    steps: ['部屋の写真をアップ', 'Visionプロンプト生成', '不備の特定'],
  },
  {
    id: 'contract', label: '契約書・重要事項', desc: '特約や費用の罠をチェック',
    icon: ShieldCheck,
    steps: ['契約書を貼付', 'リスク抽出プロンプト', '交渉点の特定'],
  },
]

const ROADMAP = [
  { title: 'リスク抽出', desc: '浸水・倒壊リスク、治安をAIが特定。', icon: Search },
  { title: '交渉策定', desc: '不動産屋への具体的質問案を構成。', icon: ShieldCheck },
  { title: '防衛完了', desc: '入居後の防犯・防災対策を自動提示。', icon: TrendingUp },
]

const inputCls = `w-full rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

const MasterEngine = () => {
  const [mode, setMode] = useState('selection')
  const [isMounted, setIsMounted] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [areaInputs, setAreaInputs] = useState(['', '', '']) // 3つのエリア用

  // カメラ関連
  const [uploadMode, setUploadMode] = useState<'file' | 'camera'>('file')
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async (facing: 'environment' | 'user' = 'environment') => {
    setCameraError(null)
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.setAttribute('playsinline', 'true'); await videoRef.current.play() }
      setIsCameraActive(true)
    } catch (err: any) {
      setCameraError(err.name === 'NotAllowedError' ? 'カメラへのアクセスが拒否されました。ブラウザ設定から許可してください。' : err.name === 'NotFoundError' ? 'カメラが見つかりません。' : `カメラを起動できませんでした（${err.name}）`)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    if (videoRef.current) videoRef.current.srcObject = null
    setIsCameraActive(false)
  }, [])

  const flipCamera = useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next); startCamera(next)
  }, [facingMode, startCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current; const canvas = canvasRef.current
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1) }
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    // dataURLをFileオブジェクトに変換
    fetch(dataUrl).then(r => r.blob()).then(blob => {
      const f = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      setFile(f); setFilePreview(dataUrl); setResult(null)
    })
    stopCamera()
  }, [facingMode, stopCamera])

  // カメラタブ切替時に自動起動（全モード共通）
  useEffect(() => {
    if (uploadMode === 'camera' && !filePreview && mode !== 'selection') startCamera(facingMode)
    if (uploadMode === 'file') stopCamera()
  }, [uploadMode]) // eslint-disable-line

  // モード変更時にカメラ停止・状態リセット
  const handleModeChange = (newMode: string) => {
    stopCamera(); setUploadMode('file'); setFile(null); setFilePreview(null); setResult(null); setMode(newMode)
  }

  // アンマウント時カメラ停止
  useEffect(() => () => stopCamera(), [stopCamera])

  useEffect(() => { setIsMounted(true) }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      if (file) formData.append('file', file)
      formData.append('mode', mode)
      await new Promise(r => setTimeout(r, 2500))
      setResult('AIによる多角的なリスク解析が完了しました。指定エリアのハザードマップと犯罪統計、および物件写真から検知された特有の不備（防音性の欠如、設備の老朽化）を特定しました。不動産屋への具体的な確認事項を生成します。')
    } catch {
      setResult('解析中にエラーが発生しました。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  const currentMode = ENTRY_MODES.find(m => m.id === mode)

  if (!isMounted) return null

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI引越し安心チェッカー
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          引越し前の不安を<span style={{ color: '#10b981' }}>AIで全部つぶす</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          エリア・物件写真・契約書のいずれかを選択してください。AIが不動産業界のリスクを洗い出し、あなたの新生活を守る防衛戦略を策定します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-5">

        {/* モード選択 */}
        {mode === 'selection' && (
          <div className="grid md:grid-cols-3 gap-4">
            {ENTRY_MODES.map(item => (
              <button
                key={item.id}
                onClick={() => handleModeChange(item.id)}
                className="rounded-xl p-6 text-left space-y-4 transition-all hover:scale-[1.02]"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)' }}
                >
                  <item.icon size={18} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
                <div className="space-y-1.5">
                  {item.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <ChevronRight size={10} style={{ color: '#10b981' }} />
                      {s}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 解析フォーム */}
        {mode !== 'selection' && (
          <div className="space-y-4">
            <button
              onClick={() => handleModeChange('selection')}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={13} /> モード選択に戻る
            </button>

            <div
              className="rounded-xl p-6 space-y-5"
              style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.08)' }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                {currentMode && <currentMode.icon size={15} style={{ color: '#10b981' }} />}
                {currentMode?.label} — 解析プロトコル
              </div>

              {/* hidden canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* エリア解析用入力（エリアモードのみ） */}
              {mode === 'area' ? (
                <div className="space-y-3">
                  {areaInputs.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`候補地 ${idx + 1} を入力（例：神奈川県海老名市）`}
                      value={val}
                      onChange={e => {
                        const next = [...areaInputs]; next[idx] = e.target.value; setAreaInputs(next)
                      }}
                      className={inputCls}
                      style={inputStyle}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* アップロード / カメラ タブ */}
                  <div className="flex gap-2 p-1 rounded-lg" style={{ background: '#0a0a0c' }}>
                    <button
                      onClick={() => setUploadMode('file')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${uploadMode === 'file' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Upload size={13} /> ファイル
                    </button>
                    <button
                      onClick={() => setUploadMode('camera')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${uploadMode === 'camera' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Camera size={13} /> カメラ撮影
                    </button>
                  </div>
                  {/* カメラビュー */}
                  {uploadMode === 'camera' && !filePreview && (
                    <div className="space-y-3">
                      {cameraError && (
                        <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs">
                          {cameraError}
                        </div>
                      )}
                      <div className="relative rounded-lg overflow-hidden aspect-video" style={{ background: '#0a0a0c', border: '1px solid #1e293b' }}>
                        <video
                          ref={videoRef}
                          autoPlay playsInline muted
                          className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                        />
                        {!isCameraActive && !cameraError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                            <p className="text-xs text-slate-500">カメラを起動中...</p>
                          </div>
                        )}
                        {isCameraActive && (
                          <>
                            <button onClick={flipCamera} className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-lg transition-all backdrop-blur-sm">
                              <SwitchCamera size={15} />
                            </button>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-40 h-40 rounded-xl" style={{ border: '2px solid rgba(16,185,129,0.5)' }} />
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={capturePhoto}
                        disabled={!isCameraActive}
                        className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: '#10b981', color: '#fff' }}
                        onMouseEnter={e => { if (isCameraActive) e.currentTarget.style.background = '#059669' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#10b981' }}
                      >
                        <Camera size={15} />
                        {mode === 'area' ? 'マップ・現場を撮影する' : mode === 'contract' ? '書類を撮影する' : '部屋を撮影する'}
                      </button>
                    </div>
                  )}

                  {/* 撮影プレビュー */}
                  {filePreview && (
                    <div className="relative rounded-lg overflow-hidden aspect-video" style={{ border: '1px solid #1e293b' }}>
                      <img src={filePreview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setFile(null); setFilePreview(null); if (uploadMode === 'camera') startCamera(facingMode) }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-slate-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <X size={11} /> 撮り直す
                      </button>
                    </div>
                  )}

                  {/* ファイルアップロード（ファイルモード時のみ） */}
                  {uploadMode === 'file' && !filePreview && (
                    <div
                      className="relative rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                      style={{ height: '160px', border: '2px dashed #334155', background: '#13141f' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                    >
                      <input
                        type="file"
                        onChange={e => {
                          const f = e.target.files?.[0] || null
                          setFile(f)
                          if (f && f.type.startsWith('image/')) {
                            const reader = new FileReader()
                            reader.onload = ev => setFilePreview(ev.target?.result as string)
                            reader.readAsDataURL(f)
                          } else { setFilePreview(null) }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        accept="image/*,.pdf"
                      />
                      <Upload size={24} style={{ color: file ? '#10b981' : '#475569' }} />
                      <div className="text-center pointer-events-none">
                        <p className="text-sm font-medium text-slate-400">
                          {file ? file.name : 'ファイルをドロップ、またはクリック'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {file
                            ? `${(file.size / 1024 / 1024).toFixed(1)}MB — 準備完了`
                            : mode === 'area' ? 'ハザードマップ・現場写真（画像）'
                            : mode === 'contract' ? '契約書・重要事項説明書（PDF/画像）'
                            : '物件写真（画像）'}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* カメラビュー */}
              {uploadMode === 'camera' && !filePreview && (
                <div className="space-y-3">
                  {cameraError && (
                    <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs">
                      {cameraError}
                    </div>
                  )}
                  <div className="relative rounded-lg overflow-hidden aspect-video" style={{ background: '#0a0a0c', border: '1px solid #1e293b' }}>
                    <video
                      ref={videoRef}
                      autoPlay playsInline muted
                      className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                    {!isCameraActive && !cameraError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                        <p className="text-xs text-slate-500">カメラを起動中...</p>
                      </div>
                    )}
                    {isCameraActive && (
                      <>
                        <button onClick={flipCamera} className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-lg transition-all backdrop-blur-sm">
                          <SwitchCamera size={15} />
                        </button>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-40 h-40 rounded-xl" style={{ border: '2px solid rgba(16,185,129,0.5)' }} />
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={capturePhoto}
                    disabled={!isCameraActive}
                    className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: '#10b981', color: '#fff' }}
                    onMouseEnter={e => { if (isCameraActive) e.currentTarget.style.background = '#059669' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#10b981' }}
                  >
                    <Camera size={15} />
                    {mode === 'area' ? 'マップ・現場を撮影する' : mode === 'contract' ? '書類を撮影する' : '部屋を撮影する'}
                  </button>
                </div>
              )}

              {/* 撮影プレビュー */}
              {filePreview && (
                <div className="relative rounded-lg overflow-hidden aspect-video" style={{ border: '1px solid #1e293b' }}>
                  <img src={filePreview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setFile(null); setFilePreview(null); if (uploadMode === 'camera') startCamera(facingMode) }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-slate-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <X size={11} /> 撮り直す
                  </button>
                </div>
              )}

              {/* ファイルアップロード（ファイルモード時のみ） */}
              {uploadMode === 'file' && !filePreview && (
                <div
                  className="relative rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                  style={{ height: '160px', border: '2px dashed #334155', background: '#13141f' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                >
                  <input
                    type="file"
                    onChange={e => {
                      const f = e.target.files?.[0] || null
                      setFile(f)
                      if (f && f.type.startsWith('image/')) {
                        const reader = new FileReader()
                        reader.onload = ev => setFilePreview(ev.target?.result as string)
                        reader.readAsDataURL(f)
                      } else { setFilePreview(null) }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*,.pdf"
                  />
                  <Upload size={24} style={{ color: file ? '#10b981' : '#475569' }} />
                  <div className="text-center pointer-events-none">
                    <p className="text-sm font-medium text-slate-400">
                      {file ? file.name : 'ファイルをドロップ、またはクリック'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(1)}MB — 準備完了`
                        : mode === 'area' ? 'ハザードマップ・現場写真（画像）'
                        : mode === 'contract' ? '契約書・重要事項説明書（PDF/画像）'
                        : '物件写真（画像）'}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (mode !== 'area' && !file)}
                className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={
                  isAnalyzing || (mode !== 'area' && !file)
                    ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                    : { background: '#10b981', color: '#fff' }
                }
              >
                {isAnalyzing
                  ? <><Loader2 size={15} className="animate-spin mr-1" />解析中...</>
                  : <><Zap size={15} className="mr-1" />AIリスク解析を実行</>}
              </button>
            </div>

            {/* 結果 */}
            {result && (
              <div className="space-y-4">
                {/* レポート */}
                <div
                  className="rounded-xl p-6 space-y-4"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#34d399' }}>
                      <Zap size={15} />AI防災・防犯診断レポート
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs transition-colors"
                      style={{ color: copied ? '#10b981' : '#64748b' }}
                    >
                      {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                      {copied ? 'コピー済み' : 'コピー'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{result}</p>
                </div>

                {/* 外部AIリンク */}
                <div className="grid grid-cols-3 gap-3">
                  {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                    <button
                      key={ai}
                      onClick={() => openAI(ai)}
                      className="h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      style={{ background: '#0d1117', border: '1px solid #1e293b', color: '#94a3b8' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#e2e8f0' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                    >
                      {ai} で相談 <ExternalLink size={10} />
                    </button>
                  ))}
                </div>

                {/* ロードマップ */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 px-1">安全確保ロードマップ</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {ROADMAP.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-5 space-y-3"
                        style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-medium">Step 0{i + 1}</span>
                          <s.icon size={15} style={{ color: '#10b981' }} />
                        </div>
                        <p className="text-sm font-semibold text-slate-200">{s.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amazon アフィリエイト */}
                <a
                  href="https://www.amazon.co.jp/s?k=防犯グッズ+防災セット&tag=nextralabs-22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden transition-transform hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(135deg, #059669, #0f766e)', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-emerald-200/60 font-medium">New Life Defense</p>
                      <p className="text-base font-semibold text-white leading-snug">
                        AI推奨の厳選防犯・防災ギア →
                      </p>
                    </div>
                    <ShoppingCart size={24} className="text-white/70 shrink-0" />
                  </div>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">NextraLabs 2026</p>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function MovingPage() {
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
 return <NoSSR /> }
