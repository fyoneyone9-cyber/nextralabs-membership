'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GitCompareArrows, Zap, Copy, CheckCircle2, AlertCircle, Loader2, ChevronDown, Lock } from 'lucide-react'

const PRESETS = [
  { id: 'fact',     label: '📋 ファクトチェック',     prompt: '以下の内容について、事実・数値・情報の正確性を検証してください。不正確な点があれば指摘してください。' },
  { id: 'writing',  label: '✏️ 文章校正',              prompt: '以下の文章について、誤字・文法・表現の改善点を指摘してください。' },
  { id: 'code',     label: '💻 コードレビュー',        prompt: '以下のコードについて、バグ・セキュリティ問題・改善点を指摘してください。' },
  { id: 'legal',    label: '⚖️ 法律・契約チェック',    prompt: '以下の文書について、法的リスクや問題点を指摘してください。' },
  { id: 'medical',  label: '🏥 医療情報確認',          prompt: '以下の医療・健康情報について、正確性と注意点を確認してください。' },
  { id: 'seo',      label: '🔍 SEO記事チェック',       prompt: 'SEOの観点でこの記事・文章の問題点と改善点を指摘してください。' },
  { id: 'biz',      label: '📊 ビジネス文書確認',       prompt: '以下のビジネス文書・メール・企画書について、表現・内容・論理に問題がないか確認してください。' },
  { id: 'custom',   label: '⚙️ カスタム',              prompt: '' },
]

type Result = {
  gemini: string
  gpt: string
  verdict: string
  matchScore: number
}

export default function CrossCheckerApp() {
  const router = useRouter()
  const [accessChecked, setAccessChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    fetch('/api/check-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'cross-checker' }),
    })
      .then(r => r.json())
      .then(d => {
        setHasAccess(d.hasAccess)
        setAccessChecked(true)
        if (!d.hasAccess) router.replace('/pricing?from=cross-checker')
      })
      .catch(() => { setHasAccess(false); setAccessChecked(true) })
  }, [router])

  const [input, setInput] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0])
  const [customPrompt, setCustomPrompt] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPresets, setShowPresets] = useState(false)

  if (!accessChecked) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  if (!hasAccess) return null

  const handleRun = async () => {
    if (!input.trim()) { setError('テキストを入力してください'); return }
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const prompt = selectedPreset.id === 'custom' ? customPrompt : selectedPreset.prompt
      const res = await fetch('/api/products/cross-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, prompt }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || '処理中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.verdict)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <GitCompareArrows className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">AI クロスチェッカー</h1>
        <p className="text-sm text-slate-400">Gemini × GPT-4o が同時に検証。2つのAIが合意した内容だけを確定回答として出力します。</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* プリセット選択 */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(p => !p)}
            className="w-full flex items-center justify-between bg-[#13141f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white hover:border-emerald-500/40 transition-all"
          >
            <span>{selectedPreset.label}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
          </button>
          {showPresets && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#13141f] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPreset(p); setShowPresets(false) }}
                  className={`w-full text-left px-4 py-3 text-sm transition-all hover:bg-white/5 ${selectedPreset.id === p.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* カスタムプロンプト */}
        {selectedPreset.id === 'custom' && (
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="チェックの指示を自由に入力してください..."
            className="w-full bg-[#13141f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none h-24 transition-all"
          />
        )}

        {/* テキスト入力 */}
        <div className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="チェックしたい文章・コード・情報を入力してください..."
            className="w-full bg-[#13141f] border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none h-48 transition-all"
          />
          <div className="absolute bottom-3 right-4 text-xs text-slate-600">{input.length} / 5000</div>
        </div>

        {/* エラー */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* 実行ボタン */}
        <button
          onClick={handleRun}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/40 disabled:cursor-not-allowed text-slate-950 font-bold py-4 rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> 2つのAIが検証中...</>
          ) : (
            <><Zap className="h-4 w-4" /> クロスチェックを実行</>
          )}
        </button>

        {/* 結果 */}
        {result && (
          <div className="space-y-4">
            {/* 信頼度スコア */}
            <div className="bg-[#13141f] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">AI一致スコア</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${result.matchScore}%`,
                      background: result.matchScore >= 70 ? '#10b981' : result.matchScore >= 40 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className={`text-sm font-bold ${result.matchScore >= 70 ? 'text-emerald-400' : result.matchScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {result.matchScore}%
                </span>
              </div>
            </div>

            {/* 2AI並列表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#13141f] border border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  Gemini の回答
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{result.gemini}</p>
              </div>
              <div className="bg-[#13141f] border border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  GPT-4o の回答
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{result.gpt}</p>
              </div>
            </div>

            {/* 確定回答 */}
            <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">✅ 確定回答（両AI合意済み）</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all"
                >
                  {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'コピー済み' : 'コピー'}
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{result.verdict}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
