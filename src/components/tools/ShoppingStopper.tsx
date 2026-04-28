'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ==================== Types ====================
interface Purchase {
  id: string
  name: string
  price: number
  category: string
  date: string
  rating: 'satisfied' | 'neutral' | 'regret' | null
  excitementAtPurchase: number
  timestamp: number
}

interface LockRecord {
  id: string
  startTime: number
  duration: number
  excitementLevel: number
  purchasedAfter: boolean
  itemConsidered: string
  priceConsidered: number
}

interface Settings {
  excitementThreshold: number
  lockDuration: number
  notificationsEnabled: boolean
}

interface ActiveLock {
  startTime: number
  duration: number
  excitementLevel: number
}

// ==================== Constants ====================
const STORAGE_KEYS = {
  purchases: 'shopping-stopper-purchases',
  settings: 'shopping-stopper-settings',
  locks: 'shopping-stopper-locks',
  stats: 'shopping-stopper-stats',
  activeLock: 'shopping-stopper-active-lock',
}

const CATEGORIES = ['ファッション', 'ガジェット', '食品', '趣味', '日用品', 'その他']

const LOCK_DURATIONS = [
  { label: '1時間', value: 3600000 },
  { label: '3時間', value: 10800000 },
  { label: '6時間', value: 21600000 },
  { label: '12時間', value: 43200000 },
  { label: '24時間', value: 86400000 },
]

const WISDOM_QUOTES = [
  '「本当に必要なものは、3日経っても欲しいもの」',
  '「衝動買いの80%は1週間後に後悔する」',
  '「その金額を時給に換算してみよう」',
  '「去年買って使わなかったものを思い出して」',
  '「欲しいと思った瞬間が一番危険」',
  '「貯金は未来の自分へのプレゼント」',
  '「安いから買うのではなく、必要だから買う」',
  '「カートに入れるのと、購入ボタンを押すのは別のこと」',
  '「持たない豊かさを知ろう」',
  '「今の感情は一時的。判断は冷静な時に」',
]

const DEFAULT_SETTINGS: Settings = {
  excitementThreshold: 70,
  lockDuration: 10800000,
  notificationsEnabled: true,
}

