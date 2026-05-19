'use client'
import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Music, Film, Tv, Sparkles, Gamepad2, BookOpen, Book,
  Loader2, ExternalLink, Copy, Check, RefreshCw, ChevronRight,
  ShoppingCart, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ── 型定義 ──────────────────────────────────────────────────────────────────

interface RecomItem {
  title: string
  genre: string
  year: number
  description: string
  whyYou: string
  rakutenUrl: string
  amazonUrl: string
}

interface RecomResult {
  items: RecomItem[]
  era: string
  eraLabel: string
  message: string
}

// ── 定数 ────────────────────────────────────────────────────────────────────

const YEAR_PRESETS = [5, 10, 15, 20, 25, 30, 35, 40]

const GENRE_OPTIONS = [
  { id: '音楽', label: '音楽', emoji: '🎵' },
  { id: '映画', label: '映画', emoji: '🎬' },
  { id: 'ドラマ', label: 'ドラマ', emoji: '📺' },
  { id: 'アニメ', label: 'アニメ', emoji: '🌸' },
  { id: 'ゲーム', label: 'ゲーム', emoji: '🎮' },
  { id: 'マンガ', label: 'マンガ', emoji: '📚' },
  { id: '本', label: '本', emoji: '📖' },
]

const TIME_PRESETS = [
  { emoji: '🎌', label: 'バブル時代', yearsAgo: 35, genres: ['音楽', '映画'], sub: '約35年前' },
  { emoji: '📱', label: 'ガラケー全盛期', yearsAgo: 20, genres: ['音楽', 'アニメ'], sub: '約20年前' },
  { emoji: '🎮', label: 'ゲーム黄金期', yearsAgo: 25, genres: ['ゲーム', 'マンガ'], sub: '約25年前' },
  { emoji: '🌸', label: 'ゆとり世代', yearsAgo: 15, genres: ['ドラマ', '音楽'], sub: '約15年前' },
]

function getEraLabel(yearsAgo: number): string {
  const year = 2026 - yearsAgo
  if (year >= 1985 && year <= 1992) return `${year}年頃 / バブル景気の時代`
  if (year >= 1993 && year <= 1999) return `${year}年頃 / 90年代J-POP黄金期`
  if (year >= 2000 && year <= 2006) return `${year}年頃 / ゆとり世代・ガラケー時代`
  if (year >= 2007 && year <= 2012) return `${year}年頃 / スマホ黎明期`
  if (year >= 2013 && year <= 2018) return `${year}年頃 / SNS全盛期`
  if (year >= 2019 && year <= 2022) return `${year}年頃 / コロナ前後の時代`
  return `${year}年頃`
}

// ── コンポーネント ─────────────────────────────────────────────────────────────

