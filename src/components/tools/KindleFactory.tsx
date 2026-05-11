// ============================================================
// 🔒 LOCKED — KindleFactory
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, BookOpen, Download, FileText, Sparkles, Crown, Zap, Lock, PenLine, Copy, CheckCheck, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ========================
// プラン定義
// ========================
type UserPlan = 'free' | 'light' | 'standard' | 'premium'

const PLAN_CONFIG: Record<UserPlan, {
  label: string
  badge: string
  badgeColor: string
  dailyLimit: number
  genres: string[]
  hasDocx: boolean
  hasKdpSheet: boolean
  hasCoverPrompt: boolean
  hasUnlimited: boolean
}> = {
  free: {
    label: '無料',
    badge: 'FREE',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    dailyLimit: 1,
    genres: ['副業・収入アップ', 'AI活用', '自己啓発'],
    hasDocx: false,
    hasKdpSheet: false,
    hasCoverPrompt: false,
    hasUnlimited: false,
  },
  light: {
    label: 'ライト',
    badge: 'LIGHT',
    badgeColor: 'bg-emerald-500/20 text-blue-400 border-emerald-500/30',
    dailyLimit: 3,
    genres: ['副業・収入アップ', 'AI活用', '家計管理・節約', '自己啓発', 'ビジネス', '健康・美容', '育児・教育', '投資・資産運用'],
    hasDocx: true,
    hasKdpSheet: false,
    hasCoverPrompt: false,
    hasUnlimited: false,
  },
  standard: {
    label: 'スタンダード',
    badge: 'STANDARD',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    dailyLimit: 5,
    genres: ['副業・収入アップ', 'AI活用', '家計管理・節約', '自己啓発', 'ビジネス', '健康・美容', '育児・教育', '投資・資産運用', '料理・レシピ', '旅行・体験記', '転職・キャリア', '英語学習'],
    hasDocx: true,
    hasKdpSheet: true,
    hasCoverPrompt: false,
    hasUnlimited: false,
  },
  premium: {
    label: 'プレミアム',
    badge: 'PREMIUM',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    dailyLimit: 15,
    genres: ['副業・収入アップ', 'AI活用', '家計管理・節約', '自己啓発', 'ビジネス', '健康・美容', '育児・教育', '投資・資産運用', '料理・レシピ', '旅行・体験記', '転職・キャリア', '英語学習', 'マインドフルネス', '起業・スタートアップ'],
    hasDocx: true,
    hasKdpSheet: true,
    hasCoverPrompt: true,
    hasUnlimited: false,
  },
}

const STORAGE_KEY = 'kindle_factory_usage'

function getUsageData(): { date: string; count: number } {
  if (typeof window === 'undefined') return { date: '', count: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: '', count: 0 }
    return JSON.parse(raw)
  } catch { return { date: '', count: 0 } }
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function getRemainingCount(limit: number): number {
  const data = getUsageData()
  if (data.date !== getTodayStr()) return limit
  return Math.max(0, limit - data.count)
}

function incrementUsage(): void {
  const today = getTodayStr()
  const data = getUsageData()
  if (data.date !== today) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 1 }))
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: data.count + 1 }))
  }
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64)
  const byteArray = new Uint8Array(Array.from({ length: byteChars.length }, (_, i) => byteChars.charCodeAt(i)))
  return new Blob([byteArray], { type: mimeType })
}

interface GenerateResult {
  success: boolean
  title: string
  preview: string
  docxBase64: string
  kdpMetadata: Record<string, unknown>
  charCount: number
  coverPrompt?: string
}

// ========================
// ロック表示コンポーネント
// ========================
function LockedFeature({ requiredPlan, label }: { requiredPlan: string; label: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 rounded-xl opacity-60">
      <Lock size={14} className="text-slate-500 shrink-0" />
      <span className="text-slate-500 text-sm font-bold">{label}</span>
      <Badge className={`ml-auto text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full border ${
        requiredPlan === 'light' ? 'bg-emerald-500/20 text-blue-400 border-emerald-500/30' :
        requiredPlan === 'standard' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      }`}>{requiredPlan.toUpperCase()}以上</Badge>
    </div>
  )
}

