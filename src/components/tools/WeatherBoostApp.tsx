'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CloudRain, Wind, Thermometer, Zap, Gift, Bell, BarChart3,
  Settings, Plus, Trash2, CheckCircle2, Clock, Send, Eye,
  CloudSnow, Sun, AlertTriangle, ChevronRight, RefreshCw,
  Users, TrendingUp, Copy, QrCode
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
}

type WeatherData = {
  temp: number
  condition: string
  precipProb: number
  windSpeed: number
  icon: string
  location: string
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

const SAMPLE_LOGS: SendLog[] = [
  { id: '1', triggeredAt: '2026/05/12 14:22', triggerLabel: '☔ 雨スタート (降水確率82%)', sentCount: 47, usedCount: 18, estimatedRevenue: 18500 },
  { id: '2', triggeredAt: '2026/05/11 09:15', triggerLabel: '🥶 寒波到来 (気温9℃)', sentCount: 23, usedCount: 10, estimatedRevenue: 12300 },
  { id: '3', triggeredAt: '2026/05/10 16:40', triggerLabel: '🌬️ 強風注意 (風速11m/s)', sentCount: 31, usedCount: 14, estimatedRevenue: 9800 },
  { id: '4', triggeredAt: '2026/05/09 11:05', triggerLabel: '☔ 雨スタート (降水確率74%)', sentCount: 52, usedCount: 22, estimatedRevenue: 24100 },
]

// ─── メインコンポーネント ─────────────────────────────
export default function WeatherBoostApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trigger' | 'offer' | 'history'>('dashboard')
  const [selectedPresets, setSelectedPresets] = useState<string[]>(['rain'])
  const [offers, setOffers] = useState<Offer[]>([
    { id: '1', title: '館内バー ハッピーアワー', category: 'バー', discount: '500円OFF', message: '本日は外出には生憎のお天気です。館内バーで使える500円クーポンをご用意しました！', validHours: 8, active: true },
    { id: '2', title: 'スパ&リラクゼーション', category: 'スパ', discount: '30分延長無料', message: '外は雨、中はリラックス。本日スパをご利用のお客様に30分延長サービスをプレゼント！', validHours: 12, active: true },
  ])
  const [sendHoursStart, setSendHoursStart] = useState(9)
  const [sendHoursEnd, setSendHoursEnd] = useState(22)
  const [intervalHours, setIntervalHours] = useState(3)
  const [notifyMethod, setNotifyMethod] = useState<'line' | 'email' | 'both'>('line')
  const [weather, setWeather] = useState<WeatherData>({ temp: 18, condition: '小雨', precipProb: 82, windSpeed: 6, icon: '🌧️', location: '東京・新宿区' })
  const [showAddOffer, setShowAddOffer] = useState(false)
  const [newOffer, setNewOffer] = useState({ title: '', category: 'バー', discount: '', message: '', validHours: 8 })
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const totalSent = SAMPLE_LOGS.reduce((s, l) => s + l.sentCount, 0)
  const totalUsed = SAMPLE_LOGS.reduce((s, l) => s + l.usedCount, 0)
  const totalRevenue = SAMPLE_LOGS.reduce((s, l) => s + l.estimatedRevenue, 0)
  const avgUseRate = Math.round((totalUsed / totalSent) * 100)

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
  ] as const

  return (
    <div className="min-h-screen bg-[#050507] text-white font-['Inter','Noto_Sans_JP',sans-serif] pb-20">

      {/* ヘッダー */}
      <div className="border-b border-white/5 bg-[#0a0a0f] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">☔ 館内消費ブースト</h1>
            <p className="text-slate-500 text-xs mt-0.5">Google天気連動型 自動クーポン配信</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            監視中
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
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8">

        {/* ─── ダッシュボードタブ ─── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 現在の天気カード */}
            <div className="bg-[#0d1117] border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-500 text-xs mb-1 flex items-center gap-1"><RefreshCw size={11} /> リアルタイム天気</p>
                  <p className="text-slate-300 text-sm font-medium">📍 {weather.location}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Zap size={12} /> トリガー発動中
                </div>
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
                  <p className="text-2xl font-bold text-emerald-400">{weather.precipProb}%</p>
                  <p className="text-slate-500 text-xs mt-1">降水確率</p>
                </div>
              </div>
            </div>

            {/* KPIカード */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '本日の送信数', value: '47件', icon: <Send size={16} />, color: 'emerald' },
                { label: 'クーポン使用率', value: `${avgUseRate}%`, icon: <Gift size={16} />, color: 'emerald' },
                { label: '推定売上増加', value: `¥${weather.precipProb > 70 ? '18,500' : '—'}`, icon: <TrendingUp size={16} />, color: 'emerald' },
                { label: '月間累計収益増', value: `¥${totalRevenue.toLocaleString()}`, icon: <BarChart3 size={16} />, color: 'sky' },
              ].map(card => (
                <div key={card.label} className="bg-[#0d1117] border border-white/5 rounded-xl p-4">
                  <div className={`text-${card.color}-400 mb-2`}>{card.icon}</div>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* アクティブ設定サマリー */}
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
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">有効オファー</p>
                  <div className="flex flex-wrap gap-1.5">
                    {offers.filter(o => o.active).map(o => (
                      <span key={o.id} className="bg-white/5 text-slate-300 border border-white/10 text-xs px-2.5 py-1 rounded-full">{o.category}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">送信設定</p>
                  <p className="text-white text-xs">{sendHoursStart}:00 〜 {sendHoursEnd}:00</p>
                  <p className="text-slate-400 text-xs mt-1">連続発動間隔: {intervalHours}時間</p>
                  <p className="text-slate-400 text-xs mt-1">通知: {notifyMethod === 'line' ? 'LINE' : notifyMethod === 'email' ? 'メール' : 'LINE + メール'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── トリガー設定タブ ─── */}
        {activeTab === 'trigger' && (
          <div className="space-y-8">

            {/* プリセット選択 */}
            <div>
              <h2 className="text-base font-semibold mb-1">天気トリガー プリセット</h2>
              <p className="text-slate-500 text-sm mb-5">発動条件をワンクリックで選択。複数選択可。</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TRIGGER_PRESETS.map(preset => {
                  const isSelected = selectedPresets.includes(preset.id)
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
                      <div className={`mb-3 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>{preset.icon}</div>
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
                    className="bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2">
                    {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{String(i).padStart(2,'0')}:00</option>)}
                  </select>
                  <span className="text-slate-500 text-sm">〜</span>
                  <select value={sendHoursEnd} onChange={e => setSendHoursEnd(+e.target.value)}
                    className="bg-[#13141f] border border-white/10 text-white text-sm rounded-lg px-3 py-2">
                    {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{String(i).padStart(2,'0')}:00</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">連続発動インターバル（同一ゲストへの重複送信防止）</label>
                <div className="flex gap-2">
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
                <div className="flex gap-2">
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
              <button className="h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2">
                <CheckCircle2 size={15} /> 設定を保存
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
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {newOffer.message}
                    </p>
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
          </div>
        )}

        {/* ─── 送信履歴タブ ─── */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* サマリー */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '累計送信数', value: `${totalSent}件`, icon: <Send size={16} /> },
                { label: '平均使用率', value: `${avgUseRate}%`, icon: <Gift size={16} /> },
                { label: '累計推定収益増', value: `¥${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={16} /> },
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
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold">送信ログ</h3>
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

            <p className="text-slate-600 text-xs text-center">※ 送信数・収益はサンプルデータです。APIキー設定後に実データへ切り替わります。</p>
          </div>
        )}

      </div>
    </div>
  )
}
