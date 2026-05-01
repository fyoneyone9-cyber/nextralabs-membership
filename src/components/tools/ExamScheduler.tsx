'use client'

import { useState, useCallback } from 'react'
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
} from 'lucide-react'

interface ExamConfig {
  id: string
  name: string
  rss: string
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

const PRESET_EXAMS: Omit<ExamConfig, 'id'>[] = [
  {
    name: 'ITパスポート',
    rss: 'https://www.ipa.go.jp/about/press/rss.rdf',
    studyWeeks: 6,
    sessionsPerWeek: 4,
    sessionHours: 1,
    examDate: '',
  },
  {
    name: '基本情報技術者',
    rss: 'https://www.ipa.go.jp/about/press/rss.rdf',
    studyWeeks: 12,
    sessionsPerWeek: 4,
    sessionHours: 2,
    examDate: '',
  },
  {
    name: '応用情報技術者',
    rss: 'https://www.ipa.go.jp/about/press/rss.rdf',
    studyWeeks: 16,
    sessionsPerWeek: 4,
    sessionHours: 2.5,
    examDate: '',
  },
  {
    name: 'CompTIA Security+',
    rss: 'https://www.comptia.org/rss/news',
    studyWeeks: 12,
    sessionsPerWeek: 3,
    sessionHours: 2,
    examDate: '',
  },
  {
    name: 'AWS Solutions Architect',
    rss: 'https://aws.amazon.com/blogs/aws/feed/',
    studyWeeks: 10,
    sessionsPerWeek: 3,
    sessionHours: 2,
    examDate: '',
  },
]

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events'

export default function ExamScheduler() {
  const [exams, setExams] = useState<ExamConfig[]>([
    { ...PRESET_EXAMS[0], id: crypto.randomUUID() },
  ])
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ResultItem[] | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  // Google OAuth
  const handleGoogleAuth = useCallback(() => {
    setAuthLoading(true)
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.href.split('?')[0],
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }, [])

  // ページロード時にURLのhashからtokenを取得
  if (typeof window !== 'undefined') {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token && !googleToken) {
      setGoogleToken(token)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  const addExam = () => {
    setExams((prev) => [...prev, { ...PRESET_EXAMS[0], id: crypto.randomUUID() }])
  }

  const removeExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
  }

  const updateExam = (id: string, field: keyof ExamConfig, value: string | number) => {
    setExams((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  const applyPreset = (id: string, presetName: string) => {
    const preset = PRESET_EXAMS.find((p) => p.name === presetName)
    if (preset) {
      setExams((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...preset } : e))
      )
    }
  }

  const handleSubmit = async () => {
    if (!googleToken) {
      alert('先にGoogleアカウントを連携してください')
      return
    }
    if (exams.length === 0) {
      alert('試験を1つ以上追加してください')
      return
    }
    setLoading(true)
    setResults(null)

    try {
      const res = await fetch('/api/exam-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exams: exams.map(({ id: _id, ...e }) => ({
            name: e.name,
            rss: e.rss,
            studyWeeks: e.studyWeeks,
            sessionsPerWeek: e.sessionsPerWeek,
            sessionHours: e.sessionHours,
            examDate: e.examDate || undefined,
          })),
          googleAccessToken: googleToken,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.results)
    } catch (e) {
      alert(`エラー: ${String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">資格試験 学習スケジューラー</h1>
          <p className="text-muted-foreground">
            試験日をRSSから自動取得 → AIが学習計画を生成 → Googleカレンダーに一括登録
          </p>
        </div>

        {/* Google Auth */}
        <Card className={googleToken ? 'border-green-500/50 bg-green-500/5' : ''}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {googleToken ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <LogIn className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium text-sm">
                  {googleToken ? 'Googleカレンダー 連携済み' : 'Googleカレンダーと連携'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {googleToken ? '学習スケジュールを登録できます' : 'カレンダーへの登録に必要です'}
                </div>
              </div>
            </div>
            {!googleToken && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoogleAuth}
                disabled={authLoading}
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Googleでログイン
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Exam List */}
        <div className="space-y-4">
          {exams.map((exam, idx) => (
            <Card key={exam.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">試験 {idx + 1}</CardTitle>
                  {exams.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeExam(exam.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* プリセット選択 */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">プリセット</label>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_EXAMS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => applyPreset(exam.id, p.name)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                          exam.name === p.name
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 試験名 */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">試験名</label>
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) => updateExam(exam.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="例: 基本情報技術者"
                  />
                </div>

                {/* RSS URL */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    RSS URL（試験日の自動取得）
                  </label>
                  <input
                    type="url"
                    value={exam.rss}
                    onChange={(e) => updateExam(exam.id, 'rss', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    placeholder="https://..."
                  />
                </div>

                {/* 試験日（手動）*/}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    試験日（手動指定・RSSで取得できない場合）
                  </label>
                  <input
                    type="date"
                    value={exam.examDate}
                    onChange={(e) => updateExam(exam.id, 'examDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* 詳細設定 */}
                <div>
                  <button
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                  >
                    {expandedId === exam.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    詳細設定
                  </button>

                  {expandedId === exam.id && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">学習開始（週前）</label>
                        <input
                          type="number"
                          min={1}
                          max={52}
                          value={exam.studyWeeks}
                          onChange={(e) => updateExam(exam.id, 'studyWeeks', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">週の学習回数</label>
                        <input
                          type="number"
                          min={1}
                          max={7}
                          value={exam.sessionsPerWeek}
                          onChange={(e) => updateExam(exam.id, 'sessionsPerWeek', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">1回の時間（h）</label>
                        <input
                          type="number"
                          min={0.5}
                          max={8}
                          step={0.5}
                          value={exam.sessionHours}
                          onChange={(e) => updateExam(exam.id, 'sessionHours', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* サマリーバッジ */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {exam.studyWeeks}週間前から開始
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    週{exam.sessionsPerWeek}回 × {exam.sessionHours}h
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    合計 {Math.round(exam.studyWeeks * exam.sessionsPerWeek * exam.sessionHours)}h
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full" onClick={addExam}>
            <Plus className="w-4 h-4 mr-2" />
            試験を追加
          </Button>
        </div>

        {/* 実行ボタン */}
        <Button
          className="w-full h-12 text-base"
          onClick={handleSubmit}
          disabled={loading || !googleToken}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              スケジュール生成中…
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              スケジュールを生成してカレンダーに登録
            </>
          )}
        </Button>

        {/* 結果 */}
        {results && (
          <div className="space-y-3">
            <h2 className="font-bold text-lg">📋 実行結果</h2>
            {results.map((r) => (
              <Card
                key={r.name}
                className={
                  r.status === 'done'
                    ? 'border-green-500/40 bg-green-500/5'
                    : 'border-yellow-500/40 bg-yellow-500/5'
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {r.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        {r.status === 'done' ? (
                          <div className="text-sm text-muted-foreground">
                            試験日: {r.examDate}（あと{r.daysUntil}日）
                          </div>
                        ) : (
                          <div className="text-sm text-yellow-600 dark:text-yellow-400">
                            {r.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    {r.status === 'done' && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">
                          {r.registered}件登録
                        </div>
                        {r.failed && r.failed > 0 && (
                          <div className="text-xs text-destructive">{r.failed}件失敗</div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            <p className="text-sm text-muted-foreground text-center">
              Googleカレンダーを開いて確認してください 📅
            </p>
          </div>
        )}

        {/* 注意事項 */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
            <p>⚠️ スケジュール生成にはAI（Gemini Flash）を使用します（無料枠内）</p>
            <p>📡 RSSから試験日が取得できない場合は手動で試験日を入力してください</p>
            <p>🔒 Googleトークンはこのセッション中のみ使用し、サーバーには保存しません</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
