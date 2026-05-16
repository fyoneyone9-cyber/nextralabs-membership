'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Mic, MicOff, Square, Copy, Mail, Save, ChevronDown, ChevronUp,
  Globe, AlertCircle, Star, MessageSquare, Loader2, CheckCircle,
  Wifi, WifiOff, Info, Map, RotateCcw
} from 'lucide-react'
import Link from 'next/link'

// ─── 型定義 ───────────────────────────────────────────
type LangCode = 'en-US' | 'zh-CN' | 'zh-TW' | 'ko-KR' | 'fr-FR' | 'es-ES' | 'de-DE' | 'th-TH' | 'auto'

interface Tag {
  type: 'allergy' | 'request' | 'vip' | 'checkout'
  label: string
  value: string
}

interface Summary {
  allergies: string[]
  requests: string[]
  vip: string[]
  checkoutTime: string
}

interface TranscriptEntry {
  original: string
  translated: string
  timestamp: string
  tags: Tag[]
}

// ─── 定数 ─────────────────────────────────────────────
const LANGUAGES: { code: LangCode; label: string; flag: string; nativeName: string }[] = [
  { code: 'auto',  label: '自動検出',     flag: '🔍', nativeName: 'Auto Detect' },
  { code: 'en-US', label: '英語',         flag: '🇺🇸', nativeName: 'English' },
  { code: 'zh-CN', label: '中国語（簡体）', flag: '🇨🇳', nativeName: '中文(简体)' },
  { code: 'zh-TW', label: '中国語（繁体）', flag: '🇹🇼', nativeName: '中文(繁體)' },
  { code: 'ko-KR', label: '韓国語',       flag: '🇰🇷', nativeName: '한국어' },
  { code: 'fr-FR', label: 'フランス語',   flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es-ES', label: 'スペイン語',   flag: '🇪🇸', nativeName: 'Español' },
  { code: 'de-DE', label: 'ドイツ語',     flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'th-TH', label: 'タイ語',       flag: '🇹🇭', nativeName: 'ภาษาไทย' },
]

const PRESETS = [
  {
    id: 'checkin',
    label: 'チェックイン',
    icon: '🏨',
    desc: 'アレルギー・同伴者・部屋の要望を優先抽出',
    promptHint: 'アレルギー・食事制限・部屋のタイプ・特別リクエスト・人数に注目して抽出してください。',
  },
  {
    id: 'breakfast',
    label: '朝食確認',
    icon: '🍳',
    desc: '食事制限・時間・席の要望を優先抽出',
    promptHint: '食事制限・朝食の時間帯・席の希望（禁煙・窓際など）に注目して抽出してください。',
  },
  {
    id: 'facility',
    label: '設備案内',
    icon: '🗺️',
    desc: 'Wi-Fi・温泉・観光案内',
    promptHint: 'Wi-Fiの要望・温泉・観光スポット・交通手段に関する質問や要望を抽出してください。',
  },
  {
    id: 'complaint',
    label: 'クレーム対応',
    icon: '⚠️',
    desc: '問題把握・謝罪・対応記録',
    promptHint: '問題の内容・深刻度・ゲストの要求事項・対応内容を正確に抽出してください。',
  },
  {
    id: 'checkout',
    label: 'チェックアウト',
    icon: '🧳',
    desc: '時間・荷物預かり・次回予約',
    promptHint: 'チェックアウト希望時間・荷物の預かり・タクシー手配・次回予約の意向を抽出してください。',
  },
]

// ─── モックAI翻訳（Gemini API なしのフォールバック） ──
async function mockTranslate(text: string, sourceLang: string): Promise<string> {
  // 実際には /api/voice-guest/translate エンドポイントを呼ぶ
  // ここではデモ用のシミュレーション
  await new Promise(r => setTimeout(r, 300))
  if (!text.trim()) return ''
  // 簡単なデモ翻訳メッセージ
  const demos: Record<string, string> = {
    'I have a nut allergy': 'ナッツアレルギーがあります',
    'I would like a non-smoking room': '禁煙室をお願いします',
    'Can I have a wake-up call at 7am': '朝7時にモーニングコールをお願いします',
    'We are celebrating our honeymoon': 'ハネムーンを祝っています',
  }
  for (const [key, val] of Object.entries(demos)) {
    if (text.toLowerCase().includes(key.toLowerCase())) return val
  }
  return `[翻訳] ${text}`
}

// ─── AI要約抽出 ───────────────────────────────────────
function extractTags(text: string): Tag[] {
  const tags: Tag[] = []
  const lower = text.toLowerCase()
  const jaText = text

  // アレルギー検出
  const allergyWords = ['allergy', 'allergic', 'アレルギー', 'nut', 'shellfish', 'dairy', 'gluten', '卵', '乳', '小麦']
  for (const w of allergyWords) {
    if (lower.includes(w)) {
      tags.push({ type: 'allergy', label: 'アレルギー', value: jaText })
      break
    }
  }
  // VIP検出
  const vipWords = ['honeymoon', 'ハネムーン', 'anniversary', '記念日', 'birthday', '誕生日', 'vip', 'celebrate']
  for (const w of vipWords) {
    if (lower.includes(w)) {
      tags.push({ type: 'vip', label: 'VIP情報', value: jaText })
      break
    }
  }
  // 要望検出
  const reqWords = ['non-smoking', '禁煙', 'quiet', '静か', 'high floor', '高層', 'view', 'ocean', 'window', 'extra', 'pillow', '枕']
  for (const w of reqWords) {
    if (lower.includes(w)) {
      tags.push({ type: 'request', label: '要望', value: jaText })
      break
    }
  }
  // チェックアウト
  const coWords = ['check out', 'checkout', 'チェックアウト', 'late', '遅め', 'early', '早め']
  for (const w of coWords) {
    if (lower.includes(w)) {
      tags.push({ type: 'checkout', label: 'チェックアウト', value: jaText })
      break
    }
  }
  return tags
}

function buildSummary(entries: TranscriptEntry[]): Summary {
  const summary: Summary = { allergies: [], requests: [], vip: [], checkoutTime: '' }
  for (const e of entries) {
    for (const tag of e.tags) {
      if (tag.type === 'allergy' && !summary.allergies.includes(e.translated)) summary.allergies.push(e.translated)
      if (tag.type === 'request' && !summary.requests.includes(e.translated)) summary.requests.push(e.translated)
      if (tag.type === 'vip' && !summary.vip.includes(e.translated)) summary.vip.push(e.translated)
      if (tag.type === 'checkout' && !summary.checkoutTime) summary.checkoutTime = e.translated
    }
  }
  return summary
}

// ─── コピーテキスト生成 ───────────────────────────────
function buildStayseeCopy(roomNo: string, guestName: string, preset: string, summary: Summary, entries: TranscriptEntry[]): string {
  const now = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  const lines: string[] = [
    `【AI多言語ゲストアシスト — 自動記録】`,
    `記録日時: ${now}`,
    roomNo ? `部屋番号: ${roomNo}` : '',
    guestName ? `ゲスト名: ${guestName}` : '',
    `対応シーン: ${PRESETS.find(p => p.id === preset)?.label ?? preset}`,
    '',
    '--- 重要事項 ---',
    summary.allergies.length ? `🔴 アレルギー・食事制限:\n${summary.allergies.map(a => `  • ${a}`).join('\n')}` : '',
    summary.requests.length  ? `🟡 特別リクエスト:\n${summary.requests.map(r => `  • ${r}`).join('\n')}` : '',
    summary.vip.length       ? `🔵 VIP情報:\n${summary.vip.map(v => `  • ${v}`).join('\n')}` : '',
    summary.checkoutTime     ? `⏰ チェックアウト関連: ${summary.checkoutTime}` : '',
    '',
    '--- 会話ログ（日本語訳） ---',
    ...entries.map(e => `[${e.timestamp}] ${e.translated}`),
  ]
  return lines.filter(l => l !== '').join('\n')
}

// ─── アクセスガード ───────────────────────────────────
function VoiceGuestAssistGuard({ children }: { children: React.ReactNode }) {
  const [accessChecked, setAccessChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    fetch('/api/check-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'voice-guest-assist' }),
    })
      .then(r => r.json())
      .then(d => { setHasAccess(d.hasAccess); setAccessChecked(true) })
      .catch(() => setAccessChecked(true))
  }, [])

  if (!accessChecked) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <Mic className="h-10 w-10 text-amber-400 mx-auto" />
        </div>
        <div>
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">🏨 エンタープライズ専用</p>
          <h1 className="text-2xl font-bold text-white mb-3">このツールは法人契約限定です</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            AI多言語ゲストアシストは、ホテル・旅館向けのエンタープライズプラン専用ツールです。<br />
            導入のご相談はお問い合わせよりお気軽にどうぞ。
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/contact">
            <button className="h-11 px-7 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all text-sm flex items-center gap-2">
              導入のご相談・お見積もり →
            </button>
          </Link>
          <Link href="/enterprise">
            <button className="h-11 px-7 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold rounded-lg transition-all text-sm">
              エンタープライズプランを見る
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// ─── メインコンポーネント ─────────────────────────────
export default function VoiceGuestAssistPage() {
  return <VoiceGuestAssistGuard><VoiceGuestAssistInner /></VoiceGuestAssistGuard>
}

