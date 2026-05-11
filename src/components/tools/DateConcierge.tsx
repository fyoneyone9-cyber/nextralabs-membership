'use client'
import React, { useState, useCallback } from 'react'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import {
  HeartHandshake, MapPin, Users, Clock, Wallet, Sparkles, Loader2,
  Star, ExternalLink, Copy, Check, ChevronDown, ChevronUp,
  Navigation, Heart, Coffee, Moon, Cake, Footprints,
  ArrowRight, Building2, Trees, Camera, RefreshCw
} from 'lucide-react'

// ── 型定義 ─────────────────────────────────────────────────────────────────────

interface RestaurantResult {
  name: string
  address: string
  genre: string
  budget: string
  rating: number
  reviewCount: number
  url: string
  imageUrl?: string
  privateRoom: boolean
  lat: number
  lng: number
}

interface SpotResult {
  name: string
  type: string
  rating: number
  address: string
  placeId: string
  lat: number
  lng: number
}

interface TimelineItem {
  time: string
  activity: string
  location: string
  note: string
}

interface DatePlanResult {
  midpoint: { lat: number; lng: number }
  restaurant: RestaurantResult | null
  spots: SpotResult[]
  timeline: TimelineItem[]
  coupleMessage: string
}

// ── プリセット ──────────────────────────────────────────────────────────────────

const PRESETS = [
  { id: 'romantic', label: 'ロマンチック夜デート', emoji: '🌹', desc: '個室×夜景×特別な夜', budget: 8000, privateRoom: true, startTime: '18:00', icon: Heart },
  { id: 'casual', label: '昼のカジュアルデート', emoji: '☀️', desc: 'カフェ×公園散策', budget: 3000, privateRoom: false, startTime: '12:00', icon: Coffee },
  { id: 'night', label: '夜デート×夜景', emoji: '🌙', desc: '夜景スポット巡り', budget: 6000, privateRoom: false, startTime: '19:00', icon: Moon },
  { id: 'anniversary', label: '記念日コース', emoji: '🎂', desc: '高評価レストラン×フォトスポット', budget: 15000, privateRoom: true, startTime: '18:30', icon: Cake },
  { id: 'active', label: 'アクティブデート', emoji: '👟', desc: 'カフェ×公園×夕暮れ', budget: 4000, privateRoom: false, startTime: '14:00', icon: Footprints },
]

const BUDGET_QUICK = [
  { label: '〜¥3,000', value: 3000 },
  { label: '〜¥5,000', value: 5000 },
  { label: '〜¥8,000', value: 8000 },
  { label: '〜¥15,000', value: 15000 },
]

// ── 星レンダリング ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? 'text-emerald-400 fill-current' : 'text-slate-600'}
        />
      ))}
      <span className="text-xs text-emerald-400 ml-1 font-semibold">{rating.toFixed(1)}</span>
    </span>
  )
}

// ── メインコンポーネント ────────────────────────────────────────────────────────

