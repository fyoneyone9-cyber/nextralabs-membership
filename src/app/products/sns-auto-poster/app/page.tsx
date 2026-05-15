'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Copy, CheckCircle2, RefreshCw, Twitter, Instagram,
  Video, MessageSquare, HeartHandshake, ExternalLink,
  Sparkles, Zap, Share2, AlertCircle
} from 'lucide-react'

const SNS_PLATFORMS = [
  { id: 'twitter',   label: 'X (Twitter)',    icon: Twitter,        prompt: 'あなたはプロのX運用担当者です。以下のトレンドと戦略を元に、インプレッションが最大化する140文字以内の投稿を3パターン作成してください。各パターンは「---」で区切り、投稿本文のみを出力してください。' },
  { id: 'instagram', label: 'Instagram',      icon: Instagram,      prompt: 'あなたは人気インスタグラマーです。以下のトレンドと戦略を組み合わせて、情緒的なキャプションとハッシュタグ15個を3パターン作成してください。各パターンは「---」で区切り、本文とハッシュタグのみを出力してください。' },
  { id: 'tiktok',    label: 'TikTok / Reels', icon: Video,          prompt: 'あなたはバズ動画作家です。以下のトレンドと戦略を元に、最初の3秒で惹きつける動画台本を3パターン作成してください。各パターンは「---」で区切り、台本のみを出力してください。' },
  { id: 'threads',   label: 'Threads',        icon: MessageSquare,  prompt: 'あなたはコラムニストです。以下のトレンドと戦略について、深い共感を生む長文を3パターン作成してください。各パターンは「---」で区切り、本文のみを出力してください。' },
  { id: 'konkatsu',  label: '婚活モード',     icon: HeartHandshake, prompt: 'あなたは婚活カウンセラーです。上級心理カウンセラーの知見を活かし、成婚意欲を高める投稿を3パターン作成してください。ターゲット：20〜40代の本気で結婚したい男女。各パターンは「---」で区切り、投稿本文のみを出力してください。' },
]

const STRATEGIES = [
  { label: '🔥 本音・暴露系',   content: '業界の当たり前に疑問を呈し、皆が言いにくいことを代弁する鋭い言葉で。' },
  { label: '💡 有益Tips',       content: '今日から使える業務効率化の神知識を、箇条書きを使って10秒で伝わる構成に。' },
  { label: '😢 共感・エモ',     content: '深夜の独り言のような、挑戦の孤独と希望に寄り添うエモーショナルな文章。' },
  { label: '🧵 スレッド誘導',   content: '続きが読みたくなる仕掛けを施し、深い知識へ誘導する導入文。' },
  { label: '⚔️ 比較・検証',    content: 'AとBの違いを明確にし、独自の視点で結論を出すプロのレビュー。' },
  { label: '📰 ニュース要約',   content: '複雑な時事ネタを中学生でもわかるレベルに噛み砕き、一言解説を添えて。' },
  { label: '💬 質問・対話',     content: 'フォロワーが回答しやすい二択や質問を投げかけ、交流を生む。' },
  { label: '💪 モチベーション', content: 'やる気が出ない人の背中を強力に押す、力強いメッセージとマインドセット。' },
  { label: '💍 婚活・成婚',     content: '成婚のプロが教える、婚活の「残酷な真実」と「選ばれるための具体的アクション」。' },
  { label: '🧠 心理・相性',     content: '上級心理カウンセラーの知見から、長く続くカップルの共通点と心理的安全性。' },
  { label: '🤖 AI活用術',       content: 'AIツールを使いこなすための具体的なプロンプトや活用例を、初心者でも即実践できる形で。' },
  { label: '💰 副業・収益化',   content: '月1万〜10万円を目指す副業の始め方を、失敗談も含めてリアルに。' },
  { label: '📈 成長ストーリー', content: '過去の自分と今の自分を対比させ、変化と気づきを感情豊かに語る。' },
  { label: '🎯 ターゲット刺し', content: '「〇〇な人にだけ読んでほしい」と特定ユーザーに刺さる限定感のある書き出しで。' },
  { label: '🌅 朝活・習慣',     content: '毎朝続けることで人生が変わる習慣を、具体的なルーティンとともに紹介。' },
]

