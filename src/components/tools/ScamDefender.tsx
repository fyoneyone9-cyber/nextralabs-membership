'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldAlert, ShieldCheck, Zap, AlertTriangle, Info, Camera, Trash2, ExternalLink, CheckCircle2
} from 'lucide-react'

// ─────────────────────────────────────────────
// キーワード定義（カテゴリ + 重み付き）
// ─────────────────────────────────────────────
type KeywordEntry = { word: string; weight: number; category: string }

const KEYWORD_LIST: KeywordEntry[] = [
  // 【闇バイト系】重大フラグ（単体で高リスク）
  { word: '受け子',       weight: 45, category: '闇バイト' },
  { word: '出し子',       weight: 45, category: '闇バイト' },
  { word: '運び屋',       weight: 40, category: '闇バイト' },
  { word: '闇バイト',     weight: 50, category: '闇バイト' },
  { word: '裏バイト',     weight: 40, category: '闇バイト' },
  { word: 'ホワイト案件', weight: 35, category: '闇バイト' },
  { word: '秘密厳守',     weight: 30, category: '闇バイト' },
  { word: '身分証不要',   weight: 35, category: '闇バイト' },
  { word: '即日現金',     weight: 30, category: '闇バイト' },
  { word: '1日5万',       weight: 30, category: '闇バイト' },
  { word: '1日3万',       weight: 25, category: '闇バイト' },
  // 【闇バイト系】単体では低リスク（組み合わせで加点）
  { word: 'テレグラム',   weight: 15, category: '闇バイト' },
  { word: 'Telegram',     weight: 15, category: '闇バイト' },
  { word: 'シグナル',     weight: 10, category: '闇バイト' },
  { word: 'Signal',       weight: 10, category: '闇バイト' },
  { word: '高額報酬',     weight: 12, category: '闇バイト' },
  { word: '未経験歓迎',   weight: 8,  category: '闇バイト' },
  { word: 'ノルマなし',   weight: 8,  category: '闇バイト' },
  { word: '日払い',       weight: 8,  category: '闇バイト' },
  { word: '即払い',       weight: 12, category: '闇バイト' },
  { word: '簡単作業',     weight: 8,  category: '闇バイト' },
  { word: '在宅ワーク 高収入', weight: 15, category: '闇バイト' },
  { word: '10万円',       weight: 8,  category: '闇バイト' },
  // 【フィッシング系】重大フラグ
  { word: '口座凍結',     weight: 45, category: 'フィッシング' },
  { word: '差し押さえ',   weight: 45, category: 'フィッシング' },
  { word: 'アカウント停止', weight: 35, category: 'フィッシング' },
  { word: 'アカウントが停止', weight: 35, category: 'フィッシング' },
  { word: 'カード停止',   weight: 35, category: 'フィッシング' },
  { word: '不正アクセス', weight: 30, category: 'フィッシング' },
  { word: 'amezen',       weight: 50, category: 'フィッシング' },
  { word: 'amazen',       weight: 50, category: 'フィッシング' },
  { word: 'Amaz0n',       weight: 50, category: 'フィッシング' },
  { word: '異常なアクティビティ', weight: 30, category: 'フィッシング' },
  // 【フィッシング系】中リスク
  { word: '重要なお知らせ', weight: 12, category: 'フィッシング' },
  { word: '本人確認',     weight: 15, category: 'フィッシング' },
  { word: 'ログイン制限', weight: 20, category: 'フィッシング' },
  { word: 'セキュリティ確認', weight: 18, category: 'フィッシング' },
  { word: '24時間以内',   weight: 20, category: 'フィッシング' },
  { word: '48時間以内',   weight: 20, category: 'フィッシング' },
  { word: '緊急のお知らせ', weight: 18, category: 'フィッシング' },
  { word: 'クリックしてください', weight: 15, category: 'フィッシング' },
  { word: 'こちらから確認', weight: 18, category: 'フィッシング' },
  { word: 'アマゾンプライム', weight: 10, category: 'フィッシング' },
  { word: '楽天カード',   weight: 8,  category: 'フィッシング' },
  { word: '楽天市場 確認', weight: 20, category: 'フィッシング' },
  { word: 'らくてん',     weight: 25, category: 'フィッシング' },
  { word: '三菱UFJ',      weight: 8,  category: 'フィッシング' },
  { word: 'みずほ',       weight: 5,  category: 'フィッシング' },
  { word: '三井住友 確認', weight: 20, category: 'フィッシング' },
  { word: 'ゆうちょ 確認', weight: 20, category: 'フィッシング' },
  // 【SMS詐欺系】
  { word: '荷物をお届け', weight: 20, category: 'SMS詐欺' },
  { word: '配達できません', weight: 20, category: 'SMS詐欺' },
  { word: '再配達',       weight: 12, category: 'SMS詐欺' },
  { word: 'ヤマト運輸 確認', weight: 25, category: 'SMS詐欺' },
  { word: '郵便局 確認',  weight: 25, category: 'SMS詐欺' },
  { word: '佐川急便 確認', weight: 25, category: 'SMS詐欺' },
  // 【投資詐欺系】重大フラグ
  { word: '元本保証',     weight: 45, category: '投資詐欺' },
  { word: '高利回り',     weight: 30, category: '投資詐欺' },
  { word: '億り人',       weight: 30, category: '投資詐欺' },
  { word: 'FX 必勝',      weight: 35, category: '投資詐欺' },
  { word: '投資 確実',    weight: 35, category: '投資詐欺' },
  { word: '仮想通貨 無料', weight: 25, category: '投資詐欺' },
  { word: 'ネットワークビジネス', weight: 20, category: '投資詐欺' },
  { word: 'MLM',          weight: 20, category: '投資詐欺' },
  { word: '副業 簡単',    weight: 15, category: '投資詐欺' },
]

