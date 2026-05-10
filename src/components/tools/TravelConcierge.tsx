'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  MapPin, Calendar, Users, Wallet, Plane, Loader2,
  Hotel, Star, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Navigation, Utensils, TreePine, ShoppingBag,
  Droplets, Building2, Search, CheckCircle2, Copy, Check,
  Heart, Baby, User, Users2, Coffee, Camera, Waves, Landmark,
  Sun, Snowflake, Wind, Flower2, ChevronRight
} from 'lucide-react'

// ─── 旅行スタイルプリセット ────────────────────────────────────────────────────

const STYLE_PRESETS = [
  {
    id: 'couple',
    label: 'カップル旅行',
    icon: Heart,
    emoji: '💑',
    adults: 2,
    purpose: '恋人とのロマンチックな旅行。夜景・ディナー・温泉を楽しみたい',
    category: '観光地',
    budget: 20000,
  },
  {
    id: 'family',
    label: 'ファミリー',
    icon: Baby,
    emoji: '👨‍👩‍👧',
    adults: 4,
    purpose: '子連れ家族旅行。子どもが楽しめるアクティビティ重視',
    category: '自然',
    budget: 15000,
  },
  {
    id: 'solo',
    label: '一人旅',
    icon: User,
    emoji: '🎒',
    adults: 1,
    purpose: '一人旅。自由気ままに観光・グルメ・ゆっくり散歩',
    category: '観光地',
    budget: 10000,
  },
  {
    id: 'friends',
    label: '友人グループ',
    icon: Users2,
    emoji: '🎉',
    adults: 4,
    purpose: '友人グループ旅行。アクティブに観光・グルメ・夜も楽しみたい',
    category: 'グルメ',
    budget: 12000,
  },
  {
    id: 'onsen',
    label: '温泉のんびり',
    icon: Droplets,
    emoji: '♨️',
    adults: 2,
    purpose: '温泉旅行。日常の疲れを癒やす非日常リトリート',
    category: '温泉',
    budget: 25000,
  },
  {
    id: 'culture',
    label: '歴史・文化',
    icon: Landmark,
    emoji: '⛩️',
    adults: 2,
    purpose: '歴史・文化巡り。神社仏閣・博物館・伝統工芸体験',
    category: '神社仏閣',
    budget: 15000,
  },
  {
    id: 'gourmet',
    label: 'グルメ旅',
    icon: Utensils,
    emoji: '🍜',
    adults: 2,
    purpose: 'グルメ旅行。地元の名物・有名店を食べ歩きしたい',
    category: 'グルメ',
    budget: 15000,
  },
  {
    id: 'photo',
    label: '写真撮影旅',
    icon: Camera,
    emoji: '📸',
    adults: 1,
    purpose: '風景・自然・建築の写真撮影旅。映えスポット・絶景重視',
    category: '自然',
    budget: 12000,
  },
]

// 季節プリセット
const SEASON_PRESETS = [
  { id: 'spring', label: '🌸 春（3〜5月）', destinations: ['京都', '奈良', '吉野'], hint: '桜の名所' },
  { id: 'summer', label: '🏖️ 夏（7〜8月）', destinations: ['沖縄', '北海道', '湘南'], hint: '海・避暑地' },
  { id: 'autumn', label: '🍁 秋（10〜11月）', destinations: ['京都', '日光', '軽井沢'], hint: '紅葉の名所' },
  { id: 'winter', label: '⛄ 冬（12〜2月）', destinations: ['北海道', '草津', '箱根'], hint: '雪・温泉' },
]

const ATTRACTION_CATEGORIES = [
  { id: '観光地', label: '観光地', icon: Navigation },
  { id: 'グルメ', label: 'グルメ', icon: Utensils },
  { id: '自然', label: '自然', icon: TreePine },
  { id: 'ショッピング', label: 'ショッピング', icon: ShoppingBag },
  { id: '温泉', label: '温泉', icon: Droplets },
  { id: '神社仏閣', label: '神社仏閣', icon: Building2 },
]

