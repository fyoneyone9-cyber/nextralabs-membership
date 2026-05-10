'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  ShieldAlert, ShieldCheck, Zap, AlertTriangle, Info, Camera, Trash2, ExternalLink, CheckCircle2
} from 'lucide-react'

const DANGER_KEYWORDS = [
  // 闇バイト系
  '即日現金', '身分証不要', 'テレグラム', 'Telegram', 'シグナル', 'Signal',
  '運び屋', '受け子', '出し子', '高額報酬', 'ホワイト案件', '裏バイト',
  '未経験歓迎', 'ノルマなし', '日払い', '即払い', '秘密厳守', '闇バイト',
  '簡単作業', '在宅ワーク 高収入', '1日5万', '1日3万', '10万円',
  // フィッシング系
  'amezen', 'amazen', 'アマゾン', 'アマゾンプライム', 'Amaz0n',
  '楽天カード', '楽天市場 確認', 'らくてん',
  '三菱UFJ', 'みずほ', '三井住友 確認', 'ゆうちょ 確認',
  '重要なお知らせ', '本人確認', '異常なアクティビティ', 'ログイン制限',
  '差し押さえ', 'アカウント停止', 'アカウントが停止', 'カード停止',
  '不正アクセス', 'セキュリティ確認', '24時間以内', '48時間以内',
  '緊急のお知らせ', '口座凍結', 'クリックしてください', 'こちらから確認',
  // SMS詐欺
  '荷物をお届け', '配達できません', '再配達', 'ヤマト運輸 確認',
  '郵便局 確認', '佐川急便 確認',
  // マルチ・投資詐欺
  '副業 簡単', '投資 確実', '億り人', 'FX 必勝', '仮想通貨 無料',
  '元本保証', '高利回り', 'ネットワークビジネス', 'MLM',
]

// URLパターン（怪しいドメイン特徴）
const SUSPICIOUS_URL_PATTERNS = [
  /https?:\/\/[a-z0-9-]+\.(xyz|top|click|online|site|fun|cn|ru)\//i,
  /amazon\.[a-z]{3,}/i,
  /rakuten-[a-z]/i,
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,  // IPアドレス直打ち
  /bit\.ly|tinyurl|t\.co\/[a-z0-9]+$/i,
  /[a-z]+-amazon-[a-z]+\./i,
  /amaz[o0]n\.[a-z]{2,4}\//i,
]