export default function NostalgicRecomApp() {
  const [yearsAgo, setYearsAgo] = useState<number>(20)
  const [genres, setGenres] = useState<string[]>(['音楽', 'アニメ'])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecomResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const toggleGenre = useCallback((id: string) => {
    setGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }, [])

  const applyPreset = useCallback((p: typeof TIME_PRESETS[0]) => {
    setYearsAgo(p.yearsAgo)
    setGenres(p.genres)
    setResult(null)
    setError(null)
  }, [])

  const handleSubmit = async () => {
    if (!yearsAgo || genres.length === 0) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/nostalgic-recom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearsAgo, genres, description }),
      })
      if (!res.ok) throw new Error('AIの生成に失敗しました')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!result) return
    const text = `【あの頃の僕へ】${yearsAgo}年前(${result.era})のレコメンド\n${result.eraLabel}\n\n` +
      result.items.slice(0, 5).map(item => `・${item.title}（${item.genre}/${item.year}年）`).join('\n') +
      '\n\nhttps://nextralab.jp/products/nostalgic-recom'
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050507] px-4 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">

        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
            <Clock size={14} />
            タイムトラベルレコメンド
          </div>
          <h1 className="text-2xl font-black text-white">あの頃の僕へ</h1>
          <p className="mt-2 text-sm text-slate-400">年代とジャンルを選んで、青春の名作に再会しよう</p>
        </div>

        {/* プリセット */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">人気のタイムトラベル先</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className={`rounded-xl border p-3 text-left transition-all hover:border-amber-500/50 ${
                  yearsAgo === p.yearsAgo && JSON.stringify(genres.sort()) === JSON.stringify([...p.genres].sort())
                    ? 'border-amber-500/60 bg-amber-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="text-xl">{p.emoji}</div>
                <div className="mt-1 text-xs font-bold text-slate-200">{p.label}</div>
                <div className="text-xs text-slate-500">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP1: 年代選択 */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-1 text-sm font-semibold text-amber-400">STEP 1</h2>
          <h3 className="mb-4 text-base font-bold text-white">何年前に戻る？</h3>

          <div className="mb-4">
            <input
              type="range"
              min={5}
              max={40}
              step={5}
              value={yearsAgo}
              onChange={e => setYearsAgo(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>5年前</span>
              <span className="font-bold text-amber-400 text-sm">{yearsAgo}年前</span>
              <span>40年前</span>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {YEAR_PRESETS.map(y => (
              <button
                key={y}
                onClick={() => setYearsAgo(y)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-all ${
                  yearsAgo === y
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'border border-white/10 bg-white/5 text-slate-400 hover:border-amber-500/40'
                }`}
              >
                {y}年前
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm text-amber-300">
            📅 {getEraLabel(yearsAgo)}
          </div>
        </div>

        {/* STEP2: ジャンル選択 */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-1 text-sm font-semibold text-amber-400">STEP 2</h2>
          <h3 className="mb-4 text-base font-bold text-white">ジャンルを選ぶ（複数OK）</h3>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map(g => (
              <button
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  genres.includes(g.id)
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'border border-white/10 bg-white/5 text-slate-400 hover:border-amber-500/40'
                }`}
              >
                <span>{g.emoji}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>
          {genres.length === 0 && (
            <p className="mt-3 text-xs text-rose-400">※ 1つ以上選んでください</p>
          )}
        </div>

        {/* STEP3: 追加情報 */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-1 text-sm font-semibold text-amber-400">STEP 3（任意）</h2>
          <h3 className="mb-3 text-base font-bold text-white">当時の自分について</h3>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="例: 中学生だった、スポーツをやっていた、友達と放課後よくゲームセンターに行っていた..."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          />
          <p className="mt-1.5 text-xs text-slate-500">入力するほどAIのレコメンドが精度UP</p>
        </div>

        {/* 実行ボタン */}
        <Button
          onClick={handleSubmit}
          disabled={loading || genres.length === 0}
          className="mb-10 h-14 w-full bg-amber-500 text-slate-950 font-bold text-base rounded-xl hover:bg-amber-400 disabled:opacity-40 shadow-[0_4px_24px_rgba(245,158,11,0.35)]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              {yearsAgo}年前の記憶を呼び起こしています...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={18} />
              あの頃に戻る ✨
            </span>
          )}
        </Button>

        {/* エラー */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* 結果 */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* 時代ヘッダー */}
              <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
                <div className="mb-1 text-3xl">⏰</div>
                <div className="text-xl font-black text-amber-400">{result.era}</div>
                <div className="mt-1 font-bold text-white">{result.eraLabel}</div>
                <div className="mt-2 text-sm text-slate-400">{result.message}</div>
              </div>

              {/* アクションボタン */}
              <div className="mb-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  {copied ? <Check size={14} className="mr-2 text-emerald-400" /> : <Share2 size={14} className="mr-2" />}
                  {copied ? 'コピーしました！' : 'シェアする'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setResult(null); setError(null) }}
                  className="flex-1 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  <RefreshCw size={14} className="mr-2" />
                  もう一度試す
                </Button>
              </div>

              {/* レコメンドカード一覧 */}
              <div className="space-y-4">
                {result.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <span className="mr-2 text-xs text-slate-500">#{i + 1}</span>
                        <span className="font-bold text-white">{item.title}</span>
                      </div>
                      <div className="flex flex-shrink-0 gap-1.5">
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
                          {item.genre}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-slate-400 text-xs">
                          {item.year}年
                        </Badge>
                      </div>
                    </div>

                    <p className="mb-2 text-sm text-slate-400">{item.description}</p>

                    <div className="mb-4 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-sm text-amber-300">
                      💭 {item.whyYou}
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={item.rakutenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400 transition-all hover:bg-rose-500/20"
                      >
                        <ShoppingCart size={12} />
                        楽天で探す
                      </a>
                      <a
                        href={item.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400 transition-all hover:bg-amber-500/20"
                      >
                        <ExternalLink size={12} />
                        Amazonで探す
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 下部アクション */}
              <div className="mt-8 text-center">
                <Button
                  onClick={() => { setResult(null); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 rounded-xl"
                >
                  <RefreshCw size={14} className="mr-2" />
                  別の時代も探してみる
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
