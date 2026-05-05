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

const CATEGORIES = ['繝輔ぃ繝・す繝ｧ繝ｳ', '繧ｬ繧ｸ繧ｧ繝・ヨ', '鬟溷刀', '雜｣蜻ｳ', '譌･逕ｨ蜩・, '縺昴・莉・]

const LOCK_DURATIONS = [
  { label: '1譎る俣', value: 3600000 },
  { label: '3譎る俣', value: 10800000 },
  { label: '6譎る俣', value: 21600000 },
  { label: '12譎る俣', value: 43200000 },
  { label: '24譎る俣', value: 86400000 },
]

const WISDOM_QUOTES = [
  '縲梧悽蠖薙↓蠢・ｦ√↑繧ゅ・縺ｯ縲・譌･邨後▲縺ｦ繧よｬｲ縺励＞繧ゅ・縲・,
  '縲瑚｡晏虚雋ｷ縺・・80%縺ｯ1騾ｱ髢灘ｾ後↓蠕梧ｔ縺吶ｋ縲・,
  '縲後◎縺ｮ驥鷹｡阪ｒ譎らｵｦ縺ｫ謠帷ｮ励＠縺ｦ縺ｿ繧医≧縲・,
  '縲悟悉蟷ｴ雋ｷ縺｣縺ｦ菴ｿ繧上↑縺九▲縺溘ｂ縺ｮ繧呈昴＞蜃ｺ縺励※縲・,
  '縲梧ｬｲ縺励＞縺ｨ諤昴▲縺溽椪髢薙′荳逡ｪ蜊ｱ髯ｺ縲・,
  '縲瑚ｲｯ驥代・譛ｪ譚･縺ｮ閾ｪ蛻・∈縺ｮ繝励Ξ繧ｼ繝ｳ繝医・,
  '縲悟ｮ峨＞縺九ｉ雋ｷ縺・・縺ｧ縺ｯ縺ｪ縺上∝ｿ・ｦ√□縺九ｉ雋ｷ縺・・,
  '縲後き繝ｼ繝医↓蜈･繧後ｋ縺ｮ縺ｨ縲∬ｳｼ蜈･繝懊ち繝ｳ繧呈款縺吶・縺ｯ蛻･縺ｮ縺薙→縲・,
  '縲梧戟縺溘↑縺・ｱ翫°縺輔ｒ遏･繧阪≧縲・,
  '縲御ｻ翫・諢滓ュ縺ｯ荳譎ら噪縲ょ愛譁ｭ縺ｯ蜀ｷ髱吶↑譎ゅ↓縲・,
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
                {breathPhase === 'inhale' ? '蜷ｸ縺・..' : breathPhase === 'hold' ? '豁｢繧√ｋ...' : '蜷舌￥...'}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">尅 蜀ｷ蜊ｴ譛滄俣荳ｭ</h1>
          <p className="text-red-400 text-xl font-bold mb-2">譛ｬ蠖薙↓蠢・ｦ√〒縺吶°・・/p>

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
              <p className="text-gray-400 text-sm mb-2">搭 驕主悉縺ｮ蠕梧ｔ縺励◆雋ｷ縺・黄</p>
              {regretPurchases.map(p => (
                <div key={p.id} className="text-gray-500 text-sm">
                  于 {p.name} 窶・ﾂ･{p.price.toLocaleString()}
                </div>
              ))}
            </div>
          )}

          <p className="text-gray-600 text-xs">
            闊亥･ｮ蠎ｦ {activeLock.excitementLevel}% 縺ｧ逋ｺ蜍・繝ｻ 繧ｿ繧､繝槭・邨ゆｺ・∪縺ｧ髢峨§繧峨ｌ縺ｾ縺帙ｓ
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'monitor' as const, label: '繝｢繝九ち繝ｼ', emoji: '胴' },
    { id: 'history' as const, label: '螻･豁ｴ', emoji: '搭' },
    { id: 'analysis' as const, label: '蛻・梵', emoji: '投' },
    { id: 'settings' as const, label: '險ｭ螳・, emoji: '笞呻ｸ・ },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">尅</span>
              <h1 className="text-lg font-bold">AI雋ｷ縺・黄萓晏ｭ倥せ繝医ャ繝代・</h1>
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
      setCameraError('繧ｫ繝｡繝ｩ縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ縺梧拠蜷ｦ縺輔ｌ縺ｾ縺励◆縲ゅヶ繝ｩ繧ｦ繧ｶ縺ｮ險ｭ螳壹ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・)
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
    if (score < 30) return { color: 'text-green-400', bg: 'bg-green-500', label: '・ 蜀ｷ髱・ }
    if (score < 60) return { color: 'text-yellow-400', bg: 'bg-yellow-500', label: '､・豕ｨ諢・ }
    if (score < 80) return { color: 'text-orange-400', bg: 'bg-orange-500', label: '丶 鬮俶恕' }
    return { color: 'text-red-400', bg: 'bg-red-500', label: '櫨 蜊ｱ髯ｺ' }
  }

  const scoreInfo = getScoreColor(excitementScore)

  return (
    <div className="space-y-6">
      {/* Camera Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">胴 繧ｫ繝｡繝ｩ譏蜒・/h3>
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
                  <span className="text-4xl mb-2">胴</span>
                  <p className="text-sm">繧ｫ繝｡繝ｩ縺悟●豁｢荳ｭ縺ｧ縺・/p>
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
                  胴 繧ｫ繝｡繝ｩ繧定ｵｷ蜍・                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  竢ｹ 繧ｫ繝｡繝ｩ繧貞●豁｢
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Excitement Gauge */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">櫨 闊亥･ｮ蠎ｦ繝｡繝ｼ繧ｿ繝ｼ</h3>

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
                  title={`髢ｾ蛟､: ${settings.excitementThreshold}%`}
                />
              </div>
              <div className="flex justify-between w-full text-xs text-gray-500 mt-1">
                <span>0% 蜀ｷ髱・/span>
                <span>髢ｾ蛟､ {settings.excitementThreshold}%</span>
                <span>100% 蜊ｱ髯ｺ</span>
              </div>
            </div>

            {/* Detail metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-950 rounded-lg p-2">
                <p className="text-xs text-gray-500">鬘疲､懷・</p>
                <p className="text-sm font-bold text-gray-300">{skinRatio}%</p>
              </div>
              <div className="bg-gray-950 rounded-lg p-2">
                <p className="text-xs text-gray-500">蜍輔″</p>
                <p className="text-sm font-bold text-gray-300">{motionLevel}%</p>
              </div>
              <div className="bg-gray-950 rounded-lg p-2">
                <p className="text-xs text-gray-500">陦ｨ諠・､牙喧</p>
                <p className="text-sm font-bold text-gray-300">{Math.round(brightnessVar)}%</p>
              </div>
            </div>

            {/* Lock button */}
            {excitementScore >= settings.excitementThreshold && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-center">
                <p className="text-red-400 text-sm mb-2">笞・・闊亥･ｮ蠎ｦ縺碁明蛟､繧定ｶ・∴縺ｦ縺・∪縺呻ｼ・/p>
                <Button
                  onClick={() => onTriggerLock(excitementScore, settings)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  尅 蜀ｷ蜊ｴ繝ｭ繝・け繧堤匱蜍・                </Button>
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
                白 謇句虚縺ｧ繝ｭ繝・け繧堤匱蜍・              </Button>
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
    if (purchase.category === '繝輔ぃ繝・す繝ｧ繝ｳ') regretProb += 10
    if (purchase.category === '繧ｬ繧ｸ繧ｧ繝・ヨ') regretProb += 8

    // Essentials have lower regret
    if (purchase.category === '譌･逕ｨ蜩・) regretProb -= 15
    if (purchase.category === '鬟溷刀') regretProb -= 10

    return Math.min(95, Math.max(5, regretProb))
  }

  return (
    <div className="space-y-6">
      {/* Add Purchase */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">搭 雉ｼ蜈･螻･豁ｴ</h3>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className={showForm ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {showForm ? '笨・髢峨§繧・ : '・・雉ｼ蜈･繧定ｿｽ蜉'}
            </Button>
          </div>

          {showForm && (
            <div className="bg-gray-950 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <Label className="text-gray-400 text-xs">蝠・刀蜷・/Label>
                <Input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="萓・ 繝ｯ繧､繝､繝ｬ繧ｹ繧､繝､繝帙Φ"
                  className="bg-gray-900 border-gray-700 text-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-400 text-xs">驥鷹｡搾ｼ亥・・・/Label>
                  <Input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="3980"
                    className="bg-gray-900 border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">繧ｫ繝・ざ繝ｪ</Label>
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
                <Label className="text-gray-400 text-xs">雉ｼ蜈･譌･</Label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white mt-1"
                />
              </div>
              <Button onClick={addPurchase} className="w-full bg-red-600 hover:bg-red-700">
                霑ｽ蜉縺吶ｋ
              </Button>
            </div>
          )}

          {/* Purchase List */}
          {purchases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">統</span>
              <p>雉ｼ蜈･螻･豁ｴ縺後≠繧翫∪縺帙ｓ</p>
              <p className="text-xs">縲瑚ｳｼ蜈･繧定ｿｽ蜉縲阪°繧芽ｨ倬鹸繧貞ｧ九ａ縺ｾ縺励ｇ縺・/p>
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
                          <span>ﾂ･{p.price.toLocaleString()}</span>
                          <span>{p.date}</span>
                          <span className={regret > 60 ? 'text-red-400' : regret > 40 ? 'text-yellow-400' : 'text-green-400'}>
                            蠕梧ｔ遒ｺ邇・ {regret}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePurchase(p.id)}
                        className="text-gray-600 hover:text-red-400 text-xs ml-2"
                      >
                        笨・                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">隧穂ｾ｡:</span>
                      {[
                        { val: 'satisfied' as const, emoji: '・', label: '貅雜ｳ' },
                        { val: 'neutral' as const, emoji: '・', label: '譎ｮ騾・ },
                        { val: 'regret' as const, emoji: '于', label: '蠕梧ｔ' },
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
      ctx.fillText(month.substring(5) + '譛・, x + barWidth / 2, height - padding.bottom + 16)

      // Value label
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px sans-serif'
      const label = monthlySpend[month] >= 10000
        ? `ﾂ･${(monthlySpend[month] / 10000).toFixed(1)}荳㌔
        : `ﾂ･${monthlySpend[month].toLocaleString()}`
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
          { label: '邱乗髪蜃ｺ', value: `ﾂ･${totalSpend.toLocaleString()}`, emoji: '腸', color: 'text-white' },
          { label: '蠕梧ｔ邇・, value: `${regretRate}%`, emoji: '于', color: regretRate > 50 ? 'text-red-400' : 'text-green-400' },
          { label: '莉企ｱ縺ｮ繝ｭ繝・け', value: `${locksThisWeek}蝗杼, emoji: '白', color: 'text-orange-400' },
          { label: '謗ｨ螳夂ｯ邏・｡・, value: `ﾂ･${savedAmount.toLocaleString()}`, emoji: '潮', color: 'text-green-400' },
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
            <span className="text-2xl">醇</span>
            <p className="text-xl font-bold text-yellow-400">{getStreak()}譌･</p>
            <p className="text-xs text-gray-500">陦晏虚雋ｷ縺・ぞ繝ｭ騾｣邯・/p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <span className="text-2xl">・</span>
            <p className="text-xl font-bold text-green-400">{satisfiedRate}%</p>
            <p className="text-xs text-gray-500">貅雜ｳ邇・/p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <span className="text-2xl">逃</span>
            <p className="text-xl font-bold text-white">{purchases.length}莉ｶ</p>
            <p className="text-xs text-gray-500">邱剰ｳｼ蜈･謨ｰ</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">投 譛亥挨謾ｯ蜃ｺ謗ｨ遘ｻ</h3>
          {purchases.length > 0 ? (
            <canvas
              ref={chartRef}
              className="w-full"
              style={{ height: '200px' }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>繝・・繧ｿ縺後≠繧翫∪縺帙ｓ縲りｳｼ蜈･螻･豁ｴ繧定ｿｽ蜉縺励※縺上□縺輔＞縲・/p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">唐 繧ｫ繝・ざ繝ｪ蛻･蛻・梵</h3>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {categoryBreakdown.map(cat => {
                const percent = totalSpend > 0 ? Math.round((cat.total / totalSpend) * 100) : 0
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-300">{cat.category}</span>
                      <span className="text-gray-400">
                        ﾂ･{cat.total.toLocaleString()} ({cat.count}莉ｶ)
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
              <p>繝・・繧ｿ縺後≠繧翫∪縺帙ｓ</p>
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
    setMessage('笨・繝・・繧ｿ繧偵お繧ｯ繧ｹ繝昴・繝医＠縺ｾ縺励◆')
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
      setMessage('笨・繝・・繧ｿ繧偵う繝ｳ繝昴・繝医＠縺ｾ縺励◆')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('笶・JSON縺ｮ蠖｢蠑上′豁｣縺励￥縺ゅｊ縺ｾ縺帙ｓ')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const resetAll = () => {
    if (!confirm('縺吶∋縺ｦ縺ｮ繝・・繧ｿ繧貞炎髯､縺励∪縺吶°・溘％縺ｮ謫堺ｽ懊・蜿悶ｊ豸医○縺ｾ縺帙ｓ縲・)) return
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    setSettings(DEFAULT_SETTINGS)
    setMessage('笨・縺吶∋縺ｦ縺ｮ繝・・繧ｿ繧偵Μ繧ｻ繝・ヨ縺励∪縺励◆')
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
          <h3 className="text-sm font-medium text-gray-400 mb-4">識 闊亥･ｮ蠎ｦ髢ｾ蛟､</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">繝ｭ繝・け逋ｺ蜍輔・髢ｾ蛟､</span>
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
              <span>50% (謨乗─)</span>
              <span>90% (邱ｩ繧・</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lock Duration */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">竢ｱ・・繝ｭ繝・け譎る俣</h3>
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
          <h3 className="text-sm font-medium text-gray-400 mb-4">沈 繝・・繧ｿ邂｡逅・/h3>
          <div className="space-y-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              豆 繝・・繧ｿ繧偵お繧ｯ繧ｹ繝昴・繝・(JSON)
            </Button>

            <div>
              <Label className="text-gray-400 text-xs">繝・・繧ｿ繧､繝ｳ繝昴・繝・/Label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="繧ｨ繧ｯ繧ｹ繝昴・繝医＠縺櫟SON繧定ｲｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞"
                className="w-full bg-gray-950 border border-gray-700 text-white rounded-md px-3 py-2 text-sm mt-1 h-24 resize-none"
              />
              <Button
                onClick={importData}
                disabled={!importText}
                size="sm"
                className="mt-1 bg-gray-700 hover:bg-gray-600"
              >
                踏 繧､繝ｳ繝昴・繝・              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-gray-900 border-red-900/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-red-400 mb-4">笞・・蜊ｱ髯ｺ繧ｾ繝ｼ繝ｳ</h3>
          <p className="text-xs text-gray-500 mb-3">
            縺吶∋縺ｦ縺ｮ雉ｼ蜈･螻･豁ｴ縲√Ο繝・け險倬鹸縲∬ｨｭ螳壹ｒ蜑企勁縺励∪縺吶ゅ％縺ｮ謫堺ｽ懊・蜿悶ｊ豸医○縺ｾ縺帙ｓ縲・          </p>
          <Button
            onClick={resetAll}
            variant="outline"
            className="border-red-800 text-red-400 hover:bg-red-950"
          >
            卵・・縺吶∋縺ｦ縺ｮ繝・・繧ｿ繧偵Μ繧ｻ繝・ヨ
          </Button>
        </CardContent>
      </Card>
    
      </div>
  )
}


