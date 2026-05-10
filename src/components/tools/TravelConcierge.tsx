'use client'
import React, { useState } from 'react'
import {
  MapPin, Calendar, Users, Wallet, Plane, Loader2,
  Hotel, Star, ExternalLink, ChevronDown, ChevronUp,
  Sparkles, Navigation, Utensils, TreePine, ShoppingBag,
  Droplets, Building2, Search, CheckCircle2
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// ─── 定数 ─────────────────────────────────────────────────────────────────────

const ATTRACTION_CATEGORIES = [
  { id: '観光地', label: '観光地', icon: Navigation },
  { id: 'グルメ', label: 'グルメ', icon: Utensils },
  { id: '自然', label: '自然', icon: TreePine },
  { id: 'ショッピング', label: 'ショッピング', icon: ShoppingBag },
  { id: '温泉', label: '温泉', icon: Droplets },
  { id: '神社仏閣', label: '神社仏閣', icon: Building2 },
]

const POPULAR_DESTINATIONS = ['京都', '沖縄', '北海道', '箱根', '大阪', '金沢', '奈良', '軽井沢']

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
  photoRef?: string
  mapsUrl: string
}

interface TravelResult {
  hotels: HotelResult[]
  attractions: AttractionResult[]
  itinerary: string
  remainingToday: number
}

// ─── サブコンポーネント ────────────────────────────────────────────────────────

function HotelCard({ hotel }: { hotel: HotelResult }) {
  return (
    <a
      href={hotel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden transition-transform hover:scale-[1.02]"
      style={{ background: '#13141f', border: '1px solid #1e293b' }}
    >
      {hotel.imageUrl && (
        <div className="relative h-36 overflow-hidden">
          <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,5,7,0.8), transparent)' }} />
        </div>
      )}
      <div className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-100 leading-tight">{hotel.name}</h3>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
        </div>
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
          <div className="pt-1">
            <span className="text-xs text-slate-500">最安値 </span>
            <span className="text-sm font-bold text-emerald-400">
              ¥{hotel.minCharge.toLocaleString()}〜
            </span>
            <span className="text-xs text-slate-500">/泊</span>
          </div>
        )}
      </div>
    </a>
  )
}

