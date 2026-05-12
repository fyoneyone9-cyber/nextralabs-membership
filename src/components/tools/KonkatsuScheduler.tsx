'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Calendar, Clock, ChevronRight, Loader2, CheckCircle2, Settings,
  RefreshCw, Info, AlertCircle, ArrowLeft, Zap, User, Users,
  MapPin, Bell, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
type Step = 'home' | 'connect' | 'preset' | 'candidates' | 'confirmed' | 'settings' | 'help'

interface TimeSlot {
  id: string
  date: string          // "2026-05-15"
  dateLabel: string     // "5/15（木）"
  startTime: string     // "19:00"
  endTime: string       // "20:30"
  dayOfWeek: string
}

interface Preset {
  weekdays: boolean
  weekends: boolean
  morningOk: boolean    // 10-12
  afternoonOk: boolean  // 12-15
  eveningOk: boolean    // 17-19
  nightOk: boolean      // 19-21
  duration: 60 | 90 | 120
  bufferMin: 30 | 60 | 90
  daysFromNow: 2 | 3 | 7
}

// ─────────────────────────────────────────────
// ダミー候補生成（本番はGoogle Calendar APIに置換）
// ─────────────────────────────────────────────
function generateCandidates(preset: Preset): TimeSlot[] {
  const slots: TimeSlot[] = []
  const days = ['日', '月', '火', '水', '木', '金', '土']
  const now = new Date()
  let added = 0
  let offset = preset.daysFromNow

  while (added < 3 && offset < 30) {
    const d = new Date(now)
    d.setDate(now.getDate() + offset)
    const dow = d.getDay()
    const isWeekend = dow === 0 || dow === 6
    const isWeekday = !isWeekend

    if ((isWeekend && preset.weekends) || (isWeekday && preset.weekdays)) {
      const timeOptions: { start: string; end: string }[] = []
      if (preset.morningOk)    timeOptions.push({ start: '10:00', end: `${10 + Math.floor(preset.duration/60)}:${preset.duration%60 === 0 ? '00' : '30'}` })
      if (preset.afternoonOk)  timeOptions.push({ start: '13:00', end: `${13 + Math.floor(preset.duration/60)}:${preset.duration%60 === 0 ? '00' : '30'}` })
      if (preset.eveningOk)    timeOptions.push({ start: '18:00', end: `${18 + Math.floor(preset.duration/60)}:${preset.duration%60 === 0 ? '00' : '30'}` })
      if (preset.nightOk)      timeOptions.push({ start: '19:30', end: `${19 + Math.floor(preset.duration/60)}:${30 + preset.duration%60 >= 60 ? (30+preset.duration%60-60)+'（翌時）': (30+preset.duration%60)}` })

      if (timeOptions.length > 0) {
        const t = timeOptions[added % timeOptions.length]
        const mm = String(d.getMonth() + 1)
        const dd = String(d.getDate())
        slots.push({
          id: `slot-${offset}`,
          date: `${d.getFullYear()}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`,
          dateLabel: `${mm}/${dd}（${days[dow]}）`,
          startTime: t.start,
          endTime: t.end,
          dayOfWeek: days[dow],
        })
        added++
      }
    }
    offset++
  }
  return slots
}

