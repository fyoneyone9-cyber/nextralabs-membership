'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

// ---- Types ----
interface Emotion {
  name: string
  emoji: string
  confidence: number
}

interface EmotionRecord {
  timestamp: number
  emotion: Emotion
  motion: number
  volume: number
}

interface Settings {
  sensitivity: number
  notificationThreshold: number
  petType: 'dog' | 'cat'
}

const EMOTIONS: Record<string, { emoji: string; nameJa: string }> = {
  happy: { emoji: '😸', nameJa: '幸せ' },
  lonely: { emoji: '😿', nameJa: '寂しい' },
  hungry: { emoji: '🍽️', nameJa: 'お腹空いた' },
  angry: { emoji: '😾', nameJa: '怒り' },
  relaxed: { emoji: '😌', nameJa: 'リラックス' },
  excited: { emoji: '🤩', nameJa: '興奮' },
  anxious: { emoji: '😰', nameJa: '不安' },
}

function analyzeEmotion(
  motion: number,
  lowBand: number,
  midBand: number,
  highBand: number,
  petType: 'dog' | 'cat',
  sensitivity: number
): Emotion {
  const sens = sensitivity / 50 // normalize 0-100 to 0-2
  const totalAudio = (lowBand + midBand + highBand) * sens
  const adjMotion = Math.min(100, motion * sens)

  // Rule-based emotion engine
  const scores: Record<string, number> = {
    happy: 0,
    lonely: 0,
    hungry: 0,
    angry: 0,
    relaxed: 0,
    excited: 0,
    anxious: 0,
  }

  // Relaxed: low motion, low audio
  if (adjMotion < 15 && totalAudio < 20) {
    scores.relaxed += 60 + (15 - adjMotion) * 2
  }

  // Happy: moderate motion + mid-range sound (purring/panting)
  if (adjMotion > 10 && adjMotion < 50 && midBand > lowBand && midBand > highBand) {
    scores.happy += 50 + midBand * 0.5
    if (petType === 'cat' && midBand > 30) scores.happy += 20 // purring
    if (petType === 'dog' && adjMotion > 20) scores.happy += 15 // wagging
  }

  // Excited: high motion
  if (adjMotion > 50) {
    scores.excited += 40 + (adjMotion - 50) * 1.5
    if (totalAudio > 30) scores.excited += 15
  }

  // Lonely: low motion + intermittent mid/high sounds
  if (adjMotion < 20 && (midBand > 15 || highBand > 15) && totalAudio < 60) {
    scores.lonely += 45 + highBand * 0.8
    if (petType === 'cat') scores.lonely += 10
  }

  // Hungry: moderate motion + periodic vocalizations
  if (adjMotion > 5 && adjMotion < 40 && (midBand > 20 || highBand > 20)) {
    const hour = new Date().getHours()
    const mealBonus = (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 19) ? 25 : 0
    scores.hungry += 35 + mealBonus + midBand * 0.3
  }

  // Angry: high motion + low frequency sounds
  if (adjMotion > 30 && lowBand > midBand && lowBand > 20) {
    scores.angry += 40 + lowBand * 0.8
    if (petType === 'dog') scores.angry += 15 // growling
    if (petType === 'cat' && adjMotion > 40) scores.angry += 10
  }

  // Anxious: erratic motion + high frequency sounds
  if (highBand > midBand && highBand > lowBand && highBand > 15) {
    scores.anxious += 40 + highBand * 0.7
    if (adjMotion > 20 && adjMotion < 60) scores.anxious += 15
  }

  // Find the top emotion
  let topKey = 'relaxed'
  let topScore = 0
  for (const [key, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score
      topKey = key
    }
  }

  const confidence = Math.min(98, Math.max(15, topScore))

  return {
    name: topKey,
    emoji: EMOTIONS[topKey].emoji,
    confidence: Math.round(confidence),
  }
}

