'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, Copy, CheckCircle2, RefreshCw, Twitter, Instagram, Video, MessageSquare, HeartHandshake, ExternalLink } from 'lucide-react'

const SNS_PLATFORMS = [
  { id: 'twitter',   label: 'X (Twitter)',    icon: Twitter,        prompt: 'あなたはプロのX運用担当者です。以下のトレンドと戦略を元に、インプレッションが最大化する140文字以内の投稿を3パターン作成してください。各パターンは「---」で区切り、投稿本文のみを出力してください。' },
  { id: 'instagram', label: 'Instagram',      icon: Instagram,      prompt: 'あなたは人気インスタグラマーです。以下のトレンドと戦略を組み合わせて、情緒的なキャプションとハッシュタグ15個を3パターン作成してください。各パターンは「---」で区切り、本文とハッシュタグのみを出力してください。' },
  { id: 'tiktok',    label: 'TikTok / Reels', icon: Video,          prompt: 'あなたはバズ動画作家です。以下のトレンドと戦略を元に、最初の3秒で惹きつける動画台本を3パターン作成してください。各パターンは「---」で区切り、台本のみを出力してください。' },
  { id: 'threads',   label: 'Threads',        icon: MessageSquare,  prompt: 'あなたはコラムニストです。以下のトレンドと戦略について、深い共感を生む長文を3パターン作成してください。各パターンは「---」で区切り、本文のみを出力してください。' },
  { id: 'konkatsu',  label: '婚活モード',     icon: HeartHandshake, prompt: 'あなたは婚活カウンセラーです。上級心理カウンセラーの知見を活かし、成婚意欲を高める投稿を3パターン作成してください。ターゲット：20〜40代の本気で結婚したい男女。各パターンは「---」で区切り、投稿本文のみを出力してください。' },
]

const STRATEGIES = [
  { label: '本音・暴露系',     content: '業界の当たり前に疑問を呈し、皆が言いにくいことを代弁する鋭い言葉で。' },
  { label: '有益Tips',         content: '今日から使える業務効率化の神知識を、箇条書きを使って10秒で伝わる構成に。' },
  { label: '共感・エモ',       content: '深夜の独り言のような、挑戦の孤独と希望に寄り添うエモーショナルな文章。' },
  { label: 'スレッド誘導',     content: '続きが読みたくなる仕掛けを施し、深い知識へ誘導する導入文。' },
  { label: '比較・検証',       content: 'AとBの違いを明確にし、独自の視点で結論を出すプロのレビュー。' },
  { label: 'ニュース要約',     content: '複雑な時事ネタを中学生でもわかるレベルに噛み砕き、一言解説を添えて。' },
  { label: '質問・対話',       content: 'フォロワーが回答しやすい二択や質問を投げかけ、交流を生む。' },
  { label: 'モチベーション',   content: 'やる気が出ない人の背中を強力に押す、力強いメッセージとマインドセット。' },
  { label: '婚活・成婚',       content: '成婚のプロが教える、婚活の「残酷な真実」と「選ばれるための具体的アクション」。' },
  { label: '心理・相性',       content: '上級心理カウンセラーの知見から、長く続くカップルの共通点と心理的安全性。' },
]

