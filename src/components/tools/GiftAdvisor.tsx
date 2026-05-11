'use client'
import React, { useState, useCallback } from 'react'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import {
  Gift, Calendar, User, Wallet, Sparkles, Loader2,
  Star, ExternalLink, Copy, Check, ChevronRight,
  Heart, Briefcase, Users, Baby, UserCheck,
  ShieldCheck, MessageSquare, Tag, RefreshCw,
  PartyPopper, ChevronDown, ChevronUp, Info
} from 'lucide-react'

// ─── 定数 ─────────────────────────────────────────────────────────────────────

const RELATION_PRESETS = [
  { id: '上司・先輩', label: '上司・先輩', emoji: '👔', desc: '高品質・実用的・適切価格帯' },
  { id: '取引先・ビジネス', label: '取引先', emoji: '🤝', desc: 'のし対応・個包装優先' },
  { id: '同僚・友人', label: '同僚・友人', emoji: '👫', desc: 'おしゃれ・トレンド重視' },
  { id: '親・義実家', label: '親・義実家', emoji: '🏠', desc: '食品・体験型・地元名産' },
  { id: '恋人・配偶者', label: '恋人・配偶者', emoji: '💑', desc: 'サプライズ感・体験型' },
  { id: '子ども', label: '子ども', emoji: '👶', desc: '安全性・知育・年齢適合' },
  { id: 'その他', label: 'その他', emoji: '🎁', desc: '汎用的なギフト提案' },
]

const OCCASION_PRESETS = [
  { id: '誕生日', label: '誕生日', emoji: '🎂' },
  { id: '結婚記念日', label: '記念日', emoji: '💍' },
  { id: '昇進・栄転', label: '昇進・栄転', emoji: '🏆' },
  { id: '出産祝い', label: '出産祝い', emoji: '🍼' },
  { id: '結婚祝い', label: '結婚祝い', emoji: '👰' },
  { id: '退職祝い', label: '退職祝い', emoji: '🌸' },
  { id: '還暦祝い', label: '還暦祝い', emoji: '🎊' },
  { id: '母の日', label: '母の日', emoji: '🌺' },
  { id: '父の日', label: '父の日', emoji: '👨' },
  { id: 'クリスマス', label: 'クリスマス', emoji: '🎄' },
  { id: 'バレンタイン', label: 'バレンタイン', emoji: '🍫' },
  { id: 'お中元', label: 'お中元', emoji: '🎋' },
  { id: 'お歳暮', label: 'お歳暮', emoji: '🎍' },
  { id: 'その他・感謝', label: 'その他・感謝', emoji: '💐' },
]

const BUDGET_QUICK = [
  { label: '〜¥3,000', min: 1000, max: 3000 },
  { label: '〜¥5,000', min: 1000, max: 5000 },
  { label: '〜¥10,000', min: 3000, max: 10000 },
  { label: '〜¥30,000', min: 5000, max: 30000 },
]

const EXCLUDE_OPTIONS = [
  { id: '食べ物NG', label: '食べ物NG', emoji: '🚫🍽️' },
  { id: 'アルコールNG', label: 'アルコールNG', emoji: '🚫🍷' },
  { id: '高額すぎる', label: '高額品NG', emoji: '💸' },
  { id: '消耗品NG', label: '消耗品NG', emoji: '🚫📦' },
]

// ─── 型 ──────────────────────────────────────────────────────────────────────

interface GiftItem {
  name: string
  price: number
  url: string
  imageUrl: string
  shopName: string
  reviewAverage: number
  reviewCount: number
  caption: string
  isFallback?: boolean
}

interface Analysis {
  recommendation: string
  searchKeyword: string
  mannerTips: string
  messageTemplate: string
  mannerScore: number
  reason: string[]
}

interface GiftResult {
  items: GiftItem[]
  analysis: Analysis
  searchKeyword: string
  remainingToday: number
  hasRealItems: boolean
}

// ─── サブコンポーネント ────────────────────────────────────────────────────────

function StarRating({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.round(score) ? 'fill-current text-emerald-400' : 'text-slate-600'}
        />
      ))}
    </div>
  )
}