export default function ScamDefender() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
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

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const [inputText, setInputText]   = useState('')
  const [senderInfo, setSenderInfo] = useState('')
  const [subjectInfo, setSubjectInfo] = useState('')
  const [riskScore, setRiskScore]   = useState<number | null>(null)
  const [detectedWords, setDetectedWords] = useState<string[]>([])
  const [detectedPatterns, setDetectedPatterns] = useState<string[]>([])
  const [image, setImage]           = useState<string | null>(null)
  const [copied, setCopied]         = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyze = useCallback((text: string, sender: string, subject: string) => {
    const full = `${text} ${sender} ${subject}`
    const fullLower = full.toLowerCase()

    // キーワード検出
    const found = DANGER_KEYWORDS.filter(w => fullLower.includes(w.toLowerCase()))
    setDetectedWords(found)

    // URLパターン検出
    const foundPatterns: string[] = []
    SUSPICIOUS_URL_PATTERNS.forEach((pattern, i) => {
      if (pattern.test(full)) {
        const labels = [
          '不審なドメイン(.xyz/.top等)',
          'Amazon偽装URL',
          '楽天偽装URL',
          'IPアドレス直打ちURL',
          '短縮URL使用',
          '不審な短縮URL',
          'Amazon偽装ドメイン',
          'Amazon偽装スペル',
        ]
        foundPatterns.push(labels[i] || '不審なURL')
      }
    })
    setDetectedPatterns(foundPatterns)

    // スコア計算
    let score = 0

    // キーワードによるスコア
    if (found.length >= 1) score += 35
    if (found.length >= 2) score += found.length * 12
    if (found.length >= 4) score += 10

    // URLパターンによるスコア
    score += foundPatterns.length * 25

    // 送信者ドメインの特別チェック
    const senderL = sender.toLowerCase()
    if (/amazon/i.test(senderL) && !/amazon\.co\.jp$|amazon\.com$/i.test(senderL)) score += 40
    if (/rakuten/i.test(senderL) && !/rakuten\.co\.jp$/i.test(senderL)) score += 35
    if (/[0-9]{5,}/.test(sender)) score += 20  // 数字だらけのアドレス
    if (/@[^@]+\.[^.]{4,}$/.test(sender)) score += 15  // 変なTLD

    // 件名の特別チェック
    const subjectL = subject.toLowerCase()
    if (subjectL.includes('停止') || subjectL.includes('制限')) score += 20
    if (subjectL.includes('重要') || subjectL.includes('緊急')) score += 15
    if (subjectL.includes('確認') && (subjectL.includes('アカウント') || subjectL.includes('カード'))) score += 20
    if (subjectL.includes('口座') || subjectL.includes('凍結')) score += 25

    setRiskScore(Math.min(100, score))
  }, [])

  useEffect(() => {
    if (inputText || senderInfo || subjectInfo) {
      analyze(inputText, senderInfo, subjectInfo)
    } else {
      setRiskScore(null)
      setDetectedWords([])
      setDetectedPatterns([])
    }
  }, [inputText, senderInfo, subjectInfo, analyze])

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
    setTimeout(() => setCopied(false), 2000)
    window.open('https://gemini.google.com', '_blank')
  }

  const clearAll = () => {
    setInputText('')
    setSenderInfo('')
    setSubjectInfo('')
    setImage(null)
    setRiskScore(null)
    setDetectedWords([])
    setDetectedPatterns([])
  }

  const score = riskScore ?? 0
  const hasInput    = inputText || senderInfo || subjectInfo || image
  const hasAnalyzed = riskScore !== null

  const riskColor = score > 60 ? '#ef4444' : score > 30 ? '#f59e0b' : '#10b981'
  const riskLabel = !hasAnalyzed
    ? '入力待ち'
    : score > 80
    ? '⚠️ 危険度：高'
    : score > 40
    ? '⚠️ 注意：疑わしい'
    : '✅ 安全：問題なし'

  const displayColor = hasAnalyzed ? riskColor : '#475569'

  const inputCls = `w-full rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors resize-none`
  const inputStyle = { background: '#13141f', border: '1px solid #334155' }
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#10b981')
  const blurBorder  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#334155')

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
          怪しいメッセージを<span style={{ color: '#10b981' }}>AIで即鑑定</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          送信者・件名・本文を入力するだけ。AIがリアルタイムで詐欺リスクを算出し、手口と対策をアドバイスします。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-5">

          {/* 左：リスクメーター */}
          <div className="space-y-4">
            {/* スコアカード */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: '#0d1117',
                border: `2px solid ${hasAnalyzed && score > 60 ? 'rgba(239,68,68,0.4)' : hasAnalyzed && score > 30 ? 'rgba(245,158,11,0.4)' : '#1e293b'}`,
                boxShadow: hasAnalyzed && score > 60 ? '0 0 20px rgba(239,68,68,0.1)' : 'none',
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
              <div className="text-center py-3">
                <p
                  className="text-6xl font-bold tabular-nums transition-all duration-500"
                  style={{ color: displayColor }}
                >
                  {hasAnalyzed ? `${score}%` : '--'}
                </p>
                <p className="text-xs font-medium mt-2 transition-all duration-300" style={{ color: displayColor }}>
                  {riskLabel}
                </p>
              </div>
              {/* プログレスバー */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: hasAnalyzed ? `${score}%` : '0%', background: displayColor }}
                />
              </div>
              {hasAnalyzed && (
                <p className="text-[10px] text-center text-slate-600">
                  スキャン完了
                </p>
              )}
            </div>

            {/* 検出キーワード */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <p className="text-xs font-medium text-slate-500">検出された危険シグナル</p>
              {(detectedWords.length > 0 || detectedPatterns.length > 0) ? (
                <div className="flex flex-wrap gap-1.5">
                  {detectedWords.map(w => (
                    <span
                      key={w}
                      className="text-xs px-2 py-1 rounded-md font-medium"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}
                    >
                      {w}
                    </span>
                  ))}
                  {detectedPatterns.map(p => (
                    <span
                      key={p}
                      className="text-xs px-2 py-1 rounded-md font-medium"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)' }}
                    >
                      🔗 {p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  {hasAnalyzed ? '危険なシグナルは検出されませんでした' : '入力待ち'}
                </p>
              )}
            </div>

            {/* 使い方 */}
            <div
              className="rounded-xl p-5 flex gap-3"
              style={{ background: '#0d1117', border: '1px solid #1e293b' }}
            >
              <Info size={14} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                怪しいテキストやスクリーンショットを入力してください。AIが犯罪手口と照合し、危険度をリアルタイム算出します。
              </p>
            </div>
          </div>

          {/* 右：入力フォーム */}
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
              {/* テキスト入力 */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">送信者 / ドメイン</label>
                  <input
                    type="text"
                    value={senderInfo}
                    onChange={e => setSenderInfo(e.target.value)}
                    placeholder="info@unknown-scam.com / @fake_user..."
                    className={inputCls}
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">件名</label>
                  <input
                    type="text"
                    value={subjectInfo}
                    onChange={e => setSubjectInfo(e.target.value)}
                    placeholder="重要：アカウントが停止されました..."
                    className={inputCls}
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">本文・募集文</label>
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="本文、SNS募集文などを貼り付け..."
                    rows={8}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* 画像アップロード */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">スクリーンショット（任意）</label>
                {!image ? (
                  <div
                    className="rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                    style={{ height: '240px', border: '2px dashed #334155', background: '#13141f' }}
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Camera size={28} className="text-slate-600" />
                    <p className="text-xs text-slate-600">クリックしてアップロード</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden" style={{ height: '240px', background: '#000' }}>
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
                      画像読込済
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 鑑定ボタン */}
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
                ? <><CheckCircle2 size={15} className="mr-1" />プロンプトをコピーしました — Geminiが開きます</>
                : <><Zap size={15} className="mr-1" />AI徹底鑑定を開始 <ExternalLink size={13} /></>}
            </button>
            <p className="text-[10px] text-slate-600 text-center">
              プロンプトをコピーしてGeminiへ貼り付けると詳細な鑑定結果が得られます
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-tight">Nextra Cyber Defense · NextraLabs 2026</p>
      </div>
    </div>
  )
}
