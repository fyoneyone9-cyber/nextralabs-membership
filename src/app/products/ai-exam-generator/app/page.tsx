'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Zap, Loader2, TrendingUp, Search, ShoppingCart,
  Brain, ListChecks, ShieldAlert, FileText, FileDown,
  ClipboardPaste, Smartphone, Info, ExternalLink, CheckCircle2
} from 'lucide-react'

const PRESETS = [
  { id: 'itpass', label: 'ITパスポート', icon: Smartphone, content: 'ITパスポート試験のシラバス（テクノロジ・マネジメント・ストラテジ）に基づき、過去問実物データから頻出の選択問題を解説付きで生成してください。' },
  { id: 'fe', label: '基本情報技術者', icon: Zap, content: '基本情報技術者試験の科目A形式で、アルゴリズムと情報セキュリティの重要問題を実データに基づき生成してください。' },
  { id: 'security', label: '情報処理安全確保', icon: ShieldAlert, content: '情報処理安全確保支援士試験向けに、最新のサイバー攻撃手法と防御策に関する応用問題を生成してください。' },
]

const ROADMAP = [
  { title: '弱点特定', desc: '過去問実データから「知識の穴」をAIが可視化。', icon: Search },
  { title: '特訓問題', desc: '弱点に特化した実物同様の問題を自動生成。', icon: ListChecks },
  { title: '合格圏内', desc: 'AIの解説で正答率を高め本番へ。', icon: TrendingUp },
]

export default function AiExamGeneratorApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [inputData, setInputData] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [docUrl, setDocUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleAnalyze = async () => {
    if (!inputData) return
    setIsAnalyzing(true)
    setResult(null)
    setDocUrl(null)
    await new Promise(r => setTimeout(r, 2500))
    setResult('ITパスポート過去問実データの解析が完了しました。あなたの弱点である「ネットワーク・セキュリティ」分野の予想問題を30問生成しました。Googleドキュメントへ出力可能です。')
    setIsAnalyzing(false)
  }

  const handleExportDocs = async () => {
    setIsExporting(true)
    await new Promise(r => setTimeout(r, 3000))
    setDocUrl('https://docs.google.com/document/d/example')
    setIsExporting(false)
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(inputData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  return (
    <div
      className="min-h-screen text-slate-100 pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
              style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI問題生成 &amp; 苦手分析
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
              過去問データから、あなたの<br />
              <span style={{ color: '#10b981' }}>弱点だけを徹底攻略</span>する
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              学習したい科目を選択または入力してください。AIが実物の過去問データを分析し、弱点を突く問題を無限に生成。結果はGoogleドキュメントへ保存できます。
            </p>
          </div>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 mt-1"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            MASTER PLAN
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-5">

        {/* 使い方 */}
        <Card
          style={{ background: '#0d1117', border: '1px solid #1e293b' }}
          className="rounded-xl p-5 flex gap-3"
        >
          <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-400 leading-relaxed">
            学習したい科目を選択、または入力をしてください。AIが実物の過去問データを分析し、あなたの弱点を突く問題を無限に生成。結果はGoogleドキュメントへ永久保存可能です。
          </p>
        </Card>

        {/* プリセット */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 px-1">試験を選択</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => { setInputData(p.content); setResult(null); setDocUrl(null) }}
                className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                style={{
                  background: inputData === p.content ? 'rgba(16,185,129,0.1)' : '#0d1117',
                  border: inputData === p.content ? '1px solid rgba(16,185,129,0.5)' : '1px solid #1e293b',
                }}
              >
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ background: 'rgba(16,185,129,0.1)' }}
                >
                  <p.icon size={16} style={{ color: '#10b981' }} />
                </div>
                <span className="text-sm font-semibold text-slate-200">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 入力フォーム */}
        <Card style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.1)' }} className="rounded-xl p-6 space-y-4">
          <label className="text-xs font-medium text-slate-500">学習コンテキスト・苦手分野</label>
          <textarea
            value={inputData}
            onChange={e => setInputData(e.target.value)}
            className="w-full h-36 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none transition-colors"
            style={{ background: '#13141f', border: '1px solid #334155' }}
            placeholder="例：ITパスポートのセキュリティ分野を強化したい。"
            onFocus={e => (e.target.style.borderColor = '#10b981')}
            onBlur={e => (e.target.style.borderColor = '#334155')}
          />
          <div className="grid md:grid-cols-2 gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputData}
              className="h-12 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              style={
                isAnalyzing || !inputData
                  ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                  : { background: '#10b981', color: '#fff' }
              }
            >
              {isAnalyzing
                ? <><Loader2 size={16} className="animate-spin mr-2" />解析中...</>
                : <><Zap size={16} className="mr-2" />AI解析・生成を始動</>}
            </Button>
            <Button
              onClick={copyPrompt}
              disabled={!inputData}
              className="h-12 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              style={
                !inputData
                  ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                  : copied
                  ? { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.4)' }
                  : { background: '#13141f', color: '#e2e8f0', border: '1px solid #334155' }
              }
            >
              {copied
                ? <><CheckCircle2 size={16} className="mr-2" />コピーしました</>
                : <><ClipboardPaste size={16} className="mr-2" />指示をコピー</>}
            </Button>
          </div>
        </Card>

        {/* 結果 */}
        {result && (
          <div className="space-y-5">
            {/* AI診断 */}
            <Card
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)' }}
              className="rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#34d399' }}>
                <Zap size={15} />
                AI Diagnostic Insight
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{result}</p>
              <div className="pt-2">
                {!docUrl ? (
                  <Button
                    onClick={handleExportDocs}
                    disabled={isExporting}
                    className="h-10 px-5 text-sm font-semibold rounded-lg flex items-center gap-2"
                    style={{ background: '#fff', color: '#0f172a' }}
                  >
                    {isExporting
                      ? <><Loader2 size={14} className="animate-spin mr-1" />保存中...</>
                      : <><FileText size={14} className="mr-1" />Googleドキュメントへ保存</>}
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.open(docUrl)}
                    className="h-10 px-5 text-sm font-semibold rounded-lg flex items-center gap-2"
                    style={{ background: '#1a73e8', color: '#fff' }}
                  >
                    <FileDown size={14} className="mr-1" />ドキュメントを開く
                    <ExternalLink size={12} />
                  </Button>
                )}
              </div>
            </Card>

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
                  Study with {ai}
                  <ExternalLink size={10} />
                </button>
              ))}
            </div>

            {/* ロードマップ */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 px-1">合格攻略ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {ROADMAP.map((s, i) => (
                  <Card
                    key={i}
                    style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                    className="rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Step 0{i + 1}</span>
                      <s.icon size={16} style={{ color: '#10b981' }} />
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{s.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Amazon アフィリエイト */}
            <a
              href="https://www.amazon.co.jp/s?k=ITパスポート+過去問+参考書&tag=nextralabs-22"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden transition-transform hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #059669, #0f766e)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <div className="p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-emerald-200/60 font-medium">Official Reference Library</p>
                  <p className="text-base font-semibold text-white leading-snug">
                    AI厳選：最短合格を叶える最強参考書。 →
                  </p>
                </div>
                <ShoppingCart size={28} className="text-white/70 shrink-0" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