const POPULAR_DESTINATIONS = ['京都', '沖縄', '北海道', '箱根', '大阪', '金沢', '奈良', '軽井沢']

// ロードステップ
const LOAD_STEPS = [
  { label: '楽天トラベルで宿を検索中…', duration: 4000 },
  { label: 'Google Mapsで観光スポットを収集中…', duration: 5000 },
  { label: 'Gemini AIが旅程を生成中…', duration: 8000 },
  { label: '仕上げ中…', duration: 9999 },
]

// ─── 型 ───────────────────────────────────────────────────────────────────────

interface HotelResult {
  name: string
  url: string
  imageUrl: string
  rating: number | null
  reviewCount: number
  minCharge: number | null
  address: string
  nearestStation: string
}

interface AttractionResult {
  name: string
  vicinity: string
  rating: number
  mapsUrl: string
}

interface TravelResult {
  hotels: HotelResult[]
  attractions: AttractionResult[]
  itinerary: string
  remainingToday: number
}

// ─── ローディングUI ────────────────────────────────────────────────────────────

function LoadingProgress({ active }: { active: boolean }) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      setStep(0)
      setProgress(0)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    let elapsed = 0
    const total = 18000 // 18秒想定
    intervalRef.current = setInterval(() => {
      elapsed += 100
      setProgress(Math.min(95, (elapsed / total) * 100))
    }, 100)

    let s = 0
    const advance = () => {
      s++
      if (s < LOAD_STEPS.length) {
        setStep(s)
        timerRef.current = setTimeout(advance, LOAD_STEPS[s].duration)
      }
    }
    timerRef.current = setTimeout(advance, LOAD_STEPS[0].duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="max-w-4xl mx-auto px-6 mt-6">
      <div
        className="rounded-2xl p-8 space-y-6"
        style={{ background: '#0d1117', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        {/* ステップ一覧 */}
        <div className="space-y-4">
          {LOAD_STEPS.slice(0, 3).map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: i < step ? 'rgba(16,185,129,0.2)' : i === step ? 'rgba(16,185,129,0.1)' : '#13141f',
                  border: i <= step ? '1px solid #10b981' : '1px solid #334155',
                }}
              >
                {i < step ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : i === step ? (
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full" style={{ background: '#334155' }} />
                )}
              </div>
              <span
                className="text-sm transition-colors"
                style={{ color: i === step ? '#34d399' : i < step ? '#64748b' : '#475569' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* プログレスバー */}
        <div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: '#1e293b' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
              }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-2 text-right">{Math.round(progress)}%</p>
        </div>

        <p className="text-xs text-slate-600 text-center">通常10〜20秒かかります。そのままお待ちください</p>
      </div>
    </div>
  )
}

// ─── ホテルカード ─────────────────────────────────────────────────────────────

function HotelCard({ hotel }: { hotel: HotelResult }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
      style={{ background: '#13141f', border: '1px solid #1e293b' }}
    >
      {hotel.imageUrl && (
        <div className="relative h-36 overflow-hidden">
          <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,5,7,0.85), transparent)' }} />
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-slate-100 leading-tight">{hotel.name}</h3>
        {hotel.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">{hotel.rating}</span>
            <span className="text-xs text-slate-500">({hotel.reviewCount}件)</span>
          </div>
        )}
        <p className="text-xs text-slate-500 truncate">{hotel.address}</p>
        {hotel.nearestStation && (
          <p className="text-xs text-slate-600 truncate">🚉 {hotel.nearestStation}</p>
        )}
        {hotel.minCharge && (
          <div>
            <span className="text-xs text-slate-500">最安 </span>
            <span className="text-sm font-bold text-emerald-400">¥{hotel.minCharge.toLocaleString()}〜</span>
            <span className="text-xs text-slate-500">/泊</span>
          </div>
        )}
        <a
          href={hotel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1.5 w-full h-9 rounded-lg text-xs font-semibold text-white transition-colors"
          style={{ background: '#bf0000' }}
        >
          楽天トラベルで予約する
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}

// ─── 観光スポットカード ───────────────────────────────────────────────────────

