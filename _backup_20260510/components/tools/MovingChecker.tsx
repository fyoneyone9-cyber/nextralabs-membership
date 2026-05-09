'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Upload, CheckCircle2, Home, ShieldCheck, MapPin,
  Loader2, Search, Zap, Info, TrendingUp, ShoppingCart,
  Copy, ChevronRight, ExternalLink, ArrowLeft
} from 'lucide-react'

const ENTRY_MODES = [
  {
    id: 'area', label: 'エリア・治安調査', desc: '候補地のハザード・治安を分析',
    icon: MapPin,
    steps: ['市区町村を入力', 'AIプロンプト生成', 'リスク判定'],
  },
  {
    id: 'room', label: '内見・物件チェック', desc: '写真から不備を暴く',
    icon: Home,
    steps: ['部屋の写真をアップ', 'Visionプロンプト生成', '不備の特定'],
  },
  {
    id: 'contract', label: '契約書・重要事項', desc: '特約や費用の罠をチェック',
    icon: ShieldCheck,
    steps: ['契約書を貼付', 'リスク抽出プロンプト', '交渉点の特定'],
  },
]

const ROADMAP = [
  { title: 'リスク抽出', desc: '浸水・倒壊リスク、治安をAIが特定。', icon: Search },
  { title: '交渉策定', desc: '不動産屋への具体的質問案を構成。', icon: ShieldCheck },
  { title: '防衛完了', desc: '入居後の防犯・防災対策を自動提示。', icon: TrendingUp },
]

const inputCls = `w-full rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors`
const inputStyle = { background: '#13141f', border: '1px solid #334155' }

const MasterEngine = () => {
  const [mode, setMode] = useState('selection')
  const [isMounted, setIsMounted] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      if (file) formData.append('file', file)
      formData.append('mode', mode)
      await new Promise(r => setTimeout(r, 2500))
      setResult('AIによる多角的なリスク解析が完了しました。指定エリアのハザードマップと犯罪統計、および物件写真から検知された特有の不備（防音性の欠如、設備の老朽化）を特定しました。不動産屋への具体的な確認事項を生成します。')
    } catch {
      setResult('解析中にエラーが発生しました。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  const currentMode = ENTRY_MODES.find(m => m.id === mode)

  if (!isMounted) return null

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI引越し安心チェッカー
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          引越し前の不安を<span style={{ color: '#10b981' }}>AIで全部つぶす</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          エリア・物件写真・契約書のいずれかを選択してください。AIが不動産業界のリスクを洗い出し、あなたの新生活を守る防衛戦略を策定します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-5">

        {/* モード選択 */}
        {mode === 'selection' && (
          <div className="grid md:grid-cols-3 gap-4">
            {ENTRY_MODES.map(item => (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className="rounded-xl p-6 text-left space-y-4 transition-all hover:scale-[1.02]"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)' }}
                >
                  <item.icon size={18} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
                <div className="space-y-1.5">
                  {item.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <ChevronRight size={10} style={{ color: '#10b981' }} />
                      {s}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 解析フォーム */}
        {mode !== 'selection' && (
          <div className="space-y-4">
            <button
              onClick={() => { setMode('selection'); setResult(null); setFile(null) }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={13} /> モード選択に戻る
            </button>

            <div
              className="rounded-xl p-6 space-y-5"
              style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.08)' }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                {currentMode && <currentMode.icon size={15} style={{ color: '#10b981' }} />}
                {currentMode?.label} — 解析プロトコル
              </div>

              {/* ファイルアップロード */}
              <div
                className="relative rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                style={{ height: '160px', border: '2px dashed #334155', background: '#13141f' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
              >
                <input
                  type="file"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/*,.pdf"
                />
                <Upload size={24} style={{ color: file ? '#10b981' : '#475569' }} />
                <div className="text-center pointer-events-none">
                  <p className="text-sm font-medium text-slate-400">
                    {file ? file.name : 'ファイルをドロップ、またはクリック'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)}MB — 準備完了` : '物件写真・契約書（PDF/画像）'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (mode !== 'area' && !file)}
                className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={
                  isAnalyzing || (mode !== 'area' && !file)
                    ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                    : { background: '#10b981', color: '#fff' }
                }
              >
                {isAnalyzing
                  ? <><Loader2 size={15} className="animate-spin mr-1" />解析中...</>
                  : <><Zap size={15} className="mr-1" />AIリスク解析を実行</>}
              </button>
            </div>

            {/* 結果 */}
            {result && (
              <div className="space-y-4">
                {/* レポート */}
                <div
                  className="rounded-xl p-6 space-y-4"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#34d399' }}>
                      <Zap size={15} />AI防災・防犯診断レポート
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs transition-colors"
                      style={{ color: copied ? '#10b981' : '#64748b' }}
                    >
                      {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                      {copied ? 'コピー済み' : 'コピー'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{result}</p>
                </div>

                {/* 外部AIリンク */}
                <div className="grid grid-cols-3 gap-3">
                  {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                    <button
                      key={ai}
                      onClick={() => openAI(ai)}
                      className="h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      style={{ background: '#0d1117', border: '1px solid #1e293b', color: '#94a3b8' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#e2e8f0' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                    >
                      {ai} で相談 <ExternalLink size={10} />
                    </button>
                  ))}
                </div>

                {/* ロードマップ */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 px-1">安全確保ロードマップ</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {ROADMAP.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-5 space-y-3"
                        style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-medium">Step 0{i + 1}</span>
                          <s.icon size={15} style={{ color: '#10b981' }} />
                        </div>
                        <p className="text-sm font-semibold text-slate-200">{s.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amazon アフィリエイト */}
                <a
                  href="https://www.amazon.co.jp/s?k=防犯グッズ+防災セット&tag=nextralabs-22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden transition-transform hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(135deg, #059669, #0f766e)', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-emerald-200/60 font-medium">New Life Defense</p>
                      <p className="text-base font-semibold text-white leading-snug">
                        AI推奨の厳選防犯・防災ギア →
                      </p>
                    </div>
                    <ShoppingCart size={24} className="text-white/70 shrink-0" />
                  </div>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-widest">NextraLabs 2026</p>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function MovingPage() { return <NoSSR /> }
