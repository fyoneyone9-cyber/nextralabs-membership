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
  Rss,
  AlertCircle,
  Info,
  RefreshCw,
} from 'lucide-react'

interface ExamConfig {
  id: string
  name: string
  rss: string
  studyWeeks: number
  sessionsPerWeek: number
  sessionHours: number
  examDate: string
  // UI用
  rssStatus: 'idle' | 'checking' | 'found' | 'notfound' | 'error'
  rssFoundDate: string
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

// ※ IPA試験（ITパスポート・基本情報・応用情報）はIPAがRSSを廃止済みのため手動入力が必要
const PRESET_EXAMS: Omit<ExamConfig, 'id' | 'rssStatus' | 'rssFoundDate'>[] = [
  { name: 'ITパスポート', rss: '', studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1, examDate: '' },
  { name: '基本情報技術者', rss: '', studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 2, examDate: '' },
  { name: '応用情報技術者', rss: '', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2.5, examDate: '' },
  { name: 'CompTIA Security+', rss: 'https://www.comptia.org/rss/news', studyWeeks: 12, sessionsPerWeek: 3, sessionHours: 2, examDate: '' },
  { name: 'AWS Solutions Architect', rss: 'https://aws.amazon.com/blogs/aws/feed/', studyWeeks: 10, sessionsPerWeek: 3, sessionHours: 2, examDate: '' },
]

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events'

function newExam(preset = PRESET_EXAMS[0]): ExamConfig {
  return { ...preset, id: crypto.randomUUID(), rssStatus: 'idle', rssFoundDate: '' }
}

export default function ExamScheduler() {
  const [exams, setExams] = useState<ExamConfig[]>([newExam()])
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [results, setResults] = useState<ResultItem[] | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

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

  // RSS確認（個別）
  const checkRss = async (examId: string) => {
    const exam = exams.find(e => e.id === examId)
    if (!exam || !exam.rss) return

    setExams(prev => prev.map(e => e.id === examId ? { ...e, rssStatus: 'checking', rssFoundDate: '' } : e))

    try {
      const res = await fetch(`/api/exam-scheduler/check-rss?url=${encodeURIComponent(exam.rss)}`)
      const data = await res.json()
      if (data.date) {
        setExams(prev => prev.map(e => e.id === examId ? { ...e, rssStatus: 'found', rssFoundDate: data.date } : e))
      } else {
        setExams(prev => prev.map(e => e.id === examId ? { ...e, rssStatus: 'notfound' } : e))
      }
    } catch {
      setExams(prev => prev.map(e => e.id === examId ? { ...e, rssStatus: 'error' } : e))
    }
  }

  const addExam = () => setExams(prev => [...prev, newExam()])
  const removeExam = (id: string) => setExams(prev => prev.filter(e => e.id !== id))

  const updateExam = (id: string, field: keyof ExamConfig, value: string | number) => {
    setExams(prev => prev.map(e => {
      if (e.id !== id) return e
      const updated = { ...e, [field]: value }
      // RSS変更時はステータスリセット
      if (field === 'rss') updated.rssStatus = 'idle'
      return updated
    }))
  }

  const applyPreset = (id: string, presetName: string) => {
    const preset = PRESET_EXAMS.find(p => p.name === presetName)
    if (preset) setExams(prev => prev.map(e => e.id === id ? { ...e, ...preset, rssStatus: 'idle', rssFoundDate: '' } : e))
  }

  const handleSubmit = async () => {
    if (!googleToken) { alert('先にGoogleアカウントを連携してください'); return }
    if (exams.length === 0) { alert('試験を1つ以上追加してください'); return }

    // 試験日の確認
    const missingDate = exams.find(e => !e.examDate && e.rssStatus !== 'found')
    if (missingDate) {
      alert(`「${missingDate.name}」の試験日を入力するか、RSS確認ボタンで試験日を取得してください`)
      return
    }

    setLoading(true)
    setResults(null)

    try {
      setLoadingStep('📡 RSSから試験日を取得中...')
      await new Promise(r => setTimeout(r, 500))
      setLoadingStep('🤖 AIが学習スケジュールを生成中...')

      const res = await fetch('/api/exam-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exams: exams.map(({ id: _id, rssStatus: _rs, rssFoundDate: _rf, ...e }) => ({
            name: e.name, rss: e.rss,
            studyWeeks: e.studyWeeks, sessionsPerWeek: e.sessionsPerWeek, sessionHours: e.sessionHours,
            examDate: e.examDate || undefined,
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

  const getRssStatusUI = (exam: ExamConfig) => {
    switch (exam.rssStatus) {
      case 'checking':
        return <span className="flex items-center gap-1 text-xs text-blue-500"><Loader2 className="w-3 h-3 animate-spin" />確認中...</span>
      case 'found':
        return <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle2 className="w-3 h-3" />試験日取得: <strong>{exam.rssFoundDate}</strong></span>
      case 'notfound':
        return <span className="flex items-center gap-1 text-xs text-amber-500"><AlertCircle className="w-3 h-3" />RSSに試験日なし → 手動入力が必要</span>
      case 'error':
        return <span className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3 h-3" />RSS取得失敗 → 手動入力が必要</span>
      default:
        return <span className="flex items-center gap-1 text-xs text-muted-foreground"><Info className="w-3 h-3" />「RSS確認」を押して試験日を自動取得</span>
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
            試験日をRSSから自動取得 → AIが学習計画を生成 → Googleカレンダーに一括登録
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

                  {/* プリセット */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">プリセットから選ぶ</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_EXAMS.map(p => (
                        <button key={p.name} onClick={() => applyPreset(exam.id, p.name)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${exam.name === p.name ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 試験名 */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">試験名 <span className="text-destructive">*</span></label>
                    <input type="text" value={exam.name}
                      onChange={e => updateExam(exam.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="例: 基本情報技術者" />
                  </div>

                  {/* RSS + 確認ボタン */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      RSS URL <span className="text-muted-foreground font-normal">— 試験日を自動取得</span>
                    </label>
                    <div className="flex gap-2">
                      <input type="url" value={exam.rss}
                        onChange={e => updateExam(exam.id, 'rss', e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        placeholder="https://... （ない場合は空欄のまま試験日を手動入力）" />
                      <Button variant="outline" size="sm" className="shrink-0 gap-1.5"
                        onClick={() => checkRss(exam.id)}
                        disabled={exam.rssStatus === 'checking' || !exam.rss}>
                        {exam.rssStatus === 'checking'
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <><Rss className="w-3.5 h-3.5" /><RefreshCw className="w-3 h-3" /></>
                        }
                        RSS確認
                      </Button>
                    </div>
                    {/* RSSステータス表示 */}
                    <div className="mt-1.5 ml-1">
                      {!exam.rss
                        ? <span className="flex items-center gap-1 text-xs text-amber-500"><AlertCircle className="w-3 h-3" />IPA試験はRSS廃止済み → 下の試験日欄に手動入力してください</span>
                        : getRssStatusUI(exam)
                      }
                    </div>
                  </div>

                  {/* 試験日（手動）*/}
                  <div>
                    <label className="text-xs mb-1 block">
                      <span className="text-muted-foreground">試験日（手動入力）</span>
                      {exam.rssStatus === 'notfound' || exam.rssStatus === 'error'
                        ? <span className="text-amber-500 ml-1 font-medium">← RSSで取得できなかったため入力必須</span>
                        : exam.rssStatus === 'found'
                          ? <span className="text-green-500 ml-1">← RSSで取得済み（空欄でOK）</span>
                          : <span className="text-muted-foreground ml-1">← RSS確認後に不要なら空欄でOK</span>
                      }
                    </label>
                    <input type="date" value={exam.examDate}
                      onChange={e => updateExam(exam.id, 'examDate', e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${exam.rssStatus === 'notfound' || exam.rssStatus === 'error' ? 'border-amber-400' : ''}`} />
                  </div>

                  {/* 詳細設定 */}
                  <div>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}>
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
                            <input type="number" min={min} max={max} step={step} value={exam[field] as number}
                              onChange={e => updateExam(exam.id, field, field === 'sessionHours' ? parseFloat(e.target.value) : parseInt(e.target.value))}
                              className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
            <p>📡 RSSで試験日が取得できない場合は手動で試験日を入力してください</p>
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
                <CardContent className="p-4">
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
                        {r.status === 'done' && (r.failed ?? 0) > 0 && (r as any).failedDetails?.[0] && (
                          <div className="text-xs text-red-500 mt-1">⚠️ エラー: {(r as any).failedDetails[0].error}</div>
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