const PRESET_THEMES: { category: string; emoji: string; items: string[] }[] = [
  {
    category: 'AI・テック',
    emoji: '🤖',
    items: [
      'ChatGPTで仕事が10倍速くなる方法',
      'AI画像生成でSNS映え素材を量産',
      '無料で使えるAIツール5選',
      'プロンプトエンジニアリング入門',
      'AIと人間の仕事の境界線',
      'Gemini vs ChatGPT どっちが優秀？',
      'AIで副業月5万円の作り方',
    ],
  },
  {
    category: 'ビジネス・副業',
    emoji: '💼',
    items: [
      '会社員が副業で月10万稼いだリアル',
      'フリーランス1年目が知っておくべき真実',
      '価格交渉で失敗しない3つのコツ',
      '朝1時間で人生が変わる理由',
      'SNS集客で月100万達成した方法',
      'ノースキルでも稼げる副業ランキング',
      'Kindle出版してみた正直レビュー',
    ],
  },
  {
    category: '婚活・恋愛',
    emoji: '💍',
    items: [
      '30代独身が結婚相談所で成婚した話',
      'モテる人の共通点をカウンセラーが解説',
      '婚活アプリで失敗する人の特徴',
      '初デートで必ず好印象を残す方法',
      '結婚相手の条件の優先順位',
      '婚活疲れを感じたときの対処法',
      '40代から始める婚活で結果を出す方法',
    ],
  },
  {
    category: '健康・ライフ',
    emoji: '🌿',
    items: [
      '睡眠の質を劇的に改善する方法',
      '忙しい人のための時短ダイエット術',
      '肌荒れが止まった生活習慣の変化',
      '1日5分で体が変わるストレッチ',
      'ストレスゼロ生活を実現する思考法',
      '節約しながら食費を豊かにする技',
      'ミニマリストが手放してよかったもの',
    ],
  },
  {
    category: '時事・社会',
    emoji: '🌍',
    items: [
      '物価高騰の今こそ見直すべき家計管理',
      '日本の少子化問題をわかりやすく解説',
      'SNSが社会に与えた意外な影響',
      '2025年注目のビジネストレンド',
      '若者が地方移住を選ぶ本当の理由',
      '円安時代のお金の守り方',
      '働き方改革で実際に変わったこと',
    ],
  },
  {
    category: 'エンタメ・趣味',
    emoji: '🎮',
    items: [
      '推し活経済圏でお金を使わない方法',
      '映画見放題サービス徹底比較2025',
      '今すぐハマれるソロキャンプ入門',
      'ゲームで稼ぐPlay to Earn最前線',
      '読書1000冊で気づいた人生の真実',
      'ひとり旅で得た人生観の変化',
      'ドラマより面白いビジネス書3選',
    ],
  },
]