// ─────────────────────────────────────────────
// URLパターン（重み付き）
// ─────────────────────────────────────────────
type UrlPatternEntry = { pattern: RegExp; label: string; weight: number }

const URL_PATTERNS: UrlPatternEntry[] = [
  { pattern: /https?:\/\/[a-z0-9-]+\.(xyz|top|click|online|site|fun|cn|ru)\b/i, label: '不審ドメイン(.xyz/.top等)', weight: 35 },
  { pattern: /amaz[o0]n\.[a-z]{3,}/i,    label: 'Amazon偽装URL',     weight: 45 },
  { pattern: /rakuten-[a-z]/i,            label: '楽天偽装URL',       weight: 40 },
  { pattern: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, label: 'IPアドレス直打ちURL', weight: 40 },
  { pattern: /bit\.ly\/|tinyurl\.com\//i, label: '短縮URL(bit.ly等)', weight: 25 },
  { pattern: /[a-z]+-amazon-[a-z]+\./i,  label: 'Amazon偽装ドメイン', weight: 45 },
]

// ─────────────────────────────────────────────
// 組み合わせボーナスルール
// ─────────────────────────────────────────────
type ComboRule = { categories: string[]; bonus: number; label: string }

const COMBO_RULES: ComboRule[] = [
  { categories: ['闇バイト', '闇バイト'], bonus: 15, label: '闇バイト系キーワード複合' },
  { categories: ['フィッシング', 'フィッシング'], bonus: 12, label: 'フィッシング複合' },
  { categories: ['投資詐欺', '投資詐欺'], bonus: 15, label: '投資詐欺複合' },
  { categories: ['闇バイト', 'SMS詐欺'], bonus: 10, label: '多手口複合' },
  { categories: ['フィッシング', 'SMS詐欺'], bonus: 10, label: 'フィッシング+SMS複合' },
]

// ─────────────────────────────────────────────
// スコア計算エンジン
// ─────────────────────────────────────────────
type AnalysisResult = {
  score: number
  detectedKeywords: KeywordEntry[]
  detectedPatterns: UrlPatternEntry[]
  comboBonus: number
  senderBonus: number
  subjectBonus: number
  breakdown: string[]
}

function calcScore(text: string, sender: string, subject: string, hasImage: boolean): AnalysisResult {
  const full = `${text} ${sender} ${subject}`
  const fullLower = full.toLowerCase()

  // キーワード検出
  const detectedKeywords = KEYWORD_LIST.filter(k => fullLower.includes(k.word.toLowerCase()))

  // URLパターン検出
  const detectedPatterns = URL_PATTERNS.filter(p => p.pattern.test(full))

  // 基本スコア（キーワード重みの合計、ただし上限を設ける）
  let keywordScore = detectedKeywords.reduce((sum, k) => sum + k.weight, 0)
  keywordScore = Math.min(keywordScore, 70) // キーワードだけでは最大70

  // URLスコア
  let urlScore = detectedPatterns.reduce((sum, p) => sum + p.weight, 0)
  urlScore = Math.min(urlScore, 50)

  // 組み合わせボーナス
  const detectedCategories = detectedKeywords.map(k => k.category)
  let comboBonus = 0
  for (const rule of COMBO_RULES) {
    const remaining = [...detectedCategories]
    let match = true
    for (const cat of rule.categories) {
      const idx = remaining.indexOf(cat)
      if (idx === -1) { match = false; break }
      remaining.splice(idx, 1)
    }
    if (match) comboBonus += rule.bonus
  }
  comboBonus = Math.min(comboBonus, 20)

  // 送信者スコア
  const senderL = sender.toLowerCase()
  let senderBonus = 0
  if (/amazon/i.test(senderL) && !/amazon\.co\.jp$|amazon\.com$/i.test(senderL)) senderBonus += 40
  if (/rakuten/i.test(senderL) && !/rakuten\.co\.jp$/i.test(senderL)) senderBonus += 35
  if (/[0-9]{5,}/.test(sender)) senderBonus += 20
  if (/@[^@]+\.[a-z]{4,}$/.test(sender) && !/\.com$|\.jp$|\.co\.jp$/i.test(sender)) senderBonus += 15
  if (/@[^@]*[0-9]{3,}[^@]*$/.test(sender)) senderBonus += 10
  senderBonus = Math.min(senderBonus, 45)

  // 件名スコア
  const subjectL = subject.toLowerCase()
  let subjectBonus = 0
  if (subjectL.includes('停止') || subjectL.includes('制限')) subjectBonus += 20
  if (subjectL.includes('重要') || subjectL.includes('緊急')) subjectBonus += 15
  if ((subjectL.includes('確認') && subjectL.includes('アカウント')) ||
      (subjectL.includes('確認') && subjectL.includes('カード'))) subjectBonus += 20
  if (subjectL.includes('口座') || subjectL.includes('凍結')) subjectBonus += 25
  if (subjectL.includes('差し押さえ') || subjectL.includes('逮捕')) subjectBonus += 35
  subjectBonus = Math.min(subjectBonus, 40)

  // 画像ありボーナス（テキスト以外の証拠 → リスク上乗せ）
  const imageBonus = hasImage ? 5 : 0

  const total = Math.min(100, keywordScore + urlScore + comboBonus + senderBonus + subjectBonus + imageBonus)

  // 内訳テキスト
  const breakdown: string[] = []
  if (keywordScore > 0) breakdown.push(`危険キーワード(${detectedKeywords.length}語) +${keywordScore}`)
  if (urlScore > 0)     breakdown.push(`不審URL(${detectedPatterns.length}件) +${urlScore}`)
  if (comboBonus > 0)   breakdown.push(`複合ルール一致 +${comboBonus}`)
  if (senderBonus > 0)  breakdown.push(`送信者ドメイン異常 +${senderBonus}`)
  if (subjectBonus > 0) breakdown.push(`件名に危険ワード +${subjectBonus}`)
  if (imageBonus > 0)   breakdown.push('スクリーンショット添付 +5')

  return { score: total, detectedKeywords, detectedPatterns, comboBonus, senderBonus, subjectBonus, breakdown }
}

// ─────────────────────────────────────────────
// コンポーネント
// ─────────────────────────────────────────────
export default function ScamDefender() {
  const router = useRouter()

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      if (window.confirm('ツールを終了しますか？')) router.push('/dashboard')
      else window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    if (window.confirm('ツールを終了しますか？')) router.push('/dashboard')
  }, [router])

  const [inputText, setInputText]     = useState('')
  const [senderInfo, setSenderInfo]   = useState('')
  const [subjectInfo, setSubjectInfo] = useState('')
  const [image, setImage]             = useState<string | null>(null)
  const [copied, setCopied]           = useState(false)
  const [result, setResult]           = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // リアルタイム再計算
  useEffect(() => {
    if (inputText || senderInfo || subjectInfo || image) {
      setResult(calcScore(inputText, senderInfo, subjectInfo, !!image))
    } else {
      setResult(null)
    }
  }, [inputText, senderInfo, subjectInfo, image])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const PROMPT = `あなたはプロのサイバー犯罪捜査官です。以下の【証拠データ】を解析し、詐欺の可能性を判定してください。
【送信者/ドメイン】: ${senderInfo}
【件名】: ${subjectInfo}
【本文】: ${inputText}

1. 【詐欺スコア】: 0-100で判定
2. 【手口の解説】: どのような詐欺か（闇バイト、フィッシング等）
3. 【対策アドバイス】: 今すぐすべきこと`

  const handleAnalyze = () => {
    navigator.clipboard.writeText(PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    window.open('https://gemini.google.com', '_blank')
  }

  const clearAll = () => {
    setInputText(''); setSenderInfo(''); setSubjectInfo('')
    setImage(null); setResult(null)
  }

  const score       = result?.score ?? 0
  const hasInput    = !!(inputText || senderInfo || subjectInfo || image)
  const hasAnalyzed = result !== null

  const riskColor = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981'
  const riskLabel = !hasAnalyzed
    ? '入力待ち'
    : score >= 80 ? '🚨 極めて危険'
    : score >= 60 ? '⚠️ 危険度：高'
    : score >= 40 ? '⚠️ 要注意：疑わしい'
    : score >= 20 ? '🟡 やや注意'
    : '✅ 問題なし'

  const displayColor = hasAnalyzed ? riskColor : '#475569'

  const inputCls  = `w-full rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors resize-none`
  const inputSt   = { background: '#13141f', border: '1px solid #334155' }
  const onFocus   = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#10b981')
  const onBlur    = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#334155')

  // カテゴリ別の集計（表示用）
  const categoryMap: Record<string, number> = {}
  result?.detectedKeywords.forEach(k => {
    categoryMap[k.category] = (categoryMap[k.category] || 0) + 1
  })

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
          Scam Defender
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          怪しいメッセージを<span style={{ color: '#10b981' }}>即鑑定</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          送信者・件名・本文を入力するだけ。60以上の検出ルールでリスクをリアルタイム算出します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-5">

          {/* ── 左：リスクメーター ── */}
          <div className="space-y-4">

            {/* スコアカード */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: '#0d1117',
                border: `2px solid ${
                  hasAnalyzed && score >= 60 ? 'rgba(239,68,68,0.45)'
                  : hasAnalyzed && score >= 40 ? 'rgba(245,158,11,0.4)'
                  : '#1e293b'
                }`,
                boxShadow: hasAnalyzed && score >= 60 ? '0 0 24px rgba(239,68,68,0.12)' : 'none',
                transition: 'all 0.4s ease',
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">リスクスコア</p>
                <span
                  className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{ background: hasAnalyzed ? displayColor : '#334155' }}
                />
              </div>
              <div className="text-center py-2">
                <p
                  className="text-6xl font-bold tabular-nums transition-all duration-500"
                  style={{ color: displayColor }}
                >
                  {hasAnalyzed ? `${score}` : '--'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{hasAnalyzed ? '/ 100' : ''}</p>
                <p className="text-xs font-semibold mt-2 transition-all duration-300" style={{ color: displayColor }}>
                  {riskLabel}
                </p>
              </div>
              {/* プログレスバー */}
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: hasAnalyzed ? `${score}%` : '0%', background: displayColor }}
                />
              </div>

              {/* スコア帯説明 */}
              <div className="grid grid-cols-4 text-center gap-1 pt-1">
                {[
                  { label: '安全', range: '0-19',  color: '#10b981' },
                  { label: '注意', range: '20-39', color: '#34d399' },
                  { label: '危険', range: '40-69', color: '#f59e0b' },
                  { label: '極危', range: '70+',   color: '#ef4444' },
                ].map(b => (
                  <div key={b.label} className="space-y-0.5">
                    <div className="h-1 rounded-full w-full" style={{ background: b.color, opacity: 0.6 }} />
                    <p className="text-[9px] font-medium" style={{ color: b.color }}>{b.label}</p>
                    <p className="text-[8px] text-slate-600">{b.range}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 内訳 */}
            {hasAnalyzed && result && result.breakdown.length > 0 && (
              <div
                className="rounded-xl p-5 space-y-3"
                style={{ background: '#0d1117', border: '1px solid #1e293b' }}
              >
                <p className="text-xs font-medium text-slate-500">スコア内訳</p>
                <div className="space-y-2">
                  {result.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#10b981' }} />
                      <p className="text-xs text-slate-400">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 検出シグナル */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <p className="text-xs font-medium text-slate-500">検出された危険シグナル</p>
              {((result?.detectedKeywords.length ?? 0) > 0 || (result?.detectedPatterns.length ?? 0) > 0) ? (
                <div className="space-y-2">
                  {/* カテゴリバッジ */}
                  {Object.entries(categoryMap).map(([cat, cnt]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        {cat} × {cnt}語
                      </span>
                    </div>
                  ))}
                  {/* URLパターン */}
                  {result?.detectedPatterns.map(p => (
                    <div key={p.label} className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}
                      >
                        🔗 {p.label}
                      </span>
                    </div>
                  ))}
                  {/* 検出キーワード一覧（小さく） */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {result?.detectedKeywords.map(k => (
                      <span
                        key={k.word}
                        className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        {k.word}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  {hasAnalyzed ? '危険なシグナルは検出されませんでした' : '入力待ち'}
                </p>
              )}
            </div>

            {/* 使い方ヒント */}
            <div
              className="rounded-xl p-4 flex gap-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <Info size={14} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                60種以上のルールをリアルタイム適用。スコア40以上は要注意、70以上は危険と判断してください。
              </p>
            </div>
          </div>

          {/* ── 右：入力フォーム ── */}
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ background: '#0d1117', border: '1px solid #334155' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <ShieldAlert size={15} style={{ color: '#10b981' }} />
                証拠を入力
              </div>
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
                クリア
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* テキスト入力群 */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">送信者 / ドメイン / 電話番号</label>
                  <input
                    type="text"
                    value={senderInfo}
                    onChange={e => setSenderInfo(e.target.value)}
                    placeholder="info@unknown-scam.com / @fake_user..."
                    className={inputCls}
                    style={inputSt}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">件名 / タイトル</label>
                  <input
                    type="text"
                    value={subjectInfo}
                    onChange={e => setSubjectInfo(e.target.value)}
                    placeholder="重要：アカウントが停止されました..."
                    className={inputCls}
                    style={inputSt}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">本文・募集文・メッセージ</label>
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="本文、SNS募集文などを貼り付け..."
                    rows={8}
                    className={inputCls}
                    style={inputSt}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {/* 画像アップロード */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">
                  スクリーンショット（任意）
                  <span className="ml-1 text-slate-600">※添付するとスコア+5</span>
                </label>
                {!image ? (
                  <div
                    className="rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                    style={{ height: '260px', border: '2px dashed #334155', background: '#13141f' }}
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Camera size={28} className="text-slate-600" />
                    <p className="text-xs text-slate-600">クリックしてアップロード</p>
                    <p className="text-[10px] text-slate-700">JPG / PNG / GIF</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden" style={{ height: '260px', background: '#000' }}>
                    <img src={image} alt="証拠" className="object-contain w-full h-full" />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors"
                      style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      ✕
                    </button>
                    <span
                      className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      画像読込済（+5pt）
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Gemini鑑定ボタン */}
            <button
              onClick={handleAnalyze}
              disabled={!hasInput}
              className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={
                !hasInput
                  ? { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                  : copied
                  ? { background: '#059669', color: '#fff' }
                  : { background: '#10b981', color: '#fff' }
              }
            >
              {copied
                ? <><CheckCircle2 size={15} className="mr-1" />プロンプトをコピー完了 — Geminiを開きました</>
                : <><Zap size={15} className="mr-1" />Geminiで深掘り鑑定 <ExternalLink size={13} /></>}
            </button>
            <p className="text-[10px] text-slate-600 text-center">
              上のスコアはローカル判定（60+ルール）。Geminiでさらに詳細な分析ができます。
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">Nextra Cyber Defense · NextraLabs 2026</p>
      </div>
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="scam-defender" />
</div>
  )
}
