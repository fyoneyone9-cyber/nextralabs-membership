// ============================================================
// 🔒 LOCKED — ExamScheduler
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, Plus, Trash2, Calendar, CheckCircle2, Loader2,
} from 'lucide-react'

interface ExamConfig {
  id: string
  name: string
  studyWeeks: number
  sessionsPerWeek: number
  sessionHours: number
  examDate: string
}

interface ResultItem {
  name: string
  status: 'done' | 'skipped'
  examDate?: string
  daysUntil?: number
  registered?: number
  failed?: number
  reason?: string
}

const PRESET_CATEGORIES = [
  {
    label: 'IT・情報処理',
    presets: [
      { name: 'ITパスポート',               studyWeeks: 6,  sessionsPerWeek: 4, sessionHours: 1,   examDate: '' },
      { name: '基本情報技術者',             studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 2,   examDate: '' },
      { name: '応用情報技術者',             studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2.5, examDate: '' },
      { name: '情報処理安全確保支援士',     studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 2.5, examDate: '' },
      { name: 'ネットワークスペシャリスト', studyWeeks: 24, sessionsPerWeek: 4, sessionHours: 2.5, examDate: '' },
      { name: 'データベーススペシャリスト', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 2,   examDate: '' },
      { name: 'CompTIA Security+',          studyWeeks: 12, sessionsPerWeek: 3, sessionHours: 2,   examDate: '' },
      { name: 'AWS SAA',                    studyWeeks: 10, sessionsPerWeek: 3, sessionHours: 2,   examDate: '' },
    ],
  },
  {
    label: 'ビジネス・会計',
    presets: [
      { name: '簿記3級', studyWeeks: 6,  sessionsPerWeek: 4, sessionHours: 1,   examDate: '' },
      { name: '簿記2級', studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1.5, examDate: '' },
      { name: '簿記1級', studyWeeks: 40, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
      { name: 'FP3級',   studyWeeks: 6,  sessionsPerWeek: 4, sessionHours: 1,   examDate: '' },
      { name: 'FP2級',   studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1.5, examDate: '' },
      { name: 'FP1級',   studyWeeks: 30, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
      { name: '中小企業診断士', studyWeeks: 52, sessionsPerWeek: 5, sessionHours: 2, examDate: '' },
    ],
  },
  {
    label: '法律・行政',
    presets: [
      { name: '行政書士',       studyWeeks: 40, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
      { name: '社会保険労務士', studyWeeks: 52, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
      { name: '宅地建物取引士', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 1.5, examDate: '' },
      { name: '司法書士',       studyWeeks: 80, sessionsPerWeek: 6, sessionHours: 3,   examDate: '' },
      { name: '公務員試験（教養）', studyWeeks: 24, sessionsPerWeek: 5, sessionHours: 2, examDate: '' },
    ],
  },
  {
    label: '語学',
    presets: [
      { name: 'TOEIC 600点',   studyWeeks: 8,  sessionsPerWeek: 5, sessionHours: 1,   examDate: '' },
      { name: 'TOEIC 700点',   studyWeeks: 16, sessionsPerWeek: 5, sessionHours: 1.5, examDate: '' },
      { name: 'TOEIC 900点',   studyWeeks: 30, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
      { name: '英検3級',       studyWeeks: 6,  sessionsPerWeek: 4, sessionHours: 1,   examDate: '' },
      { name: '英検2級',       studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1,   examDate: '' },
      { name: '英検準1級',     studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 1.5, examDate: '' },
      { name: '英検1級',       studyWeeks: 40, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
    ],
  },
  {
    label: '医療・福祉',
    presets: [
      { name: '看護師国家試験',   studyWeeks: 20, sessionsPerWeek: 5, sessionHours: 2,   examDate: '' },
      { name: '介護福祉士',       studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 1.5, examDate: '' },
      { name: '薬剤師国家試験',   studyWeeks: 30, sessionsPerWeek: 5, sessionHours: 3,   examDate: '' },
      { name: '医師国家試験',     studyWeeks: 52, sessionsPerWeek: 6, sessionHours: 4,   examDate: '' },
    ],
  },
  {
    label: '技術・工業',
    presets: [
      { name: '電気工事士2種', studyWeeks: 10, sessionsPerWeek: 4, sessionHours: 1,   examDate: '' },
      { name: '電気工事士1種', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 1.5, examDate: '' },
      { name: '危険物取扱者乙4', studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1,  examDate: '' },
      { name: '普通自動車免許（学科）', studyWeeks: 2, sessionsPerWeek: 5, sessionHours: 1, examDate: '' },
    ],
  },
]

const PRESET_EXAMS: Omit<ExamConfig, 'id'>[] = PRESET_CATEGORIES.flatMap(c => c.presets)

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events'

function newExam(preset = PRESET_EXAMS[0]): ExamConfig {
  return { ...preset, id: crypto.randomUUID() }
}

export default function ExamScheduler() {
  const [exams, setExams] = useState<ExamConfig[]>([newExam()])
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [results, setResults] = useState<ResultItem[] | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token) {
      setGoogleToken(token)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleGoogleAuth = useCallback(() => {
    setAuthLoading(true)
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.href.split('?')[0].split('#')[0],
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }, [])

  const updateExam = (id: string, field: keyof ExamConfig, value: string | number) => {
    setExams(prev => prev.map(e => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const handleSubmit = async () => {
    if (!googleToken) return
    setLoading(true)
    try {
      setLoadingStep('AI学習スケジュールを生成中...')
      const res = await fetch('/api/exam-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exams: exams.map(e => ({
            name: e.name,
            studyWeeks: e.studyWeeks, sessionsPerWeek: e.sessionsPerWeek, sessionHours: e.sessionHours,
            examDate: e.examDate || undefined,
          })),
          googleAccessToken: googleToken,
        }),
      })
      const data = await res.json()
      setResults(data.results)
    } catch (e) {
      alert(`エラー: ${String(e)}`)
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-5 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8 pb-32">

        {/* タイトル */}
        <div className="text-center space-y-3 pt-4">
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-4 py-1 text-xs rounded-full">
            学習スケジューラー
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            試験<span className="text-emerald-400">スケジューラー</span>
          </h1>
          <p className="text-slate-400 text-sm">AI学習計画 × Googleカレンダー一括登録</p>
        </div>

        {/* STEP 1: Googleログイン */}
        <Card className={`bg-[#0d0f1a] border-2 transition-all rounded-2xl ${googleToken ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-white/5'}`}>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${googleToken ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
                <Calendar size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-sm">
                  {googleToken ? 'Googleアカウント連携済み' : 'STEP 1：カレンダーを連携'}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {googleToken ? 'カレンダーへの書き込み権限が付与されています' : 'ログインして学習計画を自動登録しましょう'}
                </p>
              </div>
            </div>
            {!googleToken && (
              <Button
                onClick={handleGoogleAuth}
                disabled={authLoading}
                className="h-11 bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 rounded-xl text-sm shrink-0"
              >
                {authLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Googleログイン →
              </Button>
            )}
          </CardContent>
        </Card>

        {/* STEP 2: 試験設定 */}
        <div className="space-y-4">
          {exams.map((exam, idx) => (
            <Card key={exam.id} className="bg-[#0d0f1a] border border-white/5 rounded-2xl shadow-xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white flex items-center gap-2 text-base">
                    <BookOpen size={16} className="text-emerald-400" />
                    試験 #{idx + 1}
                  </h3>
                  {exams.length > 1 && (
                    <button onClick={() => setExams(exams.filter(e => e.id !== exam.id))} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* プリセット選択 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">プリセットから選ぶ（{PRESET_EXAMS.length}種類）</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {PRESET_CATEGORIES.map(cat => (
                      <div key={cat.label}>
                        <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1 px-0.5">{cat.label}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.presets.map(p => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => {
                                setExams(prev => prev.map(e =>
                                  e.id === exam.id ? { ...e, ...p } : e
                                ))
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                exam.name === p.name
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-white'
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* 試験名 */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">試験名（直接編集も可）</label>
                    <input
                      type="text"
                      value={exam.name}
                      onChange={e => updateExam(exam.id, 'name', e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white text-sm font-semibold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* 試験日（手動） */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">試験日（手動入力）</label>
                    <input
                      type="date"
                      value={exam.examDate}
                      onChange={e => updateExam(exam.id, 'examDate', e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white text-sm font-semibold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* 学習期間・時間 */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">学習期間（週）</label>
                    <input
                      type="number"
                      value={exam.studyWeeks}
                      onChange={e => updateExam(exam.id, 'studyWeeks', e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white text-sm font-semibold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">1日あたりの時間（h）</label>
                    <input
                      type="number"
                      value={exam.sessionHours}
                      onChange={e => updateExam(exam.id, 'sessionHours', e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white text-sm font-semibold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* 試験を追加 */}
          <button
            onClick={() => setExams([...exams, newExam()])}
            className="w-full h-14 border-2 border-dashed border-white/10 hover:border-emerald-500/40 text-slate-500 hover:text-emerald-400 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> 試験を追加
          </button>
        </div>

        {/* STEP 3: 実行ボタン */}
        <Button
          onClick={handleSubmit}
          disabled={!googleToken || loading}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-2xl shadow-xl text-lg transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">{loadingStep}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Calendar size={22} />
              スケジュールを生成してGoogleカレンダーに登録
            </div>
          )}
        </Button>

        {/* 結果表示 */}
        {results && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" /> 登録完了
            </h2>
            {results.map(r => (
              <Card key={r.name} className="bg-[#0d0f1a] border border-emerald-500/20 rounded-2xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-sm">{r.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{r.examDate}（残り {r.daysUntil} 日）</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">{r.registered}件</p>
                    <p className="text-slate-600 text-[9px] font-semibold uppercase">カレンダー登録済</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="text-center pt-4">
              <Button
                onClick={() => window.open('https://calendar.google.com', '_blank')}
                variant="ghost"
                className="border border-white/10 text-emerald-400 hover:bg-emerald-500/10 font-semibold px-8 h-12 rounded-xl text-sm"
              >
                Googleカレンダーで確認 →
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