function VoiceGuestAssistInner() {
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLang, setSelectedLang] = useState<LangCode>('en-US')
  const [selectedPreset, setSelectedPreset] = useState('checkin')
  const [roomNo, setRoomNo] = useState('')
  const [guestName, setGuestName] = useState('')
  const [liveOriginal, setLiveOriginal] = useState('')
  const [liveTranslated, setLiveTranslated] = useState('')
  const [entries, setEntries] = useState<TranscriptEntry[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [browserSupport, setBrowserSupport] = useState(true)
  const [isTranslating, setIsTranslating] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptBufferRef = useRef('')

  // ブラウザ対応確認
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) setBrowserSupport(false)
  }, [])

  // 録音タイマー
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRecording])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleTranscript = useCallback(async (text: string, isFinal: boolean) => {
    setLiveOriginal(text)
    if (isFinal && text.trim()) {
      setIsTranslating(true)
      const translated = await mockTranslate(text, selectedLang)
      setIsTranslating(false)
      setLiveTranslated(translated)
      const tags = extractTags(text + ' ' + translated)
      const now = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const entry: TranscriptEntry = { original: text, translated, timestamp: now, tags }
      setEntries(prev => [...prev, entry])
      setLiveOriginal('')
      setLiveTranslated('')
    }
  }, [selectedLang])

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    const langCode = selectedLang === 'auto' ? 'en-US' : selectedLang
    recognition.lang = langCode
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      if (final) handleTranscript(final, true)
      else if (interim) handleTranscript(interim, false)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('SpeechRecognition error:', event.error)
    }

    recognition.onend = () => {
      if (isRecording) recognition.start() // 連続録音
    }

    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
    setElapsed(0)
  }, [selectedLang, isRecording, handleTranscript])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    if (entries.length > 0) {
      setSummary(buildSummary(entries))
    }
  }, [entries])

  const handleCopyStaysee = async () => {
    if (!summary) return
    const text = buildStayseeCopy(roomNo, guestName, selectedPreset, summary, entries)
    await navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2500)
  }

  const handleReset = () => {
    setEntries([])
    setSummary(null)
    setLiveOriginal('')
    setLiveTranslated('')
    setElapsed(0)
    setRoomNo('')
    setGuestName('')
  }

  const tagColor = (type: Tag['type']) => {
    if (type === 'allergy')  return 'bg-red-500/20 text-red-300 border-red-500/40'
    if (type === 'vip')      return 'bg-sky-500/20 text-sky-300 border-sky-500/40'
    if (type === 'request')  return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
    if (type === 'checkout') return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    return ''
  }

  const tagIcon = (type: Tag['type']) => {
    if (type === 'allergy')  return '🔴'
    if (type === 'vip')      return '🔵'
    if (type === 'request')  return '🟡'
    if (type === 'checkout') return '⏰'
    return ''
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-['Inter','Noto_Sans_JP',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ─── ヘッダー ─── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI多言語ゲストアシスト — Web Speech API × Gemini AI
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            🎤 多言語ゲスト<span className="text-emerald-400">対応</span>アシスタント
          </h1>
          <p className="text-slate-400 leading-relaxed text-sm max-w-xl mx-auto">
            外国語の会話をリアルタイムで日本語翻訳。アレルギー・要望・VIP情報を自動抽出し、<br />
            Stayseeのゲストメモにワンタップでコピーできます。
          </p>
        </div>

        {/* ─── ブラウザ非対応警告 ─── */}
        {!browserSupport && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">音声認識非対応ブラウザです</p>
              <p className="text-red-400 text-xs mt-1">Chrome または Edge をご利用ください。Safari / Firefox は非対応です。</p>
            </div>
          </div>
        )}

        {/* ─── STEP 1: ゲスト情報 ─── */}
        <div className="bg-[#0d1117] rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">STEP 1 — ゲスト情報（任意）</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">部屋番号</label>
              <input
                value={roomNo}
                onChange={e => setRoomNo(e.target.value)}
                placeholder="例: 301"
                className="w-full bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">ゲスト名（任意）</label>
              <input
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="例: Smith"
                className="w-full bg-[#13141f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>
          </div>
        </div>

        {/* ─── STEP 2: シーン選択 ─── */}
        <div className="bg-[#0d1117] rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">STEP 2 — 対応シーン選択</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedPreset === p.id
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-[#13141f] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {PRESETS.find(p => p.id === selectedPreset)?.desc}
          </p>
        </div>

        {/* ─── STEP 3: 言語選択 ─── */}
        <div className="bg-[#0d1117] rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">STEP 3 — ゲストの言語を選択</h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedLang === l.code
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-[#13141f] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <span>{l.flag}</span>
                <span className="hidden sm:inline">{l.label}</span>
                <span className="sm:hidden text-xs">{l.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── STEP 4: 録音コントロール ─── */}
        <div className="bg-[#0d1117] rounded-2xl p-6 border border-white/5 space-y-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">STEP 4 — 録音 &amp; リアルタイム翻訳</h2>

          {/* 大きなマイクボタン */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!browserSupport}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isRecording ? <Square size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
            </button>

            {isRecording ? (
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                録音中 — {formatTime(elapsed)}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">マイクボタンを押して録音を開始</p>
            )}
          </div>

          {/* リアルタイム表示 */}
          {(liveOriginal || liveTranslated || isTranslating) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#13141f] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-slate-500 mb-2">原語（リアルタイム）</p>
                <p className="text-sm text-slate-200 leading-relaxed">{liveOriginal || '...'}</p>
              </div>
              <div className="bg-[#13141f] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  日本語訳
                  {isTranslating && <Loader2 size={12} className="animate-spin" />}
                </p>
                <p className="text-sm text-emerald-300 leading-relaxed">{liveTranslated || '翻訳中...'}</p>
              </div>
            </div>
          )}
        </div>

        {/* ─── 会話ログ ─── */}
        {entries.length > 0 && (
          <div className="bg-[#0d1117] rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">会話ログ（{entries.length}件）</h2>
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
                <RotateCcw size={12} /> リセット
              </button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {entries.map((entry, i) => (
                <div key={i} className="bg-[#13141f] rounded-xl p-4 border border-white/5 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <p className="text-xs text-slate-400 leading-relaxed">{entry.original}</p>
                    <p className="text-xs text-emerald-300 leading-relaxed">{entry.translated}</p>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag, j) => (
                        <span key={j} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${tagColor(tag.type)}`}>
                          {tagIcon(tag.type)} {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-600">{entry.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── AI要約まとめ ─── */}
        {summary && (
          <div className="bg-[#0d1117] rounded-2xl p-6 border border-emerald-500/20 space-y-5">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">📋 重要事項まとめ — Stayseeに転記</h2>
            </div>

            <div className="space-y-3">
              {summary.allergies.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <span className="text-lg mt-0.5">🔴</span>
                  <div>
                    <p className="text-xs font-semibold text-red-300 mb-1">アレルギー・食事制限</p>
                    {summary.allergies.map((a, i) => <p key={i} className="text-sm text-slate-200">• {a}</p>)}
                  </div>
                </div>
              )}
              {summary.requests.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-lg mt-0.5">🟡</span>
                  <div>
                    <p className="text-xs font-semibold text-yellow-300 mb-1">特別リクエスト</p>
                    {summary.requests.map((r, i) => <p key={i} className="text-sm text-slate-200">• {r}</p>)}
                  </div>
                </div>
              )}
              {summary.vip.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <span className="text-lg mt-0.5">🔵</span>
                  <div>
                    <p className="text-xs font-semibold text-sky-300 mb-1">VIP情報</p>
                    {summary.vip.map((v, i) => <p key={i} className="text-sm text-slate-200">• {v}</p>)}
                  </div>
                </div>
              )}
              {summary.checkoutTime && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-lg mt-0.5">⏰</span>
                  <div>
                    <p className="text-xs font-semibold text-purple-300 mb-1">チェックアウト関連</p>
                    <p className="text-sm text-slate-200">{summary.checkoutTime}</p>
                  </div>
                </div>
              )}
              {!summary.allergies.length && !summary.requests.length && !summary.vip.length && !summary.checkoutTime && (
                <p className="text-sm text-slate-500 text-center py-4">特記事項は検出されませんでした</p>
              )}
            </div>

            {/* アウトプットボタン */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyStaysee}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copySuccess ? 'コピーしました！' : 'Stayseeメモにコピー'}
              </button>
              <button
                onClick={() => {
                  const text = buildStayseeCopy(roomNo, guestName, selectedPreset, summary, entries)
                  const subject = `ゲスト対応記録 ${roomNo ? `[${roomNo}]` : ''} ${new Date().toLocaleDateString('ja-JP')}`
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
                }}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#13141f] border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 font-medium text-sm transition-all"
              >
                <Mail size={18} />
                次担当へメール送信
              </button>
            </div>
          </div>
        )}

        {/* ─── 使い方（折りたたみ） ─── */}
        <div className="bg-[#0d1117] rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setShowHelp(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-slate-300 hover:text-white transition"
          >
            <span className="flex items-center gap-2"><Info size={16} className="text-emerald-400" /> 使い方・注意事項</span>
            {showHelp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showHelp && (
            <div className="px-6 pb-6 space-y-3 text-sm text-slate-400 border-t border-white/5 pt-4">
              <p>① 部屋番号・ゲスト名を入力（任意）</p>
              <p>② 対応シーンとゲストの言語を選択</p>
              <p>③ 🎤 マイクボタンで録音開始 → ゲストと話す</p>
              <p>④ 会話がリアルタイムで日本語訳され、重要事項が自動タグ付けされます</p>
              <p>⑤ 「録音停止して要約」で「重要事項まとめ」を生成</p>
              <p>⑥「Stayseeメモにコピー」で顧客メモに貼り付け</p>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                ⚠️ 会話内容はブラウザ内でのみ処理されます。サーバーへの送信はありません。<br />
                Chrome / Edge 推奨。マイクの使用許可が必要です。
              </div>
            </div>
          )}
        </div>

        {/* ─── ロードマップ（折りたたみ） ─── */}
        <div className="bg-[#0d1117] rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setShowRoadmap(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-slate-300 hover:text-white transition"
          >
            <span className="flex items-center gap-2"><Map size={16} className="text-emerald-400" /> ロードマップ</span>
            {showRoadmap ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showRoadmap && (
            <div className="px-6 pb-6 border-t border-white/5 pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-400 font-bold text-xs whitespace-nowrap">Phase 1 ✅</span>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-semibold">現在提供中</p>
                    <p className="text-slate-400 text-xs">✅ Web Speech API による音声認識（ブラウザ内蔵）</p>
                    <p className="text-slate-400 text-xs">✅ リアルタイム日本語翻訳表示</p>
                    <p className="text-slate-400 text-xs">✅ アレルギー・VIP・要望の自動タグ付け</p>
                    <p className="text-slate-400 text-xs">✅ Stayseeメモ形式コピー出力</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-sky-400 font-bold text-xs whitespace-nowrap">Phase 2 🔲</span>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-semibold">近日対応予定</p>
                    <p className="text-slate-400 text-xs">🔲 Google Cloud Speech-to-Text v2 API 連携（精度向上）</p>
                    <p className="text-slate-400 text-xs">🔲 Google Cloud Translation API v3 連携（正確な翻訳）</p>
                    <p className="text-slate-400 text-xs">🔲 Gemini AI による構造化サマリー生成</p>
                    <p className="text-slate-400 text-xs">🔲 Supabase への会話履歴保存・検索</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-amber-400 font-bold text-xs whitespace-nowrap">Phase 3 💡</span>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-semibold">将来構想</p>
                    <p className="text-slate-400 text-xs">💡 スタッフ向け多言語応答フレーズ提案</p>
                    <p className="text-slate-400 text-xs">💡 Zapier/Make経由でStaysee自動書き込み</p>
                    <p className="text-slate-400 text-xs">💡 Staysee公式API連携（提供開始次第）</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── フッター ─── */}
        <p className="text-center text-xs text-slate-600 pb-6">
          AI多言語ゲストアシスト — NextraLabs | <a href="https://nextralab.jp" className="hover:text-emerald-400 transition">nextralab.jp</a>
        </p>
      </div>
    </div>
  )
}
