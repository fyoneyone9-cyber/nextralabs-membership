'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, Plus, Trash2, Calendar, CheckCircle2, XCircle, Loader2, LogIn, ChevronDown, ChevronUp, Clock, Rss, AlertCircle, Info, RefreshCw,
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
      setLoadingStep('🤖 AIが学習スケジュールを生成中...')
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10 pb-40">
        <div className="text-center space-y-4">
          <Badge className="bg-emerald-500 text-white font-black italic tracking-widest px-6 py-2 text-xs uppercase rounded-full shadow-lg">LEARNING OPTIMIZER</Badge>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Exam Scheduler</h1>
          <p className="text-slate-400 font-bold italic">試験日RSS自動取得 × AI学習計画 × Googleカレンダー一括登録</p>
        </div>

        {/* STEP 1: AUTH */}
        <Card className={`bg-slate-900 border-4 transition-all ${googleToken ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-slate-800'}`}>
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl ${googleToken ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-black text-white italic uppercase tracking-tighter">{googleToken ? 'Google Account Connected' : 'Step 1: Connect Calendar'}</p>
                <p className="text-sm text-slate-500 font-bold">{googleToken ? 'カレンダーへの書き込み準備が整いました' : 'ログインして学習計画を自動登録しましょう'}</p>
              </div>
            </div>
            {!googleToken && (
              <Button onClick={handleGoogleAuth} className="h-14 bg-white text-black hover:bg-slate-200 font-black px-10 rounded-2xl text-lg uppercase italic shadow-xl">Google Login ↗</Button>
            )}
          </CardContent>
        </Card>

        {/* STEP 2: CONFIG */}
        <div className="space-y-6">
          {exams.map((exam, idx) => (
            <Card key={exam.id} className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl">
              <div className="space-y-8">
                <div className="flex justify-between items-center"><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3"><BookOpen className="text-emerald-500" /> Exam #{idx + 1}</h3>{exams.length > 1 && <Button variant="ghost" onClick={() => setExams(exams.filter(e => e.id !== exam.id))}><Trash2 className="text-red-500" /></Button>}</div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6 text-left">
                      <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Exam Name</label><input type="text" value={exam.name} onChange={e => updateExam(exam.id, 'name', e.target.value)} className="w-full h-14 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 text-white font-bold focus:border-emerald-500 outline-none shadow-inner" /></div>
                      <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">RSS for Exam Date</label><div className="flex gap-2"><input type="text" value={exam.rss} onChange={e => updateExam(exam.id, 'rss', e.target.value)} className="flex-1 h-12 bg-slate-950 border-2 border-slate-800 rounded-xl px-4 text-xs font-mono" /><Button onClick={() => checkRss(exam.id)} variant="outline" className="h-12 border-slate-800 text-xs font-black uppercase"><RefreshCw className={`w-3 h-3 mr-1 ${exam.rssStatus === 'checking' ? 'animate-spin' : ''}`} /> check</Button></div></div>
                   </div>
                   <div className="space-y-6 text-left">
                      <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Manual Exam Date</label><input type="date" value={exam.examDate} onChange={e => updateExam(exam.id, 'examDate', e.target.value)} className="w-full h-14 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 text-white font-bold" /></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div><label className="text-[10px] font-black text-slate-500 uppercase">Weeks</label><input type="number" value={exam.studyWeeks} onChange={e => updateExam(exam.id, 'studyWeeks', e.target.value)} className="w-full h-12 bg-slate-950 border-2 border-slate-800 rounded-xl px-4" /></div>
                         <div><label className="text-[10px] font-black text-slate-500 uppercase">h/Day</label><input type="number" value={exam.sessionHours} onChange={e => updateExam(exam.id, 'sessionHours', e.target.value)} className="w-full h-12 bg-slate-950 border-2 border-slate-800 rounded-xl px-4" /></div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>
          ))}
          <Button onClick={() => setExams([...exams, newExam()])} variant="outline" className="w-full h-16 border-2 border-dashed border-slate-800 text-slate-500 hover:bg-slate-900 font-black rounded-3xl uppercase italic"><Plus className="mr-2" /> Add Another Exam</Button>
        </div>

        {/* STEP 3: EXECUTE */}
        <Button onClick={handleSubmit} disabled={!googleToken || loading} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center group transition-all">
          {loading ? (
            <div className="flex flex-col items-center"><Loader2 className="animate-spin mb-1" /><p className="text-[10px] uppercase tracking-widest">{loadingStep}</p></div>
          ) : (
            <div className="flex items-center gap-4 text-3xl italic uppercase tracking-tighter"><Calendar className="w-10 h-10 group-hover:scale-110 transition-transform" /> Generate & Sync to Google</div>
          )}
        </Button>

        {results && (
          <div className="space-y-4 animate-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3"><CheckCircle2 className="text-emerald-500" /> Mission Success</h2>
            {results.map(r => (
              <Card key={r.name} className="bg-slate-900 border-2 border-emerald-500/30 p-6 rounded-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center"><Calendar className="text-emerald-500" /></div><div><p className="font-black text-white">{r.name}</p><p className="text-[10px] text-slate-500 uppercase">{r.examDate} ({r.daysUntil} days left)</p></div></div>
                  <div className="text-right"><p className="text-xl font-black text-emerald-500 italic">{r.registered} Events</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Added to Calendar</p></div>
                </div>
              </Card>
            ))}
            <div className="pt-8 text-center"><Button onClick={() => window.open('https://calendar.google.com', '_blank')} variant="outline" className="border-slate-800 text-emerald-500 font-black px-10 h-16 rounded-2xl uppercase italic">Check Google Calendar ↗</Button></div>
          </div>
        )}
      </div>
    </div>
  )
}
