'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  LogIn,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
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
  failedDetails?: { error: string }[]
}

// ─── プリセット ───────────────────────────────────────────
const PRESET_CATEGORIES = [
  {
    label: '🖥️ IT・情報処理',
    exams: [
      { name: 'ITパスポート', studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1 },
      { name: '基本情報技術者', studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '応用情報技術者', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2.5 },
      { name: '情報処理安全確保支援士', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 3 },
      { name: 'ネットワークスペシャリスト', studyWeeks: 24, sessionsPerWeek: 4, sessionHours: 3 },
    ],
  },
  {
    label: '🌐 ベンダー資格',
    exams: [
      { name: 'CompTIA A+', studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1.5 },
      { name: 'CompTIA Network+', studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1.5 },
      { name: 'CompTIA Security+', studyWeeks: 12, sessionsPerWeek: 3, sessionHours: 2 },
      { name: 'AWS Solutions Architect Associate', studyWeeks: 10, sessionsPerWeek: 3, sessionHours: 2 },
      { name: 'AWS Developer Associate', studyWeeks: 10, sessionsPerWeek: 3, sessionHours: 2 },
      { name: 'Google Cloud Associate CE', studyWeeks: 10, sessionsPerWeek: 3, sessionHours: 2 },
      { name: 'Azure AZ-900', studyWeeks: 6, sessionsPerWeek: 3, sessionHours: 1.5 },
      { name: 'Oracle Java SE 17', studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 2 },
      { name: 'Cisco CCNA', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
    ],
  },
  {
    label: '📊 ビジネス・法律',
    exams: [
      { name: 'FP2級', studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1.5 },
      { name: 'FP3級', studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1 },
      { name: '簿記3級', studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1 },
      { name: '簿記2級', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '宅建士', studyWeeks: 20, sessionsPerWeek: 5, sessionHours: 2 },
      { name: '行政書士', studyWeeks: 40, sessionsPerWeek: 5, sessionHours: 3 },
      { name: '社会保険労務士', studyWeeks: 52, sessionsPerWeek: 5, sessionHours: 3 },
      { name: 'ビジネス実務法務3級', studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1 },
    ],
  },
  {
    label: '🔒 セキュリティ',
    exams: [
      { name: 'CISSP', studyWeeks: 24, sessionsPerWeek: 5, sessionHours: 3 },
      { name: 'CISM', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 2.5 },
      { name: 'CEH', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
      { name: 'OSCP', studyWeeks: 24, sessionsPerWeek: 5, sessionHours: 3 },
    ],
  },
  {
    label: '🏥 医療・福祉',
    exams: [
      { name: '介護福祉士', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 2 },
      { name: 'ケアマネジャー', studyWeeks: 24, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '登録販売者', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
    ],
  },
  {
    label: '🚗 生活・技能',
    exams: [
      { name: '普通自動車免許（学科）', studyWeeks: 4, sessionsPerWeek: 5, sessionHours: 1 },
      { name: '危険物取扱者乙4', studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1 },
      { name: '電気工事士2種（筆記）', studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1.5 },
    ],
  },
]

// フラットなプリセットリスト（検索・表示用）
const PRESET_EXAMS = PRESET_CATEGORIES.flatMap(c => c.exams)

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events'

function newExam(): ExamConfig {
  return {
    id: crypto.randomUUID(),
    name: '',
    studyWeeks: 8,
    sessionsPerWeek: 3,
    sessionHours: 1.5,
    examDate: '',
  }
}

export default function ExamScheduler() {
  const [exams, setExams] = useState<ExamConfig[]>([newExam()])
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [results, setResults] = useState<ResultItem[] | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)

  // OAuthトークン取得
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

  const addExam = () => setExams(prev => [...prev, newExam()])
  const removeExam = (id: string) => setExams(prev => prev.filter(e => e.id !== id))

  const updateExam = (id: string, field: keyof ExamConfig, value: string | number) => {
    setExams(prev => prev.map(e => e.id !== id ? e : { ...e, [field]: value }))
  }

  const applyPreset = (id: string, presetName: string) => {
    const preset = PRESET_EXAMS.find(p => p.name === presetName)
    if (preset) {
      setExams(prev => prev.map(e => e.id !== id ? e : {
        ...e,
        name: preset.name,
        studyWeeks: preset.studyWeeks,
        sessionsPerWeek: preset.sessionsPerWeek,
        sessionHours: preset.sessionHours,
      }))
    }
    setOpenCategoryId(null)
  }

  const handleSubmit = async () => {
    if (!googleToken) { alert('先にGoogleアカウントを連携してください'); return }
    if (exams.length === 0) { alert('試験を1つ以上追加してください'); return }

    const missing = exams.find(e => !e.name.trim())
    if (missing) { alert('試験名を入力してください'); return }

    const missingDate = exams.find(e => !e.examDate)
    if (missingDate) {
      alert(`「${missingDate.name}」の試験日を入力してください`)
      return
    }

    setLoading(true)
    setResults(null)

    try {
      setLoadingStep('🤖 AIが学習スケジュールを生成中...')
      await new Promise(r => setTimeout(r, 300))

      const res = await fetch('/api/exam-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exams: exams.map(({ id: _id, ...e }) => ({
            name: e.name,
            rss: '',
            studyWeeks: e.studyWeeks,
            sessionsPerWeek: e.sessionsPerWeek,
            sessionHours: e.sessionHours,
            examDate: e.examDate,
          })),
          googleAccessToken: googleToken,
        }),
      })

      setLoadingStep('📅 Googleカレンダーに登録中...')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.results)
    } catch (e) {
      alert(`エラー: ${String(e)}`)
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  const canSubmit = googleToken && !loading && exams.length > 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">資格試験 AIスケジューラー</h1>
          <p className="text-muted-foreground text-sm">
            試験名と試験日を入力するだけ → AIが学習計画を生成 → Googleカレンダーに自動登録
          </p>
        </div>

        {/* STEP 1: Google Auth */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${googleToken ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>1</div>
            <span className="font-semibold text-sm">Googleカレンダーと連携</span>
          </div>
          <Card className={googleToken ? 'border-green-500/50 bg-green-500/5' : 'border-primary/30'}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {googleToken
                  ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                  : <LogIn className="w-5 h-5 text-muted-foreground" />
                }
                <div>
                  <div className="font-medium text-sm">
                    {googleToken ? '✅ 連携済み — カレンダーへの登録が可能です' : 'Googleアカウントでログインしてください'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {googleToken ? 'このセッション中のみ有効（サーバー保存なし）' : 'カレンダーへの書き込み権限のみ取得します'}
                  </div>
                </div>
              </div>
              {!googleToken && (
                <Button variant="outline" size="sm" onClick={handleGoogleAuth} disabled={authLoading}>
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Googleでログイン
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* STEP 2: Exam List */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">2</div>
            <span className="font-semibold text-sm">試験を設定する</span>
          </div>

          <div className="space-y-4">
            {exams.map((exam, idx) => (
              <Card key={exam.id} className="border-border">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">試験 {idx + 1}</CardTitle>
                    {exams.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeExam(exam.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">

                  {/* プリセット（カテゴリ別アコーディオン） */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">プリセットから選ぶ</label>
                    <div className="space-y-1">
                      {PRESET_CATEGORIES.map(cat => {
                        const catKey = `${exam.id}-${cat.label}`
                        const isOpen = openCategoryId === catKey
                        return (
                          <div key={cat.label} className="border border-border rounded-lg overflow-hidden">
                            <button
                              type="button"
                              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors"
                              onClick={() => setOpenCategoryId(isOpen ? null : catKey)}
                            >
                              <span>{cat.label}</span>
                              {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            {isOpen && (
                              <div className="px-3 pb-3 pt-1 flex flex-wrap gap-1.5 border-t border-border bg-muted/20">
                                {cat.exams.map(p => (
                                  <button
                                    key={p.name}
                                    type="button"
                                    onClick={() => applyPreset(exam.id, p.name)}
                                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${exam.name === p.name ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                                  >
                                    {p.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 試験名 */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      試験名 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={exam.name}
                      onChange={e => updateExam(exam.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="例: 基本情報技術者 / AWS Solutions Architect …"
                    />
                  </div>

                  {/* 試験日（手動入力） */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      試験日 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      value={exam.examDate}
                      onChange={e => updateExam(exam.id, 'examDate', e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!exam.examDate ? 'border-amber-400/60' : 'border-border'}`}
                    />
                    {!exam.examDate && (
                      <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        試験日を入力してください
                      </p>
                    )}
                  </div>

                  {/* 詳細設定（折りたたみ） */}
                  <div>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                    >
                      {expandedId === exam.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      学習ペースの詳細設定
                    </button>
                    {expandedId === exam.id && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { label: '何週間前から開始', field: 'studyWeeks' as const, min: 1, max: 52, step: 1 },
                          { label: '週の学習回数', field: 'sessionsPerWeek' as const, min: 1, max: 7, step: 1 },
                          { label: '1回の時間（h）', field: 'sessionHours' as const, min: 0.5, max: 8, step: 0.5 },
                        ].map(({ label, field, min, max, step }) => (
                          <div key={field}>
                            <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                            <input
                              type="number"
                              min={min} max={max} step={step}
                              value={exam[field] as number}
                              onChange={e => updateExam(exam.id, field, field === 'sessionHours' ? parseFloat(e.target.value) : parseInt(e.target.value))}
                              className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* サマリー */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />{exam.studyWeeks}週間前から開始</Badge>
                    <Badge variant="secondary" className="text-xs">週{exam.sessionsPerWeek}回 × {exam.sessionHours}h</Badge>
                    <Badge variant="secondary" className="text-xs">合計 約{Math.round(exam.studyWeeks * exam.sessionsPerWeek * exam.sessionHours)}h</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={addExam}>
              <Plus className="w-4 h-4 mr-2" />試験を追加
            </Button>
          </div>
        </div>

        {/* STEP 3: 実行 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${canSubmit ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
            <span className="font-semibold text-sm">スケジュールを生成してカレンダーに登録</span>
          </div>

          {!googleToken && (
            <div className="mb-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              ステップ1でGoogleにログインしてください
            </div>
          )}

          <Button className="w-full h-14 text-base" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{loadingStep || 'スケジュール生成中...'}</>
            ) : (
              <><Calendar className="w-5 h-5 mr-2" />スケジュールを生成してカレンダーに登録</>
            )}
          </Button>

          <div className="mt-2 space-y-1 text-xs text-muted-foreground px-1">
            <p>⚠️ AI（Gemini Flash）で学習計画を生成します（無料枠内）</p>
            <p>🔒 Googleトークンはこのセッション中のみ使用し、サーバーには保存しません</p>
          </div>
        </div>

        {/* 結果 */}
        {results && (
          <div className="space-y-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />実行結果
            </h2>
            {results.map(r => (
              <Card key={r.name} className={r.status === 'done' ? 'border-green-500/40 bg-green-500/5' : 'border-yellow-500/40 bg-yellow-500/5'}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {r.status === 'done'
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        : <XCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                      }
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        {r.status === 'done'
                          ? <div className="text-sm text-muted-foreground">試験日: {r.examDate}（あと{r.daysUntil}日）</div>
                          : <div className="text-sm text-yellow-600 dark:text-yellow-400">{r.reason}</div>
                        }
                        {r.status === 'done' && (r.failed ?? 0) > 0 && r.failedDetails?.[0] && (
                          <div className="text-xs text-red-500 mt-1">⚠️ エラー: {r.failedDetails[0].error}</div>
                        )}
                      </div>
                    </div>
                    {r.status === 'done' && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{r.registered}件登録</div>
                        {(r.failed ?? 0) > 0 && <div className="text-xs text-destructive">{r.failed}件失敗</div>}
                      </div>
                    )}
                  </div>
                  {r.status === 'done' && (r.registered ?? 0) > 0 && (
                    <a
                      href={`https://calendar.google.com/calendar/r/search?q=${encodeURIComponent(r.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 hover:underline"
                    >
                      <Calendar className="w-4 h-4" />
                      Googleカレンダーで確認する →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
            <p className="text-sm text-center text-muted-foreground">
              Googleカレンダーを開いて確認してください 📅
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
