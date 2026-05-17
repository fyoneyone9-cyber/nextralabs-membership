'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  CloudRain, Wind, Thermometer, Zap, Gift, Bell, BarChart3,
  Settings, Plus, Trash2, CheckCircle2, Clock, Send, Eye,
  CloudSnow, Sun, AlertTriangle, ChevronRight, RefreshCw,
  TrendingUp, Copy, QrCode, MapPin, Info, BookOpen
} from 'lucide-react'

// ─── 型定義 ──────────────────────────────────────────
type TriggerPreset = {
  id: string
  label: string
  icon: React.ReactNode
  condition: string
  value: number
  unit: string
  description: string
}

type Offer = {
  id: string
  title: string
  category: string
  discount: string
  message: string
  validHours: number
  active: boolean
}

type SendLog = {
  id: string
  triggeredAt: string
  triggerLabel: string
  sentCount: number
  usedCount: number
  estimatedRevenue: number
  isSample?: boolean
}

type WeatherData = {
  temp: number
  condition: string
  precipProb: number
  windSpeed: number
  icon: string
  location: string
  isReal: boolean
  fetchedAt: string
}

type SavedSettings = {
  selectedPresets: string[]
  offers: Offer[]
  sendHoursStart: number
  sendHoursEnd: number
  intervalHours: number
  notifyMethod: 'line' | 'email' | 'both'
  locationCity: string
}

// ─── プリセットデータ ─────────────────────────────────
const TRIGGER_PRESETS: TriggerPreset[] = [
  { id: 'rain', label: '☔ 雨スタート', icon: <CloudRain size={18} />, condition: '降水確率', value: 70, unit: '%以上', description: '雨が降り出したタイミングでバー・売店クーポンを送信' },
  { id: 'wind', label: '🌬️ 強風注意', icon: <Wind size={18} />, condition: '風速', value: 8, unit: 'm/s以上', description: '強風で外出困難なゲストに館内スパ・レストランを案内' },
  { id: 'cold', label: '🥶 寒波到来', icon: <Thermometer size={18} />, condition: '気温', value: 10, unit: '℃以下', description: '寒い日に温かいラウンジ・ホットドリンクを提案' },
  { id: 'typhoon', label: '🌩️ 台風接近', icon: <AlertTriangle size={18} />, condition: '降水確率', value: 85, unit: '%以上', description: '台風時に全館特典パッケージを一括送信' },
  { id: 'heat', label: '🌡️ 猛暑日', icon: <Sun size={18} />, condition: '気温', value: 35, unit: '℃以上', description: '猛暑日にプール・バー・エアコン完備の施設を案内' },
]

const OFFER_TEMPLATES = [
  { category: 'バー', title: '館内バー ハッピーアワー', discount: '500円OFF', message: '本日は外出には生憎のお天気です。館内バーで使える500円クーポンをご用意しました！本日22:00まで有効です。' },
  { category: 'レストラン', title: 'ランチ・ディナー割引', discount: '10%OFF', message: 'お天気が悪い日こそ、ゆっくりお食事を。ランチ・ディナーが10%OFFのクーポンをお届けします。' },
  { category: 'スパ', title: 'スパ&リラクゼーション', discount: '30分延長無料', message: '外は雨、中はリラックス。本日スパをご利用のお客様に30分延長サービスをプレゼント！' },
  { category: '売店', title: '売店お買い物クーポン', discount: '300円OFF', message: '館内売店で使える300円クーポンです。ご当地お土産・スナック・飲み物にどうぞ。' },
  { category: 'ルームサービス', title: 'ルームサービス無料配送', discount: '配送料無料', message: 'お部屋でゆっくりお過ごしください。本日はルームサービスの配送料を無料にいたします。' },
]

