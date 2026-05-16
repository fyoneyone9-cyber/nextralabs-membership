'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import { useRouter, useSearchParams } from 'next/navigation'

import React, { useState, useCallback, useEffect, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Zap, Loader2, TrendingUp, Search, ShoppingCart,
  Brain, ListChecks, ShieldAlert, FileText, FileDown,
  ClipboardPaste, Smartphone, Info, ExternalLink, CheckCircle2,
  Network, BookOpen, Stethoscope, Scale, Building2, Calculator,
  Globe, Car, Leaf, Award, GraduationCap, Cpu, AlertCircle
} from 'lucide-react'

const PRESET_CATEGORIES = [
  {
    label: 'IT・情報処理',
    color: '#3b82f6',
    presets: [
      { id: 'itpass',   label: 'ITパスポート',         icon: Smartphone, content: 'ITパスポート試験のシラバス（テクノロジ・マネジメント・ストラテジ）に基づき、過去問実物データから頻出の選択問題を解説付きで生成してください。' },
      { id: 'fe',       label: '基本情報技術者',        icon: Cpu,        content: '基本情報技術者試験の科目A形式で、アルゴリズムと情報セキュリティの重要問題を実データに基づき生成してください。' },
      { id: 'ap',       label: '応用情報技術者',        icon: Brain,      content: '応用情報技術者試験の午前問題形式で、データベース・ネットワーク・経営戦略など幅広い分野の頻出問題を生成してください。' },
      { id: 'security', label: '情報処理安全確保支援士', icon: ShieldAlert, content: '情報処理安全確保支援士試験向けに、最新のサイバー攻撃手法と防御策に関する応用問題を生成してください。' },
      { id: 'nw',       label: 'ネットワークスペシャリスト', icon: Network, content: 'ネットワークスペシャリスト試験向けに、TCP/IP・ルーティング・セキュリティプロトコルの高難度問題を生成してください。' },
      { id: 'db',       label: 'データベーススペシャリスト', icon: FileText, content: 'データベーススペシャリスト試験向けに、SQL・正規化・トランザクション管理の実践的な問題を生成してください。' },
    ]
  },
  {
    label: 'ビジネス・資格',
    color: '#f59e0b',
    presets: [
      { id: 'biz2',     label: '簿記2級',               icon: Calculator, content: '日商簿記2級の商業簿記・工業簿記を網羅した頻出仕訳問題と計算問題を解説付きで生成してください。' },
      { id: 'biz3',     label: '簿記3級',               icon: Calculator, content: '日商簿記3級の基本仕訳・決算処理・精算表の穴埋め問題を初学者向けに解説付きで生成してください。' },
      { id: 'fp2',      label: 'FP2級',                 icon: TrendingUp, content: 'FP2級試験向けに、ライフプランニング・タックスプランニング・相続の頻出計算問題を生成してください。' },
      { id: 'fp3',      label: 'FP3級',                 icon: TrendingUp, content: 'FP3級試験向けに、保険・年金・税金の基礎知識を問う選択問題を解説付きで生成してください。' },
      { id: 'gyosei',   label: '行政書士',               icon: Scale,      content: '行政書士試験の行政法・民法・憲法の頻出問題と記述式対策問題を生成してください。' },
      { id: 'syaroushi',label: '社会保険労務士',         icon: Building2,  content: '社会保険労務士試験の労働基準法・社会保険・雇用保険の選択式・択一式問題を生成してください。' },
    ]
  },
  {
    label: '語学・英語',
    color: '#8b5cf6',
    presets: [
      { id: 'toeic',    label: 'TOEIC L&R 900点',       icon: Globe,      content: 'TOEIC L&R 900点突破を目指し、Part5文法問題・Part6長文穴埋め・Part7読解の頻出パターンを生成してください。' },
      { id: 'toeic700', label: 'TOEIC L&R 700点',       icon: Globe,      content: 'TOEIC L&R 700点レベルの文法・語彙・読解問題を解説付きで生成してください。' },
      { id: 'eiken2',   label: '英検2級',               icon: BookOpen,   content: '英検2級の語彙・文法・長文読解・英作文の頻出問題を解説付きで生成してください。' },
      { id: 'eiken1',   label: '英検準1級',             icon: BookOpen,   content: '英検準1級の語彙・長文読解・英作文の難問を解説付きで生成してください。' },
    ]
  },
  {
    label: '医療・福祉',
    color: '#ef4444',
    presets: [
      { id: 'kangoshi',  label: '看護師国家試験',        icon: Stethoscope, content: '看護師国家試験の必修問題・一般問題・状況設定問題の頻出パターンを解説付きで生成してください。' },
      { id: 'kaigo',     label: '介護福祉士',            icon: Award,       content: '介護福祉士国家試験の介護・医療的ケア・社会の理解の頻出問題を生成してください。' },
      { id: 'yakuzai',   label: '薬剤師国家試験',        icon: Stethoscope, content: '薬剤師国家試験の薬理・薬剤・衛生・法規の頻出問題を解説付きで生成してください。' },
    ]
  },
  {
    label: '法律・公務員',
    color: '#06b6d4',
    presets: [
      { id: 'koumu',    label: '公務員試験（教養）',     icon: GraduationCap, content: '公務員試験の教養科目（文章理解・数的処理・社会科学・人文科学）の頻出問題を解説付きで生成してください。' },
      { id: 'shiho',    label: '司法書士',               icon: Scale,         content: '司法書士試験の民法・不動産登記法・商業登記法・刑法の頻出問題を生成してください。' },
      { id: 'kenteishi',label: '宅地建物取引士（宅建）', icon: Building2,     content: '宅建試験の権利関係・法令上の制限・宅建業法・税金の頻出問題を解説付きで生成してください。' },
    ]
  },
  {
    label: 'その他・技術',
    color: '#10b981',
    presets: [
      { id: 'kiken',    label: '危険物取扱者（乙4）',    icon: ShieldAlert,   content: '危険物取扱者乙種第4類の物理化学・危険物の性質・法令の頻出問題を生成してください。' },
      { id: 'denki',    label: '電気工事士（2種）',      icon: Zap,           content: '第二種電気工事士の筆記試験（電気理論・施工法・法規）の頻出問題を生成してください。' },
      { id: 'kankyou',  label: '環境計量士',             icon: Leaf,           content: '環境計量士（濃度関係）の計量法・化学分析・環境関連法の頻出問題を生成してください。' },
      { id: 'driver',   label: '普通自動車免許',          icon: Car,           content: '普通自動車免許の学科試験（交通ルール・標識・安全運転）の頻出問題を生成してください。' },
    ]
  },
]