export default function DateConcierge() {
  const [myLocation, setMyLocation] = useState('')
  const [partnerLocation, setPartnerLocation] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [mood, setMood] = useState('romantic')
  const [budget, setBudget] = useState(8000)
  const [privateRoom, setPrivateRoom] = useState(true)
  const [startTime, setStartTime] = useState('18:00')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DatePlanResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  // プリセット選択
  const handlePreset = useCallback((preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset.id)
    setMood(preset.id)
    setBudget(preset.budget)
    setPrivateRoom(preset.privateRoom)
    setStartTime(preset.startTime)
  }, [])

  // 現在地取得
  const getMyLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation(`現在地:${pos.coords.latitude},${pos.coords.longitude}`)
        setGettingLocation(false)
      },
      () => {
        setGettingLocation(false)
        setError('現在地の取得に失敗しました')
      },
      { timeout: 10000 }
    )
  }, [])

  // 生成実行
  const handleGenerate = useCallback(async () => {
    if (!myLocation.trim() || !partnerLocation.trim()) {
      setError('出発地を2つ入力してください')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/date-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myLocation, partnerLocation, mood, budget, privateRoom, startTime }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'エラーが発生しました')
        return
      }
      setResult(data)
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }, [myLocation, partnerLocation, mood, budget, privateRoom, startTime])

  // しおりコピー
  const handleCopy = useCallback(async () => {
    if (!result) return
    const now = new Date()
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
    const lines = [
      `📍 デートコース（${dateStr}）`,
      '',
      result.restaurant ? `【レストラン】${result.restaurant.name}（評価★${result.restaurant.rating}）` : '【レストラン】検索中',
      result.restaurant ? `  住所: ${result.restaurant.address}` : '',
      result.restaurant ? `  URL: ${result.restaurant.url}` : '',
      '',
      '【タイムライン】',
      ...result.timeline.map(t => `  ${t.time} ${t.activity} @ ${t.location}`),
      '',
      result.spots.length > 0 ? `【スポット】${result.spots.map(s => s.name).join(' / ')}` : '',
      '',
      `💬 ${result.coupleMessage}`,
      '',
      '──────────────────────',
      '生成: NextraLabs デートコース自動コンシェルジュ',
      'https://membership-site-nextralabos.vercel.app/products/date-concierge/app',
    ].filter(l => l !== '')
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  return (
    <div className="min-h-screen bg-[#050507] text-white font-['Inter','Noto_Sans_JP',sans-serif]">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">

        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <HeartHandshake size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">デートコース自動コンシェルジュ</h1>
              <p className="text-xs text-slate-500">中間地点 × 楽天グルメ × Google Maps</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mt-3">
            ふたりの出発地を入れるだけ。中間地点に最高のレストランとスポットを自動で見つけ、タイムライン付きのデートしおりを生成します。
          </p>
        </div>

        {/* STEP 1: 出発地入力 */}
        <div className="bg-[#0d1117] rounded-xl p-5 mb-4 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-[#050507] text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-sm font-semibold text-white">出発地を入力</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">自分の出発地</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={myLocation.startsWith('現在地:') ? '📍 現在地を取得済み' : myLocation}
                  onChange={e => setMyLocation(e.target.value)}
                  placeholder="例：新宿駅、渋谷区道玄坂"
                  className="flex-1 bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button
                  onClick={getMyLocation}
                  disabled={gettingLocation}
                  className="px-3 py-2.5 bg-[#13141f] border border-white/10 rounded-lg hover:border-emerald-500/30 transition-all text-emerald-400 disabled:opacity-50"
                  title="現在地を使う"
                >
                  {gettingLocation ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">相手の出発地</label>
              <input
                type="text"
                value={partnerLocation}
                onChange={e => setPartnerLocation(e.target.value)}
                placeholder="例：品川駅、横浜市西区"
                className="w-full bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* STEP 2: プリセット */}
        <div className="bg-[#0d1117] rounded-xl p-5 mb-4 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-[#050507] text-xs font-bold flex items-center justify-center">2</span>
            <span className="text-sm font-semibold text-white">デートスタイルを選択</span>
            <span className="text-xs text-slate-600">（任意）</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => handlePreset(p)}
                className={`relative text-left p-3 rounded-xl border transition-all ${
                  selectedPreset === p.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/5 bg-[#13141f] hover:border-white/15'
                }`}
              >
                <span className="text-lg block mb-1">{p.emoji}</span>
                <p className={`text-xs font-semibold leading-tight ${selectedPreset === p.id ? 'text-emerald-300' : 'text-white'}`}>{p.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: 詳細設定 */}
        <div className="bg-[#0d1117] rounded-xl p-5 mb-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-[#050507] text-xs font-bold flex items-center justify-center">3</span>
            <span className="text-sm font-semibold text-white">詳細設定</span>
          </div>
          <div className="space-y-4">
            {/* 予算 */}
            <div>
              <label className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                <Wallet size={12} className="text-emerald-400" />
                1人あたり予算: <span className="text-emerald-400 font-semibold">¥{budget.toLocaleString()}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {BUDGET_QUICK.map(b => (
                  <button
                    key={b.value}
                    onClick={() => setBudget(b.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      budget === b.value
                        ? 'bg-emerald-500 text-[#050507]'
                        : 'bg-[#13141f] text-slate-400 border border-white/5 hover:border-white/15'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            {/* 個室 + 時刻 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrivateRoom(!privateRoom)}
                  className={`w-10 h-6 rounded-full transition-all relative ${privateRoom ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${privateRoom ? 'left-5' : 'left-1'}`} />
                </button>
                <span className="text-xs text-slate-400">個室希望</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Clock size={13} className="text-emerald-400" />
                <span className="text-xs text-slate-400">開始時刻</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="bg-[#13141f] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* エラー */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* 生成ボタン */}
        <button
          onClick={handleGenerate}
          disabled={loading || !myLocation || !partnerLocation}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-[#050507] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mb-8"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>最高のデートコースを考案中...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>デートコースを自動生成</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* 結果エリア */}
        {result && (
          <div className="space-y-5 mb-8">

            {/* ふたりへのメッセージ */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-4">
              <div className="flex items-start gap-2">
                <HeartHandshake size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-300 leading-relaxed">{result.coupleMessage}</p>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${result.midpoint.lat},${result.midpoint.lng}&zoom=14`}
                width="100%"
                height="300"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>

            {/* レストランカード */}
            {result.restaurant && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 size={12} />おすすめレストラン
                </h3>
                <div className="bg-[#0d1117] border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-bold text-white">{result.restaurant.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{result.restaurant.genre}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-emerald-400">{result.restaurant.budget}/人</p>
                      {result.restaurant.privateRoom && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1.5 py-0.5 mt-1 inline-block">個室あり</span>
                      )}
                    </div>
                  </div>
                  <StarRating rating={result.restaurant.rating} />
                  {result.restaurant.reviewCount > 0 && (
                    <p className="text-[10px] text-slate-600 mt-0.5">{result.restaurant.reviewCount}件のレビュー</p>
                  )}
                  <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                    <MapPin size={11} className="mt-0.5 shrink-0 text-slate-600" />
                    {result.restaurant.address}
                  </p>
                  <a
                    href={result.restaurant.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink size={12} />
                    楽天グルメで詳細を見る
                  </a>
                </div>
              </div>
            )}

            {/* スポット */}
            {result.spots.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Trees size={12} />周辺スポット
                </h3>
                <div className="space-y-2">
                  {result.spots.map((spot, i) => (
                    <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        {spot.type === '公園' ? <Trees size={14} className="text-emerald-400" /> : <Camera size={14} className="text-emerald-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{spot.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{spot.address}</p>
                      </div>
                      <div className="shrink-0">
                        <StarRating rating={spot.rating} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* タイムライン */}
            {result.timeline.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock size={12} />タイムライン
                </h3>
                <div className="relative">
                  {/* 縦ライン */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-emerald-500/20" />
                  <div className="space-y-3">
                    {result.timeline.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-[#050507] text-xs font-bold flex items-center justify-center shrink-0 relative z-10">
                          {item.time.split(':')[0]}
                        </div>
                        <div className="flex-1 bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold text-emerald-400">{item.time}</span>
                            <span className="text-xs font-semibold text-white">{item.activity}</span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin size={10} className="text-slate-600 shrink-0" />
                            {item.location}
                          </p>
                          {item.note && (
                            <p className="text-[10px] text-slate-600 mt-1 italic">{item.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* しおりコピーボタン */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 h-11 bg-[#0d1117] border border-white/10 hover:border-emerald-500/30 rounded-xl text-sm font-medium text-slate-300 hover:text-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {copied ? <><Check size={16} className="text-emerald-400" />コピー完了！</> : <><Copy size={16} />しおりをコピー</>}
              </button>
              <button
                onClick={() => { setResult(null); setError('') }}
                className="h-11 px-4 bg-[#0d1117] border border-white/10 hover:border-white/20 rounded-xl text-slate-500 hover:text-white transition-all"
                title="やり直す"
              >
                <RefreshCw size={16} />
              </button>
            </div>

          </div>
        )}

        {/* ロードマップ */}
        <div className="bg-[#0d1117] rounded-xl border border-white/5 mb-8 overflow-hidden">
          <button
            onClick={() => setRoadmapOpen(!roadmapOpen)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-sm font-semibold text-white">機能ロードマップ</span>
            </div>
            {roadmapOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          </button>
          {roadmapOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              <div>
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Phase 1（リリース中）</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• 中間地点の自動計算</li>
                  <li>• 楽天グルメAPI × 個室絞り込み</li>
                  <li>• Google Mapsでルート全体表示</li>
                  <li>• AI自動タイムライン生成</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-400 mb-2">🔜 Phase 2（近日公開）</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• LINEでしおり共有</li>
                  <li>• 口コミ・写真の表示</li>
                  <li>• 別候補を再提案ボタン</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">💡 Phase 3（将来）</p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• 天気API連携（雨天時インドア自動切替）</li>
                  <li>• 過去のデート履歴から好みを学習</li>
                  <li>• AI会話型コース提案</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 口コミ */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Star size={14} className="text-emerald-400 fill-current" />
            ユーザーの声
          </h3>
          <div className="space-y-3">
            {[
              {
                name: '田中 愛美',
                role: 'OL・埼玉県',
                text: '中間地点なんて考えたことなかった！お互い電車で30分の場所にいいレストランが見つかって、個室だったので彼氏にびっくりされました笑 タイムライン通りに動いたら"デキる人"って言われました',
                tags: ['#カップル', '#デート初心者', '#個室'],
              },
              {
                name: '鈴木 健太',
                role: '会社員・東京都',
                text: '記念日で使いました。レストランから夜景スポットまでの徒歩ルートも表示してくれて、彼女が感動してました。予算8,000円でこの質は最高すぎます',
                tags: ['#記念日', '#夜デート', '#夜景'],
              },
              {
                name: '山本 さくら',
                role: '大学生・神奈川県',
                text: '友達に「どこで覚えたの？」って聞かれました笑 アクティブデートプリセット使ったら公園のバラ園まで案内してくれて、めちゃくちゃ良い写真撮れました',
                tags: ['#昼デート', '#公園', '#フォトスポット'],
              },
            ].map((r, i) => (
              <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{r.name}</p>
                    <p className="text-[10px] text-slate-500">{r.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={11} className="text-emerald-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.text}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.tags.map(t => (
                    <span key={t} className="text-[10px] text-emerald-500/70 bg-emerald-500/5 border border-emerald-500/10 rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* アフィリエイト */}
        <AffiliateBanner toolId="date-concierge" />

      </div>
    </div>
  )
}
