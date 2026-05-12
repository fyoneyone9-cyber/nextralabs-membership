'use client'
import React, { useState, useCallback } from 'react'
import {
  Scissors, MapPin, Calendar, Clock, Wallet, Search,
  Star, ExternalLink, ChevronRight, Navigation, Loader2,
  Sparkles, User, Users, RefreshCw, Info, CheckCircle2,
  ArrowRight, Map, Zap, CalendarPlus, Check
} from 'lucide-react'

// ─── 定数 ─────────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { id: 'female', label: '女性', emoji: '👩' },
  { id: 'male', label: '男性', emoji: '🧔' },
]

const SERVICE_PRESETS = [
  {
    id: 'female-standard',
    label: '女性スタンダード',
    emoji: '💆‍♀️',
    desc: 'ヘアセット + スタイリング',
    gender: 'female',
    services: ['ヘアセット', 'シャンプーブロー'],
  },
  {
    id: 'female-full',
    label: '女性フルケア',
    emoji: '💅',
    desc: 'ヘアセット + まつエク + ネイル',
    gender: 'female',
    services: ['ヘアセット', 'まつエク', 'ネイル'],
  },
  {
    id: 'male-basic',
    label: 'メンズ基本',
    emoji: '🧔',
    desc: 'カット + シェービング + セット',
    gender: 'male',
    services: ['カット', 'シェービング', 'ヘアセット'],
  },
  {
    id: 'speed',
    label: '時間がない（1h）',
    emoji: '⚡',
    desc: 'ヘアセット only / 最寄り優先',
    gender: 'both',
    services: ['ヘアセット'],
  },
]

const BUDGET_OPTIONS = [
  { label: '〜¥3,000', value: 3000 },
  { label: '〜¥5,000', value: 5000 },
  { label: '〜¥10,000', value: 10000 },
  { label: '制限なし', value: 0 },
]

const LEAD_TIME_OPTIONS = [
  { label: '1時間前', value: 1 },
  { label: '2時間前', value: 2 },
  { label: '3時間前', value: 3 },
]

// ─── 型 ──────────────────────────────────────────────────────────────────────

interface SalonResult {
  name: string
  rating: number
  reviewCount: number
  distance: string
  walkMin: number
  address: string
  priceFrom: number | null
  lat: number
  lng: number
  placeId: string
  rakutenUrl: string
  hotpepperUrl: string
  recommendTime: string
}

interface FormState {
  date: string
  time: string
  venue: string
  gender: string
  preset: string
  budget: number
  leadTime: number
}

// ─── ユーティリティ ──────────────────────────────────────────────────────────

function calcRecommendTime(omiai: string, leadHours: number): string {
  if (!omiai) return ''
  const [h, m] = omiai.split(':').map(Number)
  const total = h * 60 + m - leadHours * 60
  const rh = Math.floor(((total % 1440) + 1440) % 1440 / 60)
  const rm = ((total % 1440) + 1440) % 1440 % 60
  return `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}`
}

function getRakutenBeautyUrl(venue: string, services: string[]): string {
  const q = encodeURIComponent(`${venue}周辺 ${services[0] || 'ヘアセット'}`)
  return `https://beauty.rakuten.co.jp/search/?keyword=${q}`
}

function getHotPepperUrl(venue: string, services: string[]): string {
  const q = encodeURIComponent(`${venue}周辺`)
  const service = services.includes('ヘアセット') ? 'set' : 'cut'
  return `https://beauty.hotpepper.jp/svcSS/shushi/search/?keyword=${q}&service=${service}`
}

function getGoogleMapsSearchUrl(venue: string): string {
  const q = encodeURIComponent(`${venue} 周辺 美容院`)
  return `https://www.google.com/maps/search/${q}`
}

