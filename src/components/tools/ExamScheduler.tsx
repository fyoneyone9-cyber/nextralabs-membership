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

// 笏笏笏 繝励Μ繧ｻ繝・ヨ 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const PRESET_CATEGORIES = [
  {
    label: '箕・・IT繝ｻ諠・ｱ蜃ｦ逅・,
    exams: [
      { name: 'IT繝代せ繝昴・繝・, studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1 },
      { name: '蝓ｺ譛ｬ諠・ｱ謚陦楢・, studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '蠢懃畑諠・ｱ謚陦楢・, studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2.5 },
      { name: '諠・ｱ蜃ｦ逅・ｮ牙・遒ｺ菫晄髪謠ｴ螢ｫ', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 3 },
      { name: '繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｹ繝壹す繝｣繝ｪ繧ｹ繝・, studyWeeks: 24, sessionsPerWeek: 4, sessionHours: 3 },
    ],
  },
  {
    label: '倹 繝吶Φ繝繝ｼ雉・ｼ',
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
    label: '投 繝薙ず繝阪せ繝ｻ豕募ｾ・,
    exams: [
      { name: 'FP2邏・, studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1.5 },
      { name: 'FP3邏・, studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1 },
      { name: '邁ｿ險・邏・, studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1 },
      { name: '邁ｿ險・邏・, studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '螳・ｻｺ螢ｫ', studyWeeks: 20, sessionsPerWeek: 5, sessionHours: 2 },
      { name: '陦梧帆譖ｸ螢ｫ', studyWeeks: 40, sessionsPerWeek: 5, sessionHours: 3 },
      { name: '遉ｾ莨壻ｿ晞匱蜉ｴ蜍吝｣ｫ', studyWeeks: 52, sessionsPerWeek: 5, sessionHours: 3 },
      { name: '繝薙ず繝阪せ螳溷漁豕募漁3邏・, studyWeeks: 8, sessionsPerWeek: 3, sessionHours: 1 },
    ],
  },
  {
    label: '白 繧ｻ繧ｭ繝･繝ｪ繝・ぅ',
    exams: [
      { name: 'CISSP', studyWeeks: 24, sessionsPerWeek: 5, sessionHours: 3 },
      { name: 'CISM', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 2.5 },
      { name: 'CEH', studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
      { name: 'OSCP', studyWeeks: 24, sessionsPerWeek: 5, sessionHours: 3 },
    ],
  },
  {
    label: '唱 蛹ｻ逋ゅ・遖冗･・,
    exams: [
      { name: '莉玖ｭｷ遖冗･牙｣ｫ', studyWeeks: 20, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '繧ｱ繧｢繝槭ロ繧ｸ繝｣繝ｼ', studyWeeks: 24, sessionsPerWeek: 4, sessionHours: 2 },
      { name: '逋ｻ骭ｲ雋ｩ螢ｲ閠・, studyWeeks: 16, sessionsPerWeek: 4, sessionHours: 2 },
    ],
  },
  {
    label: '囓 逕滓ｴｻ繝ｻ謚閭ｽ',
    exams: [
      { name: '譎ｮ騾夊・蜍戊ｻ雁・險ｱ・亥ｭｦ遘托ｼ・, studyWeeks: 4, sessionsPerWeek: 5, sessionHours: 1 },
      { name: '蜊ｱ髯ｺ迚ｩ蜿匁桶閠・ｹ・', studyWeeks: 6, sessionsPerWeek: 4, sessionHours: 1 },
      { name: '髮ｻ豌怜ｷ･莠句｣ｫ2遞ｮ・育ｭ・ｨ假ｼ・, studyWeeks: 12, sessionsPerWeek: 4, sessionHours: 1.5 },
    ],
  },
]

// 繝輔Λ繝・ヨ縺ｪ繝励Μ繧ｻ繝・ヨ繝ｪ繧ｹ繝茨ｼ域､懃ｴ｢繝ｻ陦ｨ遉ｺ逕ｨ・・const PRESET_EXAMS = PRESET_CATEGORIES.flatMap(c => c.exams)

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

  // OAuth繝医・繧ｯ繝ｳ蜿門ｾ・  useEffect(() => {
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
    if (!googleToken) { alert('蜈医↓Google繧｢繧ｫ繧ｦ繝ｳ繝医ｒ騾｣謳ｺ縺励※縺上□縺輔＞'); return }
    if (exams.length === 0) { alert('隧ｦ鬨薙ｒ1縺､莉･荳願ｿｽ蜉縺励※縺上□縺輔＞'); return }

    const missing = exams.find(e => !e.name.trim())
    if (missing) { alert('隧ｦ鬨灘錐繧貞・蜉帙＠縺ｦ縺上□縺輔＞'); return }

    const missingDate = exams.find(e => !e.examDate)
    if (missingDate) {
      alert(`縲・{missingDate.name}縲阪・隧ｦ鬨捺律繧貞・蜉帙＠縺ｦ縺上□縺輔＞`)
      return
    }

    setLoading(true)
    setResults(null)

    try {
      setLoadingStep('､・AI縺悟ｭｦ鄙偵せ繧ｱ繧ｸ繝･繝ｼ繝ｫ繧堤函謌蝉ｸｭ...')
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

      setLoadingStep('套 Google繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ逋ｻ骭ｲ荳ｭ...')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.results)
    } catch (e) {
      alert(`繧ｨ繝ｩ繝ｼ: ${String(e)}`)
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
          <h1 className="text-3xl font-bold mb-2">雉・ｼ隧ｦ鬨・AI繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｩ繝ｼ</h1>
          <p className="text-muted-foreground text-sm">
            隧ｦ鬨灘錐縺ｨ隧ｦ鬨捺律繧貞・蜉帙☆繧九□縺・竊・AI縺悟ｭｦ鄙定ｨ育判繧堤函謌・竊・Google繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ閾ｪ蜍慕匳骭ｲ
          </p>
        </div>

        {/* STEP 1: Google Auth */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${googleToken ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>1</div>
            <span className="font-semibold text-sm">Google繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｨ騾｣謳ｺ</span>
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
                    {googleToken ? '笨・騾｣謳ｺ貂医∩ 窶・繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｸ縺ｮ逋ｻ骭ｲ縺悟庄閭ｽ縺ｧ縺・ : 'Google繧｢繧ｫ繧ｦ繝ｳ繝医〒繝ｭ繧ｰ繧､繝ｳ縺励※縺上□縺輔＞'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {googleToken ? '縺薙・繧ｻ繝・す繝ｧ繝ｳ荳ｭ縺ｮ縺ｿ譛牙柑・医し繝ｼ繝舌・菫晏ｭ倥↑縺暦ｼ・ : '繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｸ縺ｮ譖ｸ縺崎ｾｼ縺ｿ讓ｩ髯舌・縺ｿ蜿門ｾ励＠縺ｾ縺・}
                  </div>
                </div>
              </div>
              {!googleToken && (
                <Button variant="outline" size="sm" onClick={handleGoogleAuth} disabled={authLoading}>
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Google縺ｧ繝ｭ繧ｰ繧､繝ｳ
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* STEP 2: Exam List */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">2</div>
            <span className="font-semibold text-sm">隧ｦ鬨薙ｒ險ｭ螳壹☆繧・/span>
          </div>

          <div className="space-y-4">
            {exams.map((exam, idx) => (
              <Card key={exam.id} className="border-border">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">隧ｦ鬨・{idx + 1}</CardTitle>
                    {exams.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeExam(exam.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">

                  {/* 繝励Μ繧ｻ繝・ヨ・医き繝・ざ繝ｪ蛻･繧｢繧ｳ繝ｼ繝・ぅ繧ｪ繝ｳ・・*/}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">繝励Μ繧ｻ繝・ヨ縺九ｉ驕ｸ縺ｶ</label>
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

                  {/* 隧ｦ鬨灘錐 */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      隧ｦ鬨灘錐 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={exam.name}
                      onChange={e => updateExam(exam.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="萓・ 蝓ｺ譛ｬ諠・ｱ謚陦楢・/ AWS Solutions Architect 窶ｦ"
                    />
                  </div>

                  {/* 隧ｦ鬨捺律・域焔蜍募・蜉幢ｼ・*/}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      隧ｦ鬨捺律 <span className="text-destructive">*</span>
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
                        隧ｦ鬨捺律繧貞・蜉帙＠縺ｦ縺上□縺輔＞
                      </p>
                    )}
                  </div>

                  {/* 隧ｳ邏ｰ險ｭ螳夲ｼ域釜繧翫◆縺溘∩・・*/}
                  <div>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                    >
                      {expandedId === exam.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      蟄ｦ鄙偵・繝ｼ繧ｹ縺ｮ隧ｳ邏ｰ險ｭ螳・                    </button>
                    {expandedId === exam.id && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { label: '菴暮ｱ髢灘燕縺九ｉ髢句ｧ・, field: 'studyWeeks' as const, min: 1, max: 52, step: 1 },
                          { label: '騾ｱ縺ｮ蟄ｦ鄙貞屓謨ｰ', field: 'sessionsPerWeek' as const, min: 1, max: 7, step: 1 },
                          { label: '1蝗槭・譎る俣・・・・, field: 'sessionHours' as const, min: 0.5, max: 8, step: 0.5 },
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

                  {/* 繧ｵ繝槭Μ繝ｼ */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />{exam.studyWeeks}騾ｱ髢灘燕縺九ｉ髢句ｧ・/Badge>
                    <Badge variant="secondary" className="text-xs">騾ｱ{exam.sessionsPerWeek}蝗・ﾃ・{exam.sessionHours}h</Badge>
                    <Badge variant="secondary" className="text-xs">蜷郁ｨ・邏кMath.round(exam.studyWeeks * exam.sessionsPerWeek * exam.sessionHours)}h</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={addExam}>
              <Plus className="w-4 h-4 mr-2" />隧ｦ鬨薙ｒ霑ｽ蜉
            </Button>
          </div>
        </div>

        {/* STEP 3: 螳溯｡・*/}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${canSubmit ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
            <span className="font-semibold text-sm">繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ繧堤函謌舌＠縺ｦ繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ逋ｻ骭ｲ</span>
          </div>

          {!googleToken && (
            <div className="mb-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              繧ｹ繝・ャ繝・縺ｧGoogle縺ｫ繝ｭ繧ｰ繧､繝ｳ縺励※縺上□縺輔＞
            </div>
          )}

          <Button className="w-full h-14 text-base" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{loadingStep || '繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ逕滓・荳ｭ...'}</>
            ) : (
              <><Calendar className="w-5 h-5 mr-2" />繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ繧堤函謌舌＠縺ｦ繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ逋ｻ骭ｲ</>
            )}
          </Button>

          <div className="mt-2 space-y-1 text-xs text-muted-foreground px-1">
            <p>笞・・AI・・emini Flash・峨〒蟄ｦ鄙定ｨ育判繧堤函謌舌＠縺ｾ縺呻ｼ育┌譁呎棧蜀・ｼ・/p>
            <p>白 Google繝医・繧ｯ繝ｳ縺ｯ縺薙・繧ｻ繝・す繝ｧ繝ｳ荳ｭ縺ｮ縺ｿ菴ｿ逕ｨ縺励√し繝ｼ繝舌・縺ｫ縺ｯ菫晏ｭ倥＠縺ｾ縺帙ｓ</p>
          </div>
        </div>

        {/* 邨先棡 */}
        {results && (
          <div className="space-y-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />螳溯｡檎ｵ先棡
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
                          ? <div className="text-sm text-muted-foreground">隧ｦ鬨捺律: {r.examDate}・医≠縺ｨ{r.daysUntil}譌･・・/div>
                          : <div className="text-sm text-yellow-600 dark:text-yellow-400">{r.reason}</div>
                        }
                        {r.status === 'done' && (r.failed ?? 0) > 0 && r.failedDetails?.[0] && (
                          <div className="text-xs text-red-500 mt-1">笞・・繧ｨ繝ｩ繝ｼ: {r.failedDetails[0].error}</div>
                        )}
                      </div>
                    </div>
                    {r.status === 'done' && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{r.registered}莉ｶ逋ｻ骭ｲ</div>
                        {(r.failed ?? 0) > 0 && <div className="text-xs text-destructive">{r.failed}莉ｶ螟ｱ謨・/div>}
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
                      Google繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｧ遒ｺ隱阪☆繧・竊・                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
            <p className="text-sm text-center text-muted-foreground">
              Google繧ｫ繝ｬ繝ｳ繝繝ｼ繧帝幕縺・※遒ｺ隱阪＠縺ｦ縺上□縺輔＞ 套
            </p>
          </div>
        )}
      </div>
    
      </div>
  )
}