// ---- Simple Chart Component ----
function EmotionChart({ history }: { history: EmotionRecord[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    const w = rect.width
    const h = rect.height

    ctx.clearRect(0, 0, w, h)

    // Background
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 5; i++) {
      const y = (h / 5) * i + 20
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(w - 10, y)
      ctx.stroke()
    }

    if (history.length < 2) {
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('データ収集中...', w / 2, h / 2)
      return
    }

    const now = Date.now()
    const fiveMinAgo = now - 5 * 60 * 1000
    const visible = history.filter(r => r.timestamp >= fiveMinAgo)
    if (visible.length < 2) return

    const timeRange = now - fiveMinAgo
    const xScale = (t: number) => 40 + ((t - fiveMinAgo) / timeRange) * (w - 50)
    const yMotion = (v: number) => h - 20 - (v / 100) * (h - 40)
    const yVolume = (v: number) => h - 20 - (v / 100) * (h - 40)

    // Motion line
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    visible.forEach((r, i) => {
      const x = xScale(r.timestamp)
      const y = yMotion(r.motion)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Volume line
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    visible.forEach((r, i) => {
      const x = xScale(r.timestamp)
      const y = yVolume(r.volume)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Legend
    ctx.fillStyle = '#10b981'
    ctx.fillRect(w - 110, 8, 10, 3)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('動き', w - 95, 13)

    ctx.fillStyle = '#6366f1'
    ctx.fillRect(w - 55, 8, 10, 3)
    ctx.fillStyle = '#9ca3af'
    ctx.fillText('音量', w - 40, 13)

    // Y axis labels
    ctx.fillStyle = '#4b5563'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('100%', 35, 24)
    ctx.fillText('50%', 35, h / 2 + 4)
    ctx.fillText('0%', 35, h - 16)
  }, [history])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ height: '160px' }}
    />
  )
}