// Googleカレンダー追加URL生成（OAuthなし・リンクのみ）
function getGoogleCalendarUrl(params: {
  date: string       // YYYY-MM-DD
  time: string       // HH:MM
  recTime: string    // 推奨美容院セット時刻 HH:MM
  venue: string
  services: string[]
  leadTime: number
}): { salon: string; omiai: string } {
  const { date, time, recTime, venue, services, leadTime } = params
  if (!date || !recTime) return { salon: '', omiai: '' }

  // 日時フォーマット: YYYYMMDDTHHmmss / YYYYMMDDTHHmmss
  const toGcalDt = (d: string, t: string, durationMin = 60) => {
    const [y, mo, day] = d.split('-')
    const [h, m] = t.split(':').map(Number)
    const startStr = `${y}${mo}${day}T${String(h).padStart(2,'0')}${String(m).padStart(2,'0')}00`
    const endTotal = h * 60 + m + durationMin
    const eh = Math.floor(endTotal / 60) % 24
    const em = endTotal % 60
    const endStr = `${y}${mo}${day}T${String(eh).padStart(2,'0')}${String(em).padStart(2,'0')}00`
    return `${startStr}/${endStr}`
  }

  // 美容院セット予約リマインド
  const salonTitle = encodeURIComponent(`💇 美容院セット（${services[0]}）@ ${venue}周辺`)
  const salonDetails = encodeURIComponent(
    `NextraLabs BeautyBoost で設定\n希望メニュー: ${services.join('・')}\n${leadTime}時間前セット完了目標`
  )
  const salonDt = toGcalDt(date, recTime, 90)
  const salonUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${salonTitle}&dates=${salonDt}&details=${salonDetails}&location=${encodeURIComponent(venue + '周辺の美容院')}`

  // お見合い本番
  const [h, m] = time.split(':').map(Number)
  const omiaiTitle = encodeURIComponent(`✨ お見合い @ ${venue}`)
  const omiaiDetails = encodeURIComponent(
    `NextraLabs BeautyBoost で管理\n美容院セット: ${recTime} 完了予定\n場所: ${venue}`
  )
  const omiaiDt = toGcalDt(date, time, 120)
  const omiaiUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${omiaiTitle}&dates=${omiaiDt}&details=${omiaiDetails}&location=${encodeURIComponent(venue)}`

  return { salon: salonUrl, omiai: omiaiUrl }
}

// Google Places API経由のモック（本番はAPIキー使用）
function generateMockSalons(venue: string, leadHours: number, time: string): SalonResult[] {
  const recTime = calcRecommendTime(time, leadHours)
  return [
    {
      name: `${venue}近くの美容院（Google Maps で確認）`,
      rating: 4.5,
      reviewCount: 120,
      distance: '徒歩圏内',
      walkMin: 5,
      address: `${venue}周辺`,
      priceFrom: null,
      lat: 35.6812,
      lng: 139.7671,
      placeId: 'mock',
      rakutenUrl: getRakutenBeautyUrl(venue, ['ヘアセット']),
      hotpepperUrl: getHotPepperUrl(venue, ['ヘアセット']),
      recommendTime: recTime,
    }
  ]
}

// ─── コンポーネント ───────────────────────────────────────────────────────────