// ==================== Helpers ====================
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch { /* ignore */ }
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// ==================== Main Component ====================
export default function ShoppingStopper() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'history' | 'analysis' | 'settings'>('monitor')
  const [activeLock, setActiveLock] = useState<ActiveLock | null>(null)
  const [lockRemaining, setLockRemaining] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')

  // Check for active lock on mount
  useEffect(() => {
    const stored = loadFromStorage<ActiveLock | null>(STORAGE_KEYS.activeLock, null)
    if (stored) {
      const remaining = (stored.startTime + stored.duration) - Date.now()
      if (remaining > 0) {
        setActiveLock(stored)
      } else {
        localStorage.removeItem(STORAGE_KEYS.activeLock)
      }
    }
  }, [])

  // Lock timer countdown
  useEffect(() => {
    if (!activeLock) return
    const interval = setInterval(() => {
      const remaining = (activeLock.startTime + activeLock.duration) - Date.now()
      if (remaining <= 0) {
        setActiveLock(null)
        localStorage.removeItem(STORAGE_KEYS.activeLock)
        setLockRemaining(0)
      } else {
        setLockRemaining(remaining)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [activeLock])

  // Rotate quotes
  useEffect(() => {
    if (!activeLock) return
    const interval = setInterval(() => {
      setCurrentQuoteIndex(i => (i + 1) % WISDOM_QUOTES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeLock])

  // Breathing exercise
  useEffect(() => {
    if (!activeLock) return
    const phases: Array<{ phase: typeof breathPhase; dur: number }> = [
      { phase: 'inhale', dur: 4000 },
      { phase: 'hold', dur: 4000 },
      { phase: 'exhale', dur: 6000 },
    ]
    let idx = 0
    let timeout: NodeJS.Timeout

    const next = () => {
      setBreathPhase(phases[idx].phase)
      timeout = setTimeout(() => {
        idx = (idx + 1) % phases.length
        next()
      }, phases[idx].dur)
    }
    next()
    return () => clearTimeout(timeout)
  }, [activeLock])

  const triggerLock = useCallback((excitementLevel: number, settings: Settings) => {
    const lock: ActiveLock = {
      startTime: Date.now(),
      duration: settings.lockDuration,
      excitementLevel,
    }
    setActiveLock(lock)
    saveToStorage(STORAGE_KEYS.activeLock, lock)

    // Record lock
    const locks = loadFromStorage<LockRecord[]>(STORAGE_KEYS.locks, [])
    locks.push({
      id: generateId(),
      startTime: lock.startTime,
      duration: lock.duration,
      excitementLevel,
      purchasedAfter: false,
      itemConsidered: '',
      priceConsidered: 0,
    })
    saveToStorage(STORAGE_KEYS.locks, locks)
  }, [])

  // Lock overlay
  if (activeLock && lockRemaining > 0) {
    const progress = 1 - (lockRemaining / activeLock.duration)
    const regretPurchases = loadFromStorage<Purchase[]>(STORAGE_KEYS.purchases, [])
      .filter(p => p.rating === 'regret')
      .slice(-3)

    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* Breathing circle */}
          <div className="mb-8 flex justify-center">
            <div
              className={`rounded-full border-4 border-red-500/50 flex items-center justify-center transition-all duration-[2000ms] ease-in-out ${
                breathPhase === 'inhale' ? 'w-40 h-40 bg-red-500/20' :
                breathPhase === 'hold' ? 'w-40 h-40 bg-red-500/30' :
                'w-24 h-24 bg-red-500/10'
              }`}
            >
              <span className="text-red-300 text-sm font-medium">
                {breathPhase === 'inhale' ? '吸う...' : breathPhase === 'hold' ? '止める...' : '吐く...'}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">🛑 冷却期間中</h1>
          <p className="text-red-400 text-xl font-bold mb-2">本当に必要ですか？</p>

          {/* Countdown */}
          <div className="text-5xl font-mono font-bold text-white mb-4">
            {formatDuration(lockRemaining)}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Wisdom quote */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <p className="text-gray-300 text-lg italic">
              {WISDOM_QUOTES[currentQuoteIndex]}
            </p>
          </div>

          {/* Past regrets */}
          {regretPurchases.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-2">📋 過去の後悔した買い物</p>
              {regretPurchases.map(p => (
                <div key={p.id} className="text-gray-500 text-sm">
                  😰 {p.name} — ¥{p.price.toLocaleString()}
                </div>
              ))}
            </div>
          )}

          <p className="text-gray-600 text-xs">
            興奮度 {activeLock.excitementLevel}% で発動 ・ タイマー終了まで閉じられません
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'monitor' as const, label: 'モニター', emoji: '📷' },
    { id: 'history' as const, label: '履歴', emoji: '📋' },
    { id: 'analysis' as const, label: '分析', emoji: '📊' },
    { id: 'settings' as const, label: '設定', emoji: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛑</span>
              <h1 className="text-lg font-bold">AI買い物依存ストッパー</h1>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-3 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-red-400 border border-gray-800 border-b-gray-950'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'monitor' && <MonitorTab onTriggerLock={triggerLock} />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

// ==================== Monitor Tab ====================
function MonitorTab({ onTriggerLock }: { onTriggerLock: (level: number, settings: Settings) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevFrameRef = useRef<ImageData | null>(null)
  const excitementHistoryRef = useRef<number[]>([])

  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [excitementScore, setExcitementScore] = useState(0)
  const [skinRatio, setSkinRatio] = useState(0)
  const [motionLevel, setMotionLevel] = useState(0)
  const [brightnessVar, setBrightnessVar] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number>(0)

  const settings = loadFromStorage<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
    } catch (err) {
      setCameraError('カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }
    setCameraActive(false)
    prevFrameRef.current = null
  }, [])

  // Frame analysis loop
  useEffect(() => {
    if (!cameraActive) return

    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let lastAnalysis = 0
    const ANALYSIS_INTERVAL = 200 // ms

    const analyze = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(analyze)

      if (timestamp - lastAnalysis < ANALYSIS_INTERVAL) return
      lastAnalysis = timestamp

      if (video.readyState < video.HAVE_ENOUGH_DATA) return

      canvas.width = 320
      canvas.height = 240
      ctx.drawImage(video, 0, 0, 320, 240)

      const imageData = ctx.getImageData(0, 0, 320, 240)
      const data = imageData.data

      // 1. Skin color detection (detect face region)
      let skinPixels = 0
      let totalPixels = 0
      let skinBrightness = 0
      let skinBrightnessSquared = 0

      for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        totalPixels++

        // Skin color detection in RGB space
        const isSkin = r > 95 && g > 40 && b > 20 &&
          r > g && r > b &&
          (r - g) > 15 &&
          Math.abs(r - g) < 100 &&
          (r - b) > 15
        
        if (isSkin) {
          skinPixels++
          const brightness = (r + g + b) / 3
          skinBrightness += brightness
          skinBrightnessSquared += brightness * brightness
        }
      }

      const skinR = skinPixels / totalPixels
      setSkinRatio(Math.round(skinR * 100))

      // 2. Brightness variance in skin region (indicates facial expression changes)
      let bVar = 0
      if (skinPixels > 10) {
        const meanBrightness = skinBrightness / skinPixels
        bVar = (skinBrightnessSquared / skinPixels) - (meanBrightness * meanBrightness)
        bVar = Math.min(100, bVar / 10) // normalize
      }
      setBrightnessVar(Math.round(bVar))

      // 3. Motion detection between frames
      let motionSum = 0
      if (prevFrameRef.current) {
        const prevData = prevFrameRef.current.data
        let motionPixels = 0
        for (let i = 0; i < data.length; i += 16) {
          const diff = Math.abs(data[i] - prevData[i]) +
                       Math.abs(data[i + 1] - prevData[i + 1]) +
                       Math.abs(data[i + 2] - prevData[i + 2])
          if (diff > 30) motionPixels++
        }
        motionSum = (motionPixels / totalPixels) * 100
      }
      setMotionLevel(Math.round(motionSum))
      prevFrameRef.current = imageData

      // 4. Combine into excitement score
      // Face detected = higher baseline
      const faceDetected = skinR > 0.05
      let score = 0

      if (faceDetected) {
        // Motion contributes most (fidgeting, leaning forward)
        score += Math.min(40, motionSum * 2)
        // Brightness variance (facial expression changes)
        score += Math.min(30, bVar * 0.5)
        // Skin ratio changes (face getting closer = more excited/leaning in)
        score += Math.min(15, skinR * 50)
        // Add small random variation for realism
        score += Math.random() * 5
        // Baseline excitement from having face detected
        score += 10
      } else {
        score = Math.random() * 15
      }

      score = Math.min(100, Math.max(0, Math.round(score)))

      // Smooth with history
      excitementHistoryRef.current.push(score)
      if (excitementHistoryRef.current.length > 10) {
        excitementHistoryRef.current.shift()
      }
      const smoothed = Math.round(
        excitementHistoryRef.current.reduce((a, b) => a + b, 0) / excitementHistoryRef.current.length
      )

      setExcitementScore(smoothed)
    }

    animFrameRef.current = requestAnimationFrame(analyze)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cameraActive])

  // Cleanup
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const getScoreColor = (score: number) => {
    if (score < 30) return { color: 'text-green-400', bg: 'bg-green-500', label: '😌 冷静' }
    if (score < 60) return { color: 'text-yellow-400', bg: 'bg-yellow-500', label: '🤔 注意' }
    if (score < 80) return { color: 'text-orange-400', bg: 'bg-orange-500', label: '😤 高揚' }
    return { color: 'text-red-400', bg: 'bg-red-500', label: '🔥 危険' }
  }

  const scoreInfo = getScoreColor(excitementScore)

  return (
    <div className="space-y-6">
      {/* Camera Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">📷 カメラ映像</h3>
            <div className="relative aspect-[4/3] bg-gray-950 rounded-lg overflow-hidden mb-3">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
                style={{ display: cameraActive ? 'block' : 'none', transform: 'scaleX(-1)' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <span className="text-4xl mb-2">📷</span>
                  <p className="text-sm">カメラが停止中です</p>
                </div>
              )}
              {cameraActive && (
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              )}
            </div>
            {cameraError && (
              <p className="text-red-400 text-sm mb-3">{cameraError}</p>
            )}
            <div className="flex gap-2">
              {!cameraActive ? (
                <Button
                  onClick={startCamera}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  📷 カメラを起動
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  ⏹ カメラを停止
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Excitement Gauge */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">🔥 興奮度メーター</h3>

            {/* Main Gauge */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-48 h-48 mb-4">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#1f2937" strokeWidth="14" />
                  <circle
                    cx="100" cy="100" r="85"
                    fill="none"
                    stroke={excitementScore < 30 ? '#22c55e' : excitementScore < 60 ? '#eab308' : excitementScore < 80 ? '#f97316' : '#ef4444'}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${excitementScore * 5.34} 534`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${scoreInfo.color}`}>
                    {excitementScore}%
                  </span>
                  <span className="text-lg">{scoreInfo.label}</span>
                </div>
              </div>

              {/* Threshold line */}
              <div className="w-full bg-gray-800 rounded-full h-3 relative">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${scoreInfo.bg}`}
                  style={{ width: `${excitementScore}%` }}
                />
                <div
                  className="absolute top-0 h-3 w-0.5 bg-white"
                  style={{ left: `${settings.excitementThreshold}%` }}
                  title={`閾値: ${settings.excitementThreshold}%`}
                />
              </div>
              <div className="flex justify-between w-full text-xs text-gray-500 mt-1">
                <span>0% 冷静</span>
                <span>閾値 {settings.excitementThreshold}%</span>
                <span>100% 危険</span>
              </div>
            </div>

            {/* Detail metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-950 rounded-lg p-2">
                <p className="text-xs text-gray-500">顔検出</p>
                <p className="text-sm font-bold text-gray-300">{skinRatio}%</p>
              </div>
              <div className="bg-gray-950 rounded-lg p-2">
                <p className="text-xs text-gray-500">動き</p>
                <p className="text-sm font-bold text-gray-300">{motionLevel}%</p>
              </div>
              <div className="bg-gray-950 rounded-lg p-2">
                <p className="text-xs text-gray-500">表情変化</p>
                <p className="text-sm font-bold text-gray-300">{Math.round(brightnessVar)}%</p>
              </div>
            </div>

            {/* Lock button */}
            {excitementScore >= settings.excitementThreshold && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-center">
                <p className="text-red-400 text-sm mb-2">⚠️ 興奮度が閾値を超えています！</p>
                <Button
                  onClick={() => onTriggerLock(excitementScore, settings)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  🛑 冷却ロックを発動
                </Button>
              </div>
            )}

            {/* Manual trigger */}
            <div className="mt-3">
              <Button
                onClick={() => onTriggerLock(excitementScore, settings)}
                variant="outline"
                className="w-full border-gray-700 text-gray-400 hover:bg-gray-800"
                size="sm"
              >
                🔒 手動でロックを発動
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==================== History Tab ====================
function HistoryTab() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState(CATEGORIES[0])
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    setPurchases(loadFromStorage<Purchase[]>(STORAGE_KEYS.purchases, []))
  }, [])

  const addPurchase = () => {
    if (!formName || !formPrice) return
    const newPurchase: Purchase = {
      id: generateId(),
      name: formName,
      price: parseInt(formPrice),
      category: formCategory,
      date: formDate,
      rating: null,
      excitementAtPurchase: 0,
      timestamp: Date.now(),
    }
    const updated = [newPurchase, ...purchases]
    setPurchases(updated)
    saveToStorage(STORAGE_KEYS.purchases, updated)
    setFormName('')
    setFormPrice('')
    setShowForm(false)
  }

  const ratePurchase = (id: string, rating: Purchase['rating']) => {
    const updated = purchases.map(p => p.id === id ? { ...p, rating } : p)
    setPurchases(updated)
    saveToStorage(STORAGE_KEYS.purchases, updated)
  }

  const deletePurchase = (id: string) => {
    const updated = purchases.filter(p => p.id !== id)
    setPurchases(updated)
    saveToStorage(STORAGE_KEYS.purchases, updated)
  }

  const predictRegret = (purchase: Purchase): number => {
    let regretProb = 30 // baseline

    // High price = higher regret
    if (purchase.price > 10000) regretProb += 15
    if (purchase.price > 30000) regretProb += 15

    // Category patterns
    const catPurchases = purchases.filter(p => p.category === purchase.category && p.rating)
    const catRegrets = catPurchases.filter(p => p.rating === 'regret').length
    if (catPurchases.length > 0) {
      regretProb += Math.round((catRegrets / catPurchases.length) * 30)
    }

    // Fashion and gadgets have higher regret rates
    if (purchase.category === 'ファッション') regretProb += 10
    if (purchase.category === 'ガジェット') regretProb += 8

    // Essentials have lower regret
    if (purchase.category === '日用品') regretProb -= 15
    if (purchase.category === '食品') regretProb -= 10

    return Math.min(95, Math.max(5, regretProb))
  }

  return (
    <div className="space-y-6">
      {/* Add Purchase */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">📋 購入履歴</h3>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className={showForm ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {showForm ? '✕ 閉じる' : '＋ 購入を追加'}
            </Button>
          </div>

          {showForm && (
            <div className="bg-gray-950 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <Label className="text-gray-400 text-xs">商品名</Label>
                <Input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="例: ワイヤレスイヤホン"
                  className="bg-gray-900 border-gray-700 text-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-400 text-xs">金額（円）</Label>
                  <Input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="3980"
                    className="bg-gray-900 border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">カテゴリ</Label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 text-sm mt-1"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-gray-400 text-xs">購入日</Label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white mt-1"
                />
              </div>
              <Button onClick={addPurchase} className="w-full bg-red-600 hover:bg-red-700">
                追加する
              </Button>
            </div>
          )}

          {/* Purchase List */}
          {purchases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">📝</span>
              <p>購入履歴がありません</p>
              <p className="text-xs">「購入を追加」から記録を始めましょう</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {purchases.map(p => {
                const regret = predictRegret(p)
                return (
                  <div
                    key={p.id}
                    className="bg-gray-950 rounded-lg p-3 border border-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{p.name}</span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-800 text-gray-400"
                          >
                            {p.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>¥{p.price.toLocaleString()}</span>
                          <span>{p.date}</span>
                          <span className={regret > 60 ? 'text-red-400' : regret > 40 ? 'text-yellow-400' : 'text-green-400'}>
                            後悔確率: {regret}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePurchase(p.id)}
                        className="text-gray-600 hover:text-red-400 text-xs ml-2"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">評価:</span>
                      {[
                        { val: 'satisfied' as const, emoji: '😍', label: '満足' },
                        { val: 'neutral' as const, emoji: '😐', label: '普通' },
                        { val: 'regret' as const, emoji: '😰', label: '後悔' },
                      ].map(r => (
                        <button
                          key={r.val}
                          onClick={() => ratePurchase(p.id, r.val)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            p.rating === r.val
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {r.emoji} {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Analysis Tab ====================
function AnalysisTab() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [locks, setLocks] = useState<LockRecord[]>([])
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setPurchases(loadFromStorage<Purchase[]>(STORAGE_KEYS.purchases, []))
    setLocks(loadFromStorage<LockRecord[]>(STORAGE_KEYS.locks, []))
  }, [])

  // Draw chart
  useEffect(() => {
    const canvas = chartRef.current
    if (!canvas || purchases.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }

    // Group by month
    const monthlySpend: Record<string, number> = {}
    purchases.forEach(p => {
      const month = p.date.substring(0, 7) // YYYY-MM
      monthlySpend[month] = (monthlySpend[month] || 0) + p.price
    })

    const months = Object.keys(monthlySpend).sort().slice(-6) // last 6 months
    if (months.length === 0) return

    const maxSpend = Math.max(...months.map(m => monthlySpend[m]))
    const barWidth = Math.min(40, (width - padding.left - padding.right) / months.length * 0.6)
    const gap = (width - padding.left - padding.right) / months.length

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Draw bars
    months.forEach((month, i) => {
      const x = padding.left + i * gap + (gap - barWidth) / 2
      const barHeight = (monthlySpend[month] / maxSpend) * (height - padding.top - padding.bottom)
      const y = height - padding.bottom - barHeight

      // Gradient bar
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom)
      gradient.addColorStop(0, '#ef4444')
      gradient.addColorStop(1, '#f43f5e')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 3)
      ctx.fill()

      // Month label
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(month.substring(5) + '月', x + barWidth / 2, height - padding.bottom + 16)

      // Value label
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px sans-serif'
      const label = monthlySpend[month] >= 10000
        ? `¥${(monthlySpend[month] / 10000).toFixed(1)}万`
        : `¥${monthlySpend[month].toLocaleString()}`
      ctx.fillText(label, x + barWidth / 2, y - 5)
    })
  }, [purchases])

  const totalSpend = purchases.reduce((sum, p) => sum + p.price, 0)
  const ratedPurchases = purchases.filter(p => p.rating)
  const regretRate = ratedPurchases.length > 0
    ? Math.round(ratedPurchases.filter(p => p.rating === 'regret').length / ratedPurchases.length * 100)
    : 0
  const satisfiedRate = ratedPurchases.length > 0
    ? Math.round(ratedPurchases.filter(p => p.rating === 'satisfied').length / ratedPurchases.length * 100)
    : 0
  const locksThisWeek = locks.filter(l => l.startTime > Date.now() - 7 * 86400000).length
  const savedAmount = locks.filter(l => !l.purchasedAfter).length * 5000 // estimate

  // Impulse buy streak
  const getStreak = () => {
    if (purchases.length === 0) return 0
    const sorted = [...purchases].sort((a, b) => b.timestamp - a.timestamp)
    let streak = 0
    const now = new Date()
    for (let i = 0; i < 30; i++) {
      const day = new Date(now)
      day.setDate(day.getDate() - i)
      const dayStr = day.toISOString().split('T')[0]
      const dayPurchases = sorted.filter(p => p.date === dayStr)
      const hasImpulse = dayPurchases.some(p => p.rating === 'regret')
      if (hasImpulse) break
      streak++
    }
    return streak
  }

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map(cat => {
    const catPurchases = purchases.filter(p => p.category === cat)
    return {
      category: cat,
      count: catPurchases.length,
      total: catPurchases.reduce((s, p) => s + p.price, 0),
      regretRate: catPurchases.filter(p => p.rating === 'regret').length,
    }
  }).filter(c => c.count > 0).sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: '総支出', value: `¥${totalSpend.toLocaleString()}`, emoji: '💰', color: 'text-white' },
          { label: '後悔率', value: `${regretRate}%`, emoji: '😰', color: regretRate > 50 ? 'text-red-400' : 'text-green-400' },
          { label: '今週のロック', value: `${locksThisWeek}回`, emoji: '🔒', color: 'text-orange-400' },
          { label: '推定節約額', value: `¥${savedAmount.toLocaleString()}`, emoji: '💪', color: 'text-green-400' },
        ].map(stat => (
          <Card key={stat.label} className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <span className="text-2xl">{stat.emoji}</span>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* More Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <span className="text-2xl">🏆</span>
            <p className="text-xl font-bold text-yellow-400">{getStreak()}日</p>
            <p className="text-xs text-gray-500">衝動買いゼロ連続</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <span className="text-2xl">😍</span>
            <p className="text-xl font-bold text-green-400">{satisfiedRate}%</p>
            <p className="text-xs text-gray-500">満足率</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <span className="text-2xl">📦</span>
            <p className="text-xl font-bold text-white">{purchases.length}件</p>
            <p className="text-xs text-gray-500">総購入数</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">📊 月別支出推移</h3>
          {purchases.length > 0 ? (
            <canvas
              ref={chartRef}
              className="w-full"
              style={{ height: '200px' }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>データがありません。購入履歴を追加してください。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">📂 カテゴリ別分析</h3>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {categoryBreakdown.map(cat => {
                const percent = totalSpend > 0 ? Math.round((cat.total / totalSpend) * 100) : 0
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-300">{cat.category}</span>
                      <span className="text-gray-400">
                        ¥{cat.total.toLocaleString()} ({cat.count}件)
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>データがありません</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Settings Tab ====================
function SettingsTab() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [showExport, setShowExport] = useState(false)
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setSettings(loadFromStorage<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS))
  }, [])

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    saveToStorage(STORAGE_KEYS.settings, newSettings)
  }

  const exportData = () => {
    const data = {
      purchases: loadFromStorage(STORAGE_KEYS.purchases, []),
      settings: loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
      locks: loadFromStorage(STORAGE_KEYS.locks, []),
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shopping-stopper-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('✅ データをエクスポートしました')
    setTimeout(() => setMessage(''), 3000)
  }

  const importData = () => {
    try {
      const data = JSON.parse(importText)
      if (data.purchases) saveToStorage(STORAGE_KEYS.purchases, data.purchases)
      if (data.settings) {
        saveToStorage(STORAGE_KEYS.settings, data.settings)
        setSettings(data.settings)
      }
      if (data.locks) saveToStorage(STORAGE_KEYS.locks, data.locks)
      setImportText('')
      setMessage('✅ データをインポートしました')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('❌ JSONの形式が正しくありません')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const resetAll = () => {
    if (!confirm('すべてのデータを削除しますか？この操作は取り消せません。')) return
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    setSettings(DEFAULT_SETTINGS)
    setMessage('✅ すべてのデータをリセットしました')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {message && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-center">
          {message}
        </div>
      )}

      {/* Threshold */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">🎯 興奮度閾値</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">ロック発動の閾値</span>
              <span className="text-lg font-bold text-red-400">{settings.excitementThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={settings.excitementThreshold}
              onChange={e => updateSettings({ excitementThreshold: parseInt(e.target.value) })}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50% (敏感)</span>
              <span>90% (緩め)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lock Duration */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">⏱️ ロック時間</h3>
          <div className="grid grid-cols-5 gap-2">
            {LOCK_DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => updateSettings({ lockDuration: d.value })}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  settings.lockDuration === d.value
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export/Import */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">💾 データ管理</h3>
          <div className="space-y-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              📤 データをエクスポート (JSON)
            </Button>

            <div>
              <Label className="text-gray-400 text-xs">データインポート</Label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="エクスポートしたJSONを貼り付けてください"
                className="w-full bg-gray-950 border border-gray-700 text-white rounded-md px-3 py-2 text-sm mt-1 h-24 resize-none"
              />
              <Button
                onClick={importData}
                disabled={!importText}
                size="sm"
                className="mt-1 bg-gray-700 hover:bg-gray-600"
              >
                📥 インポート
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-gray-900 border-red-900/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-red-400 mb-4">⚠️ 危険ゾーン</h3>
          <p className="text-xs text-gray-500 mb-3">
            すべての購入履歴、ロック記録、設定を削除します。この操作は取り消せません。
          </p>
          <Button
            onClick={resetAll}
            variant="outline"
            className="border-red-800 text-red-400 hover:bg-red-950"
          >
            🗑️ すべてのデータをリセット
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