// ========================
// メインコンポーネント
// ========================
export function KindleFactory() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const [userPlan, setUserPlan] = useState<UserPlan>('free')
  const [isAdmin, setIsAdmin] = useState(false)
  const [planLoading, setPlanLoading] = useState(true)
  const [theme, setTheme] = useState('')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [step, setStep] = useState('')

  // プラン取得
  useEffect(() => {
    async function fetchPlan() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setPlanLoading(false); return }

        // 管理者は常にプレミアム＋制限なし
        if (session.user.email === 'f.yoneyone9@gmail.com') {
          setUserPlan('premium')
          setIsAdmin(true)
          setPlanLoading(false)
          return
        }

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle()

        const plan = (sub?.plan || 'free') as UserPlan
        setUserPlan(plan)
      } catch { /* free fallback */ } finally {
        setPlanLoading(false)
      }
    }
    fetchPlan()
  }, [])

  useEffect(() => {
    if (!planLoading) {
      setRemaining(getRemainingCount(PLAN_CONFIG[userPlan].dailyLimit))
    }
  }, [planLoading, userPlan])

  const config = PLAN_CONFIG[userPlan]

  const handleGenerate = useCallback(async () => {
    if (loading) return
    if (remaining <= 0) {
      setError(`本日の生成回数制限（${config.dailyLimit}回）に達しました。明日また生成できます。`)
      return
    }
    if (!theme.trim()) { setError('テーマを入力してください。'); return }
    if (!genre.trim()) { setError('ジャンルを入力してください。'); return }

    setLoading(true)
    setError(null)
    setResult(null)
    setStep('AIが原稿を生成中...')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme.trim(),
          genre: genre.trim(),
          maxChars: isAdmin ? 10000 : (userPlan === 'premium' ? 8000 : userPlan === 'standard' ? 6000 : 5000),
          includeCoverPrompt: config.hasCoverPrompt,
          isAdmin,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || '生成に失敗しました。')
      incrementUsage()
      setRemaining(getRemainingCount(config.dailyLimit))
      setResult(data)
      setStep('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。')
      setStep('')
    } finally {
      setLoading(false)
    }
  }, [theme, genre, loading, remaining, config])

  const handleDownloadDocx = useCallback(() => {
    if (!result) return
    const blob = base64ToBlob(result.docxBase64, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${result.title}.docx`
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }, [result])

  const handleDownloadKdp = useCallback(() => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result.kdpMetadata, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${result.title}_KDP入稿情報.json`
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }, [result])

  if (planLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      {/* ヘッダー */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="text-emerald-500" size={32} />
            <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
              Kindle AI ファクトリー
            </h1>
          </div>
          <Badge className={`text-xs font-bold uppercase tracking-tight px-4 py-1 rounded-full border ${config.badgeColor}`}>
            {config.badge} プラン
          </Badge>
        </div>
        <p className="text-slate-300 text-base font-bold leading-relaxed">
          最新の Gemini 2.5 Flash 搭載。テーマを入力するだけで、KDP入稿可能な5,000〜8,000字の原稿を最短5分で自動生成します。
        </p>
      </div>

      {/* プラン別機能一覧 */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#13141f] border border-white/5 rounded-2xl p-4">
          {(['free', 'light', 'standard', 'premium'] as UserPlan[]).map(p => {
            const c = PLAN_CONFIG[p]
            const isActive = p === userPlan
            return (
              <div key={p} className={`rounded-xl p-3 border transition-all ${isActive ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-white/5 opacity-50'}`}>
                <Badge className={`text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full border mb-2 ${c.badgeColor}`}>{c.badge}</Badge>
                <ul className="text-xs text-slate-400 space-y-1 font-bold">
                  <li>📄 {c.dailyLimit === 999 ? '無制限' : `1日${c.dailyLimit}回`}</li>
                  <li>⚡️ 最大8000字</li>
                  <li className={c.hasDocx ? 'text-emerald-400' : ''}>📁 DOCX {c.hasDocx ? '✓' : '✗'}</li>
                  <li className={c.hasKdpSheet ? 'text-emerald-400' : ''}>📋 KDP表 {c.hasKdpSheet ? '✓' : '✗'}</li>
                  <li className={c.hasCoverPrompt ? 'text-emerald-400' : ''}>🎨 表紙 {c.hasCoverPrompt ? '✓' : '✗'}</li>
                </ul>
              </div>
            )
          })}
        </div>
        {userPlan !== 'premium' && (
          <p className="text-center text-[11px] text-slate-500 font-bold mt-2">
            ⬆️ <a href="/pricing" className="text-emerald-400 underline">プランをアップグレード</a>して全機能を解放
          </p>
        )}
      </div>

      {/* 使用回数バッジ */}
      <div className="max-w-3xl mx-auto px-4 mb-4 flex justify-end">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${remaining > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          <Zap size={12} />
          本日の残り: {remaining} / {config.dailyLimit}回
        </span>
      </div>

      {/* 入力フォーム */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2rem] p-6 md:p-8 space-y-5 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">📝 本の設定</h2>

          {/* テーマ */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              テーマ <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              placeholder="例: 副業で月10万円を稼ぐ方法、ChatGPTで業務効率化"
              className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-4 py-4 text-white text-base font-bold placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
              disabled={loading}
              maxLength={200}
            />
          </div>

          {/* ジャンル */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              ジャンル <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {config.genres.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                    genre === g
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/40 hover:text-emerald-400'
                  }`}
                  disabled={loading}
                >
                  {g}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="または直接入力"
              className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-4 py-4 text-white text-base font-bold placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition-all"
              disabled={loading}
              maxLength={100}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border-2 border-red-500/40 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="text-red-400 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-red-400 text-base font-bold uppercase tracking-wider">生成エラーが発生しました</p>
                <p className="text-red-300 text-sm font-bold leading-relaxed">{error}</p>
                <p className="text-red-400/60 text-[10px] font-bold mt-1">※Gemini APIの制限やネットワークエラーの可能性があります。しばらく時間を置いてお試しください。</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || remaining <= 0}
            className={`w-full h-14 rounded-xl font-bold text-lg uppercase transition-all ${
              loading || remaining <= 0
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" size={20} />
                {step || '生成中...'}
              </span>
            ) : remaining <= 0 ? '本日の制限に達しました' : '🚀 AIで原稿を生成する'}
          </button>
          <p className="text-[11px] text-slate-500 text-center font-bold">※ 生成には30〜60秒かかります</p>
        </div>
      </div>

      {/* 生成結果 */}
      {result && (
        <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
          {/* 成功バナー */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">✅</span>
              <h3 className="font-bold text-emerald-400 uppercase ">原稿の生成が完了！</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-emerald-300">
              <span>📖 {result.title}</span>
              <span>📊 {result.charCount.toLocaleString()}字</span>
            </div>
          </div>

          {/* ダウンロードボタン */}
          <div className="bg-[#13141f] border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">📥 ダウンロード</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* DOCXダウンロード */}
              {config.hasDocx ? (
                <button
                  onClick={handleDownloadDocx}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-5 rounded-xl font-bold text-sm uppercase transition-all active:scale-95"
                >
                  <Download size={16} />DOCX原稿
                </button>
              ) : (
                <LockedFeature requiredPlan="light" label="DOCX原稿ダウンロード" />
              )}

              {/* KDPチートシート */}
              {config.hasKdpSheet ? (
                <button
                  onClick={handleDownloadKdp}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-emerald-400 border border-emerald-500/40 py-3 px-5 rounded-xl font-bold text-sm uppercase transition-all active:scale-95"
                >
                  <FileText size={16} />KDP入稿チートシート
                </button>
              ) : (
                <LockedFeature requiredPlan="standard" label="KDP入稿チートシート" />
              )}
            </div>

            {/* 表紙プロンプト */}
            {config.hasCoverPrompt && result.coverPrompt ? (
              <div className="mt-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">表紙プロンプト（AI画像生成用）</span>
                </div>
                <p className="text-slate-300 text-sm font-bold leading-relaxed">{result.coverPrompt}</p>
              </div>
            ) : !config.hasCoverPrompt ? (
              <LockedFeature requiredPlan="premium" label="表紙プロンプト自動生成（Midjourney/DALL-E対応）" />
            ) : null}
          </div>

          {/* プレビュー */}
          <div className="bg-[#13141f] border border-white/10 rounded-2xl p-5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">👁️ 原稿プレビュー（最初の1000字）</h4>
            <div className="bg-black/40 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono max-h-64 overflow-y-auto border border-white/5">
              {result.preview}
              {result.charCount > 1000 && (
                <span className="text-slate-600">{'\n\n'}... （続きはDOCXファイルでご確認ください）</span>
              )}
            </div>
          </div>

          {/* 次のステップ */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
            <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider mb-3">📌 次のステップ</h4>
            <ol className="space-y-2 text-sm text-emerald-300 font-bold">
              {[
                'DOCXをWordまたはGoogleドキュメントで開き、内容を確認・加筆修正',
                'Canva等でカバー画像を作成（推奨: 2560×1600px）',
                'KDP入稿チートシートを参考にKDPダッシュボードで登録',
                '審査後（24〜72時間）に販売開始！',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold min-w-[20px]">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="kindle-factory" />
</div>
  )
}
