'use client'
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2, RotateCcw, ExternalLink, Train, Hotel, Utensils, Camera, ChevronDown, ChevronUp, ArrowRight, Star, Users, Compass, Youtube } from 'lucide-react'
// Markdown renderer (no external dependency)

// ─── Markdown簡易レンダラー ───────────────────────────────────────────────────

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('#### '))
          return <h4 key={i} className="text-sm font-semibold text-slate-200 mt-3 mb-0.5">{line.replace(/^#### /, '')}</h4>
        if (line.startsWith('### '))
          return <h3 key={i} className="text-emerald-400 font-semibold mt-5 mb-2 text-base">{line.replace(/^### /, '')}</h3>
        if (line.startsWith('## '))
          return <h2 key={i} className="text-white font-bold mt-6 mb-2 text-lg">{line.replace(/^## /, '')}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <p key={i} className="text-slate-400 text-sm pl-3 before:content-['•'] before:mr-2 before:text-emerald-500">{line.replace(/^[-*] /, '')}</p>
        if (line.startsWith('---'))
          return <hr key={i} className="border-white/5 my-3" />
        if (line.trim() === '')
          return <div key={i} className="h-1" />
        // bold inline
        const boldParsed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
        return <p key={i} className="text-slate-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: boldParsed }} />
      })}
    </div>
  )
}

// ─── 定数 ──────────────────────────────────────────────────────────────────────

const PRESETS = [
  { id: 'kimetsu', label: '鬼滅の刃', emoji: '🗡️', description: '竹林・大正ロマン', color: 'border-red-500/60 hover:border-red-400' },
  { id: 'kiminonawa', label: '君の名は', emoji: '☄️', description: '飛騨古川・新宿', color: 'border-blue-500/60 hover:border-blue-400' },
  { id: 'slamdunk', label: 'スラムダンク', emoji: '🏀', description: '鎌倉・江ノ電', color: 'border-orange-500/60 hover:border-orange-400' },
  { id: 'spirited', label: '千と千尋', emoji: '🏮', description: '道後温泉・山梨', color: 'border-purple-500/60 hover:border-purple-400' },
  { id: 'evangelion', label: 'エヴァンゲリオン', emoji: '🤖', description: '箱根・宇部市', color: 'border-green-500/60 hover:border-green-400' },
  { id: 'yuruyuri', label: 'ゆるキャン△', emoji: '⛺', description: '山梨・富士山', color: 'border-yellow-500/60 hover:border-yellow-400' },
]

const TRIP_STYLES = ['日帰り', '1泊2日', '2泊3日']
const DEPARTURE_OPTIONS = ['東京', '大阪', '名古屋', '福岡', '札幌', '仙台', '広島', 'その他']
const ADULTS_OPTIONS = [1, 2, 3, 4, 5]
const BUDGET_OPTIONS = [
  { label: '〜¥5,000', value: 5000 },
  { label: '〜¥10,000', value: 10000 },
  { label: '〜¥15,000', value: 15000 },
  { label: '〜¥20,000', value: 20000 },
  { label: 'こだわらない', value: 50000 },
]

// ─── 型定義 ────────────────────────────────────────────────────────────────────

interface SacredSpot {
  name: string
  address: string
  description: string
  sceneDescription: string
  lat?: number
  lng?: number
  mapsUrl?: string
}

interface Hotel {
  name: string
  url: string
  imageUrl: string
  rating: number | null
  reviewCount: number
  minCharge: number | null
  address: string
  nearestStation: string
}

interface PlanResult {
  videoId: string | null
  videoInfo: { title: string; channelTitle: string; thumbnail: string } | null
  workTitle: string
  spots: SacredSpot[]
  hotels: Hotel[]
  itinerary: string
  tripStyle: string
  departure: string
  remainingToday: number
}

// ─── メインコンポーネント ────────────────────────────────────────────────────────

export default function PilgrimagePlanner() {
  const router = useRouter()

  // ── 入力状態 ──
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [tripStyle, setTripStyle] = useState('1泊2日')
  const [departure, setDeparture] = useState('東京')
  const [adults, setAdults] = useState(2)
  const [budget, setBudget] = useState(15000)
  const [checkinDate, setCheckinDate] = useState('')
  const [checkoutDate, setCheckoutDate] = useState('')

  // ── UI状態 ──
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlanResult | null>(null)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showDesc, setShowDesc] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const handlePresetSelect = (id: string) => {
    if (selectedPreset === id) {
      setSelectedPreset(null)
      setKeyword('')
    } else {
      setSelectedPreset(id)
      setKeyword('')
      setYoutubeUrl('')
    }
  }

  const handleSubmit = async () => {
    if (!youtubeUrl && !keyword && !selectedPreset) {
      setError('YouTube URL、作品名、またはプリセットを選択してください')
      return
    }
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/pilgrimage-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: youtubeUrl || undefined,
          keyword: keyword || undefined,
          presetId: selectedPreset || undefined,
          tripStyle,
          departure,
          adults,
          budget,
          checkinDate: checkinDate || undefined,
          checkoutDate: checkoutDate || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'エラーが発生しました')
        return
      }
      setResult(data)
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
    setYoutubeUrl('')
    setKeyword('')
    setSelectedPreset(null)
  }

  // ── 地図URL生成（複数ピン）──
  const buildMapsRouteUrl = (spots: SacredSpot[]) => {
    const validSpots = spots.filter((s) => s.mapsUrl)
    if (validSpots.length === 0) return null
    const origin = encodeURIComponent(validSpots[0].name)
    const destination = encodeURIComponent(validSpots[validSpots.length - 1].name)
    const waypoints = validSpots
      .slice(1, -1)
      .map((s) => encodeURIComponent(s.name))
      .join('|')
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=transit`
  }

  // ─── 入力フォーム ─────────────────────────────────────────────────────────────
  const renderForm = () => (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI聖地巡礼プランナー β
        </div>
        <h1 className="text-3xl font-semibold text-white leading-tight">
          推し活<span className="text-emerald-400">聖地巡礼</span><br />ツアープランナー
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          URLを貼るだけで、AI が聖地を特定して<br />最適な巡礼プランを自動生成します
        </p>
      </div>

      {/* STEP 1: 入力 */}
      <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">STEP 1 — 作品を教えてください</p>

        {/* YouTube URL */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block flex items-center gap-1.5">
            <Youtube size={14} className="text-red-400" />
            YouTube URL（任意）
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => { setYoutubeUrl(e.target.value); setSelectedPreset(null); setKeyword('') }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-[#0f1520] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>

        {/* OR区切り */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-slate-600">または</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* テキスト入力 */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">作品名・キーワードで入力</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setSelectedPreset(null); setYoutubeUrl('') }}
            placeholder="例：鬼滅の刃、君の名は、新海誠..."
            className="w-full bg-[#0f1520] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>

        {/* OR区切り */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-slate-600">または プリセットから選ぶ</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* プリセット */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p.id)}
              className={`flex flex-col items-start gap-0.5 p-3 rounded-xl border text-left transition-all ${
                selectedPreset === p.id
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : `border-white/10 bg-[#0f1520] text-slate-300 ${p.color}`
              }`}
            >
              <span className="text-xl">{p.emoji}</span>
              <span className="text-sm font-medium leading-tight">{p.label}</span>
              <span className="text-xs text-slate-500">{p.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: 旅のスタイル */}
      <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">STEP 2 — 旅のスタイル</p>

        {/* 日程 */}
        <div>
          <label className="text-sm text-slate-300 mb-2 block flex items-center gap-1.5">
            <Train size={14} className="text-emerald-400" />
            旅行スタイル
          </label>
          <div className="flex gap-2">
            {TRIP_STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setTripStyle(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  tripStyle === s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#0f1520] border border-white/10 text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 出発地・人数 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block flex items-center gap-1">
              <Compass size={13} className="text-emerald-400" />
              出発地
            </label>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full bg-[#0f1520] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
            >
              {DEPARTURE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block flex items-center gap-1">
              <Users size={13} className="text-emerald-400" />
              人数
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full bg-[#0f1520] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
            >
              {ADULTS_OPTIONS.map((n) => <option key={n} value={n}>{n}名</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* STEP 3: 宿泊予算（任意・折りたたみ） */}
      <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-sm text-slate-300"
        >
          <span className="flex items-center gap-1.5">
            <Hotel size={14} className="text-emerald-400" />
            STEP 3 — 宿泊予算・日程（任意）
          </span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* 予算 */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">1泊あたりの予算</label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setBudget(b.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      budget === b.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#0f1520] border border-white/10 text-slate-300 hover:border-emerald-500/40'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* チェックイン日 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">チェックイン日</label>
                <input
                  type="date"
                  value={checkinDate}
                  onChange={(e) => setCheckinDate(e.target.value)}
                  className="w-full bg-[#0f1520] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">チェックアウト日</label>
                <input
                  type="date"
                  value={checkoutDate}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                  className="w-full bg-[#0f1520] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* エラー */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            聖地を探しています...
          </>
        ) : (
          <>
            <MapPin size={18} />
            聖地巡礼プランを生成する
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* 説明欄 */}
      <div className="border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowDesc(!showDesc)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400"
        >
          <span>ℹ️ このツールについて</span>
          {showDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showDesc && (
          <div className="px-4 pb-4 text-xs text-slate-500 space-y-1.5">
            <p>• AIが動画メタデータ・作品情報からロケ地・聖地を推定します</p>
            <p>• ロケ地は推定情報です。必ず現地情報をご確認ください</p>
            <p>• 本日の残り利用回数：1日5回まで</p>
          </div>
        )}
      </div>

      {/* ロードマップ */}
      <div className="border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowRoadmap(!showRoadmap)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400"
        >
          <span>🛣️ ロードマップ</span>
          {showRoadmap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showRoadmap && (
          <div className="px-4 pb-4 space-y-2">
            {[
              { v: 'v1.0（現在）', desc: 'YouTube URL解析 → 聖地特定 → 楽天連携', done: true },
              { v: 'v1.5（予定）', desc: 'アニメタイトル直接入力 / シーン比較画像', done: false },
              { v: 'v2.0（予定）', desc: 'X投稿のロケ地タグ解析 / 聖地データベース', done: false },
              { v: 'v2.5（予定）', desc: 'PDFしおり生成 / LINE共有', done: false },
              { v: 'v3.0（将来）', desc: '施設タイアップ / 限定特典チケット', done: false },
            ].map((r) => (
              <div key={r.v} className="flex items-start gap-2 text-xs">
                <span className={r.done ? 'text-emerald-400' : 'text-slate-600'}>
                  {r.done ? '✅' : '⬜'}
                </span>
                <span>
                  <span className={r.done ? 'text-emerald-400 font-medium' : 'text-slate-400 font-medium'}>{r.v}</span>
                  <span className="text-slate-500"> — {r.desc}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleBack} className="w-full text-xs text-slate-600 py-2 hover:text-slate-400 transition">
        ← ダッシュボードに戻る
      </button>
    </div>
  )

  // ─── 結果表示 ──────────────────────────────────────────────────────────────────
  const renderResult = () => {
    if (!result) return null
    const mapsRouteUrl = buildMapsRouteUrl(result.spots)

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {result.workTitle} の聖地巡礼プラン
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {result.departure}出発 / {result.tripStyle} / 残り{result.remainingToday}回
            </p>
          </div>
          <button onClick={handleReset} className="flex items-center gap-1 text-slate-400 text-sm hover:text-white transition">
            <RotateCcw size={14} />
            やり直す
          </button>
        </div>

        {/* 動画情報（YouTube URLの場合） */}
        {result.videoInfo && (
          <div className="bg-[#0d1117] rounded-xl border border-white/5 p-4 flex gap-3">
            {result.videoInfo.thumbnail && (
              <img src={result.videoInfo.thumbnail} alt="thumbnail" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{result.videoInfo.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{result.videoInfo.channelTitle}</p>
            </div>
          </div>
        )}

        {/* 聖地スポット */}
        {result.spots.length > 0 && (
          <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-400" />
                特定された聖地スポット（{result.spots.length}件）
              </h3>
              {mapsRouteUrl && (
                <a
                  href={mapsRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  <ExternalLink size={12} />
                  ルートを見る
                </a>
              )}
            </div>
            <div className="space-y-3">
              {result.spots.map((spot, i) => (
                <div key={i} className="flex gap-3 p-3 bg-[#0f1520] rounded-lg border border-white/5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-white">{spot.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{spot.address}</p>
                      </div>
                      {spot.mapsUrl && (
                        <a
                          href={spot.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-slate-500 hover:text-emerald-400 transition"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-slate-400">📷 {spot.sceneDescription}</p>
                      <p className="text-xs text-slate-500">✨ {spot.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 楽天ホテル */}
        {result.hotels.length > 0 && (
          <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 mb-4">
              <Hotel size={14} className="text-emerald-400" />
              最寄りの宿泊先（楽天トラベル）
            </h3>
            <div className="space-y-3">
              {result.hotels.map((hotel, i) => (
                <div key={i} className="flex gap-3 p-3 bg-[#0f1520] rounded-lg border border-white/5">
                  {hotel.imageUrl && (
                    <img src={hotel.imageUrl} alt={hotel.name} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white leading-tight">{hotel.name}</p>
                      <a
                        href={hotel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition whitespace-nowrap"
                      >
                        予約 <ExternalLink size={11} />
                      </a>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {hotel.rating && (
                        <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                          <Star size={10} fill="currentColor" />
                          {hotel.rating}
                        </span>
                      )}
                      {hotel.minCharge && (
                        <span className="text-xs text-slate-400">
                          ¥{hotel.minCharge.toLocaleString()}/泊〜
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">{hotel.nearestStation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 旅程プラン（Markdown） */}
        <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 mb-4">
            <Utensils size={14} className="text-emerald-400" />
            AIが生成した旅程プラン
          </h3>
          <MarkdownRenderer content={result.itinerary} />
        </div>

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 h-11 bg-[#0d1117] border border-white/10 text-slate-300 rounded-xl text-sm hover:border-emerald-500/40 transition"
          >
            <RotateCcw size={15} />
            別の作品を探す
          </button>
          {mapsRouteUrl && (
            <a
              href={mapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition"
            >
              <Camera size={15} />
              Mapsで確認
            </a>
          )}
        </div>

        <button onClick={handleBack} className="w-full text-xs text-slate-600 py-2 hover:text-slate-400 transition">
          ← ダッシュボードに戻る
        </button>
      </div>
    )
  }

  // ─── ローディング ─────────────────────────────────────────────────────────────
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
          <MapPin size={28} className="text-emerald-400" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-white font-medium">聖地を特定中...</p>
        <p className="text-slate-500 text-sm mt-1">YouTube解析 → 地図照合 → 旅程生成</p>
      </div>
    </div>
  )

  // ─── レンダリング ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        {isLoading ? renderLoading() : result ? renderResult() : renderForm()}
      </div>
    </div>
  )
}