export default function SnsAutoPosterApp() {
  const router = useRouter()
  const [selectedTrend, setSelectedTrend]   = useState('')
  const [selectedPreset, setSelectedPreset] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [customTheme, setCustomTheme]       = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('twitter')
  const [trends, setTrends]                 = useState<string[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [trendSource, setTrendSource]       = useState('')
  const [copied, setCopied]                 = useState(false)
  const [activePresetCat, setActivePresetCat] = useState(0)

  useEffect(() => { fetchTrends() }, [])

  const fetchTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const res = await fetch('/api/tools/trends', { cache: 'no-store' })
      const data = await res.json()
      if (data.trends && data.trends.length > 0) {
        setTrends(data.trends.slice(0, 10).map((t: any) => t.title || t))
        setTrendSource(data.source || '')
      } else {
        setTrends(['AI革命', '最新ガジェット', '働き方改革', 'SNSマーケティング', '副業ブーム', '節約術'])
        setTrendSource('fallback')
      }
    } catch {
      setTrends(['AI革命', '最新ガジェット', '働き方改革', 'SNSマーケティング', '副業ブーム', '節約術'])
      setTrendSource('fallback')
    } finally {
      setIsLoadingTrends(false)
    }
  }

  const platform = SNS_PLATFORMS.find(p => p.id === selectedPlatform)!

  const effectiveTopic = (() => {
    if (customTheme) return customTheme
    if (selectedTrend && selectedPreset) return `${selectedTrend} × ${selectedPreset}`
    if (selectedTrend) return selectedTrend
    if (selectedPreset) return selectedPreset
    return ''
  })()

  const buildPrompt = () => {
    const strategyLine = selectedStrategy ? `\n【戦略】${selectedStrategy}` : ''
    return `${platform.prompt}\n\n【テーマ】${effectiveTopic}${strategyLine}`.trim()
  }

  const handleCopy = () => {
    if (!effectiveTopic) return
    navigator.clipboard.writeText(buildPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleBack = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200" style={{ fontFamily: "'Inter','Noto Sans JP',sans-serif" }}>
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #10b981, #6366f1)' }} />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6 pb-24">

        {/* ヘッダー */}
        <div className="space-y-2">
          <button onClick={handleBack} className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            ダッシュボードへ戻る
          </button>
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">SNS × AI コンテンツ生成</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            AI SNS<span className="text-emerald-400">オートポスター</span>
          </h1>
          <p className="text-slate-400 text-sm">トレンド×プリセット×戦略でバズる投稿プロンプトを自動生成。ChatGPT/Geminiにコピペするだけ。</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* 左カラム */}
          <div className="space-y-5">

            {/* ① トレンド */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-bold">1</span>
                  <p className="text-xs font-bold text-white">トレンドから選ぶ</p>
                  {trendSource === 'rss_hybrid' && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">リアルタイム</span>}
                  {trendSource === 'gemini_fallback' && <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">AI生成</span>}
                </div>
                <button onClick={fetchTrends} className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 text-[10px] font-semibold transition-colors">
                  <RefreshCw size={11} className={isLoadingTrends ? 'animate-spin' : ''} /> 更新
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {isLoadingTrends
                  ? Array(8).fill(0).map((_, i) => <div key={i} className="h-9 bg-white/5 rounded-lg animate-pulse" />)
                  : trends.map((t, i) => (
                    <button key={i}
                      onClick={() => { setSelectedTrend(prev => prev === t ? '' : t); setCustomTheme('') }}
                      className={`h-9 px-3 rounded-lg text-xs font-semibold text-left truncate transition-all border ${
                        selectedTrend === t
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-white/5 bg-black/30 text-slate-400 hover:text-white hover:border-white/20'
                      }`}>
                      {t}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* ② プリセット */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">2</span>
                  <p className="text-xs font-bold text-white">プリセットテーマ（42種）</p>
                </div>
                {selectedTrend && selectedPreset && (
                  <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap size={9} /> 合成中
                  </span>
                )}
              </div>
              {/* カテゴリタブ */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_THEMES.map((cat, i) => (
                  <button key={i} onClick={() => setActivePresetCat(i)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                      activePresetCat === i
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-white/5 bg-black/30 text-slate-500 hover:text-white'
                    }`}>
                    {cat.emoji} {cat.category}
                  </button>
                ))}
              </div>
              {/* プリセット一覧 */}
              <div className="space-y-1.5">
                {PRESET_THEMES[activePresetCat].items.map((item, i) => (
                  <button key={i}
                    onClick={() => { setSelectedPreset(prev => prev === item ? '' : item); setCustomTheme('') }}
                    className={`w-full h-9 px-3 rounded-lg text-xs font-semibold text-left truncate transition-all border ${
                      selectedPreset === item
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-white/5 bg-black/30 text-slate-400 hover:text-white hover:border-white/20'
                    }`}>
                    {item}
                  </button>
                ))}
              </div>
              {/* 合成プレビュー */}
              {selectedTrend && selectedPreset && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-300">
                  <span className="text-purple-500 font-semibold">合成: </span>
                  {selectedTrend} × {selectedPreset}
                </div>
              )}
            </div>

            {/* ③ ターゲットSNS */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-slate-300 text-xs font-bold">3</span>
                <p className="text-xs font-bold text-white">ターゲットSNS</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
          </div>

          {/* 右カラム */}
          <div className="space-y-5">

            {/* ④ 戦略 */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-slate-300 text-xs font-bold">4</span>
                <p className="text-xs font-bold text-white">投稿戦略（15種）</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {STRATEGIES.map(s => (
                  <button key={s.label}
                    onClick={() => setSelectedStrategy(prev => prev === s.content ? '' : s.content)}
                    className={`h-10 px-2 rounded-lg text-[10px] font-semibold transition-all border leading-tight ${
                      selectedStrategy === s.content
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-white/5 bg-black/30 text-slate-400 hover:text-white'
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ⑤ カスタム */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-slate-300 text-xs font-bold">5</span>
                <p className="text-xs font-bold text-white">完全カスタムテーマ（任意）</p>
              </div>
              <textarea
                value={customTheme}
                onChange={e => {
                  setCustomTheme(e.target.value)
                  if (e.target.value) { setSelectedTrend(''); setSelectedPreset('') }
                }}
                placeholder="独自のテーマを入力...（入力するとトレンド・プリセットより優先）"
                rows={2}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-slate-600"
              />
            </div>

            {/* プロンプトプレビュー */}
            <div className="bg-[#0d0f1a] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-emerald-400" />
                <p className="text-xs font-bold text-slate-400">生成プロンプトプレビュー</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-xs text-slate-400 leading-relaxed min-h-[80px] whitespace-pre-wrap">
                {effectiveTopic
                  ? buildPrompt()
                  : <span className="text-slate-600">テーマを選択するとここにプロンプトが表示されます</span>
                }
              </div>
            </div>

            {/* コピーボタン */}
            <button
              onClick={handleCopy}
              disabled={!effectiveTopic}
              className={`w-full h-14 rounded-2xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : effectiveTopic
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
              }`}>
              {copied ? <><CheckCircle2 size={18} /> コピーしました！</> : <><Copy size={18} /> プロンプトをコピー</>}
            </button>

            {/* AIサービスへのリンク */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ChatGPT', url: 'https://chatgpt.com' },
                { label: 'Gemini',  url: 'https://gemini.google.com' },
                { label: 'Claude',  url: 'https://claude.ai' },
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

      <AffiliateBanner toolId="sns-auto-poster" />
    </div>
  )
}