// 都市名 → 緯度経度マッピング（Open-Meteo用）
const CITY_COORDS: Record<string, { lat: number; lon: number; label: string }> = {
  tokyo: { lat: 35.6895, lon: 139.6917, label: '東京' },
  osaka: { lat: 34.6937, lon: 135.5023, label: '大阪' },
  kyoto: { lat: 35.0116, lon: 135.7681, label: '京都' },
  sapporo: { lat: 43.0642, lon: 141.3469, label: '札幌' },
  fukuoka: { lat: 33.5904, lon: 130.4017, label: '福岡' },
  nagoya: { lat: 35.1815, lon: 136.9066, label: '名古屋' },
  hiroshima: { lat: 34.3853, lon: 132.4553, label: '広島' },
  sendai: { lat: 38.2682, lon: 140.8694, label: '仙台' },
  naha: { lat: 26.2124, lon: 127.6809, label: '那覇（沖縄）' },
  hakone: { lat: 35.2329, lon: 139.1069, label: '箱根' },
}

// WMO 天気コード → 絵文字・日本語
function wmoToJa(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: '快晴' }
  if (code <= 2) return { icon: '⛅', label: '晴れ時々曇り' }
  if (code <= 3) return { icon: '☁️', label: '曇り' }
  if (code <= 49) return { icon: '🌫️', label: '霧' }
  if (code <= 59) return { icon: '🌦️', label: '霧雨' }
  if (code <= 69) return { icon: '🌧️', label: '雨' }
  if (code <= 79) return { icon: '🌨️', label: '雪' }
  if (code <= 84) return { icon: '🌧️', label: '小雨〜強雨' }
  if (code <= 94) return { icon: '⛄', label: '雪・みぞれ' }
  return { icon: '⛈️', label: '雷雨' }
}

// ─── デフォルト設定 ──────────────────────────────────
const DEFAULT_SETTINGS: SavedSettings = {
  selectedPresets: ['rain'],
  offers: [
    { id: '1', title: '館内バー ハッピーアワー', category: 'バー', discount: '500円OFF', message: '本日は外出には生憎のお天気です。館内バーで使える500円クーポンをご用意しました！', validHours: 8, active: true },
    { id: '2', title: 'スパ&リラクゼーション', category: 'スパ', discount: '30分延長無料', message: '外は雨、中はリラックス。本日スパをご利用のお客様に30分延長サービスをプレゼント！', validHours: 12, active: true },
  ],
  sendHoursStart: 9,
  sendHoursEnd: 22,
  intervalHours: 3,
  notifyMethod: 'line',
  locationCity: 'tokyo',
}

// ─── アクセスガードラッパー ────────────────────────────
function WeatherBoostGuard({ children }: { children: React.ReactNode }) {
  const [accessChecked, setAccessChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    fetch('/api/check-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'weather-boost' }),
    })
      .then(r => r.json())
      .then(d => { setHasAccess(d.hasAccess); setAccessChecked(true) })
      .catch(() => setAccessChecked(true))
  }, [])

  if (!accessChecked) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <CloudRain className="h-10 w-10 text-amber-400 mx-auto" />
        </div>
        <div>
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">🏨 エンタープライズ専用</p>
          <h1 className="text-2xl font-bold text-white mb-3">このツールは法人契約限定です</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Google天気連動型 館内消費ブーストは、ホテル・旅館向けのエンタープライズプラン専用ツールです。<br />導入のご相談はお問い合わせよりお気軽にどうぞ。
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/contact">
            <button className="h-11 px-7 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all text-sm flex items-center gap-2">
              導入のご相談・お見積もり →
            </button>
          </a>
          <a href="/enterprise">
            <button className="h-11 px-7 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold rounded-lg transition-all text-sm">
              エンタープライズプランを見る
            </button>
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// ─── メインコンポーネント ─────────────────────────────
export default function WeatherBoostApp() {
  return <WeatherBoostGuard><WeatherBoostAppInner /></WeatherBoostGuard>
}

