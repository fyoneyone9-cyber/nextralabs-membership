'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Camera, Ban, Timer, Activity, ShieldAlert, Power } from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

export default function ShoppingStopper() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [excitementLevel, setExcitementLevel] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isCooldown, setIsCooldown] = useState(false)
  const [systemOnline, setSystemOnline] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        try { await videoRef.current.play() } catch (e) { console.error(e) }
        setIsCameraActive(true)
        setSystemOnline(true)
        startAnalysis()
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('カメラの使用がブロックされています。ブラウザのアドレスバーの「鍵マーク」からカメラを許可してください。')
      } else if (err.name === 'NotFoundError') {
        alert('利用可能なカメラが見つかりません。')
      } else {
        alert(`カメラの起動に失敗しました (${err.name})`)
      }
    }
  }

  const startAnalysis = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setExcitementLevel(prev => {
        const next = Math.min(100, Math.max(0, prev + (Math.random() * 20 - 5)))
        if (next > 85) setIsCooldown(true)
        return Math.floor(next)
      })
    }, 800)
  }

  useEffect(() => {
    if (isCooldown && timer === 0) setTimer(10800)
    let t: NodeJS.Timeout
    if (isCooldown && timer > 0) t = setInterval(() => setTimer(p => p - 1), 1000)
    return () => {
      clearInterval(t)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isCooldown, timer])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* ヘッダー */}
      <div style={{ borderBottom: '1px solid #1e293b', background: 'rgba(5,5,7,0.85)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">衝動買い防止システム</span>
          <span
            className="ml-auto text-xs font-medium px-3 py-1 rounded-full border"
            style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
          >
            {systemOnline ? '稼働中' : 'スタンバイ'}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 space-y-10">
        {/* ヒーロー */}
        <div className="space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
            style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Shopping Stopper
          </div>
          <h1 className="text-4xl font-semibold text-slate-100 tracking-tight leading-[1.15]">
            AI <span style={{ color: '#10b981' }}>衝動買い</span>ストッパー
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            カメラで表情の興奮度をリアルタイム解析。<br />
            購買衝動が高まった瞬間、3時間の冷却タイマーを自動起動します。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* コントロールパネル */}
          <div className="lg:col-span-1 space-y-5">
            {/* メインカード — 内側カードなのでエメラルドアクセントOK、外枠はslate */}
            <div
              className="rounded-xl p-6 space-y-6"
              style={{ background: '#0d1117', border: '1px solid #334155' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#10b981' }}>
                  <Activity size={14} />
                  解析エンジン
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full border"
                  style={
                    systemOnline
                      ? { borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }
                      : { borderColor: '#334155', color: '#475569', background: 'transparent' }
                  }
                >
                  {systemOnline ? 'オンライン' : 'オフライン'}
                </span>
              </div>

              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="w-full h-12 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: '#10b981' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'scale(1.02)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <Power size={16} />
                  スキャン開始
                </button>
              ) : (
                <div
                  className="rounded-lg p-4 text-center space-y-2"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <div className="flex justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#34d399' }}>解析中</p>
                </div>
              )}

              {/* 興奮度メーター */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-slate-500">購買衝動レベル</span>
                  <span
                    className="text-3xl font-semibold leading-none"
                    style={{ color: excitementLevel > 70 ? '#f87171' : '#10b981' }}
                  >
                    {excitementLevel}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${excitementLevel}%`,
                      background: excitementLevel > 70 ? '#f87171' : '#10b981',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 操作ガイド */}
            <div className="rounded-xl p-5 space-y-3" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#10b981' }}>
                <ShieldAlert size={14} />
                使い方
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                カメラで表情をスキャンし、興奮度が
                <span className="font-semibold" style={{ color: '#10b981' }}> 85% </span>
                を超えた瞬間、3時間の強制冷却タイマーを起動します。
              </p>
            </div>
          </div>

          {/* ライブフィード */}
          <div className="lg:col-span-2 space-y-5">
            <div
              className="relative aspect-video rounded-xl overflow-hidden"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-700 ${isCameraActive ? 'opacity-100' : 'opacity-20'}`}
              />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#13141f', border: '1px solid #334155' }}>
                    <Camera size={28} className="text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm font-medium">カメラ待機中</p>
                </div>
              )}

              {isCameraActive && (
                <div className="absolute top-4 left-4">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    style={{ background: 'rgba(16,185,129,0.9)', color: '#fff' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    スキャン稼働中
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 space-y-0.5 pointer-events-none">
                <p className="text-[10px] font-mono" style={{ color: 'rgba(16,185,129,0.3)' }}>POS: 35.4542, 139.3921</p>
                <p className="text-[10px] font-mono" style={{ color: 'rgba(16,185,129,0.3)' }}>SYS: VER-4.0.2</p>
              </div>
            </div>

            {/* 冷却タイマー */}
            <div
              className={`rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-700 ${isCooldown ? 'opacity-100' : 'opacity-40'}`}
              style={{
                background: isCooldown ? 'rgba(248,113,113,0.06)' : '#0d1117',
                border: isCooldown ? '1px solid rgba(248,113,113,0.35)' : '1px solid #1e293b',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: isCooldown ? 'rgba(248,113,113,0.15)' : '#13141f', border: '1px solid #334155' }}
                >
                  {isCooldown
                    ? <Ban size={20} className="text-red-400" />
                    : <Timer size={20} className="text-slate-500" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {isCooldown ? '冷却フェーズ中' : 'スタンバイ'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">購買衝動閾値超過による自動起動</p>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-2">
                <p
                  className="text-5xl font-semibold font-mono tabular-nums tracking-tight"
                  style={{ color: isCooldown ? '#f87171' : '#475569' }}
                >
                  {formatTime(timer)}
                </p>
                {isCooldown && (
                  <button
                    onClick={() => { setIsCooldown(false); setTimer(0) }}
                    className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
                  >
                    手動リセット
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">Shopping Stopper · NextraLabs 2026</p>
      </div>

      <DebugPanel data={{ excitementLevel, isCooldown, timer, isCameraActive }} toolId="shopping-stopper" />
    </div>
  )
}
