'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload, CheckCircle2, Camera, ChefHat, Utensils,
  ClipboardPaste, RotateCcw, ArrowRight, Download,
  Lightbulb, Sparkles, ExternalLink, Info, X
} from 'lucide-react'

const TABS = [
  { id: 'scan',   label: '食材スキャン', icon: Camera },
  { id: 'recipe', label: '絶品レシピ',   icon: ChefHat },
]

const FINAL_PROMPT = `あなたはミシュランシェフです。添付された写真を分析し、食材リスト、3つの提案、詳細レシピを出力してください。`

const inputCls = `w-full rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

export default function AiRecipeScope() {
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

  const [activeTab, setActiveTab]       = useState('scan')
  const [copied, setCopied]             = useState(false)
  const [image, setImage]               = useState<string | null>(null)
  const [recipeResult, setRecipeResult] = useState('')
  const [cameraOpen, setCameraOpen]     = useState(false)
  const [cameraError, setCameraError]   = useState<string | null>(null)
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const videoRef      = useRef<HTMLVideoElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const streamRef     = useRef<MediaStream | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const openCamera = useCallback(async () => {
    setCameraError(null)
    setCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setCameraError('カメラの起動に失敗しました。ブラウザの権限設定を確認してください。')
    }
  }, [])

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOpen(false)
    setCameraError(null)
  }, [])

  const capturePhoto = useCallback(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setImage(dataUrl)
    closeCamera()
  }, [closeCamera])

  const useSample = () => {
    const url = 'https://nextralab.jp/samples/fridge-sample.jpg'
    setImage(url)
    const a = document.createElement('a'); a.href = url; a.download = 'recipe_sample_image.jpg'; a.click()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(FINAL_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI Recipe Scope
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          冷蔵庫の写真から<span style={{ color: '#10b981' }}>絶品レシピ</span>を生成
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          食材の写真をアップロード → AIへ投げる → レシピを貼り付けるだけ。
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-5">

        {/* タブ */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: '#0d1117', border: '1px solid #1e293b' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
              style={
                activeTab === tab.id
                  ? { background: '#10b981', color: '#fff' }
                  : { color: '#64748b' }
              }
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ① 食材スキャン */}
        {activeTab === 'scan' && (
          <div className="space-y-4">

            {/* 使い方 */}
            <div
              className="rounded-xl p-5 flex gap-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <Info size={14} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
              <ol className="text-xs text-slate-500 leading-relaxed space-y-1 list-decimal list-inside">
                <li>冷蔵庫の写真をアップロード</li>
                <li>「レシピ指示をコピー」してAIへ投げ、画像をドロップ</li>
                <li>AIが作ったレシピを右のエリアに貼り付け</li>
              </ol>
            </div>

            <div
              className="rounded-xl p-6 space-y-5"
              style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.08)' }}
            >
              <div className="grid md:grid-cols-2 gap-5">
                {/* 左：画像アップロード */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Utensils size={13} style={{ color: '#10b981' }} />
                    食材の写真
                  </p>

                  {/* カメラモーダル */}
                  {cameraOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }}>
                      <div className="relative w-full max-w-md mx-4">
                        <button onClick={closeCamera} className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <X size={16} />
                        </button>
                        {cameraError ? (
                          <div className="rounded-xl p-6 text-center space-y-3" style={{ background: '#0d1117', border: '1px solid #334155' }}>
                            <p className="text-sm text-red-400">{cameraError}</p>
                            <button onClick={closeCamera} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: '#1e293b', color: '#94a3b8' }}>閉じる</button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" style={{ maxHeight: '60vh', background: '#000' }} />
                            <canvas ref={canvasRef} className="hidden" />
                            <button
                              onClick={capturePhoto}
                              className="w-full h-14 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                              style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}
                            >
                              <Camera size={18} /> 撮影する
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!image ? (
                    <div className="space-y-3">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      {/* カメラ撮影ボタン（getUserMedia） */}
                      <button
                        onClick={openCamera}
                        className="w-full h-14 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                        style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 16px rgba(16,185,129,0.25)' }}
                      >
                        <Camera size={18} />
                        カメラで食材を撮影
                      </button>
                      {/* ドラッグ&ドロップ or ファイル選択 */}
                      <div
                        className="rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                        style={{ height: '140px', border: '2px dashed #334155', background: '#13141f' }}
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                      >
                        <Upload size={20} className="text-slate-600" />
                        <p className="text-xs text-slate-600">またはクリックして画像を選択</p>
                      </div>
                      <button
                        onClick={useSample}
                        className="w-full h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                        style={{ background: '#13141f', border: '1px solid #1e293b', color: '#94a3b8' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#e2e8f0' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                      >
                        <Download size={13} />
                        サンプルを保存して試す
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden" style={{ height: '180px', background: '#000' }}>
                        <img src={image} alt="食材" className="object-cover w-full h-full" />
                        <button
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                          style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                        >✕</button>
                      </div>

                      {/* コピー＆AIリンク */}
                      <button
                        onClick={handleCopy}
                        className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                        style={copied ? { background: '#059669', color: '#fff' } : { background: '#10b981', color: '#fff' }}
                      >
                        {copied
                          ? <><CheckCircle2 size={15} className="mr-1" />コピーしました</>
                          : <>レシピ指示をコピー</>}
                      </button>
                      <div className="grid grid-cols-3 gap-2">
                        {[['ChatGPT','https://chatgpt.com'],['Gemini','https://gemini.google.com'],['Claude','https://claude.ai']].map(([name, url]) => (
                          <button
                            key={name}
                            onClick={() => window.open(url, '_blank')}
                            className="h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            style={{ background: '#13141f', border: '1px solid #1e293b', color: '#94a3b8' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#e2e8f0' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                          >
                            {name} <ExternalLink size={9} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 右：レシピ貼り付け */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <ClipboardPaste size={13} style={{ color: '#10b981' }} />
                    AIのレシピを貼り付け
                  </p>
                  <textarea
                    value={recipeResult}
                    onChange={e => setRecipeResult(e.target.value)}
                    placeholder="AIから届いたレシピをここにペースト..."
                    rows={10}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#10b981')}
                    onBlur={e => (e.target.style.borderColor = '#334155')}
                  />
                </div>
              </div>

              {recipeResult && (
                <button
                  onClick={() => setActiveTab('recipe')}
                  className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  絶品レシピを確認 <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ② 絶品レシピ */}
        {activeTab === 'recipe' && (
          <div className="space-y-4">
            <div
              className="rounded-xl p-6 space-y-4"
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#34d399' }}>
                <Sparkles size={15} />
                魔法のレシピレポート
              </div>
              <div
                className="rounded-lg p-5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              >
                {recipeResult || 'レシピがありません。'}
              </div>
            </div>

            <button
              onClick={() => { setImage(null); setRecipeResult(''); setActiveTab('scan') }}
              className="w-full h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#0d1117', border: '1px solid #1e293b', color: '#64748b' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >
              <RotateCcw size={13} />
              別の料理を作る
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">NextraLabs 2026</p>
      </div>
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="ai-recipe" />
</div>
  )
}