function AttractionCard({ spot, index }: { spot: AttractionResult; index: number }) {
  return (
    <a
      href={spot.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:border-emerald-500/40"
      style={{ background: '#0d1117', border: '1px solid #1e293b' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}
      >
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{spot.name}</p>
        <p className="text-xs text-slate-500 truncate">{spot.vicinity}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {spot.rating > 0 && (
          <>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-yellow-400">{spot.rating}</span>
          </>
        )}
        <ExternalLink className="w-3 h-3 text-slate-600 ml-1" />
      </div>
    </a>
  )
}

// ─── Markdown レンダラー ──────────────────────────────────────────────────────

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('#### '))
          return <h4 key={i} className="text-sm font-semibold text-slate-200 mt-3 mb-0.5">{line.replace(/^#### /, '')}</h4>
        if (line.startsWith('### '))
          return <h3 key={i} className="text-base font-semibold text-emerald-400 mt-5 mb-1">{line.replace(/^### /, '')}</h3>
        if (line.startsWith('## '))
          return <h2 key={i} className="text-lg font-semibold text-slate-100 mt-6 mb-2">{line.replace(/^## /, '')}</h2>
        if (line.startsWith('# '))
          return <h1 key={i} className="text-xl font-bold text-slate-100 mt-6 mb-3">{line.replace(/^# /, '')}</h1>
        if (line.startsWith('- ') || line.startsWith('* '))
          return (
            <li key={i} className="text-slate-300 text-sm leading-relaxed ml-4 list-disc">
              <InlineText text={line.replace(/^[-*] /, '')} />
            </li>
          )
        if (line.trim() === '---')
          return <hr key={i} className="border-slate-700/60 my-4" />
        if (line.trim() === '')
          return <div key={i} className="h-1.5" />
        return (
          <p key={i} className="text-slate-300 text-sm leading-relaxed">
            <InlineText text={line} />
          </p>
        )
      })}
    </div>
  )
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        /^\*\*(.+)\*\*$/.test(p)
          ? <strong key={i} className="text-slate-100 font-semibold">{p.replace(/^\*\*|\*\*$/g, '')}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  )
}

// ─── メインコンポーネント ─────────────────────────────────────────────────────

export default function TravelConcierge() {
  const [destination, setDestination] = useState('')
  const [checkinDate, setCheckinDate] = useState('')
  const [checkoutDate, setCheckoutDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [budget, setBudget] = useState(15000)
  const [purpose, setPurpose] = useState('')
  const [attractionCategory, setAttractionCategory] = useState('観光地')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  const [result, setResult] = useState<TravelResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHotels, setShowHotels] = useState(true)
  const [showAttractions, setShowAttractions] = useState(true)
  const [copied, setCopied] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  // スタイルプリセット適用
  const applyStyle = (preset: typeof STYLE_PRESETS[0]) => {
    setSelectedStyle(preset.id)
    setAdults(preset.adults)
    setPurpose(preset.purpose)
    setAttractionCategory(preset.category)
    setBudget(preset.budget)
  }

  // 季節プリセット適用
  const applySeason = (destinations: string[]) => {
    setDestination(destinations[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination || !checkinDate || !checkoutDate) {
      setError('目的地・チェックイン日・チェックアウト日を入力してください')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/travel-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, checkinDate, checkoutDate, adults, budget, purpose, attractionCategory }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      setResult(data)
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const copyItinerary = async () => {
    if (!result?.itinerary) return
    await navigator.clipboard.writeText(result.itinerary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = `w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-emerald-500/60`
  const inputStyle = { background: '#13141f', border: '1px solid #334155' }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>

      {/* ─── Hero ─── */}
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-6 space-y-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          楽天トラベル × Google Maps × Gemini 2.5 Flash
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: '#f1f5f9' }}>
          AI旅行コンシェルジュ
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          目的地・日程・予算を入れるだけ。宿と観光地をリアルデータで自動収集し、AIが旅程を丸ごと生成します。
        </p>
      </div>

      {/* ─── Form ─── */}
      <div className="max-w-4xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-7" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>

          {/* ① 旅行スタイルプリセット */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400" style={{ background: 'rgba(16,185,129,0.15)' }}>1</span>
              <label className="text-sm font-semibold text-slate-200">旅行スタイルを選ぶ</label>
              <span className="text-xs text-slate-600">（選ぶと条件が自動セット）</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {STYLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyStyle(p)}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all"
                  style={{
                    background: selectedStyle === p.id ? 'rgba(16,185,129,0.12)' : '#13141f',
                    border: selectedStyle === p.id ? '1px solid #10b981' : '1px solid #334155',
                  }}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-xs font-medium leading-tight" style={{ color: selectedStyle === p.id ? '#34d399' : '#94a3b8' }}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t" style={{ borderColor: '#1e293b' }} />

          {/* ② 目的地 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400" style={{ background: 'rgba(16,185,129,0.15)' }}>2</span>
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 目的地
              </label>
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="例: 京都、沖縄、北海道"
              className={inputCls}
              style={inputStyle}
            />
            {/* 人気エリア */}
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DESTINATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDestination(d)}
                  className="px-3 py-1 text-xs rounded-full transition-all"
                  style={{
                    background: destination === d ? 'rgba(16,185,129,0.2)' : '#13141f',
                    border: destination === d ? '1px solid #10b981' : '1px solid #1e293b',
                    color: destination === d ? '#34d399' : '#64748b',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            {/* 季節プリセット */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SEASON_PRESETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => applySeason(s.destinations)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all"
                  style={{ background: '#13141f', border: '1px solid #1e293b', color: '#64748b' }}
                >
                  {s.label}
                  <span className="text-slate-700">— {s.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ③ 日程 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400" style={{ background: 'rgba(16,185,129,0.15)' }}>3</span>
              <label className="text-sm font-semibold text-slate-200">日程</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> チェックイン
                </label>
                <input type="date" value={checkinDate} min={today} onChange={(e) => setCheckinDate(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> チェックアウト
                </label>
                <input type="date" value={checkoutDate} min={checkinDate || tomorrow} onChange={(e) => setCheckoutDate(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* ④ 人数・予算 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400" style={{ background: 'rgba(16,185,129,0.15)' }}>4</span>
              <label className="text-sm font-semibold text-slate-200">人数・予算</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 人数</label>
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className={inputCls} style={inputStyle}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}名</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> 1泊の宿泊予算（1名）</label>
                <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} className={inputCls} style={inputStyle}>
                  <option value={5000}>〜¥5,000（格安）</option>
                  <option value={10000}>〜¥10,000（リーズナブル）</option>
                  <option value={15000}>〜¥15,000（スタンダード）</option>
                  <option value={20000}>〜¥20,000（上質）</option>
                  <option value={30000}>〜¥30,000（高級）</option>
                  <option value={50000}>〜¥50,000（ラグジュアリー）</option>
                  <option value={99999}>上限なし</option>
                </select>
              </div>
            </div>
          </div>

          {/* ⑤ テーマ・観光カテゴリ */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400" style={{ background: 'rgba(16,185,129,0.15)' }}>5</span>
              <label className="text-sm font-semibold text-slate-200">テーマ・観光カテゴリ</label>
            </div>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="例: 夫婦の記念日旅行、子連れ、温泉でのんびり"
              className={inputCls}
              style={inputStyle}
            />
            <div className="flex flex-wrap gap-2">
              {ATTRACTION_CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAttractionCategory(id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-all"
                  style={{
                    background: attractionCategory === id ? 'rgba(16,185,129,0.15)' : '#13141f',
                    border: attractionCategory === id ? '1px solid #10b981' : '1px solid #334155',
                    color: attractionCategory === id ? '#34d399' : '#64748b',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* エラー */}
          {error && (
            <div className="p-4 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* 生成ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: loading ? '#065f46' : '#10b981', color: '#fff' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                AI処理中…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                旅程を自動生成する
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>
      </div>

      {/* ─── ローディングプログレス ─── */}
      <LoadingProgress active={loading} />

      {/* ─── Result ─── */}
      {result && (
        <div id="result-section" className="max-w-4xl mx-auto px-6 mt-8 space-y-5">

          {/* 完了バナー */}
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <span className="text-sm text-slate-300 font-medium">旅程を生成しました！</span>
              <span className="text-xs text-slate-500 ml-2">今日の残り利用回数：</span>
              <span className="text-xs text-emerald-400 font-semibold">{result.remainingToday}回</span>
            </div>
          </div>

          {/* ホテル一覧 */}
          {result.hotels.length > 0 && (
            <section className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1e293b' }}>
              <button
                className="w-full flex items-center justify-between px-6 py-4"
                style={{ background: '#0d1117' }}
                onClick={() => setShowHotels((v) => !v)}
              >
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                  <Hotel className="w-4 h-4 text-emerald-400" />
                  楽天トラベル おすすめ宿
                  <span className="text-xs text-slate-500 font-normal">（{result.hotels.length}件）</span>
                </div>
                {showHotels ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {showHotels && (
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ background: '#050507' }}>
                  {result.hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
                </div>
              )}
            </section>
          )}

          {/* 観光スポット */}
          {result.attractions.length > 0 && (
            <section className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1e293b' }}>
              <button
                className="w-full flex items-center justify-between px-6 py-4"
                style={{ background: '#0d1117' }}
                onClick={() => setShowAttractions((v) => !v)}
              >
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Google Maps 周辺スポット
                  <span className="text-xs text-slate-500 font-normal">（{result.attractions.length}件）</span>
                </div>
                {showAttractions ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {showAttractions && (
                <div className="p-5 space-y-2" style={{ background: '#050507' }}>
                  {result.attractions.map((a, i) => <AttractionCard key={i} spot={a} index={i} />)}
                </div>
              )}
            </section>
          )}

          {/* AI旅程 */}
          <section className="rounded-2xl overflow-hidden" style={{ border: '2px solid #10b981' }}>
            <div className="flex items-center gap-2 px-6 py-4" style={{ background: 'rgba(16,185,129,0.07)' }}>
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-200 font-semibold text-sm">AI生成 完全旅程プラン</span>
              <span
                className="px-2 py-0.5 text-xs rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                Gemini 2.5 Flash
              </span>
              <button
                onClick={copyItinerary}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: copied ? 'rgba(16,185,129,0.2)' : '#13141f',
                  border: `1px solid ${copied ? '#10b981' : '#334155'}`,
                  color: copied ? '#34d399' : '#94a3b8',
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'コピー完了！' : '旅程をコピー'}
              </button>
            </div>
            <div className="px-6 py-6" style={{ background: '#0d1117' }}>
              <MarkdownRenderer content={result.itinerary} />
            </div>
          </section>

          {/* 再生成ボタン */}
          <button
            type="button"
            onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="w-full h-10 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#13141f', border: '1px solid #334155', color: '#64748b' }}
          >
            条件を変えて再生成する
          </button>

          {/* Amazonアフィリエイト */}
          <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
            <p className="text-xs text-slate-500 mb-3">🛒 旅行グッズ・スーツケース・旅行保険をAmazonで</p>
            <a
              href="https://www.amazon.co.jp/s?k=%E6%97%85%E8%A1%8C+%E3%82%B9%E3%83%BC%E3%83%84%E3%82%B1%E3%83%BC%E3%82%B9&tag=nextralabs-22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: '#10b981' }}
            >
              Amazonで旅行グッズを見る →
            </a>
          </div>
        </div>
      )}

      {/* ─── 使い方（結果なし・ロード中でない時） ─── */}
      {!result && !loading && (
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: '01', icon: Sparkles, title: 'スタイルを選ぶ', desc: '旅行スタイルプリセットで条件を一発セット' },
              { num: '02', icon: Hotel, title: 'リアルデータ収集', desc: '楽天トラベルの宿＋Google Mapsの観光地を自動取得' },
              { num: '03', icon: Plane, title: 'AI旅程を受け取る', desc: 'Gemini AIが10〜20秒で完全旅程を生成' },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="rounded-xl p-5 space-y-3" style={{ background: '#0d1117', border: '1px solid #1e293b' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400">{num}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
