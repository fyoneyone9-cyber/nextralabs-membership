'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Share2, Loader2, Network, Users, AlertCircle } from 'lucide-react'

const MasterEngine = () => {
  const [inputText, setInputText] = useState('')
  const [report, setReport] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return
    setIsLoading(true)
    setError('')
    setReport('')
    try {
      const res = await fetch('/api/tools/office-politics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '解析に失敗しました')
      setReport(data.result || '')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [inputText])

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100" style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <div className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">Organization Intelligence</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* ヒーロー */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-slate-100 tracking-tight leading-[1.15]">
            社内政治 <span className="text-emerald-400">AI相関図</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            組織内のパワーバランス・派閥・深層心理の繋がりをAIが可視化。<br />
            最適な立ち回りをプランニングします。
          </p>
        </div>

        {/* 入力カード */}
        <div
          className="rounded-xl p-8 space-y-6"
          style={{
            background: '#1e293b',
            border: '2px solid #10b981',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div className="flex items-center gap-3">
            <Users size={20} className="text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">人間関係の構造解析</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              部署名・役職・最近のやり取りなどを入力
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例：営業部・田中部長（50代）と鈴木課長（40代）の関係が悪化。先週の会議で..."
              className="w-full h-48 rounded-lg p-4 text-sm text-slate-100 bg-[#0f172a] border border-slate-700 resize-none outline-none transition-all leading-relaxed placeholder:text-slate-600"
              style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981'
                e.currentTarget.style.boxShadow = '0 0 0 1px #10b981'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#334155'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputText.trim()}
            className="flex items-center gap-2 px-6 h-12 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: inputText.trim() && !isLoading ? '#10b981' : '#334155',
            }}
            onMouseEnter={(e) => {
              if (inputText.trim() && !isLoading) {
                e.currentTarget.style.background = '#059669'
                e.currentTarget.style.transform = 'scale(1.02)'
              }
            }}
            onMouseLeave={(e) => {
              if (inputText.trim() && !isLoading) {
                e.currentTarget.style.background = '#10b981'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                解析中...
              </>
            ) : (
              <>
                <Network size={16} />
                相関図を生成する
              </>
            )}
          </button>
        </div>

        {/* エラー */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-950/50 border border-red-800/50">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* 結果 */}
        {report && (
          <div
            className="rounded-xl p-8 space-y-4"
            style={{
              background: '#1e293b',
              border: '2px solid #10b981',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <Share2 size={20} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-slate-100">解析結果</h2>
              <span
                className="ml-auto text-xs font-medium px-3 py-1 rounded-full border"
                style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
              >
                MASTERMODEL品質
              </span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans"
                style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>
                {report}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false })
export default function PoliticsPage() { return <NoSSR /> }
