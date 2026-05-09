'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, Plus, Trash2, Calendar, CheckCircle2, Loader2, RefreshCw,
} from 'lucide-react'

interface ExamConfig {
  id: string
  name: string
  rss: string
  studyWeeks: number
  sessionsPerWeek: number
  sessionHours: number
  examDate: string
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

const PRESET_EXAMS: Omit<ExamConfig, 'id' | 'rssStatus' | 'rssFoundDate'>[] = [
  { name: 'ITパスポート', rss: 'https://www.ipa.go.jp/about/press/rss.rdf', studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1, examDate: '' },
  { name: '基本情報技術者', rss: 'https://www.ipa.go.jp/about/press/rss.rdf', studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 2, examDate: '' },
  { name: '応用情報技術者', rss: 'https://www.ipa.go.jp/about/press/rss.rdf', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2.5, examDate: '' },
  { name: 'CompTIA Security+', rss: 'https://www.comptia.org/rss/news', studyWeeks: 12, sessionsPerWeek: 3, sessionHours: 2, examDate: '' },
  { name: 'AWS ソリューションアーキテクト', rss: 'https://aws.amazon.com/blogs/aws/feed/', studyWeeks: 10, sessionsPerWeek: 3, sessionHours: 2, examDate: '' },
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

  const updateExam = (id: string, field: keyof ExamConfig, value: string | number) => {
    setExams(prev => prev.map(e => (e.id === id ? { ...e, [field]: value, rssStatus: field === 'rss' ? 'idle' : e.rssStatus } : e)))
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
            name: e.name, rss: e.rss,
            studyWeeks: e.studyWeeks, sessionsPerWeek: e.sessionsPerWeek, sessionHours: e.sessionHours,
            examDate: e.examDate || e.rssFoundDate || undefined,
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

  const rssStatusLabel = (status: ExamConfig['rssStatus'], date: string) => {
    if (status === 'checking') return <span className="text-slate-400 text-xs">確認中...</span>
    if (status === 'found') return <span className="text-emerald-400 text-xs font-semibold">✓ 試験日: {date}</span>
    if (status === 'notfound') return <span className="text-emerald-400 text-xs">試験日が見つかりません</span>
    if (status === 'error') return <span className="text-red-400 text-xs">取得エラー</span>
    return null
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
          <p className="text-slate-400 text-sm">試験日RSS自動取得 × AI学習計画 × Googleカレンダー一括登録</p>
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

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* 試験名 */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">試験名</label>
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

                  {/* RSS URL */}
                  <div className="space-y-1.5 text-left sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">試験日RSSで自動取得</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exam.rss}
                        onChange={e => updateExam(exam.id, 'rss', e.target.value)}
                        className="flex-1 h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-xs font-mono text-slate-300 outline-none focus:border-emerald-500 transition-all"
                      />
                      <Button
                        onClick={() => checkRss(exam.id)}
                        variant="ghost"
                        className="h-11 border border-white/10 text-slate-400 hover:bg-white/5 rounded-lg px-4 text-xs font-semibold shrink-0"
                      >
                        <RefreshCw size={13} className={`mr-1.5 ${exam.rssStatus === 'checking' ? 'animate-spin' : ''}`} />
                        確認
                      </Button>
                    </div>
                    {rssStatusLabel(exam.rssStatus, exam.rssFoundDate) && (
                      <div className="mt-1">{rssStatusLabel(exam.rssStatus, exam.rssFoundDate)}</div>
                    )}
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