const PRESETS = PRESET_CATEGORIES.flatMap(c => c.presets)

const ROADMAP = [
  { title: '弱点特定', desc: '過去問実データから「知識の穴」をAIが可視化。', icon: Search },
  { title: '特訓問題', desc: '弱点に特化した実物同様の問題を自動生成。', icon: ListChecks },
  { title: '合格圏内', desc: 'AIの解説で正答率を高め本番へ。', icon: TrendingUp },
]

function AiExamGeneratorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // URLパラメータからGoogle Docs結果を受け取る
  useEffect(() => {
    const gdocsUrl = searchParams.get('gdocs_url')
    const gdocsError = searchParams.get('gdocs_error')

    if (gdocsUrl) {
      setDocUrl(decodeURIComponent(gdocsUrl))
      setIsExporting(false)
    }
    if (gdocsError) {
      setExportError(
        gdocsError === 'access_denied'
          ? 'Googleアカウントへのアクセスが拒否されました。'
          : 'Googleドキュメントの作成に失敗しました。もう一度お試しください。'
      )
      setIsExporting(false)
    }
  }, [searchParams])

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [inputData, setInputData] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [generatedTitle, setGeneratedTitle] = useState<string>('')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [docUrl, setDocUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  // AIで本物の問題を生成
  const handleAnalyze = async () => {
    if (!inputData) return
    setIsAnalyzing(true)
    setResult(null)
    setDocUrl(null)
    setExportError(null)

    try {
      const res = await fetch('/api/exam-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: inputData }),
      })

      if (!res.ok) throw new Error('生成API失敗')
      const data = await res.json()

      setGeneratedTitle(data.title || '模擬試験問題集')
      setGeneratedContent(data.content || '')
      setResult(`AIによる問題生成が完了しました。「${data.title}」として20問の模擬問題（解説付き）を作成しました。Googleドキュメントへ保存できます。`)
    } catch (err) {
      setResult('⚠️ 問題生成に失敗しました。もう一度お試しください。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Google OAuth経由でドキュメント作成
  const handleExportDocs = () => {
    if (!generatedContent) return
    setIsExporting(true)
    setExportError(null)

    const params = new URLSearchParams({
      title: generatedTitle,
      content: generatedContent,
    })
    // OAuthフローへリダイレクト（コールバック後にdocUrlがセットされる）
    window.location.href = `/api/auth/gdocs?${params.toString()}`
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

        {/* プリセット：カテゴリ別 */}
        <div className="space-y-5">
          <p className="text-xs font-medium text-slate-500 px-1">試験を選択（{PRESETS.length}種類）</p>
          {PRESET_CATEGORIES.map(cat => (
            <div key={cat.label} className="space-y-2">
              <p className="text-xs font-semibold px-1" style={{ color: cat.color }}>{cat.label}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cat.presets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setInputData(p.content); setResult(null); setDocUrl(null); setExportError(null) }}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: inputData === p.content ? 'rgba(16,185,129,0.1)' : '#0d1117',
                      border: inputData === p.content ? '1px solid rgba(16,185,129,0.5)' : '1px solid #1e293b',
                    }}
                  >
                    <div className="p-1.5 rounded-lg shrink-0" style={{ background: `${cat.color}18` }}>
                      <p.icon size={14} style={{ color: cat.color }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 leading-tight">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
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
                ? <><Loader2 size={16} className="animate-spin mr-2" />AI生成中（30秒ほどかかります）...</>
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

              {/* 生成内容プレビュー */}
              {generatedContent && (
                <div
                  className="rounded-lg p-4 text-xs text-slate-400 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap"
                  style={{ background: '#0d1117', border: '1px solid #1e293b' }}
                >
                  {generatedContent.slice(0, 800)}
                  {generatedContent.length > 800 && '...\n\n（Googleドキュメントで全文を確認できます）'}
                </div>
              )}

              {exportError && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle size={14} />
                  {exportError}
                </div>
              )}

              <div className="pt-2">
                {!docUrl ? (
                  <Button
                    onClick={handleExportDocs}
                    disabled={isExporting || !generatedContent}
                    className="h-10 px-5 text-sm font-semibold rounded-lg flex items-center gap-2"
                    style={
                      isExporting || !generatedContent
                        ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                        : { background: '#fff', color: '#0f172a' }
                    }
                  >
                    {isExporting
                      ? <><Loader2 size={14} className="animate-spin mr-1" />Googleに接続中...</>
                      : <><FileText size={14} className="mr-1" />Googleドキュメントへ保存</>}
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.open(docUrl, '_blank')}
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

      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="ai-exam-generator" />
    </div>
  )
}

export default function AiExamGeneratorApp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050507]" />}>
      <AiExamGeneratorInner />
    </Suspense>
  )
}
