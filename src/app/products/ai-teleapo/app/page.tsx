'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, FileText, ClipboardList, Plus, Trash2, Copy, Check, Loader2, AlertCircle } from 'lucide-react'

// 隨渉隨渉 Types 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
type Tab = 'script' | 'estimate' | 'record'

interface EstimateItem {
  name: string
  price: number
}

interface CallRecord {
  id: string
  date: string
  company: string
  contact: string
  result: string
  memo: string
  nextCall: string
}

// 隨渉隨渉 Helper 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
function Spinner() {
  return <Loader2 className="animate-spin h-5 w-5" />
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  )
}

// 隨渉隨渉 Main Component 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
export default function AiTeleapoApp() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('script')

  // Auth check
  useEffect(() => {
    fetch('/api/check-access')
      .then(r => r.json())
      .then(d => {
        if (!d.ok) router.push('/login')
      })
      .catch(() => router.push('/login'))
  }, [router])

  // 隨渉隨渉 Tab 1: Script 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
  const [scriptForm, setScriptForm] = useState({
    companyName: '',
    contactName: '',
    industry: 'IT',
    product: '',
    scene: '初回アポ',
    budget: '〜10万〜',
  })
  const [scriptResult, setScriptResult] = useState('')
  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptError, setScriptError] = useState('')
  const [scriptCopied, setScriptCopied] = useState(false)

  const generateScript = async () => {
    setScriptLoading(true)
    setScriptError('')
    setScriptResult('')
    try {
      const res = await fetch('/api/tools/ai-teleapo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'script', ...scriptForm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました)
      setScriptResult(data.script)
    } catch (e: unknown) {
      setScriptError(e instanceof Error ? e.message : 'エラーが発生しました)
    } finally {
      setScriptLoading(false)
    }
  }

  const copyScript = async () => {
    await navigator.clipboard.writeText(scriptResult)
    setScriptCopied(true)
    setTimeout(() => setScriptCopied(false), 2000)
  }

  const useScriptForEstimate = () => {
    setEstimateForm(prev => ({ ...prev, companyName: scriptForm.companyName, serviceName: scriptForm.product }))
    setActiveTab('estimate')
  }

  // 隨渉隨渉 Tab 2: Estimate 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
  const [estimateForm, setEstimateForm] = useState({
    companyName: '',
    serviceName: '',
    notes: '',
  })
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([{ name: '', price: 0 }])
  const [estimateResult, setEstimateResult] = useState<{ estimate: string; items: EstimateItem[]; total: number; companyName: string; serviceName: string } | null>(null)
  const [estimateLoading, setEstimateLoading] = useState(false)
  const [estimateError, setEstimateError] = useState('')
  const [estimateCopied, setEstimateCopied] = useState(false)

  const addItem = () => setEstimateItems(prev => [...prev, { name: '', price: 0 }])
  const removeItem = (i: number) => setEstimateItems(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof EstimateItem, value: string | number) => {
    setEstimateItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: field === 'price' ? Number(value) : value } : item))
  }

  const generateEstimate = async () => {
    setEstimateLoading(true)
    setEstimateError('')
    setEstimateResult(null)
    try {
      const res = await fetch('/api/tools/ai-teleapo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'estimate', ...estimateForm, items: estimateItems }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました)
      setEstimateResult(data)
    } catch (e: unknown) {
      setEstimateError(e instanceof Error ? e.message : 'エラーが発生しました)
    } finally {
      setEstimateLoading(false)
    }
  }

  const copyEstimate = async () => {
    if (!estimateResult) return
    const text = `邵ｲ蜊・ｦ迢暦ｽｩ髦ｪ・らｹｧ鄙ｫﾂ繝ｻ{estimateResult.companyName} 陟包ｽ｡闕ｳ・ｭ\n郢ｧ・ｵ郢晢ｽｼ郢晁侭縺・ ${estimateResult.serviceName}\n\n${estimateResult.items.map(i => `${i.name}: ・ゑｽ･${i.price.toLocaleString()}`).join('\n')}\n\n陷ｷ驛・ｽｨ繝ｻ ・ゑｽ･${estimateResult.total.toLocaleString()}\n\n${estimateResult.estimate}`
    await navigator.clipboard.writeText(text)
    setEstimateCopied(true)
    setTimeout(() => setEstimateCopied(false), 2000)
  }

  // 隨渉隨渉 Tab 3: Records 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
  const SESSION_KEY = 'ai-teleapo-records'
  const [recordForm, setRecordForm] = useState({
    company: '',
    contact: '',
    result: 'アポ取れた★',
    memo: '',
    nextCall: '',
  })
  const [records, setRecords] = useState<CallRecord[]>([])
  const [adviceResult, setAdviceResult] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [adviceError, setAdviceError] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) setRecords(JSON.parse(saved))
  }, [])

  const saveRecords = (newRecords: CallRecord[]) => {
    setRecords(newRecords)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newRecords))
  }

  const addRecord = () => {
    const newRecord: CallRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ja-JP'),
      company: recordForm.company,
      contact: recordForm.contact,
      result: recordForm.result,
      memo: recordForm.memo,
      nextCall: recordForm.nextCall,
    }
    saveRecords([newRecord, ...records])
    setRecordForm({ company: '', contact: '', result: 'アポ取れた★', memo: '', nextCall: '' })
  }

  const deleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id))
  }

  const getAdvice = async () => {
    if (records.length === 0) return
    setAdviceLoading(true)
    setAdviceError('')
    setAdviceResult('')
    try {
      const res = await fetch('/api/tools/ai-teleapo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'advice', records }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました)
      setAdviceResult(data.advice)
    } catch (e: unknown) {
      setAdviceError(e instanceof Error ? e.message : 'エラーが発生しました)
    } finally {
      setAdviceLoading(false)
    }
  }

  // 隨渉隨渉 Shared styles 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉
  const inputClass = 'w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors text-sm'
  const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5'
  const cardClass = 'bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6'
  const btnPrimary = 'flex items-center justify-center gap-2 h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm'

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
            <Phone className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold tracking-tight">雎慕ｩゑｽｺ・ｺ陜滂ｽｶ隶鯉ｽｭAI郢ｧ・｢郢ｧ・ｷ郢ｧ・ｹ郢ｧ・ｿ郢晢ｽｳ郢昴・/span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">AI郢昴・ﾎ樒ｹｧ・｢郢晄亢・･郢ｧ繝ｻ/h1>
          <p className="text-slate-400 text-sm">隴ｫ・ｶ鬮ｮ・ｻ陷ｿ・ｰ隴幢ｽｬ郢晢ｽｻ髫慕距・ｩ髦ｪ・らｹｧ鄙ｫ繝ｻ髫ｪ蛟ｬ鮖ｸ陋ｻ繝ｻ譴ｵ郢ｧ菴・邵ｺ蠕後＠郢晄亢繝ｻ郢昴・/p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/40">
          {([
            { id: 'script', label: '隴ｫ・ｶ鬮ｮ・ｻ陷ｿ・ｰ隴幢ｽｬ騾墓ｻ薙・', icon: Phone },
            { id: 'estimate', label: '法人見積もり自動生成', icon: FileText },
            { id: 'record', label: '隴ｫ・ｶ鬮ｮ・ｻ髫ｪ蛟ｬ鮖ｸ', icon: ClipboardList },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 隨渉隨渉 Tab 1: Script 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉 */}
        {activeTab === 'script' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-400" /> 隴ｫ・ｶ鬮ｮ・ｻ隲繝ｻ・ｰ・ｱ郢ｧ雋槭・陷峨・
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>闔ｨ螟ゑｽ､・ｾ陷ｷ繝ｻ/label>
                  <input className={inputClass} placeholder="關薙・ 隴ｬ・ｪ陟台ｸ茨ｽｼ螟ゑｽ､・ｾ郢ｧ・ｵ郢晢ｽｳ郢晏干ﾎ・ value={scriptForm.companyName} onChange={e => setScriptForm(p => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>隲｡繝ｻ・ｽ讌｢ﾂ繝ｻ骭・/label>
                  <input className={inputClass} placeholder="關薙・ 騾包ｽｰ闕ｳ・ｭ鬩幢ｽｨ鬮滂ｽｷ" value={scriptForm.contactName} onChange={e => setScriptForm(p => ({ ...p, contactName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>隶鯉ｽｭ驕橸ｽｮ</label>
                  <select className={inputClass} value={scriptForm.industry} onChange={e => setScriptForm(p => ({ ...p, industry: e.target.value }))}>
                    {['IT', '髯ｬ・ｽ鬨ｾ・ｰ隶鯉ｽｭ', '闕ｳ讎願劒騾包ｽ｣', '陝・ｸ橸ｽ｣・ｲ', '陋ｹ・ｻ騾九・, '邵ｺ譏ｴ繝ｻ闔峨・].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>陜繝ｻ謾晉ｹ晢ｽｻ郢ｧ・ｵ郢晢ｽｼ郢晁侭縺幄惺繝ｻ/label>
                  <input className={inputClass} placeholder="關薙・ AI陜滂ｽｶ隶鯉ｽｭ隰ｾ・ｯ隰・ｴ郢ｧ・ｷ郢ｧ・ｹ郢昴・ﾎ・ value={scriptForm.product} onChange={e => setScriptForm(p => ({ ...p, product: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>隴ｫ・ｶ鬮ｮ・ｻ郢ｧ・ｷ郢晢ｽｼ郢晢ｽｳ</label>
                  <select className={inputClass} value={scriptForm.scene} onChange={e => setScriptForm(p => ({ ...p, scene: e.target.value }))}>
                    {['初回アポ', 'フォローアップ', 'クロージング', '新規開拓用'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>闔閧ｲ・ｮ邇ｲ笏</label>
                  <select className={inputClass} value={scriptForm.budget} onChange={e => setScriptForm(p => ({ ...p, budget: e.target.value }))}>
                    {['〜10万〜', '〜10万〜', '邵ｲ繝ｻ00闕ｳ繝ｻ, '100闕ｳ繝ｻ・ｻ・･闕ｳ繝ｻ].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <button className={`${btnPrimary} w-full mt-6`} onClick={generateScript} disabled={scriptLoading || !scriptForm.companyName || !scriptForm.product}>
                {scriptLoading ? <><Spinner /> 陷ｿ・ｰ隴幢ｽｬ郢ｧ蝣､蜃ｽ隰瑚揄・ｸ・ｭ...</> : <><Phone className="h-4 w-4" /> 隴ｫ・ｶ鬮ｮ・ｻ陷ｿ・ｰ隴幢ｽｬ郢ｧ蝣､蜃ｽ隰瑚・笘・ｹｧ繝ｻ/>}
              </button>
            </div>

            {scriptError && <ErrorAlert message={scriptError} />}

            {scriptResult && (
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">騾墓ｻ薙・邵ｺ霈費ｽ檎ｸｺ貊捺･秘ｫｮ・ｻ陷ｿ・ｰ隴幢ｽｬ</h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-xs font-medium text-slate-300 transition-all" onClick={copyScript}>
                      {scriptCopied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> 郢ｧ・ｳ郢晄鱒繝ｻ雋ょ現竏ｩ</> : <><Copy className="h-3.5 w-3.5" /> 郢ｧ・ｳ郢晄鱒繝ｻ</>}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-xs font-medium text-white transition-all" onClick={useScriptForEstimate}>
                      <FileText className="h-3.5 w-3.5" /> 邵ｺ阮吶・陷ｿ・ｰ隴幢ｽｬ邵ｺ・ｧ髫慕距・ｩ髦ｪ・らｹｧ鄙ｫ・定抄諛奇ｽ・
                    </button>
                  </div>
                </div>
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-5 max-h-[600px] overflow-y-auto border border-slate-700/30">{scriptResult}</pre>
              </div>
            )}
          </div>
        )}

        {/* 隨渉隨渉 Tab 2: Estimate 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉 */}
        {activeTab === 'estimate' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" /> 髫慕距・ｩ髦ｪ・らｹｧ鬆代Η陜｣・ｱ郢ｧ雋槭・陷峨・
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>闔ｨ螟ゑｽ､・ｾ陷ｷ繝ｻ/label>
                  <input className={inputClass} placeholder="關薙・ 隴ｬ・ｪ陟台ｸ茨ｽｼ螟ゑｽ､・ｾ郢ｧ・ｵ郢晢ｽｳ郢晏干ﾎ・ value={estimateForm.companyName} onChange={e => setEstimateForm(p => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>郢ｧ・ｵ郢晢ｽｼ郢晁侭縺幄惺繝ｻ/label>
                  <input className={inputClass} placeholder="關薙・ AI陜滂ｽｶ隶鯉ｽｭ隰ｾ・ｯ隰・ｴ郢ｧ・ｷ郢ｧ・ｹ郢昴・ﾎ・陝・ｸｻ繝ｻ隰ｾ・ｯ隰・ｴ" value={estimateForm.serviceName} onChange={e => setEstimateForm(p => ({ ...p, serviceName: e.target.value }))} />
                </div>
              </div>

              {/* Items */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass + ' mb-0'}>髮具ｽｻ騾ｶ・ｮ</label>
                  <button onClick={addItem} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 px-2.5 py-1 rounded-lg transition-all">
                    <Plus className="h-3 w-3" /> 髴托ｽｽ陷会｣ｰ
                  </button>
                </div>
                <div className="space-y-2">
                  {estimateItems.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className={inputClass + ' flex-1'} placeholder="鬯・・蟯ｼ陷ｷ謳ｾ・ｼ莠包ｽｾ繝ｻ 陋ｻ譎・ｄ陝・ｸｻ繝ｻ髮具ｽｻ繝ｻ繝ｻ value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-slate-400 text-sm">・ゑｽ･</span>
                        <input type="number" className={inputClass + ' w-32'} placeholder="鬩･鮃ｹ・｡繝ｻ value={item.price || ''} onChange={e => updateItem(i, 'price', e.target.value)} />
                      </div>
                      {estimateItems.length > 1 && (
                        <button onClick={() => removeItem(i)} className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-end text-sm font-bold text-white">
                  陷ｷ驛・ｽｨ繝ｻ ・ゑｽ･{estimateItems.reduce((s, i) => s + i.price, 0).toLocaleString()}
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass}>陋ｯ蜻ｵﾂ繝ｻ繝ｻ隴夲ｽ｡闔会ｽｶ</label>
                <textarea className={inputClass + ' h-20 resize-none'} placeholder="關薙・ 3郢晢ｽｶ隴帑ｺ･・･驢搾ｽｴ繝ｻ繝ｻ雎亥叙諤ｦ髫ｲ蛹ｺ・ｱ繝ｻ value={estimateForm.notes} onChange={e => setEstimateForm(p => ({ ...p, notes: e.target.value }))} />
              </div>

              <button className={`${btnPrimary} w-full`} onClick={generateEstimate} disabled={estimateLoading || !estimateForm.companyName || !estimateForm.serviceName}>
                {estimateLoading ? <><Spinner /> 髫慕距・ｩ髦ｪ・らｹｧ鄙ｫ・帝墓ｻ薙・闕ｳ・ｭ...</> : <><FileText className="h-4 w-4" /> 髫慕距・ｩ髦ｪ・らｹｧ鬆醍ｽｲ隴ｯ蝓滓椢郢ｧ蝣､蜃ｽ隰瑚・笘・ｹｧ繝ｻ/>}
              </button>
            </div>

            {estimateError && <ErrorAlert message={estimateError} />}

            {estimateResult && (
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">髫慕距・ｩ髦ｪ・らｹｧ髮√・陞ｳ・ｹ</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-xs font-medium text-slate-300 transition-all" onClick={copyEstimate}>
                    {estimateCopied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> 郢ｧ・ｳ郢晄鱒繝ｻ雋ょ現竏ｩ</> : <><Copy className="h-3.5 w-3.5" /> 郢ｧ・ｳ郢晄鱒繝ｻ</>}
                  </button>
                </div>
                {/* Table */}
                <div className="mb-5 overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium">鬯・・蟯ｼ陷ｷ繝ｻ/th>
                        <th className="text-right py-2.5 px-3 text-slate-400 font-medium">鬩･鮃ｹ・｡繝ｻ/th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimateResult.items.map((item, i) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          <td className="py-2.5 px-3 text-slate-300">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-300 text-right">・ゑｽ･{item.price.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-blue-500/5">
                        <td className="py-3 px-3 font-bold text-white">陷ｷ驛・ｽｨ繝ｻ/td>
                        <td className="py-3 px-3 font-bold text-cyan-400 text-right text-lg">・ゑｽ･{estimateResult.total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-5 max-h-[500px] overflow-y-auto border border-slate-700/30">{estimateResult.estimate}</pre>
              </div>
            )}
          </div>
        )}

        {/* 隨渉隨渉 Tab 3: Records 隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉隨渉 */}
        {activeTab === 'record' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-emerald-400" /> 隴ｫ・ｶ鬮ｮ・ｻ郢ｧ螳夲ｽｨ蛟ｬ鮖ｸ邵ｺ蜷ｶ・・
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>闔ｨ螟ゑｽ､・ｾ陷ｷ繝ｻ/label>
                  <input className={inputClass} placeholder="關薙・ 隴ｬ・ｪ陟台ｸ茨ｽｼ螟ゑｽ､・ｾ郢ｧ・ｵ郢晢ｽｳ郢晏干ﾎ・ value={recordForm.company} onChange={e => setRecordForm(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>隲｡繝ｻ・ｽ讌｢ﾂ繝ｻ骭・/label>
                  <input className={inputClass} placeholder="關薙・ 騾包ｽｰ闕ｳ・ｭ鬩幢ｽｨ鬮滂ｽｷ" value={recordForm.contact} onChange={e => setRecordForm(p => ({ ...p, contact: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>隴ｫ・ｶ鬮ｮ・ｻ驍ｨ蜈域｣｡</label>
                  <select className={inputClass} value={recordForm.result} onChange={e => setRecordForm(p => ({ ...p, result: e.target.value }))}>
                    {['アポ取れた★', '隰壼･・企恆譁撰ｼ﨟槫芦', '隶諛・ｽｨ諠ｹ・ｸ・ｭ﨟橸ｽ､繝ｻ, 'NG隨ｶ繝ｻ, '闕ｳ讎頑Β﨟樒楜'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>隹ｺ・｡陜玲ｨ頑･秘ｫｮ・ｻ陝ｶ譴ｧ謔崎ｭ鯉ｽ･隴弱・/label>
                  <input type="datetime-local" className={inputClass} value={recordForm.nextCall} onChange={e => setRecordForm(p => ({ ...p, nextCall: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>郢晢ｽ｡郢晢ｽ｢</label>
                  <textarea className={inputClass + ' h-20 resize-none'} placeholder="闔ｨ螟奇ｽｩ・ｱ陷繝ｻ・ｮ・ｹ郢晢ｽｻ雎悟干笆ｼ邵ｺ髦ｪ竊醍ｸｺ・ｩ郢ｧ螳夲ｽｨ蛟ｬ鮖ｸ" value={recordForm.memo} onChange={e => setRecordForm(p => ({ ...p, memo: e.target.value }))} />
                </div>
              </div>
              <button className={`${btnPrimary} w-full mt-6`} onClick={addRecord} disabled={!recordForm.company}>
                <ClipboardList className="h-4 w-4" /> 髫ｪ蛟ｬ鮖ｸ郢ｧ螳夲ｽｿ・ｽ陷会｣ｰ邵ｺ蜷ｶ・・
              </button>
            </div>

            {/* Records table */}
            {records.length > 0 && (
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">隴ｫ・ｶ鬮ｮ・ｻ髫ｪ蛟ｬ鮖ｸ繝ｻ繝ｻrecords.length}闔会ｽｶ繝ｻ繝ｻ/h3>
                  <button className={`${btnPrimary} px-4`} onClick={getAdvice} disabled={adviceLoading}>
                    {adviceLoading ? <><Spinner /> 陋ｻ繝ｻ譴ｵ闕ｳ・ｭ...</> : '✨AIアドバイスを取得'}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium whitespace-nowrap">隴鯉ｽ･隴弱・/th>
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium whitespace-nowrap">闔ｨ螟ゑｽ､・ｾ陷ｷ繝ｻ/th>
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium whitespace-nowrap">驍ｨ蜈域｣｡</th>
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium">郢晢ｽ｡郢晢ｽ｢</th>
                        <th className="py-2.5 px-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(r => (
                        <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-700/20">
                          <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{r.date}</td>
                          <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{r.company}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">{r.result}</td>
                          <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate">{r.memo}</td>
                          <td className="py-2.5 px-3">
                            <button onClick={() => deleteRecord(r.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adviceError && <ErrorAlert message={adviceError} />}

            {adviceResult && (
              <div className={cardClass}>
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  﨟橸ｽ､繝ｻAI郢ｧ・ｳ郢晢ｽｼ郢昶・ﾂｰ郢ｧ蟲ｨ繝ｻ郢ｧ・｢郢晏ｳｨ繝ｰ郢ｧ・､郢ｧ・ｹ
                </h3>
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-5 border border-slate-700/30">{adviceResult}</pre>
              </div>
            )}

            {records.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">邵ｺ・ｾ邵ｺ・ｰ髫ｪ蛟ｬ鮖ｸ邵ｺ蠕娯旺郢ｧ鄙ｫ竏ｪ邵ｺ蟶呻ｽ・/p>
                <p className="text-xs mt-1">隴ｫ・ｶ鬮ｮ・ｻ邵ｺ蜉ｱ笳・ｹｧ闃ｽ・ｨ蛟ｬ鮖ｸ郢ｧ螳夲ｽｿ・ｽ陷会｣ｰ邵ｺ蜉ｱ竏ｪ邵ｺ蜉ｱ・・ｸｺ繝ｻ/p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