// ---- Main Component ----
export default function PetTranslator() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevFrameRef = useRef<ImageData | null>(null)
  const animationRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isRunning, setIsRunning] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>({ name: 'relaxed', emoji: '😌', confidence: 0 })
  const [motionLevel, setMotionLevel] = useState(0)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [lowBand, setLowBand] = useState(0)
  const [midBand, setMidBand] = useState(0)
  const [highBand, setHighBand] = useState(0)
  const [history, setHistory] = useState<EmotionRecord[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    sensitivity: 50,
    notificationThreshold: 80,
    petType: 'cat',
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [lastNotification, setLastNotification] = useState(0)

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
    }
  }, [])

  const sendNotification = useCallback((emotion: Emotion) => {
    const now = Date.now()
    if (!notificationsEnabled || now - lastNotification < 60000) return
    if (emotion.confidence >= settings.notificationThreshold) {
      new Notification('🐾 ペット翻訳モニター', {
        body: `${emotion.emoji} ${EMOTIONS[emotion.name].nameJa} (${emotion.confidence}%)`,
        icon: '/favicon.ico',
      })
      setLastNotification(now)
    }
  }, [notificationsEnabled, lastNotification, settings.notificationThreshold])

  const startMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
        audio: true,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Audio setup
      const audioCtx = new AudioContext()
      audioContextRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      setIsRunning(true)
    } catch (err) {
      console.error('Failed to start monitoring:', err)
      alert('カメラとマイクへのアクセスを許可してください。')
    }
  }, [])

  const stopMonitoring = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    prevFrameRef.current = null
    setIsRunning(false)
  }, [])

  // Analysis loop
  useEffect(() => {
    if (!isRunning) return

    let running = true
    let lastRecord = 0

    const analyze = () => {
      if (!running) return

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) {
        animationRef.current = requestAnimationFrame(analyze)
        return
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      canvas.width = 320
      canvas.height = 240
      ctx.drawImage(video, 0, 0, 320, 240)
      const currentFrame = ctx.getImageData(0, 0, 320, 240)

      // Motion detection
      let motion = 0
      if (prevFrameRef.current) {
        const prev = prevFrameRef.current.data
        const curr = currentFrame.data
        let diff = 0
        const step = 16 // sample every 16th pixel for performance
        let count = 0
        for (let i = 0; i < curr.length; i += 4 * step) {
          const dr = Math.abs(curr[i] - prev[i])
          const dg = Math.abs(curr[i + 1] - prev[i + 1])
          const db = Math.abs(curr[i + 2] - prev[i + 2])
          if ((dr + dg + db) / 3 > 25) diff++
          count++
        }
        motion = Math.min(100, (diff / count) * 100 * 2)
      }
      prevFrameRef.current = currentFrame

      // Draw motion overlay
      if (motion > 5) {
        ctx.fillStyle = `rgba(16, 185, 129, ${Math.min(0.3, motion / 200)})`
        ctx.fillRect(0, 0, 320, 240)
      }

      setMotionLevel(motion)

      // Audio analysis
      let low = 0, mid = 0, high = 0
      if (analyserRef.current) {
        const analyser = analyserRef.current
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)

        // Split into 3 bands
        const third = Math.floor(bufferLength / 3)
        let lowSum = 0, midSum = 0, highSum = 0
        for (let i = 0; i < third; i++) lowSum += dataArray[i]
        for (let i = third; i < third * 2; i++) midSum += dataArray[i]
        for (let i = third * 2; i < bufferLength; i++) highSum += dataArray[i]

        low = (lowSum / third / 255) * 100
        mid = (midSum / third / 255) * 100
        high = (highSum / (bufferLength - third * 2) / 255) * 100
      }

      setLowBand(low)
      setMidBand(mid)
      setHighBand(high)
      const vol = (low + mid + high) / 3
      setVolumeLevel(vol)

      // Emotion analysis (every 500ms)
      const now = Date.now()
      if (now - lastRecord > 500) {
        const emotion = analyzeEmotion(motion, low, mid, high, settings.petType, settings.sensitivity)
        setCurrentEmotion(emotion)
        sendNotification(emotion)

        const record: EmotionRecord = {
          timestamp: now,
          emotion,
          motion,
          volume: vol,
        }
        setHistory(prev => {
          const fiveMinAgo = now - 5 * 60 * 1000
          return [...prev.filter(r => r.timestamp > fiveMinAgo), record]
        })
        lastRecord = now
      }

      animationRef.current = requestAnimationFrame(analyze)
    }

    animationRef.current = requestAnimationFrame(analyze)

    return () => {
      running = false
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, settings, sendNotification])

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopMonitoring() }
  }, [stopMonitoring])

  const emotionMessages: Record<string, string[]> = {
    happy: ['ご機嫌だニャ〜♪', '今すごく幸せだよ！', '一緒にいると楽しいな♪'],
    lonely: ['早く帰ってきて…', 'ひとりは寂しいよ', 'そばにいてほしいな…'],
    hungry: ['お腹空いたニャ！', 'ごはんまだ？', 'おやつちょうだい！'],
    angry: ['怒ってるんだからね！', '触らないで！', 'シャー！'],
    relaxed: ['zzz…気持ちいい…', 'まったりタイム', 'のんびりしてるよ'],
    excited: ['わーい！楽しい！', 'テンション上がる！', '遊ぼう遊ぼう！'],
    anxious: ['なんか不安…', '怖いよ…', '大丈夫かな…'],
  }

  const getMessage = (emotionName: string) => {
    const msgs = emotionMessages[emotionName] || emotionMessages.relaxed
    return msgs[Math.floor(Date.now() / 5000) % msgs.length]
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Header */}
      <div className="border-b border-[#1a1a2e] bg-[#0a0a14]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <div>
              <h1 className="text-sm font-semibold text-white">AIペット翻訳モニター</h1>
              <p className="text-xs text-gray-500">リアルタイム感情分析</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs border-gray-700 text-gray-300 hover:text-white bg-transparent"
            >
              ⚙️ 設定
            </Button>
            {!isRunning ? (
              <Button
                size="sm"
                onClick={startMonitoring}
                className="text-xs bg-violet-600 hover:bg-violet-700 border-0"
              >
                ▶️ モニタリング開始
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={stopMonitoring}
                className="text-xs"
              >
                ⏹ 停止
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Settings Panel */}
        {showSettings && (
          <Card className="bg-[#12121f] border-[#2a2a3e] mb-6">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-4">⚙️ 設定</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-400">ペットの種類</Label>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setSettings(s => ({ ...s, petType: 'cat' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.petType === 'cat'
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      🐱 猫
                    </button>
                    <button
                      onClick={() => setSettings(s => ({ ...s, petType: 'dog' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.petType === 'dog'
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      🐕 犬
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">
                    感度: {settings.sensitivity}%
                  </Label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.sensitivity}
                    onChange={(e) => setSettings(s => ({ ...s, sensitivity: parseInt(e.target.value) }))}
                    className="w-full mt-2 accent-violet-500"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">
                    通知閾値: {settings.notificationThreshold}%
                  </Label>
                  <input
                    type="range"
                    min="30"
                    max="98"
                    value={settings.notificationThreshold}
                    onChange={(e) => setSettings(s => ({ ...s, notificationThreshold: parseInt(e.target.value) }))}
                    className="w-full mt-2 accent-violet-500"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestNotificationPermission}
                    className="mt-2 text-xs border-gray-700 text-gray-300 bg-transparent w-full"
                  >
                    🔔 通知を許可する {notificationsEnabled ? '✓' : ''}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-[#12121f] border-[#2a2a3e] overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="aspect-video bg-black relative">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
                  />
                  {!isRunning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a14]/80">
                      <div className="text-center">
                        <div className="text-5xl mb-4">📷</div>
                        <p className="text-gray-400 mb-2">カメラ映像がここに表示されます</p>
                        <p className="text-gray-600 text-sm">「モニタリング開始」を押してください</p>
                      </div>
                    </div>
                  )}
                  {/* Overlay indicators */}
                  {isRunning && (
                    <>
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded">LIVE</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded text-xs text-white">
                        {settings.petType === 'cat' ? '🐱' : '🐕'} {settings.petType === 'cat' ? '猫' : '犬'}モード
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Meters */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[#12121f] border-[#2a2a3e]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">⚡ 動きレベル</span>
                    <span className="text-sm font-bold text-emerald-400">{motionLevel.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, motionLevel)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#12121f] border-[#2a2a3e]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">🔊 音量レベル</span>
                    <span className="text-sm font-bold text-indigo-400">{volumeLevel.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, volumeLevel)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audio Bands */}
            <Card className="bg-[#12121f] border-[#2a2a3e]">
              <CardContent className="p-4">
                <div className="text-xs text-gray-400 mb-3">🎵 周波数帯域分析</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">低音域</span>
                      <span className="text-xs font-mono text-red-400">{lowBand.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-200" style={{ width: `${lowBand}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">中音域</span>
                      <span className="text-xs font-mono text-yellow-400">{midBand.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full transition-all duration-200" style={{ width: `${midBand}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">高音域</span>
                      <span className="text-xs font-mono text-blue-400">{highBand.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${highBand}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Chart */}
            <Card className="bg-[#12121f] border-[#2a2a3e]">
              <CardContent className="p-4">
                <div className="text-xs text-gray-400 mb-3">📈 リアルタイム履歴（過去5分）</div>
                <EmotionChart history={history} />
              </CardContent>
            </Card>
          </div>

          {/* Emotion Display */}
          <div className="space-y-4">
            {/* Current Emotion */}
            <Card className="bg-[#12121f] border-[#2a2a3e]">
              <CardContent className="p-6 text-center">
                <div className="text-7xl mb-3">{currentEmotion.emoji}</div>
                <div className="text-xl font-bold text-white mb-1">
                  {EMOTIONS[currentEmotion.name]?.nameJa || '分析中'}
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  信頼度: {currentEmotion.confidence}%
                </div>
                <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentEmotion.confidence}%` }}
                  />
                </div>
                <div className="bg-[#0a0a14] rounded-lg p-4 border border-[#2a2a3e]">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    🐾 「{getMessage(currentEmotion.name)}」
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* All Emotions Quick View */}
            <Card className="bg-[#12121f] border-[#2a2a3e]">
              <CardContent className="p-4">
                <div className="text-xs text-gray-400 mb-3">感情一覧</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(EMOTIONS).map(([key, val]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        currentEmotion.name === key
                          ? 'bg-violet-600/20 border border-violet-500/30'
                          : 'bg-[#0a0a14]'
                      }`}
                    >
                      <span className="text-lg">{val.emoji}</span>
                      <span className={`text-xs ${currentEmotion.name === key ? 'text-violet-300 font-medium' : 'text-gray-500'}`}>
                        {val.nameJa}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent History */}
            <Card className="bg-[#12121f] border-[#2a2a3e]">
              <CardContent className="p-4">
                <div className="text-xs text-gray-400 mb-3">🕐 最近の感情変化</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-xs text-gray-600 text-center py-4">
                      モニタリング開始で記録が表示されます
                    </p>
                  ) : (
                    [...history].reverse().slice(0, 20).map((record, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600 font-mono w-12">
                          {new Date(record.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span>{record.emotion.emoji}</span>
                        <span className="text-gray-400 flex-1">
                          {EMOTIONS[record.emotion.name]?.nameJa}
                        </span>
                        <Badge variant="secondary" className="text-[10px] py-0">
                          {record.emotion.confidence}%
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