function WeatherBoostAppInner() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trigger' | 'offer' | 'history' | 'guide'>('dashboard')
  const [settings, setSettings] = useState<SavedSettings>(DEFAULT_SETTINGS)
  const [selectedPresets, setSelectedPresets] = useState<string[]>(DEFAULT_SETTINGS.selectedPresets)
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_SETTINGS.offers)
  const [sendHoursStart, setSendHoursStart] = useState(DEFAULT_SETTINGS.sendHoursStart)
  const [sendHoursEnd, setSendHoursEnd] = useState(DEFAULT_SETTINGS.sendHoursEnd)
  const [intervalHours, setIntervalHours] = useState(DEFAULT_SETTINGS.intervalHours)
  const [notifyMethod, setNotifyMethod] = useState<'line' | 'email' | 'both'>(DEFAULT_SETTINGS.notifyMethod)
  const [locationCity, setLocationCity] = useState(DEFAULT_SETTINGS.locationCity)

  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  const [showAddOffer, setShowAddOffer] = useState(false)
  const [newOffer, setNewOffer] = useState({ title: '', category: 'バー', discount: '', message: '', validHours: 8 })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  // ─── 設定の読み込み（localStorage） ────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather-boost-settings')
      if (saved) {
        const parsed: SavedSettings = JSON.parse(saved)
        setSelectedPresets(parsed.selectedPresets ?? DEFAULT_SETTINGS.selectedPresets)
        setOffers(parsed.offers ?? DEFAULT_SETTINGS.offers)
        setSendHoursStart(parsed.sendHoursStart ?? DEFAULT_SETTINGS.sendHoursStart)
        setSendHoursEnd(parsed.sendHoursEnd ?? DEFAULT_SETTINGS.sendHoursEnd)
        setIntervalHours(parsed.intervalHours ?? DEFAULT_SETTINGS.intervalHours)
        setNotifyMethod(parsed.notifyMethod ?? DEFAULT_SETTINGS.notifyMethod)
        setLocationCity(parsed.locationCity ?? DEFAULT_SETTINGS.locationCity)
      } else {
        setIsFirstVisit(true)
      }
    } catch {}
  }, [])

  // ─── 天気取得（Open-Meteo API・キー不要） ───────────
  const fetchWeather = useCallback(async (city: string) => {
    const coords = CITY_COORDS[city]
    if (!coords) return
    setWeatherLoading(true)
    setWeatherError(null)
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&timezone=Asia%2FTokyo`
      const res = await fetch(url)
      if (!res.ok) throw new Error('天気データの取得に失敗しました')
      const data = await res.json()
      const cur = data.current
      const wmo = wmoToJa(cur.weather_code)
      setWeather({
        temp: Math.round(cur.temperature_2m),
        condition: wmo.label,
        precipProb: cur.precipitation_probability ?? 0,
        windSpeed: Math.round(cur.wind_speed_10m * 10) / 10,
        icon: wmo.icon,
        location: coords.label,
        isReal: true,
        fetchedAt: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      })
    } catch (e: any) {
      setWeatherError(e.message ?? '取得エラー')
    } finally {
      setWeatherLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather(locationCity)
  }, [locationCity, fetchWeather])

  // ─── トリガー判定 ────────────────────────────────
  const getActiveTriggers = (): TriggerPreset[] => {
    if (!weather) return []
    return TRIGGER_PRESETS.filter(p => {
      if (!selectedPresets.includes(p.id)) return false
      if (p.id === 'rain') return weather.precipProb >= 70
      if (p.id === 'typhoon') return weather.precipProb >= 85
      if (p.id === 'wind') return weather.windSpeed >= 8
      if (p.id === 'cold') return weather.temp <= 10
      if (p.id === 'heat') return weather.temp >= 35
      return false
    })
  }
  const activeTriggers = getActiveTriggers()
  const isTriggered = activeTriggers.length > 0

  // ─── 設定を保存 ──────────────────────────────────
  const saveSettings = () => {
    const toSave: SavedSettings = {
      selectedPresets,
      offers,
      sendHoursStart,
      sendHoursEnd,
      intervalHours,
      notifyMethod,
      locationCity,
    }
    localStorage.setItem('weather-boost-settings', JSON.stringify(toSave))
    setSaveSuccess(true)
    setIsFirstVisit(false)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const togglePreset = (id: string) => {
    setSelectedPresets(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const removeOffer = (id: string) => setOffers(prev => prev.filter(o => o.id !== id))
  const toggleOffer = (id: string) => setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o))

  const addOffer = () => {
    if (!newOffer.title || !newOffer.discount) return
    setOffers(prev => [...prev, { ...newOffer, id: Date.now().toString(), active: true }])
    setNewOffer({ title: '', category: 'バー', discount: '', message: '', validHours: 8 })
    setShowAddOffer(false)
  }

  const copyMessage = (msg: string, id: string) => {
    navigator.clipboard.writeText(msg)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const TABS = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <BarChart3 size={16} /> },
    { id: 'trigger', label: 'トリガー設定', icon: <Zap size={16} /> },
    { id: 'offer', label: 'オファー管理', icon: <Gift size={16} /> },
    { id: 'history', label: '送信履歴', icon: <Clock size={16} /> },
    { id: 'guide', label: '使い方', icon: <BookOpen size={16} /> },
  ] as const

  // ─── 送信履歴（サンプル）─────────────────────────
  const SAMPLE_LOGS: SendLog[] = [
    { id: '1', triggeredAt: '2026/05/12 14:22', triggerLabel: '☔ 雨スタート (降水確率82%)', sentCount: 47, usedCount: 18, estimatedRevenue: 18500, isSample: true },
    { id: '2', triggeredAt: '2026/05/11 09:15', triggerLabel: '🥶 寒波到来 (気温9℃)', sentCount: 23, usedCount: 10, estimatedRevenue: 12300, isSample: true },
    { id: '3', triggeredAt: '2026/05/10 16:40', triggerLabel: '🌬️ 強風注意 (風速11m/s)', sentCount: 31, usedCount: 14, estimatedRevenue: 9800, isSample: true },
    { id: '4', triggeredAt: '2026/05/09 11:05', triggerLabel: '☔ 雨スタート (降水確率74%)', sentCount: 52, usedCount: 22, estimatedRevenue: 24100, isSample: true },
  ]

  return (
    <div className="min-h-screen bg-[#050507] text-white font-['Inter','Noto_Sans_JP',sans-serif] pb-20">

      {/* 初回訪問バナー */}
      {isFirstVisit && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <Info size={15} />
              <span>はじめての方へ — まず <strong>「使い方」タブ</strong> で設定手順を確認してください</span>
            </div>
            <button
              onClick={() => { setActiveTab('guide'); setIsFirstVisit(false) }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap flex items-center gap-1"
            >
              使い方を見る <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="border-b border-white/5 bg-[#0a0a0f] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">☔ 館内消費ブースト</h1>
            <p className="text-slate-500 text-xs mt-0.5">Google天気連動型 自動クーポン配信</p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
            isTriggered
              ? 'bg-red-500/15 border-red-500/40 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTriggered ? 'bg-red-400' : 'bg-emerald-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isTriggered ? 'bg-red-500' : 'bg-emerald-500'}`} />
            </span>
            {isTriggered ? 'トリガー発動中' : '監視中'}
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="border-b border-white/5 bg-[#0a0a0f] px-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.icon}{tab.label}
              {tab.id === 'guide' && isFirstVisit && (
                <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8">

        {/* ─── ダッシュボードタブ ─── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 都市選択 */}
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-emerald-400 shrink-0" />
              <label className="text-xs text-slate-400 whitespace-nowrap">施設の場所：</label>
              <select
                value={locationCity}
                onChange={e => setLocationCity(e.target.value)}
                className="bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
              >
                {Object.entries(CITY_COORDS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <button
                onClick={() => fetchWeather(locationCity)}
                disabled={weatherLoading}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={13} className={weatherLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* 現在の天気カード */}
            {weatherError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center text-red-400 text-sm">
                ⚠ {weatherError} — <button onClick={() => fetchWeather(locationCity)} className="underline">再試行</button>
              </div>
            ) : !weather ? (
              <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 text-center text-slate-500 text-sm">
                天気データを取得中...
              </div>
            ) : (
              <div className={`bg-[#0d1117] border rounded-xl p-6 ${isTriggered ? 'border-red-500/30' : 'border-emerald-500/20'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        ✅ リアルタイム（Open-Meteo）
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm font-medium">📍 {weather.location} — {weather.fetchedAt} 取得</p>
                  </div>
                  {isTriggered && (
                    <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Zap size={12} /> トリガー発動中
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl mb-1">{weather.icon}</p>
                    <p className="text-white font-semibold">{weather.condition}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{weather.temp}℃</p>
                    <p className="text-slate-500 text-xs mt-1">気温</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${weather.precipProb >= 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {weather.precipProb}%
                    </p>
                    <p className="text-slate-500 text-xs mt-1">降水確率</p>
                  </div>
                </div>
                {weather.windSpeed > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-500 flex items-center gap-2">
                    <Wind size={11} /> 風速 {weather.windSpeed} m/s
                  </div>
                )}

                {/* 発動中トリガー表示 */}
                {isTriggered && (
                  <div className="mt-4 pt-4 border-t border-red-500/20">
                    <p className="text-xs text-red-400 font-semibold mb-2 flex items-center gap-1.5"><Zap size={11} /> 発動中のトリガー</p>
                    <div className="flex flex-wrap gap-2">
                      {activeTriggers.map(t => (
                        <span key={t.id} className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-3 py-1 rounded-full">{t.label}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 設定サマリー */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Settings size={15} className="text-emerald-400" /> 現在の設定</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs mb-2">有効トリガー</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPresets.map(id => {
                      const p = TRIGGER_PRESETS.find(p => p.id === id)
                      return p ? <span key={id} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full">{p.label}</span> : null
                    })}
                    {selectedPresets.length === 0 && <span className="text-slate-600 text-xs">未設定</span>}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">有効オファー</p>
                  <div className="flex flex-wrap gap-1.5">
                    {offers.filter(o => o.active).map(o => (
                      <span key={o.id} className="bg-white/5 text-slate-300 border border-white/10 text-xs px-2.5 py-1 rounded-full">{o.category}</span>
                    ))}
                    {offers.filter(o => o.active).length === 0 && <span className="text-slate-600 text-xs">未設定</span>}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">送信設定</p>
                  <p className="text-white text-xs">{sendHoursStart}:00 〜 {sendHoursEnd}:00</p>
                  <p className="text-slate-400 text-xs mt-1">インターバル: {intervalHours}時間</p>
                  <p className="text-slate-400 text-xs mt-1">
                    通知: {notifyMethod === 'line' ? 'LINE' : notifyMethod === 'email' ? 'メール' : 'LINE + メール'}
                  </p>
                </div>
              </div>
            </div>

            {/* 使い方へのリンク */}
            <button
              onClick={() => setActiveTab('guide')}
              className="w-full text-left bg-[#0d1117] border border-white/5 hover:border-emerald-500/30 rounded-xl p-5 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">このツールの使い方</p>
                    <p className="text-xs text-slate-500 mt-0.5">設定手順・LINE連携・実運用までを確認する</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
            </button>
          </div>
        )}

        {/* ─── トリガー設定タブ ─── */}
        {activeTab === 'trigger' && (
          <div className="space-y-8">
            {/* 都市設定 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5 flex items-center gap-3">
              <MapPin size={14} className="text-emerald-400 shrink-0" />
              <label className="text-xs text-slate-400 whitespace-nowrap">施設の場所：</label>
              <select
                value={locationCity}
                onChange={e => setLocationCity(e.target.value)}
                className="bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50"
              >
                {Object.entries(CITY_COORDS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-600">この都市の天気データでトリガーを判定します</p>
            </div>

            {/* プリセット選択 */}
            <div>
              <h2 className="text-base font-semibold mb-1">天気トリガー プリセット</h2>
              <p className="text-slate-500 text-sm mb-5">発動条件をワンクリックで選択。複数選択可。現在の天気に対してリアルタイムで判定されます。</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TRIGGER_PRESETS.map(preset => {
                  const isSelected = selectedPresets.includes(preset.id)
                  // 現在の天気に対して発動するか
                  const wouldFire = weather && (() => {
                    if (preset.id === 'rain') return weather.precipProb >= 70
                    if (preset.id === 'typhoon') return weather.precipProb >= 85
                    if (preset.id === 'wind') return weather.windSpeed >= 8
                    if (preset.id === 'cold') return weather.temp <= 10
                    if (preset.id === 'heat') return weather.temp >= 35
                    return false
                  })()
                  return (
                    <button
                      key={preset.id}
                      onClick={() => togglePreset(preset.id)}
                      className={`text-left p-5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0d1117] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={isSelected ? 'text-emerald-400' : 'text-slate-500'}>{preset.icon}</div>
                        {wouldFire && isSelected && (
                          <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">発動中</span>
                        )}
                        {wouldFire && !isSelected && (
                          <span className="text-xs font-medium text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">現在該当</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold mb-1">{preset.label}</p>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{preset.description}</p>
                      <div className={`text-xs font-medium px-2.5 py-1 rounded-full border w-fit ${
                        isSelected ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-500 border-white/10'
                      }`}>
                        {preset.condition} {preset.value}{preset.unit}
                      </div>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 size={12} /> 有効
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 送信時間帯・インターバル設定 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-6">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Clock size={15} className="text-emerald-400" /> 送信スケジュール</h3>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">送信時間帯（深夜通知防止）</label>
                <div className="flex items-center gap-3">
                  <select value={sendHoursStart} onChange={e => setSendHoursStart(+e.target.value)}
                    className="bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50">
                    {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{String(i).padStart(2,'0')}:00</option>)}
                  </select>
                  <span className="text-slate-500 text-sm">〜</span>
                  <select value={sendHoursEnd} onChange={e => setSendHoursEnd(+e.target.value)}
                    className="bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50">
                    {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{String(i).padStart(2,'0')}:00</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">連続発動インターバル（重複送信防止）</label>
                <div className="flex gap-2 flex-wrap">
                  {[1,2,3,6,12].map(h => (
                    <button key={h} onClick={() => setIntervalHours(h)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        intervalHours === h ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                      }`}>
                      {h}時間
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">通知方法</label>
                <div className="flex gap-2 flex-wrap">
                  {([['line', 'LINE'], ['email', 'メール'], ['both', 'LINE + メール']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setNotifyMethod(val)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        notifyMethod === val ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={saveSettings}
                className="h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2">
                {saveSuccess ? <><CheckCircle2 size={15} /> 保存しました</> : <><CheckCircle2 size={15} /> 設定を保存</>}
              </button>
            </div>
          </div>
        )}

        {/* ─── オファー管理タブ ─── */}
        {activeTab === 'offer' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">オファー（クーポン）管理</h2>
                <p className="text-slate-500 text-sm mt-0.5">天気トリガー発動時に送信するオファーを設定</p>
              </div>
              <button onClick={() => setShowAddOffer(!showAddOffer)}
                className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5">
                <Plus size={15} /> 新規追加
              </button>
            </div>

            {/* テンプレート */}
            {showAddOffer && (
              <div className="bg-[#0d1117] border border-emerald-500/30 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-emerald-400">テンプレートから選ぶ</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {OFFER_TEMPLATES.map(t => (
                    <button key={t.category} onClick={() => setNewOffer({ ...newOffer, title: t.title, category: t.category, discount: t.discount, message: t.message })}
                      className="text-left p-3 bg-[#13141f] border border-white/10 hover:border-emerald-500/40 rounded-lg transition-colors">
                      <p className="text-xs font-semibold text-emerald-400 mb-1">{t.category}</p>
                      <p className="text-xs text-slate-300 mb-1">{t.title}</p>
                      <p className="text-xs text-slate-500">{t.discount}</p>
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">タイトル</label>
                    <input value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                      className="w-full bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50"
                      placeholder="例: 館内バー ハッピーアワー" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">割引内容</label>
                    <input value={newOffer.discount} onChange={e => setNewOffer({...newOffer, discount: e.target.value})}
                      className="w-full bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50"
                      placeholder="例: 500円OFF" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">送信メッセージ</label>
                  <textarea value={newOffer.message} onChange={e => setNewOffer({...newOffer, message: e.target.value})}
                    rows={3}
                    className="w-full bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50 resize-none"
                    placeholder="ゲストに届くメッセージ文を入力" />
                </div>
                {newOffer.message && (
                  <div className="bg-[#050507] border border-white/5 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Eye size={11} /> プレビュー（ゲストが受け取るメッセージ）</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{newOffer.message}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <QrCode size={12} /> クーポンを見る
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowAddOffer(false)} className="h-9 px-4 bg-white/5 text-slate-400 text-sm rounded-lg hover:bg-white/10 transition-colors">キャンセル</button>
                  <button onClick={addOffer} className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5">
                    <Plus size={14} /> 追加
                  </button>
                </div>
              </div>
            )}

            {/* 既存オファー一覧 */}
            <div className="space-y-3">
              {offers.map(offer => (
                <div key={offer.id} className={`bg-[#0d1117] border rounded-xl p-5 transition-all ${offer.active ? 'border-white/10' : 'border-white/5 opacity-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium px-2.5 py-0.5 rounded-full">{offer.category}</span>
                        <span className="text-white text-sm font-semibold">{offer.title}</span>
                      </div>
                      <p className="text-emerald-400 text-xs font-semibold mb-2">{offer.discount}</p>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{offer.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => copyMessage(offer.message, offer.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                        {copiedId === offer.id ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => toggleOffer(offer.id)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                          offer.active ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-500 border-white/10'
                        }`}>
                        {offer.active ? '有効' : '無効'}
                      </button>
                      <button onClick={() => removeOffer(offer.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button onClick={saveSettings}
                className="h-9 px-5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2">
                {saveSuccess ? <><CheckCircle2 size={14} /> 保存しました</> : <><CheckCircle2 size={14} /> オファーを保存</>}
              </button>
            </div>
          </div>
        )}

        {/* ─── 送信履歴タブ ─── */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* サンプルデータ注記 */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <Info size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-300 leading-relaxed">
                <strong>現在はサンプルデータを表示しています。</strong><br />
                実際のLINE・メール送信機能を使うには、バックエンドAPIキー（LINE Messaging API または SendGrid）の設定が必要です。詳しくは「使い方」タブを確認してください。
              </div>
            </div>

            {/* サマリー */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '累計送信数（サンプル）', value: '153件', icon: <Send size={16} /> },
                { label: '平均使用率（サンプル）', value: '42%', icon: <Gift size={16} /> },
                { label: '推定収益増（サンプル）', value: '¥64,700', icon: <TrendingUp size={16} /> },
              ].map(s => (
                <div key={s.label} className="bg-[#0d1117] border border-white/5 rounded-xl p-4">
                  <div className="text-emerald-400 mb-2">{s.icon}</div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* 履歴テーブル */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-semibold">送信ログ</h3>
                <span className="text-xs text-amber-400 font-medium bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">サンプルデータ</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 text-xs">
                      <th className="text-left px-5 py-3">送信日時</th>
                      <th className="text-left px-5 py-3">トリガー条件</th>
                      <th className="text-right px-5 py-3">送信数</th>
                      <th className="text-right px-5 py-3">使用率</th>
                      <th className="text-right px-5 py-3">推定収益増</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_LOGS.map(log => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-4 text-slate-400 text-xs">{log.triggeredAt}</td>
                        <td className="px-5 py-4 text-white text-xs">{log.triggerLabel}</td>
                        <td className="px-5 py-4 text-right text-white font-medium">{log.sentCount}件</td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-emerald-400 font-semibold">{Math.round((log.usedCount / log.sentCount) * 100)}%</span>
                        </td>
                        <td className="px-5 py-4 text-right text-white font-medium">¥{log.estimatedRevenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── 使い方タブ ─── */}
        {activeTab === 'guide' && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold mb-2">このツールの使い方</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                「館内消費ブースト」は、<strong className="text-white">天気が悪い日に自動でゲストへクーポンを送り、館内消費を促進する</strong>ホテル・旅館向けツールです。
              </p>
            </div>

            {/* ステップ説明 */}
            {[
              {
                step: '01',
                title: '施設の場所を設定する',
                desc: 'ダッシュボードまたはトリガー設定タブから、施設がある都市を選択してください。Open-Meteo APIを使ってリアルタイムの天気データを自動取得します（APIキー不要・無料）。',
                tag: '今すぐできる',
                tagColor: 'emerald',
              },
              {
                step: '02',
                title: '天気トリガーを選ぶ',
                desc: '「トリガー設定」タブで、どの天気条件でクーポンを送るかを選びます。例：降水確率70%以上で「雨スタート」トリガーが発動します。現在の天気に対して発動するかどうかをリアルタイムで確認できます。',
                tag: '今すぐできる',
                tagColor: 'emerald',
              },
              {
                step: '03',
                title: '送信するオファーを登録する',
                desc: '「オファー管理」タブで、天気トリガー発動時に送るクーポン内容を登録します。テンプレートから選ぶか、自由に入力できます。登録後は「保存」ボタンで設定が保持されます（ブラウザのローカルストレージに保存）。',
                tag: '今すぐできる',
                tagColor: 'emerald',
              },
              {
                step: '04',
                title: 'LINE / メール送信を接続する',
                desc: `実際にゲストへ通知を送るには以下の設定が必要です。

【LINE Messaging APIの場合】
① LINE Developersコンソール（developers.line.biz）にログイン
② 「新規プロバイダー作成」→「Messaging APIチャンネル作成」
③ チャンネル設定画面から「チャンネルシークレット」と「チャンネルアクセストークン（長期）」を取得
④ Vercel環境変数に以下を追加：
   LINE_CHANNEL_SECRET=（取得した値）
   LINE_CHANNEL_ACCESS_TOKEN=（取得した値）
⑤ ゲストのLINE User IDを事前に取得し、送信先として登録

【SendGrid（メール）の場合】
① sendgrid.com でアカウント作成（無料プランあり）
② 「Settings」→「API Keys」→「Create API Key」で取得
③ Vercel環境変数に以下を追加：
   SENDGRID_API_KEY=（取得した値）
   SENDGRID_FROM_EMAIL=（送信元メールアドレス）
④ ゲストのメールアドレスをSupabaseのguestsテーブルに登録

設定後は天気トリガーが発動した際に /api/weather-alerts エンドポイントが自動で呼ばれ、メッセージが配信されます。`,
                tag: 'バックエンド設定が必要',
                tagColor: 'amber',
              },
              {
                step: '05',
                title: '送信履歴・効果を確認する',
                desc: '「送信履歴」タブで、いつ・何件送信され・何人が使ったかを確認できます。現在はサンプルデータを表示中です。APIキー設定・連携後に実データが反映されます。',
                tag: '接続後に有効',
                tagColor: 'slate',
              },
            ].map(item => (
              <div key={item.step} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pb-8 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                      item.tagColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      item.tagColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-white/5 text-slate-500 border-white/10'
                    }`}>{item.tag}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* よくある質問 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">よくある質問</h3>
              {[
                { q: '天気データはどこから取得していますか？', a: 'Open-Meteoという無料のオープン気象APIから取得しています。APIキーは不要で、日本全国の主要都市に対応しています。' },
                { q: '設定は保存されますか？', a: 'はい。「設定を保存」ボタンを押すと、ブラウザのlocalStorageに保存されます。次回アクセス時も設定が引き継がれます。' },
                { q: 'LINEへの実際の送信はできますか？', a: '現時点ではUI・設定管理が主な機能です。実際のLINE送信にはLINE Messaging APIのチャンネルシークレット・アクセストークンをサーバー側に設定する必要があります。' },
                { q: '対応都市を増やせますか？', a: '現在は主要10都市に対応しています。Open-Meteoは緯度・経度を指定すれば全国どこでも取得可能です。追加が必要な場合はNextraLabsサポートへご相談ください。' },
              ].map(faq => (
                <div key={faq.q} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-white mb-1">Q. {faq.q}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