function MannerScore({ score }: { score: number }) {
  const labels = ['', '要注意', '普通', '良好', '優秀', '完璧']
  const colors = ['', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-emerald-400', 'text-emerald-300']
  return (
    <div className="flex items-center gap-1.5">
      <ShieldCheck size={14} className={colors[score] || 'text-slate-400'} />
      <span className={`text-xs font-medium ${colors[score] || 'text-slate-400'}`}>
        マナー {labels[score] || '—'}
      </span>
      <div className="flex gap-0.5 ml-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-1.5 rounded-full ${i < score ? 'bg-emerald-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── メインコンポーネント ──────────────────────────────────────────────────────

export default function GiftAdvisor() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [relation, setRelation] = useState('')
  const [occasion, setOccasion] = useState('')
  const [budgetMin, setBudgetMin] = useState(3000)
  const [budgetMax, setBudgetMax] = useState(10000)
  const [excludes, setExcludes] = useState<string[]>([])
  const [eventDate, setEventDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GiftResult | null>(null)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null)
  const [copied, setCopied] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageMode, setMessageMode] = useState<'formal' | 'casual'>('formal')

  const canStep2 = relation !== ''
  const canStep3 = relation !== '' && occasion !== ''

  const toggleExclude = (id: string) => {
    setExcludes(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleSearch = useCallback(async () => {
    if (!relation || !occasion) return
    setLoading(true)
    setError('')
    setResult(null)
    setSelectedItem(null)
    setShowMessage(false)

    try {
      const res = await fetch('/api/gift-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientRelation: relation, occasion, budgetMin, budgetMax, excludes, eventDate }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setResult(data)
      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [relation, occasion, budgetMin, budgetMax, excludes, eventDate])

  const handleCopyMessage = () => {
    if (!result) return
    navigator.clipboard.writeText(result.analysis.messageTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setStep(1)
    setRelation('')
    setOccasion('')
    setBudgetMin(3000)
    setBudgetMax(10000)
    setExcludes([])
    setEventDate('')
    setResult(null)
    setError('')
    setSelectedItem(null)
    setShowMessage(false)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-['Inter','Noto_Sans_JP',sans-serif]">
      {/* ヘッダー */}
      <div className="border-b border-white/5 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Gift size={18} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-semibold">AI先回りギフトナビ</h1>
              <p className="text-xs text-slate-400">カレンダー連携 × 楽天 × Gemini</p>
            </div>
          </div>
          {result && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              <RefreshCw size={13} /> やり直す
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ステップインジケーター */}
        <div className="flex items-center gap-2">
          {[
            { n: 1, label: '相手・シーン' },
            { n: 2, label: '予算・条件' },
            { n: 3, label: '提案結果' },
          ].map(({ n, label }, i, arr) => (
            <React.Fragment key={n}>
              <div
                className={`flex items-center gap-1.5 ${step >= n ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border ${step > n ? 'bg-emerald-500 border-emerald-500 text-white' : step === n ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'}`}>
                  {step > n ? <Check size={12} /> : n}
                </div>
                <span className={`text-xs hidden sm:inline ${step === n ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>{label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-px ${step > n ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── STEP 1: 相手・シーン ────────────────────────────────────── */}
        {step <= 2 && (
          <div className="space-y-5">
            {/* 関係性 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold">相手との関係性</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {RELATION_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setRelation(p.id)}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                      relation === p.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/5 bg-[#13141f] hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <span className="text-sm font-medium leading-tight">{p.label}</span>
                    <span className="text-xs text-slate-500 leading-tight">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* シーン */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <PartyPopper size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold">贈るシーン・機会</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {OCCASION_PRESETS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setOccasion(o.id)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                      occasion === o.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/5 bg-[#13141f] hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{o.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {canStep2 && step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                次へ：予算・条件を設定 <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* ─── STEP 2: 予算・除外条件 ──────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* 予算 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold">予算範囲</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {BUDGET_QUICK.map(b => (
                  <button
                    key={b.label}
                    onClick={() => { setBudgetMin(b.min); setBudgetMax(b.max) }}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                      budgetMin === b.min && budgetMax === b.max
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/5 bg-[#13141f] hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">最低金額</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">¥</span>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={e => setBudgetMin(Number(e.target.value))}
                      className="w-full bg-[#13141f] border border-white/5 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <span className="text-slate-500 text-sm mt-4">〜</span>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">最高金額</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">¥</span>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={e => setBudgetMax(Number(e.target.value))}
                      className="w-full bg-[#13141f] border border-white/5 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 贈る日（任意） */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold">贈る日（任意）</span>
                <span className="text-xs text-slate-500">— マナーアドバイスに活用</span>
              </div>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full bg-[#13141f] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-emerald-500 outline-none text-slate-300"
              />
            </div>

            {/* 除外条件 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold">除外条件（任意）</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXCLUDE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleExclude(opt.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-all ${
                      excludes.includes(opt.id)
                        ? 'border-red-500/60 bg-red-500/10 text-red-400'
                        : 'border-white/5 bg-[#13141f] hover:border-slate-500 text-slate-400'
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={loading || !canStep3}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AIが最適ギフトを分析中...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  AIギフトを提案してもらう
                </>
              )}
            </button>
          </div>
        )}

        {/* ─── STEP 3: 結果 ────────────────────────────────────────────── */}
        {step === 3 && result && (
          <div className="space-y-5">
            {/* AI分析サマリー */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-300">AI分析レポート</span>
                    <MannerScore score={result.analysis.mannerScore} />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.analysis.recommendation}</p>
                  {result.analysis.reason?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {result.analysis.reason.map((r, i) => (
                        <span key={i} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* マナーポイント */}
            {result.analysis.mannerTips && (
              <div className="bg-[#0d1117] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={14} className="text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">マナーポイント</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                  {result.analysis.mannerTips}
                </p>
              </div>
            )}

            {/* 商品カード */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gift size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold">おすすめ商品（楽天市場）</span>
                {!result.hasRealItems && (
                  <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    検索リンクモード
                  </span>
                )}
                {result.hasRealItems && (
                  <span className="text-xs text-slate-500 ml-auto">{result.items.length}件</span>
                )}
              </div>

              {/* フォールバック時の説明 */}
              {!result.hasRealItems && (
                <div className="mb-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-300 leading-relaxed">
                  💡 AIが提案するキーワードで楽天市場を直接検索できます。クリックして商品を探してください。
                </div>
              )}

              <div className="space-y-3">
                {result.items.map((item, i) => (
                  item.isFallback ? (
                    // フォールバック: 楽天検索リンクボタン
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-[#0d1117] border border-white/5 hover:border-emerald-500/40 rounded-xl transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Gift size={18} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.caption}</p>
                      </div>
                      <ExternalLink size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                    </a>
                  ) : (
                    // 実商品カード
                    <div
                      key={i}
                      className={`bg-[#0d1117] border rounded-xl p-4 transition-all cursor-pointer ${
                        selectedItem?.url === item.url
                          ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                          : 'border-white/5 hover:border-emerald-500/30'
                      }`}
                      onClick={() => setSelectedItem(selectedItem?.url === item.url ? null : item)}
                    >
                      <div className="flex gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-800"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium text-slate-200 leading-tight line-clamp-2">{item.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-emerald-400">
                              ¥{item.price.toLocaleString()}
                            </span>
                            {item.reviewAverage > 0 && (
                              <div className="flex items-center gap-1">
                                <StarRating score={item.reviewAverage} />
                                <span className="text-xs text-slate-500">({item.reviewCount})</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{item.shopName}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedItem?.url === item.url ? 'border-emerald-500 bg-emerald-500' : 'border-slate-700'}`}>
                            {selectedItem?.url === item.url && <Check size={11} className="text-white" />}
                          </span>
                        </div>
                      </div>
                      {selectedItem?.url === item.url && item.caption && (
                        <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-white/5 pt-3">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* 選択した実商品の購入リンク */}
            {selectedItem && !selectedItem.isFallback && (
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
              >
                <ExternalLink size={16} />
                楽天市場で見る・購入する
              </a>
            )}

            {/* メッセージ代筆 */}
            <div className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowMessage(!showMessage)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold">✉️ メッセージ代筆</span>
                </div>
                {showMessage ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
              </button>
              {showMessage && (
                <div className="border-t border-white/5 p-4 space-y-3">
                  <div className="flex gap-2 mb-2">
                    {(['formal', 'casual'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setMessageMode(mode)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${messageMode === mode ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 text-slate-500 hover:border-slate-500'}`}
                      >
                        {mode === 'formal' ? '丁寧語' : 'カジュアル'}
                      </button>
                    ))}
                  </div>
                  <div className="bg-[#13141f] rounded-xl p-4">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {result.analysis.messageTemplate}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyMessage}
                    className={`flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border text-sm font-medium transition-all ${copied ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 hover:border-emerald-500/40 text-slate-400'}`}
                  >
                    {copied ? <><Check size={14} /> コピーしました!</> : <><Copy size={14} /> メッセージをコピー</>}
                  </button>
                </div>
              )}
            </div>

            {/* 残り回数 */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>本日の残り利用回数: <span className="text-emerald-400 font-medium">{result.remainingToday}回</span></span>
              <button onClick={handleReset} className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors">
                <RefreshCw size={11} /> 新しいギフトを探す
              </button>
            </div>
          </div>
        )}

        {/* アフィリエイトバナー */}
        <AffiliateBanner toolId="gift-advisor" />
      </div>
    </div>
  )
}
