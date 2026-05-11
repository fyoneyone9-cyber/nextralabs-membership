'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2, RotateCcw, ExternalLink, Train, Hotel, Utensils, Camera, ChevronDown, ChevronUp, ArrowRight, Users, Compass, CheckCircle } from 'lucide-react'

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
        const boldParsed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
        return <p key={i} className="text-slate-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: boldParsed }} />
      })}
    </div>
  )
}

// ─── 定数 ──────────────────────────────────────────────────────────────────────

const PRESETS = [
  { id: 'kimetsu',     label: '鬼滅の刃',    emoji: '🗡️' },
  { id: 'kiminonawa',  label: '君の名は',    emoji: '☄️' },
  { id: 'slamdunk',    label: 'スラムダンク', emoji: '🏀' },
  { id: 'spirited',    label: '千と千尋',    emoji: '🏮' },
  { id: 'evangelion',  label: 'エヴァ',      emoji: '🤖' },
  { id: 'yuruyuri',    label: 'ゆるキャン',  emoji: '⛺' },
  { id: 'yourname2',   label: '天気の子',    emoji: '🌦️' },
  { id: 'demonslayer2',label: '呪術廻戦',    emoji: '🌀' },
  { id: 'attack',      label: '進撃の巨人',  emoji: '⚔️' },
  { id: 'onepunch',    label: 'ワンピース',  emoji: '🏴‍☠️' },
  { id: 'totoro',      label: 'トトロ',      emoji: '🌳' },
  { id: 'demon',       label: '鬼太郎',      emoji: '👁️' },
  { id: 'naruto',      label: 'NARUTO',      emoji: '🍃' },
  { id: 'dragonball',  label: 'ドラゴンボール', emoji: '⭕' },
  { id: 'oshino',      label: '推しの子',    emoji: '⭐' },
  { id: 'haikyuu',    label: 'ハイキュー',  emoji: '🏐' },
  { id: 'bleach',     label: 'BLEACH',     emoji: '⚔️' },
  { id: 'conan',      label: 'コナン',      emoji: '🔍' },
  { id: 'doraemon',   label: 'ドラえもん',  emoji: '🤖' },
  { id: 'fma',         label: '鋼の錬金術師', emoji: '⚗️' },
  { id: 'cowboy',      label: 'カウボーイBB', emoji: '🎺' },
  { id: 'akira',       label: 'AKIRA',        emoji: '🏍️' },
  { id: 'sailormoon',  label: 'セーラームーン', emoji: '🌙' },
  { id: 'dragonquest', label: 'ドラクエ',      emoji: '🐉' },
  { id: 'mononoke',    label: 'もののけ姫',    emoji: '🦌' },
  { id: 'howl',        label: 'ハウルの城',    emoji: '🏰' },
  { id: 'nausicaa',    label: 'ナウシカ',      emoji: '🌿' },
  { id: 'laputa',      label: 'ラピュタ',      emoji: '⚙️' },
  { id: 'ghost',       label: '攻殻機動隊',  emoji: '🤖' },
  { id: 'lotgh',       label: '銀英伝',      emoji: '🚀' },
  { id: 'vinland',     label: 'ヴィンランド', emoji: '⚔️' },
  { id: 'jojo',        label: 'ジョジョ',    emoji: '💎' },
  { id: 'rezero',      label: 'Re:ゼロ',    emoji: '🔮' },
  { id: 'maid',        label: 'メイドインA', emoji: '🕳️' },
  { id: 'violet',      label: 'ヴァイオレット', emoji: '✉️' },
  { id: 'lwa',         label: 'リトルウィッチ', emoji: '🧙' },
  { id: 'gridman',     label: 'グリッドマン', emoji: '⚡' },
  { id: 'koe',         label: '聲の形',      emoji: '🎵' },
  { id: 'anohana',     label: 'あの花',      emoji: '🌸' },
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

// ─── 入力タブ定義 ──────────────────────────────────────────────────────────────

const INPUT_TABS = [
  { id: 'work',   label: 'STEP 1', sublabel: '作品選択',   icon: '🎬' },
  { id: 'style',  label: 'STEP 2', sublabel: '旅のスタイル', icon: '🚃' },
  { id: 'budget', label: 'STEP 3', sublabel: '予算・日程',   icon: '💴' },
]

// ─── 結果タブ定義 ──────────────────────────────────────────────────────────────

const RESULT_TABS = [
  { id: 'spots',    label: '聖地スポット', icon: MapPin },
  { id: 'hotels',   label: '宿泊先',      icon: Hotel },
  { id: 'itinerary',label: '旅程プラン',  icon: Utensils },
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

interface HotelItem {
  name: string
  url: string
  description: string
  source: string
}

interface PlanResult {
  videoId: string | null
  videoInfo: { title: string; channelTitle: string; thumbnail: string } | null
  workTitle: string
  spots: SacredSpot[]
  hotels: HotelItem[]
  itinerary: string
  tripStyle: string
  departure: string
  checkinDate: string
  checkoutDate: string
  hotelArea: string
  remainingToday: number
}

// ─── メインコンポーネント ────────────────────────────────────────────────────────

export default function PilgrimagePlanner() {
  const router = useRouter()

  // ── 入力状態 ──
  const [keyword, setKeyword] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [tripStyle, setTripStyle] = useState('1泊2日')
  const [departure, setDeparture] = useState('東京')
  const [adults, setAdults] = useState(2)
  const [budget, setBudget] = useState(15000)
  const [checkinDate, setCheckinDate] = useState('')
  const [checkoutDate, setCheckoutDate] = useState('')

  // ── タブ状態 ──
  const [inputTab, setInputTab] = useState<'work' | 'style' | 'budget'>('work')
  const [resultTab, setResultTab] = useState<'spots' | 'hotels' | 'itinerary'>('spots')

  // ── UI状態 ──
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlanResult | null>(null)
  const [error, setError] = useState('')
  const [showDesc, setShowDesc] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const handlePresetSelect = (id: string) => {
    if (selectedPreset === id) {
      setSelectedPreset(null)
    } else {
      setSelectedPreset(id)
      setKeyword('')
    }
  }

  const handleSubmit = async () => {
    if (!keyword && !selectedPreset) {
      setError('作品を選択するか、作品名を入力してください')
      setInputTab('work')
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
      setResultTab('spots')
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
    setKeyword('')
    setSelectedPreset(null)
    setInputTab('work')
  }

  // ── 完了チェック ──
  const isWorkSelected = !!(keyword || selectedPreset)
  const isStyleDone = true // 常にデフォルト選択済み
  const isBudgetDone = true

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

  // ─── 入力タブナビ ─────────────────────────────────────────────────────────────
  const renderInputTabs = () => (
    <div className="flex border-b border-white/10 mb-6">
      {INPUT_TABS.map((tab) => {
        const isActive = inputTab === tab.id
        const isDone =
          tab.id === 'work' ? isWorkSelected :
          tab.id === 'style' ? isStyleDone :
          isBudgetDone
        return (
          <button
            key={tab.id}
            onClick={() => setInputTab(tab.id as typeof inputTab)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 px-2 relative transition-all ${
              isActive
                ? 'text-emerald-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {/* アクティブライン */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t" />
            )}
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide">
              {tab.label}
              {isDone && tab.id !== inputTab && (
                <CheckCircle size={10} className="text-emerald-500" />
              )}
            </span>
            <span className="text-[12px] font-medium">{tab.sublabel}</span>
          </button>
        )
      })}
    </div>
  )

  // ─── STEP 1: 作品選択タブ ──────────────────────────────────────────────────────
  const renderWorkTab = () => (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        作品をタップして選択してください（複数不可）
      </p>

      {/* フリー入力 */}
      <div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setSelectedPreset(null) }}
          placeholder="作品名を直接入力（例：転スラ、僕のヒーロー...）"
          className="w-full bg-[#0f1520] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
        />
      </div>

      {/* プリセット 4列 */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePresetSelect(p.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border text-center transition-all min-h-[72px] ${
              selectedPreset === p.id
                ? 'border-emerald-500 bg-emerald-500/10 text-white'
                : 'border-white/10 bg-[#0f1520] text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-white'
            }`}
          >
            <span className="text-xl leading-none">{p.emoji}</span>
            <span className="text-[11px] font-medium leading-tight break-keep">{p.label}</span>
          </button>
        ))}
      </div>

      {/* 次へボタン */}
      <button
        onClick={() => {
          if (!keyword && !selectedPreset) {
            setError('作品を選択するか、作品名を入力してください')
            return
          }
          setError('')
          setInputTab('style')
        }}
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition mt-2"
      >
        次へ：旅のスタイルを選ぶ
        <ArrowRight size={16} />
      </button>
    </div>
  )

  // ─── STEP 2: 旅のスタイルタブ ──────────────────────────────────────────────────
  const renderStyleTab = () => (
    <div className="space-y-5">
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
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition border ${
                tripStyle === s
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-[#0f1520] border-white/10 text-slate-300 hover:border-emerald-500/40'
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
            className="w-full bg-[#0f1520] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
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
            className="w-full bg-[#0f1520] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
          >
            {ADULTS_OPTIONS.map((n) => <option key={n} value={n}>{n}名</option>)}
          </select>
        </div>
      </div>

      {/* ナビボタン */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setInputTab('work')}
          className="flex-1 h-12 bg-[#0d1117] border border-white/10 text-slate-300 rounded-xl text-sm hover:border-emerald-500/30 transition"
        >
          ← 戻る
        </button>
        <button
          onClick={() => setInputTab('budget')}
          className="flex-[2] h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
        >
          次へ：予算・日程
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )

  // ─── STEP 3: 予算・日程タブ ────────────────────────────────────────────────────
  const renderBudgetTab = () => (
    <div className="space-y-5">
      {/* 予算 */}
      <div>
        <label className="text-sm text-slate-300 mb-2 block flex items-center gap-1.5">
          <Hotel size={14} className="text-emerald-400" />
          1泊あたりの予算
        </label>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <button
              key={b.value}
              onClick={() => setBudget(b.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                budget === b.value
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-[#0f1520] border-white/10 text-slate-300 hover:border-emerald-500/40'
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
          <label className="text-xs text-slate-400 mb-1.5 block">チェックイン日（任意）</label>
          <input
            type="date"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            className="w-full bg-[#0f1520] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">チェックアウト日（任意）</label>
          <input
            type="date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            className="w-full bg-[#0f1520] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>
      </div>

      {/* 選択サマリー */}
      <div className="bg-[#0d1117] rounded-xl border border-emerald-500/20 p-4 space-y-2">
        <p className="text-xs font-semibold text-emerald-400 mb-2">📋 プランのサマリー</p>
        <div className="grid grid-cols-2 gap-y-1.5 text-xs">
          <span className="text-slate-500">作品</span>
          <span className="text-white font-medium">
            {selectedPreset
              ? PRESETS.find(p => p.id === selectedPreset)?.label || selectedPreset
              : keyword || '未選択'}
          </span>
          <span className="text-slate-500">旅行スタイル</span>
          <span className="text-white">{tripStyle}</span>
          <span className="text-slate-500">出発地</span>
          <span className="text-white">{departure}</span>
          <span className="text-slate-500">人数</span>
          <span className="text-white">{adults}名</span>
          <span className="text-slate-500">予算/泊</span>
          <span className="text-white">{BUDGET_OPTIONS.find(b => b.value === budget)?.label || '—'}</span>
        </div>
      </div>

      {/* エラー */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ナビボタン */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => setInputTab('style')}
          className="flex-1 h-12 bg-[#0d1117] border border-white/10 text-slate-300 rounded-xl text-sm hover:border-emerald-500/30 transition"
        >
          ← 戻る
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-[2] h-12 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <MapPin size={18} />
              プランを生成する
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )

  // ─── 入力フォーム（タブ付き） ──────────────────────────────────────────────────
  const renderForm = () => (
    <div className="space-y-0">
      {/* ヘッダー */}
      <div className="text-center pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI聖地巡礼プランナー β
        </div>
        <h1 className="text-3xl font-semibold text-white leading-tight">
          推し活<span className="text-emerald-400">聖地巡礼</span><br />ツアープランナー
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          作品を選ぶだけで、AI が聖地を特定して<br />最適な巡礼プランを自動生成します
        </p>
      </div>

      {/* タブナビ */}
      <div className="bg-[#0d1117] rounded-xl border border-white/5 overflow-hidden">
        {renderInputTabs()}
        <div className="p-5">
          {inputTab === 'work'   && renderWorkTab()}
          {inputTab === 'style'  && renderStyleTab()}
          {inputTab === 'budget' && renderBudgetTab()}
        </div>
      </div>

      {/* 説明欄 */}
      <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
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
      <div className="border border-white/5 rounded-xl overflow-hidden mt-2">
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

      <button onClick={handleBack} className="w-full text-xs text-slate-600 py-3 hover:text-slate-400 transition mt-2">
        ← ダッシュボードに戻る
      </button>
    </div>
  )

  // ─── 結果タブナビ ──────────────────────────────────────────────────────────────
  const renderResultTabs = (result: PlanResult) => {
    const mapsRouteUrl = buildMapsRouteUrl(result.spots)
    return (
      <div className="space-y-0">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
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

        {/* 動画情報 */}
        {result.videoInfo && (
          <div className="bg-[#0d1117] rounded-xl border border-white/5 p-4 flex gap-3 mb-4">
            {result.videoInfo.thumbnail && (
              <img src={result.videoInfo.thumbnail} alt="thumbnail" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{result.videoInfo.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{result.videoInfo.channelTitle}</p>
            </div>
          </div>
        )}

        {/* 結果タブナビ */}
        <div className="bg-[#0d1117] rounded-xl border border-white/5 overflow-hidden mb-4">
          <div className="flex border-b border-white/10">
            {RESULT_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = resultTab === tab.id
              const count =
                tab.id === 'spots' ? result.spots.length :
                tab.id === 'hotels' ? result.hotels.length :
                null
              return (
                <button
                  key={tab.id}
                  onClick={() => setResultTab(tab.id as typeof resultTab)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 relative transition-all ${
                    isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t" />
                  )}
                  <Icon size={15} />
                  <span className="text-[11px] font-medium">
                    {tab.label}
                    {count !== null && <span className="ml-1 text-[10px] opacity-60">({count})</span>}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="p-5">
            {/* 聖地スポットタブ */}
            {resultTab === 'spots' && (
              <div className="space-y-3">
                {result.spots.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">{result.spots.length}件の聖地を特定しました</p>
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
                    {result.spots.map((spot, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-[#0f1520] rounded-xl border border-white/5">
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
                  </>
                ) : (
                  <p className="text-center text-slate-500 text-sm py-8">聖地スポットが見つかりませんでした</p>
                )}
              </div>
            )}

            {/* 宿泊先タブ */}
            {resultTab === 'hotels' && (
              <div className="space-y-3">
                {result.hotels.length > 0 ? (
                  <>
                    <p className="text-xs text-slate-400">聖地エリアの宿泊先を比較・予約できます</p>
                    {result.hotels.map((hotel, i) => (
                      <a
                        key={i}
                        href={hotel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-[#0f1520] rounded-xl border border-white/5 hover:border-emerald-500/40 transition group block"
                      >
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition">{hotel.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{hotel.description}</p>
                        </div>
                        <ExternalLink size={13} className="text-slate-600 group-hover:text-emerald-400 transition flex-shrink-0 ml-2" />
                      </a>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-slate-500 text-sm py-8">宿泊先情報が見つかりませんでした</p>
                )}
              </div>
            )}

            {/* 旅程プランタブ */}
            {resultTab === 'itinerary' && (
              <div>
                <MarkdownRenderer content={result.itinerary} />
              </div>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-3 mb-3">
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

        {/* Googleカレンダー */}
        {(() => {
          const cin = result.checkinDate || ''
          const cout = result.checkoutDate || ''
          if (!cin) return null
          const fmt = (d: string) => d.replace(/-/g, '')
          const title = encodeURIComponent(`【${result.workTitle}】聖地巡礼ツアー`)
          const details = encodeURIComponent(
            `${result.workTitle}の聖地巡礼ツアー（${result.tripStyle}）\n\nスポット:\n` +
            result.spots.map((s, i) => `${i+1}. ${s.name}`).join('\n') +
            `\n\nエリア: ${result.hotelArea}\n出発: ${result.departure}\n\n※NextraLabs 推し活聖地巡礼プランナーで生成`
          )
          const location = encodeURIComponent(result.spots[0]?.address || result.hotelArea || '')
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(cin)}/${fmt(cout)}&details=${details}&location=${location}`
          return (
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-11 w-full bg-[#0d1117] border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/10 hover:border-emerald-500/60 transition mb-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              Googleカレンダーに追加
            </a>
          )
        })()}

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
        {isLoading ? renderLoading() : result ? renderResultTabs(result) : renderForm()}
      </div>
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="pilgrimage-planner" />
</div>
  )
}