export default function BeautyBoost() {
  const [form, setForm] = useState<FormState>({
    date: '',
    time: '',
    venue: '',
    gender: 'female',
    preset: 'female-standard',
    budget: 5000,
    leadTime: 2,
  })
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [loading, setLoading] = useState(false)
  const [salons, setSalons] = useState<SalonResult[]>([])
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [calSaved, setCalSaved] = useState<'salon' | 'omiai' | null>(null)

  const selectedPreset = SERVICE_PRESETS.find(p => p.id === form.preset)

  const handleSearch = useCallback(async () => {
    if (!form.date || !form.time || !form.venue) return
    setLoading(true)
    // 実際はGoogle Places APIを呼ぶ。現在はモック表示 + 外部リンク誘導
    await new Promise(r => setTimeout(r, 1500))
    const results = generateMockSalons(form.venue, form.leadTime, form.time)
    setSalons(results)
    setLoading(false)
    setStep('result')
  }, [form])

  const handleReset = () => {
    setStep('input')
    setSalons([])
    setShowRoadmap(false)
  }

  // ロードマップ日程計算
  const getRoadmapDates = () => {
    if (!form.date) return null
    const omiai = new Date(form.date)
    const twoWeeks = new Date(omiai); twoWeeks.setDate(omiai.getDate() - 14)
    const oneWeek = new Date(omiai); oneWeek.setDate(omiai.getDate() - 7)
    const threeDays = new Date(omiai); threeDays.setDate(omiai.getDate() - 3)
    const fmt = (d: Date) => `${d.getMonth()+1}/${d.getDate()}`
    return { twoWeeks: fmt(twoWeeks), oneWeek: fmt(oneWeek), threeDays: fmt(threeDays), omiai: fmt(omiai) }
  }

  const roadmap = getRoadmapDates()
  const mapsUrl = getGoogleMapsSearchUrl(form.venue)
  const recTime = calcRecommendTime(form.time, form.leadTime)
  const calendarUrls = getGoogleCalendarUrl({
    date: form.date,
    time: form.time,
    recTime,
    venue: form.venue,
    services: selectedPreset?.services || ['ヘアセット'],
    leadTime: form.leadTime,
  })

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100">
      {/* ヘッダー */}
      <div className="border-b border-white/5 bg-[#0d1117]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100">お見合い垢抜けブースト</h1>
            <p className="text-xs text-slate-500">会場周辺の美容院をAIが検索 → 予約へ直接導く</p>
          </div>
          {step === 'result' && (
            <button onClick={handleReset} className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> やり直す
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ─── STEP 1: 入力フォーム ─── */}
        {step === 'input' && (
          <>
            {/* 説明 */}
            <div className="bg-[#0d1117] rounded-xl border border-white/5 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-400 leading-relaxed">
                  お見合いの日時・会場を入れるだけで、<span className="text-emerald-400 font-medium">会場周辺の美容院</span>を検索して予約ページへ案内します。当日のタイムラインも自動生成します。
                  <br /><span className="text-slate-500 mt-1 block">こんな人向け：美容院をどこにするか迷っている / 会場から遠い店に予約しがち / 男性でどこで整えるか分からない</span>
                </div>
              </div>
            </div>

            {/* 日時 */}
            <section className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> お見合い日時
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">日付</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">時刻</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* 会場 */}
            <section className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> 会場（施設名 or 住所）
              </h2>
              <input
                type="text"
                placeholder="例：ホテルニューグランド横浜、新宿ワシントンホテル"
                value={form.venue}
                onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                className="w-full bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <p className="text-xs text-slate-600">施設名でも住所でもOK。周辺の美容院を地図検索します</p>
            </section>

            {/* 性別 */}
            <section className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> 性別
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {GENDER_OPTIONS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setForm(f => ({ ...f, gender: g.id }))}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                      form.gender === g.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 bg-[#13141f] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span>{g.emoji}</span> {g.label}
                  </button>
                ))}
              </div>
            </section>

            {/* メニュープリセット */}
            <section className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> 希望メニュー
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {SERVICE_PRESETS.filter(p => p.gender === form.gender || p.gender === 'both').map(p => (
                  <button
                    key={p.id}
                    onClick={() => setForm(f => ({ ...f, preset: p.id }))}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      form.preset === p.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/10 bg-[#13141f] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{p.emoji}</span>
                      <span className={`text-xs font-semibold ${form.preset === p.id ? 'text-emerald-400' : 'text-slate-300'}`}>{p.label}</span>
                    </div>
                    <p className="text-xs text-slate-500">{p.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* 予算 + 余裕時間 */}
            <section className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-5">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" /> 予算
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {BUDGET_OPTIONS.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setForm(f => ({ ...f, budget: b.value }))}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                        form.budget === b.value
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-[#13141f] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> 何時間前に美容院へ行く？
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {LEAD_TIME_OPTIONS.map(l => (
                    <button
                      key={l.value}
                      onClick={() => setForm(f => ({ ...f, leadTime: l.value }))}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        form.leadTime === l.value
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-[#13141f] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                {form.time && (
                  <p className="text-xs text-emerald-400/80 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    推奨予約時刻: <span className="font-semibold ml-1">{recTime}</span> までに美容院へ
                  </p>
                )}
              </div>
            </section>

            {/* 検索ボタン */}
            <button
              onClick={handleSearch}
              disabled={!form.date || !form.time || !form.venue || loading}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 周辺を検索中...</>
              ) : (
                <><Search className="w-4 h-4" /> 周辺の美容院を探す <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </>
        )}

        {/* ─── STEP 2: 結果 ─── */}
        {step === 'result' && (
          <>
            {/* サマリー */}
            <div className="bg-[#0d1117] rounded-xl border border-emerald-500/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> 入力内容を確認
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div><span className="text-slate-500">日時</span>: {form.date} {form.time}</div>
                <div><span className="text-slate-500">会場</span>: {form.venue}</div>
                <div><span className="text-slate-500">メニュー</span>: {selectedPreset?.label}</div>
                <div><span className="text-slate-500">推奨予約</span>: <span className="text-emerald-400 font-medium">{recTime}</span> まで</div>
              </div>
            </div>

            {/* Googleマップ検索へ（メイン導線） */}
            <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-200">📍 会場周辺の美容院 — Googleマップで確認</h2>
              </div>
              <p className="text-xs text-slate-500">
                Google Places APIで会場周辺の美容院を地図上で確認できます。評価・営業時間・ルートも一覧で見られます。
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 hover:bg-emerald-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Map className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-100">{form.venue} 周辺の美容院</p>
                    <p className="text-xs text-slate-500">Googleマップで距離・評価・空き状況を確認</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>

            {/* 予約サイト直リンク */}
            <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-400" /> 予約サイトで探す
              </h2>
              <p className="text-xs text-slate-500">会場名 + 希望メニューで検索済みの状態で直接開きます</p>

              <div className="space-y-3">
                {/* 楽天Beauty */}
                <a
                  href={getRakutenBeautyUrl(form.venue, selectedPreset?.services || [])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#13141f] border border-white/10 rounded-xl px-4 py-3 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-sm">🛍️</div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">楽天ビューティー</p>
                      <p className="text-xs text-slate-500">{form.venue}周辺 · {selectedPreset?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">予約へ</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </a>

                {/* ホットペッパービューティー */}
                <a
                  href={getHotPepperUrl(form.venue, selectedPreset?.services || [])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#13141f] border border-white/10 rounded-xl px-4 py-3 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm">🔥</div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">ホットペッパービューティー</p>
                      <p className="text-xs text-slate-500">{form.venue}周辺 · {selectedPreset?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">予約へ</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </a>
              </div>

              {/* 推奨予約時刻 */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">推奨予約時刻（{form.leadTime}時間前）</p>
                  <p className="text-lg font-bold text-emerald-400">{recTime}</p>
                  <p className="text-xs text-slate-500">この時間に美容院でのセットを終わらせると余裕があります</p>
                </div>
              </div>

              {/* Googleカレンダー保存ボタン */}
              {calendarUrls.salon && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <CalendarPlus size={12} className="text-emerald-400" />
                    Googleカレンダーに保存
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={calendarUrls.salon}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { setCalSaved('salon'); setTimeout(() => setCalSaved(null), 3000) }}
                      className="flex items-center justify-center gap-1.5 h-10 bg-[#13141f] border border-white/10 hover:border-emerald-500/30 rounded-xl text-xs font-medium text-slate-300 hover:text-emerald-400 transition-all"
                    >
                      {calSaved === 'salon'
                        ? <><Check size={13} className="text-emerald-400" /><span className="text-emerald-400">追加しました</span></>
                        : <><CalendarPlus size={13} />💇 美容院セット</>
                      }
                    </a>
                    <a
                      href={calendarUrls.omiai}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { setCalSaved('omiai'); setTimeout(() => setCalSaved(null), 3000) }}
                      className="flex items-center justify-center gap-1.5 h-10 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-all"
                    >
                      {calSaved === 'omiai'
                        ? <><Check size={13} /><span>追加しました</span></>
                        : <><CalendarPlus size={13} />✨ お見合い本番</>
                      }
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-600 text-center">タップするとGoogleカレンダーが開きます</p>
                </div>
              )}
            </div>

            {/* 逆算ロードマップ */}
            <div className="bg-[#0d1117] rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setShowRoadmap(!showRoadmap)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">📅 お見合いまで逆算ロードマップ</span>
                </div>
                <div className={`w-4 h-4 text-slate-400 transition-transform ${showRoadmap ? 'rotate-90' : ''}`}>▶</div>
              </button>

              {showRoadmap && roadmap && (
                <div className="border-t border-white/5 p-5 space-y-4">
                  <div className="relative pl-6 space-y-5">
                    {/* タイムライン縦線 */}
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />

                    {/* 2週間前 */}
                    <div className="relative">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-400">2週間前（{roadmap.twoWeeks}〜）</p>
                        <p className="text-sm text-slate-300 mt-0.5">ヘアカラー・パーマは今週中に</p>
                        <p className="text-xs text-slate-500">色・スタイルが落ち着くまで時間が必要です</p>
                      </div>
                    </div>

                    {/* 1週間前 */}
                    <div className="relative">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-400">1週間前（{roadmap.oneWeek}〜）</p>
                        <p className="text-sm text-slate-300 mt-0.5">まつエク・ネイルの予約を入れる</p>
                        <p className="text-xs text-slate-500">直前だと浮きやすく、自然な仕上がりにならない</p>
                      </div>
                    </div>

                    {/* 3日前 */}
                    <div className="relative">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-400">3日前（{roadmap.threeDays}〜）</p>
                        <p className="text-sm text-slate-300 mt-0.5">フェイシャル・スキンケア集中ケア</p>
                        <p className="text-xs text-slate-500">むくみが引く時間を確保するため直前は避ける</p>
                      </div>
                    </div>

                    {/* 当日 */}
                    <div className="relative">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-300">🎯 当日（{roadmap.omiai}） ← このツールの出番</p>
                        <p className="text-sm text-slate-300 mt-0.5">
                          {recTime} に美容院でヘアセット
                        </p>
                        <p className="text-xs text-slate-500">{form.venue}まで徒歩圏内のサロンを上で選択 →</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amazonアフィリエイト */}
            <div className="bg-[#0d1117] rounded-xl border border-white/5 p-5 space-y-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">おすすめアイテム</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://www.amazon.co.jp/s?k=ヘアワックス+スタイリング&tag=534e3725-22`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#13141f] border border-white/10 rounded-xl p-3 hover:border-emerald-500/30 transition-all group"
                >
                  <span className="text-xl">💇</span>
                  <div>
                    <p className="text-xs font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">スタイリングワックス</p>
                    <p className="text-xs text-slate-600">Amazon で探す →</p>
                  </div>
                </a>
                <a
                  href={`https://www.amazon.co.jp/s?k=化粧品+お見合い+メイクアップ&tag=534e3725-22`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#13141f] border border-white/10 rounded-xl p-3 hover:border-emerald-500/30 transition-all group"
                >
                  <span className="text-xl">💄</span>
                  <div>
                    <p className="text-xs font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">メイクアップ用品</p>
                    <p className="text-xs text-slate-600">Amazon で探す →</p>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
      {/* 💒 マリッジロードジャパン */}
      <div className="mt-8 mb-2 flex justify-center px-4">
        <a
          href="https://marriage-road-site.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#0d1117] border border-emerald-500/40 rounded-xl px-5 py-3 hover:border-emerald-500/70 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all group w-full max-w-sm"
        >
          <span className="text-2xl">💒</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">結婚相談所をお探しの方へ</p>
            <p className="text-[11px] text-slate-400 mt-0.5">マリッジロードジャパン — 無料相談受付中</p>
          </div>
          <span className="text-slate-500 group-hover:text-emerald-400 transition-colors text-sm">→</span>
        </a>
      </div>
    </div>
  )
}