function AttractionCard({ spot }: { spot: AttractionResult }) {
  return (
    <a
      href={spot.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:border-emerald-500/40"
      style={{ background: '#0d1117', border: '1px solid #1e293b' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(16,185,129,0.1)' }}
      >
        <MapPin className="w-4 h-4 text-emerald-400" />
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

// ─── メインコンポーネント ─────────────────────────────────────────────────────

export default function TravelConcierge() {
  // フォーム
  const [destination, setDestination] = useState('')
  const [checkinDate, setCheckinDate] = useState('')
  const [checkoutDate, setCheckoutDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [budget, setBudget] = useState(15000)
  const [purpose, setPurpose] = useState('')
  const [attractionCategory, setAttractionCategory] = useState('観光地')

  // 結果
  const [result, setResult] = useState<TravelResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHotels, setShowHotels] = useState(true)
  const [showAttractions, setShowAttractions] = useState(true)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

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
        body: JSON.stringify({
          destination,
          checkinDate,
          checkoutDate,
          adults,
          budget,
          purpose,
          attractionCategory,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成に失敗しました')
      setResult(data)
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-emerald-500/60`
  const inputStyle = { background: '#13141f', border: '1px solid #334155' }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* ─── Hero ─── */}
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-6 space-y-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          楽天トラベル × Google Maps × Gemini AI
        </div>
        <h1
          className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
          style={{ color: '#f1f5f9' }}
        >
          AI旅行コンシェルジュ
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          目的地・日程・予算を入力するだけ。楽天トラベルの宿とGoogle Mapsの観光地を自動取得し、
          <br className="hidden md:block" />
          Gemini AIが完全オリジナルの旅程を生成します。
        </p>
      </div>

      {/* ─── Form ─── */}
      <div className="max-w-4xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-6"
          style={{ background: '#0d1117', border: '1px solid #1e293b' }}
        >
          {/* 目的地 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> 目的地
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="例: 京都、沖縄、北海道"
              className={inputCls}
              style={inputStyle}
            />
            {/* 人気候補 */}
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDestination(d)}
                  className="px-3 py-1 text-xs rounded-full transition-colors"
                  style={{
                    background: destination === d ? 'rgba(16,185,129,0.2)' : '#13141f',
                    border: destination === d ? '1px solid #10b981' : '1px solid #334155',
                    color: destination === d ? '#34d399' : '#64748b',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 日程 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> チェックイン
              </label>
              <input
                type="date"
                value={checkinDate}
                min={today}
                onChange={(e) => setCheckinDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> チェックアウト
              </label>
              <input
                type="date"
                value={checkoutDate}
                min={checkinDate || tomorrow}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          {/* 人数・予算 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> 人数
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className={inputCls}
                style={inputStyle}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}名</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" /> 1泊予算（1名）
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className={inputCls}
                style={inputStyle}
              >
                <option value={5000}>〜¥5,000</option>
                <option value={10000}>〜¥10,000</option>
                <option value={15000}>〜¥15,000</option>
                <option value={20000}>〜¥20,000</option>
                <option value={30000}>〜¥30,000</option>
                <option value={50000}>〜¥50,000</option>
                <option value={99999}>上限なし</option>
              </select>
            </div>
          </div>

          {/* 旅行目的 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Plane className="w-4 h-4 text-emerald-400" /> 旅行テーマ・目的（任意）
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="例: 夫婦の記念日旅行、子連れファミリー、温泉でのんびり"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* 観光カテゴリ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">観光スポットのカテゴリ</label>
            <div className="flex flex-wrap gap-2">
              {ATTRACTION_CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAttractionCategory(id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-all"
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
            <div
              className="p-4 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{
              background: loading ? '#065f46' : '#10b981',
              color: '#fff',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                宿・観光地を取得しAIが旅程を生成中…（10〜20秒）
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                旅程を自動生成する
              </span>
            )}
          </button>
        </form>
      </div>

      {/* ─── Result ─── */}
      {result && (
        <div id="result-section" className="max-w-4xl mx-auto px-6 mt-8 space-y-6">
          {/* 残り利用回数 */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">生成完了。今日の残り利用回数：</span>
            <span className="text-emerald-400 font-semibold">{result.remainingToday}回</span>
          </div>

          {/* ホテル一覧 */}
          {result.hotels.length > 0 && (
            <section
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid #1e293b' }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4"
                style={{ background: '#0d1117' }}
                onClick={() => setShowHotels((v) => !v)}
              >
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Hotel className="w-5 h-5 text-emerald-400" />
                  楽天トラベル おすすめ宿（{result.hotels.length}件）
                </div>
                {showHotels ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {showHotels && (
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ background: '#050507' }}>
                  {result.hotels.map((h, i) => (
                    <HotelCard key={i} hotel={h} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 観光スポット */}
          {result.attractions.length > 0 && (
            <section
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid #1e293b' }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4"
                style={{ background: '#0d1117' }}
                onClick={() => setShowAttractions((v) => !v)}
              >
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  周辺観光スポット（{result.attractions.length}件）
                </div>
                {showAttractions ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {showAttractions && (
                <div className="p-5 space-y-2" style={{ background: '#050507' }}>
                  {result.attractions.map((a, i) => (
                    <AttractionCard key={i} spot={a} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* AI生成旅程 */}
          <section
            className="rounded-2xl overflow-hidden"
            style={{ border: '2px solid #10b981' }}
          >
            <div
              className="flex items-center gap-2 px-6 py-4"
              style={{ background: 'rgba(16,185,129,0.08)' }}
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-200 font-semibold">AI生成 完全旅程プラン</span>
              <span
                className="ml-auto px-2.5 py-0.5 text-xs rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                Gemini 2.5 Flash
              </span>
            </div>
            <div
              className="px-6 py-6 prose prose-invert prose-sm max-w-none"
              style={{ background: '#0d1117' }}
            >
              <div className="text-slate-300 leading-relaxed space-y-3 text-sm">
                <ReactMarkdownWrapper content={result.itinerary} />
              </div>
            </div>
          </section>

          {/* アフィリエイト */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <p className="text-xs text-slate-500 mb-3">🛒 旅行グッズ・スーツケース・旅行保険をAmazonで</p>
            <a
              href="https://www.amazon.co.jp/s?k=%E6%97%85%E8%A1%8C+%E3%82%B9%E3%83%BC%E3%83%84%E3%82%B1%E3%83%BC%E3%82%B9&tag=nextralabs-22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ background: '#10b981' }}
            >
              Amazonで旅行グッズを見る →
            </a>
          </div>
        </div>
      )}

      {/* ─── 使い方 ─── */}
      {!result && !loading && (
        <div className="max-w-4xl mx-auto px-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: '01', icon: Search, title: '条件を入力', desc: '目的地・日程・予算・テーマを設定' },
              { num: '02', icon: Hotel, title: '宿と観光地を自動取得', desc: '楽天トラベル＋Google Mapsがリアルデータを収集' },
              { num: '03', icon: Sparkles, title: 'AI旅程を受け取る', desc: 'Gemini AIが最適なプランを完全自動生成' },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div
                key={num}
                className="rounded-xl p-5 space-y-3"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400">{num}</span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.1)' }}
                  >
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

// ─── ReactMarkdown ラッパー ──────────────────────────────────────────────────
// react-markdownが入っていない場合はシンプルなテキスト表示にフォールバック
function ReactMarkdownWrapper({ content }: { content: string }) {
  const [hasMD, setHasMD] = React.useState<boolean | null>(null)
  const [MDComponent, setMDComponent] = React.useState<React.ComponentType<{ children: string }> | null>(null)

  React.useEffect(() => {
    import('react-markdown')
      .then((mod) => {
        setMDComponent(() => mod.default as React.ComponentType<{ children: string }>)
        setHasMD(true)
      })
      .catch(() => setHasMD(false))
  }, [])

  if (hasMD === null) return <p className="text-slate-400 text-xs animate-pulse">表示中…</p>
  if (hasMD && MDComponent) {
    return <MDComponent>{content}</MDComponent>
  }
  // フォールバック: 改行をそのまま表示
  return (
    <div className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">{content}</div>
  )
}