// ─────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────
export default function KonkatsuScheduler() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('home')
  const [isConnected, setIsConnected] = useState(false)
  const [partnerConnected, setPartnerConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState<TimeSlot[]>([])
  const [myChoice, setMyChoice] = useState<string | null>(null)
  const [partnerChoice, setPartnerChoice] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<TimeSlot | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  const [preset, setPreset] = useState<Preset>({
    weekdays: true, weekends: true,
    morningOk: false, afternoonOk: true, eveningOk: true, nightOk: true,
    duration: 90, bufferMin: 60, daysFromNow: 2,
  })

  // パートナーが選択した候補をシミュレート（本番はSupabase Realtime）
  useEffect(() => {
    if (myChoice && candidates.length > 0) {
      const timer = setTimeout(() => {
        // 相手が同じ候補を選ぶケース（デモ）
        const randomIdx = Math.floor(Math.random() * candidates.length)
        const partnerPick = candidates[randomIdx].id
        setPartnerChoice(partnerPick)
        if (partnerPick === myChoice) {
          const slot = candidates.find(c => c.id === partnerPick)!
          setConfirmed(slot)
          setStep('confirmed')
        }
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [myChoice, candidates])

  const handleGoogleConnect = useCallback(async () => {
    setLoading(true)
    // 本番: Google OAuth2 フロー起動
    // window.location.href = '/api/auth/google-calendar'
    await new Promise(r => setTimeout(r, 1800))
    setIsConnected(true)
    setLoading(false)
  }, [])

  const handleFetchCandidates = useCallback(async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const slots = generateCandidates(preset)
    setCandidates(slots)
    setPartnerConnected(true)
    setLoading(false)
    setStep('candidates')
  }, [preset])

  const handleRefresh = useCallback(async () => {
    setLoading(true)
    setMyChoice(null)
    setPartnerChoice(null)
    await new Promise(r => setTimeout(r, 1200))
    const slots = generateCandidates(preset)
    setCandidates(slots)
    setLoading(false)
  }, [preset])

  // ─── ヘッダー ───
  const Header = () => (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => step === 'home' ? router.push('/dashboard') : setStep('home')}
        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {step === 'home' ? 'ダッシュボード' : 'ホームに戻る'}
      </button>
      <div className="flex items-center gap-2">
        <button onClick={() => setStep('settings')} className="text-slate-400 hover:text-emerald-400 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button onClick={() => setStep('help')} className="text-slate-400 hover:text-emerald-400 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // ─── HOME ───
  if (step === 'home') return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto">
      <Header />

      <div className="text-center mb-8">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] font-medium px-3 py-0.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-1.5" />
          Google Calendar API 連携
        </Badge>
        <h1 className="text-2xl font-bold mb-2">AI即アポ調整くん</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          「いつ空いてますか？」のやり取りをゼロに。<br />
          カレンダーを繋いでお見合い日程を自動確定。
        </p>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-4 rounded-xl border ${isConnected ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/5 bg-[#13141f]'}`}>
          <User className={`w-5 h-5 mb-2 ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
          <div className="text-xs font-medium">自分のカレンダー</div>
          <div className={`text-xs mt-1 ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isConnected ? '✓ 連携済み' : '未連携'}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${partnerConnected ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/5 bg-[#13141f]'}`}>
          <Users className={`w-5 h-5 mb-2 ${partnerConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
          <div className="text-xs font-medium">相手のカレンダー</div>
          <div className={`text-xs mt-1 ${partnerConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
            {partnerConnected ? '✓ 連携済み' : '待機中'}
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="space-y-3">
        {!isConnected ? (
          <Button
            onClick={() => setStep('connect')}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Googleカレンダーを連携する
          </Button>
        ) : (
          <Button
            onClick={handleFetchCandidates}
            disabled={loading}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? '候補を取得中...' : '空き時間を抽出して候補を生成'}
          </Button>
        )}

        <Button
          onClick={() => setStep('preset')}
          variant="outline"
          className="w-full h-11 border-white/10 hover:border-white/20 text-slate-300 rounded-lg flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          プリセット設定を変更する
        </Button>
      </div>

      {/* インフォボックス */}
      <div className="mt-6 border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => setInfoOpen(!infoOpen)}
          className="w-full flex items-center justify-between p-4 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2"><Info className="w-4 h-4" /> このツールについて</span>
          {infoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {infoOpen && (
          <div className="px-4 pb-4 space-y-2 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-4">
            <p>📅 <strong className="text-slate-300">参照するカレンダー:</strong> Googleカレンダー（自分・相手の両方）</p>
            <p>🔒 <strong className="text-slate-300">プライバシー:</strong> 予定タイトル・詳細は取得しません。「空き/埋まり」の情報のみを参照します。</p>
            <p>📝 <strong className="text-slate-300">カレンダーへの書き込み:</strong> 確定後「お見合い @調整中」として双方に自動登録します。</p>
            <p>🔄 <strong className="text-slate-300">再提示:</strong> 候補が合わなければ何度でも再提示できます。</p>
          </div>
        )}
      </div>
    </div>
  )

  // ─── CONNECT ───
  if (step === 'connect') return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto">
      <Header />
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Googleカレンダーを連携</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          OAuthで安全に接続します。予定のタイトルや内容は<br />取得しません。空き時間のみを参照します。
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {[
          { icon: '✅', text: '空き時間（予定がない枠）のみ参照' },
          { icon: '🔒', text: '予定のタイトル・詳細は取得しない' },
          { icon: '📝', text: '確定後に1件の予定を自動登録' },
          { icon: '🚫', text: '第三者への情報共有なし' },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-3 bg-[#13141f] border border-white/5 rounded-lg p-3 text-sm text-slate-300">
            <span>{item.icon}</span>{item.text}
          </div>
        ))}
      </div>

      <Button
        onClick={handleGoogleConnect}
        disabled={loading}
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg flex items-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
        {loading ? '認証中...' : 'Googleアカウントで連携する'}
      </Button>

      {isConnected && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          連携完了！ホーム画面から候補を生成できます。
        </div>
      )}
      {/* 💒 マリッジロードジャパン */}
      <div className="mt-8 mb-2 flex justify-center">
        <a
          href="https://www.youtube.com/@marriage_road"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#0d1117] border border-emerald-500/40 rounded-xl px-5 py-3 hover:border-emerald-500/70 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all group w-full max-w-sm"
        >
          <span className="text-2xl">💒</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">結婚相談所をお探しの方へ</p>
            <p className="text-[11px] text-slate-400 mt-0.5">マリッジロードジャパン — 無料相談受付中</p>
          </div>
          <span className="text-slate-500 group-hover:text-emerald-400 transition-colors text-sm">→</span>
        </a>
      </div>
    </div>
  )

  // ─── PRESET ───
  if (step === 'preset') return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto">
      <Header />
      <h2 className="text-xl font-bold mb-6">プリセット設定</h2>

      <div className="space-y-5">
        {/* 曜日 */}
        <div className="bg-[#13141f] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">希望する曜日</h3>
          <div className="flex gap-3">
            {[
              { key: 'weekdays', label: '平日（月〜金）' },
              { key: 'weekends', label: '土日祝' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPreset(p => ({ ...p, [key]: !p[key as keyof Preset] }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  preset[key as keyof Preset]
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 時間帯 */}
        <div className="bg-[#13141f] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">希望する時間帯</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'morningOk', label: '午前（10〜12時）' },
              { key: 'afternoonOk', label: '昼（12〜15時）' },
              { key: 'eveningOk', label: '夕方（17〜19時）' },
              { key: 'nightOk', label: '夜（19〜21時）' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPreset(p => ({ ...p, [key]: !p[key as keyof Preset] }))}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  preset[key as keyof Preset]
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 所要時間 */}
        <div className="bg-[#13141f] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">お見合い所要時間</h3>
          <div className="flex gap-2">
            {([60, 90, 120] as const).map(d => (
              <button
                key={d}
                onClick={() => setPreset(p => ({ ...p, duration: d }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  preset.duration === d
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {d === 60 ? '1時間' : d === 90 ? '1.5時間' : '2時間'}
              </button>
            ))}
          </div>
        </div>

        {/* 移動バッファ */}
        <div className="bg-[#13141f] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">移動バッファ時間</h3>
          <div className="flex gap-2">
            {([30, 60, 90] as const).map(b => (
              <button
                key={b}
                onClick={() => setPreset(p => ({ ...p, bufferMin: b }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  preset.bufferMin === b
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {b}分
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">直前・直後の予定から確保する余白時間</p>
        </div>

        {/* 最短日 */}
        <div className="bg-[#13141f] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">候補の最短日</h3>
          <div className="flex gap-2">
            {([2, 3, 7] as const).map(d => (
              <button
                key={d}
                onClick={() => setPreset(p => ({ ...p, daysFromNow: d }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  preset.daysFromNow === d
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {d === 2 ? '2日後〜' : d === 3 ? '3日後〜' : '1週間後〜'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={() => setStep('home')}
        className="w-full h-12 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg"
      >
        設定を保存してホームに戻る
      </Button>
    </div>
  )

  // ─── CANDIDATES ───
  if (step === 'candidates') return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto">
      <Header />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">候補日が届きました</h2>
        <p className="text-slate-400 text-sm">希望する日程をタップしてください。相手と一致した瞬間に確定します。</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">再提示中...</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {candidates.map((slot, i) => (
            <button
              key={slot.id}
              onClick={() => setMyChoice(slot.id)}
              className={`w-full p-5 rounded-xl border text-left transition-all duration-200 ${
                myChoice === slot.id
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'border-white/5 bg-[#13141f] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    myChoice === slot.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{slot.dateLabel}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {slot.startTime} 〜 {slot.endTime}
                    </div>
                  </div>
                </div>
                {myChoice === slot.id && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    選択中
                  </div>
                )}
              </div>

              {/* 相手の選択状態 */}
              {partnerChoice === slot.id && myChoice !== slot.id && (
                <div className="mt-2 text-xs text-pink-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> 相手がこの日程を希望しています
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {myChoice && !confirmed && (
        <div className="p-4 bg-[#13141f] border border-white/5 rounded-xl flex items-center gap-3 mb-4">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
          <p className="text-sm text-slate-400">相手の回答を待っています...</p>
        </div>
      )}

      <Button
        onClick={handleRefresh}
        disabled={loading}
        variant="outline"
        className="w-full h-11 border-white/10 hover:border-white/20 text-slate-300 rounded-lg flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        別の候補を再提示する
      </Button>
    </div>
  )

  // ─── CONFIRMED ───
  if (step === 'confirmed' && confirmed) return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto flex flex-col items-center justify-center">
      <div className="text-center space-y-6 w-full max-w-sm">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-emerald-400">日程が確定しました！</h2>
          <p className="text-slate-400 text-sm">双方のカレンダーに自動登録されました。</p>
        </div>

        <div className="bg-[#13141f] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <div className="text-3xl font-bold text-center mb-1">{confirmed.dateLabel}</div>
          <div className="text-center text-emerald-400 text-lg font-semibold mb-4">
            {confirmed.startTime} 〜 {confirmed.endTime}
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" />Googleカレンダーに「お見合い」として登録済み</div>
            <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-emerald-400" />前日・当日朝にリマインダーが届きます</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" />場所はトーク画面で相談しましょう</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg"
          >
            ダッシュボードに戻る
          </Button>
          <Button
            onClick={() => {
              setStep('home')
              setMyChoice(null)
              setPartnerChoice(null)
              setConfirmed(null)
              setCandidates([])
            }}
            variant="outline"
            className="w-full h-11 border-white/10 text-slate-400 rounded-lg"
          >
            別のお見合いを調整する
          </Button>
        </div>
      </div>
    </div>
  )

  // ─── SETTINGS（ロードマップ表示） ───
  if (step === 'settings') return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto">
      <Header />
      <h2 className="text-xl font-bold mb-6">開発ロードマップ</h2>
      <div className="space-y-4 mb-8">
        {[
          { phase: 'v1.0', status: 'リリース済み', color: 'bg-emerald-500', items: ['Google Calendar連携', '共通空き時間の自動抽出', '候補3件の自動提示・確定', '双方カレンダー自動登録'] },
          { phase: 'v1.1', status: '1ヶ月後', color: 'bg-blue-500/60', items: ['Apple Calendar（iCal）対応', '候補件数カスタマイズ（1〜5件）', 'LINE通知連携'] },
          { phase: 'v1.2', status: '2ヶ月後', color: 'bg-slate-500/60', items: ['Google Maps場所提案', 'リマインダーカスタマイズ', 'Outlook Calendar対応'] },
          { phase: 'v2.0', status: '3ヶ月後', color: 'bg-slate-500/40', items: ['AIによる最適時間帯学習', 'キャンセル・再調整ワンタップ', '結婚相談所グループ管理機能'] },
        ].map(r => (
          <div key={r.phase} className="bg-[#13141f] border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
              <span className="font-bold text-emerald-400 text-sm">{r.phase}</span>
              <span className="text-xs text-slate-500 border border-white/10 rounded-full px-2 py-0.5">{r.status}</span>
            </div>
            <ul className="space-y-1">
              {r.items.map(item => (
                <li key={item} className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Button onClick={() => setStep('home')} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg">
        ホームに戻る
      </Button>
    </div>
  )

  // ─── HELP ───
  if (step === 'help') return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 max-w-xl mx-auto">
      <Header />
      <h2 className="text-xl font-bold mb-6">ヘルプ・よくある質問</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'どのカレンダーを参照しますか？', a: 'Googleカレンダーの「空き時間」のみを参照します。予定のタイトル・詳細は一切取得しません。' },
          { q: 'Googleアカウントがない場合は？', a: 'v1.0はGoogle Calendar連携が必須です。v1.2でApple Calendar対応予定。それまでは「マニュアルモード」でご利用いただけます。' },
          { q: 'カレンダーに何が書き込まれますか？', a: '「お見合い @調整中」というタイトルで1件登録されます。内容はアプリ内でいつでも変更できます。' },
          { q: '候補が合わなかった場合は？', a: '「別の候補を再提示する」ボタンで何度でも再生成できます。回数制限はありません。' },
          { q: 'キャンセルしたい場合は？', a: 'v1.0ではGoogleカレンダーアプリから直接削除してください。v2.0でワンタップキャンセル機能を実装予定です。' },
        ].map(item => (
          <div key={item.q} className="bg-[#13141f] border border-white/5 rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-2 text-emerald-400">Q. {item.q}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">A. {item.a}</p>
          </div>
        ))}
      </div>
      <Button onClick={() => setStep('home')} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg">
        ホームに戻る
      </Button>
    </div>
  )

  return null
}

// マリッジロードジャパン バナー（婚活系ツール共通）
export function MarriageRoadBanner() {
  return (
    <div className="mt-8 mb-2 flex justify-center px-4">
      <a
        href="https://www.youtube.com/@marriage_road"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#0d1117] border border-emerald-500/40 rounded-xl px-5 py-3 shadow-lg hover:border-emerald-500/70 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all group w-full max-w-sm"
      >
        <span className="text-2xl">💒</span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">結婚相談所をお探しの方へ</p>
          <p className="text-[11px] text-slate-400 mt-0.5">マリッジロードジャパン — 無料相談受付中</p>
        </div>
        <span className="text-slate-500 group-hover:text-emerald-400 transition-colors text-sm">→</span>
      </a>
    </div>
  )
}