const MasterEngine = () => {
  const [selectedTrend, setSelectedTrend] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [customTheme, setCustomTheme] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('twitter')
  const [trends, setTrends] = useState<string[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { fetchTrends() }, [])

  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const res = await fetch('/api/tools/trends', { cache: 'no-store' })
      const data = await res.json()
      if (data.trends) setTrends(data.trends.slice(0, 8).map((t: any) => t.title || t))
      else setTrends(['AI革命', '最新ガジェット', '働き方改革', 'SNSマーケティング'])
    } catch {
      setTrends(['AI革命', '最新ガジェット', '働き方改革', 'SNSマーケティング'])
    } finally {
      setIsLoadingTrends(false)
    }
  }

  const platform = SNS_PLATFORMS.find(p => p.id === selectedPlatform)!
  const topic = customTheme || selectedTrend
  const strategy = selectedStrategy

  const buildPrompt = () => {
    return `${platform.prompt}\n\n【テーマ】${topic}\n${strategy ? `【戦略】${strategy}` : ''}`
  }

  const handleCopy = () => {
    if (!topic) return
    navigator.clipboard.writeText(buildPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 min-h-screen text-slate-200 pb-24 bg-[#050507]">

      {/* ヘッダー */}
      <div className="text-center space-y-2 pt-2">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-4 py-1 rounded-full">SNS投稿自動生成</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          AI SNS<span className="text-emerald-400">オートポスター</span>
        </h1>
        <p className="text-slate-400 text-sm">トレンド×戦略でバズる投稿プロンプトを自動生成。ChatGPT/Geminiにコピペするだけ。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 左：設定 */}
        <div className="space-y-5">

          {/* 1. トレンド選択 */}
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white">1. トレンドを選択</p>
              <button onClick={fetchTrends} className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 text-[10px] font-semibold transition-colors">
                <RefreshCw size={11} className={isLoadingTrends ? 'animate-spin' : ''} /> 更新
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {isLoadingTrends
                ? Array(6).fill(0).map((_, i) => <div key={i} className="h-9 bg-white/5 rounded-lg animate-pulse" />)
                : trends.map((t, i) => (
                  <button key={i} onClick={() => { setSelectedTrend(t); setCustomTheme('') }}
                    className={`h-9 px-3 rounded-lg text-xs font-semibold text-left truncate transition-all border ${
                      selectedTrend === t && !customTheme
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-white/5 bg-black/30 text-slate-400 hover:text-white hover:border-white/20'
                    }`}>
                    {t}
                  </button>
                ))
              }
            </div>
          </div>

          {/* 2. ターゲットSNS */}
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-white">2. ターゲットSNS</p>
            <div className="grid grid-cols-2 gap-2">
              {SNS_PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setSelectedPlatform(p.id)}
                  className={`flex items-center gap-2 h-10 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedPlatform === p.id
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-white/5 bg-black/30 text-slate-400 hover:text-white'
                  }`}>
                  <p.icon size={14} /> {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. カスタムテーマ */}
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-white">3. カスタムテーマ（任意）</p>
            <textarea
              value={customTheme}
              onChange={e => { setCustomTheme(e.target.value); if (e.target.value) setSelectedTrend('') }}
              placeholder="独自のテーマを入力..."
              rows={2}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* 右：戦略＋生成 */}
        <div className="space-y-5">

          {/* 4. 投稿戦略 */}
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-white">4. 投稿戦略</p>
            <div className="grid grid-cols-2 gap-2">
              {STRATEGIES.map(s => (
                <button key={s.label} onClick={() => setSelectedStrategy(prev => prev === s.content ? '' : s.content)}
                  className={`h-9 px-3 rounded-lg text-xs font-semibold transition-all border ${
                    selectedStrategy === s.content
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-white/5 bg-black/30 text-slate-400 hover:text-white'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* プロンプトプレビュー */}
          <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-slate-500">生成プロンプトプレビュー</p>
            <div className="bg-black/40 rounded-xl p-4 text-xs text-slate-400 leading-relaxed min-h-[80px] whitespace-pre-wrap">
              {topic
                ? buildPrompt()
                : <span className="text-slate-600">テーマを選択すると、ここにプロンプトが表示されます</span>
              }
            </div>
          </div>

          {/* コピーボタン */}
          <button
            onClick={handleCopy}
            disabled={!topic}
            className={`w-full h-14 rounded-2xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : topic
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}>
            {copied ? <><CheckCircle2 size={18} /> コピーしました！</> : <><Copy size={18} /> プロンプトをコピー</>}
          </button>

          {/* AIサービスへのリンク */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'ChatGPT', url: 'https://chatgpt.com' },
              { label: 'Gemini', url: 'https://gemini.google.com' },
              { label: 'Claude', url: 'https://claude.ai' },
            ].map(ai => (
              <button key={ai.label} onClick={() => window.open(ai.url, '_blank')}
                className="flex items-center justify-center gap-1.5 h-10 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all">
                <ExternalLink size={11} /> {ai.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false })
export default function SnsAutoPoster() { return <NoSSR /> }
