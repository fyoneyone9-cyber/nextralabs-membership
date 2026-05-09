'use client'
import React, { useState, useEffect } from 'react'
import {
  Zap, Loader2, CheckCircle2, TrendingUp,
  Share2, Clock, Copy, Sparkles, AlertCircle,
  Twitter, Instagram, RefreshCw, Check
} from 'lucide-react'

type Result = { content: string; strategy: string; bestTime: string }

export default function SnsAutoPosterApp() {
  const [topic, setTopic] = useState('')
  const [targetSns, setTargetSns] = useState<'X' | 'Instagram'>('X')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [trends, setTrends] = useState<string[]>([])
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const r = await fetch('/api/tools/trend-stock', { cache: 'no-store' })
      const d = await r.json()
      if (d.items && d.items.length > 0) {
        setTrends(d.items.slice(0, 6).map((item: any) => item.name))
      } else {
        setTrends(['AI活用', '時短術', '最新ガジェット', '副業術', '節約生活', 'ChatGPT'])
      }
    } catch {
      setTrends(['AI活用', '時短術', '最新ガジェット', '副業術', '節約生活', 'ChatGPT'])
    } finally {
      setIsLoadingTrends(false)
    }
  }

  useEffect(() => { fetchTrends() }, [])

  const handleGenerate = async () => {
    const finalTopic = topic.trim() || selectedTrend
    if (!finalTopic) {
      setError('テーマを入力するか、トレンドを選択してください。')
      return
    }
    setIsGenerating(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/tools/sns-auto-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: finalTopic, sns: targetSns, trend: selectedTrend }),
      })
      if (res.status === 401) {
        const errData = await res.json().catch(() => ({}))
        if (errData.reason === 'unauthenticated') {
          const current = encodeURIComponent(window.location.pathname)
          window.location.href = `/auth/login?redirect=${current}`
          return
        }
      }
      if (res.status === 429) {
        throw new Error('本日の利用制限に達しました。明日またご利用ください。')
      }
      const data = await res.json()
      if (!data.success) throw new Error(data.error || '生成に失敗しました')
      setResult(data)
    } catch (e: any) {
      setError(e.message || '生成に失敗しました。しばらく待って再試行してください。')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setTopic('')
    setSelectedTrend(null)
  }

  return (
    <div
      className="min-h-screen bg-[#0f172a] text-slate-100"
      style={{ fontFamily: "'Inter','Noto Sans JP',sans-serif" }}
    >
      <div className="h-1 bg-emerald-500 w-full" />

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* ヘッダー */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">SNS × AI コンテンツ生成</span>
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight leading-[1.15]">
            AI SNSオートポスター
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
            トレンドキーワードをもとに、X・InstagramでバズるAI投稿文を即生成。コピーしてそのまま投稿できます。
          </p>
        </div>

        {/* エラー */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── 入力フォーム ── */}
        {!result && (
          <div className="space-y-5">

            {/* Step 1: トレンド */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-bold">1</span>
                  <span className="text-sm font-semibold text-white">トレンドから選ぶ</span>
                </div>
                <button
                  onClick={fetchTrends}
                  disabled={isLoadingTrends}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isLoadingTrends ? 'animate-spin' : ''} />
                  更新
                </button>
              </div>
              {isLoadingTrends ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-[#0f172a] rounded-lg animate-pulse border border-slate-700/50" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {trends.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedTrend(t)
                        setTopic('')
                      }}
                      className={`h-10 px-3 rounded-lg text-sm font-medium transition-all text-left truncate border ${
                        selectedTrend === t
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                          : 'bg-[#0f172a] text-slate-300 border-slate-700/50 hover:border-emerald-500/50 hover:text-emerald-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: 自由入力 */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-slate-300 text-xs font-bold">2</span>
                <span className="text-sm font-semibold text-white">または自由にテーマを入力</span>
              </div>
              <textarea
                value={topic}
                onChange={e => { setTopic(e.target.value); setSelectedTrend(null) }}
                rows={3}
                placeholder="例：ChatGPTで副業を始める方法、朝活の習慣化..."
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors resize-none"
              />
            </div>

            {/* Step 3: SNS選択 */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-slate-300 text-xs font-bold">3</span>
                <span className="text-sm font-semibold text-white">ターゲットSNS</span>
              </div>
              <div className="flex gap-3">
                {([
                  { id: 'X', label: 'X (Twitter)', icon: Twitter },
                  { id: 'Instagram', label: 'Instagram', icon: Instagram },
                ] as { id: 'X' | 'Instagram'; label: string; icon: any }[]).map(s => (
                  <button
                    key={s.id}
                    onClick={() => setTargetSns(s.id)}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all border ${
                      targetSns === s.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                        : 'bg-[#0f172a] text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    <s.icon size={16} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 生成ボタン */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!topic.trim() && !selectedTrend)}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> 生成中...</>
              ) : (
                <><Zap size={18} /> 投稿文を生成する</>
              )}
            </button>

            {/* 生成中インジケーター */}
            {isGenerating && (
              <div className="bg-[#1e293b] border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <Loader2 size={28} className="animate-spin text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AIが投稿文を生成しています</p>
                  <p className="text-xs text-slate-400 mt-0.5">トレンドを分析して最適な文章を作成中...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 結果表示 ── */}
        {result && (
          <div className="space-y-5">
            {/* 成功ヘッダー */}
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <div>
                  <p className="text-sm font-semibold text-white">投稿文を生成しました</p>
                  <p className="text-xs text-slate-400 mt-0.5">{targetSns} 向け最適化済み</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors border border-slate-700/50 rounded-lg px-3 py-1.5"
              >
                やり直す
              </button>
            </div>

            {/* 投稿本文 */}
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-white">投稿文</span>
                </div>
                <button
                  onClick={() => copyToClipboard(result.content)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#0f172a] text-slate-400 border-slate-700/50 hover:text-emerald-400 hover:border-emerald-500/40'
                  }`}
                >
                  {copied ? <><Check size={12} /> コピー済み</> : <><Copy size={12} /> コピー</>}
                </button>
              </div>
              <div className="bg-[#0f172a] border border-slate-700/30 rounded-lg p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                {result.content}
              </div>
            </div>

            {/* バズる理由 + 投稿時間 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap size={15} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">バズる理由</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{result.strategy}</p>
              </div>
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">推奨投稿時間</span>
                </div>
                <p className="text-2xl font-semibold text-white">{result.bestTime}</p>
              </div>
            </div>

            {/* 次のアクション */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Share2,    label: '即時投稿',  desc: 'コピーして投稿' },
                { icon: TrendingUp, label: '反響分析', desc: 'インプ・エンゲージ' },
                { icon: Zap,       label: '売上連動',  desc: 'アフィリ×SNS' },
              ].map((s, i) => (
                <div key={i} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 text-center space-y-1">
                  <s.icon size={16} className="text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">{s.label}</p>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <span>© 2026 NextraLabs</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Gemini 1.5 Flash × Real-time Trends
          </span>
        </div>
      </div>
    </div>
  )
}
