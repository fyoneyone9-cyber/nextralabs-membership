'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, FileText, ClipboardList, Plus, Trash2, Copy, Check, Loader2, AlertCircle } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Helper ────────────────────────────────────────────────────────────────────
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

// ── Main Component ────────────────────────────────────────────────────────────
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

  // ── Tab 1: Script ─────────────────────────────────────────────────────────
  const [scriptForm, setScriptForm] = useState({
    companyName: '',
    contactName: '',
    industry: 'IT',
    product: '',
    scene: '初回アポ',
    budget: '〜10万',
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
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setScriptResult(data.script)
    } catch (e: unknown) {
      setScriptError(e instanceof Error ? e.message : 'エラーが発生しました')
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

  // ── Tab 2: Estimate ───────────────────────────────────────────────────────
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
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setEstimateResult(data)
    } catch (e: unknown) {
      setEstimateError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setEstimateLoading(false)
    }
  }

  const copyEstimate = async () => {
    if (!estimateResult) return
    const text = `見積書\n宛先: ${estimateResult.companyName} 御中\nサービス: ${estimateResult.serviceName}\n\n${estimateResult.items.map(i => `${i.name}: ¥${i.price.toLocaleString()}`).join('\n')}\n\n合計: ¥${estimateResult.total.toLocaleString()}\n\n${estimateResult.estimate}`
    await navigator.clipboard.writeText(text)
    setEstimateCopied(true)
    setTimeout(() => setEstimateCopied(false), 2000)
  }

  // ── Tab 3: Records ────────────────────────────────────────────────────────
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
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setAdviceResult(data.advice)
    } catch (e: unknown) {
      setAdviceError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setAdviceLoading(false)
    }
  }

  // ── Shared styles ─────────────────────────────────────────────────────────
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
            <span className="text-blue-400 text-xs font-bold tracking-tight">法人営業AI自動化ツール</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">AIテレアポくん</h1>
          <p className="text-slate-400 text-sm">架電台本・法人見積もりをAIがサポート</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/40">
          {([
            { id: 'script', label: '架電台本生成', icon: Phone },
            { id: 'estimate', label: '法人見積もり自動生成', icon: FileText },
            { id: 'record', label: '架電記録', icon: ClipboardList },
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

        {/* ── Tab 1: Script ── */}
        {activeTab === 'script' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-400" /> 架電情報を入力
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>会社名</label>
                  <input className={inputClass} placeholder="例: 株式会社サンプル" value={scriptForm.companyName} onChange={e => setScriptForm(p => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>担当者名</label>
                  <input className={inputClass} placeholder="例: 田中部長" value={scriptForm.contactName} onChange={e => setScriptForm(p => ({ ...p, contactName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>業種</label>
                  <select className={inputClass} value={scriptForm.industry} onChange={e => setScriptForm(p => ({ ...p, industry: e.target.value }))}>
                    {['IT', '製造業', '金融・保険', '不動産', '小売・EC', 'その他'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>商材・サービス名</label>
                  <input className={inputClass} placeholder="例: AI営業支援ツール" value={scriptForm.product} onChange={e => setScriptForm(p => ({ ...p, product: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>架電シーン</label>
                  <select className={inputClass} value={scriptForm.scene} onChange={e => setScriptForm(p => ({ ...p, scene: e.target.value }))}>
                    {['初回アポ', 'フォローアップ', 'クロージング', '新規開拓用'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>想定予算</label>
                  <select className={inputClass} value={scriptForm.budget} onChange={e => setScriptForm(p => ({ ...p, budget: e.target.value }))}>
                    {['〜10万', '10〜50万', '50〜100万', '100万以上'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <button className={`${btnPrimary} w-full mt-6`} onClick={generateScript} disabled={scriptLoading || !scriptForm.companyName || !scriptForm.product}>
                {scriptLoading ? <><Spinner /> 台本を生成中...</> : <><Phone className="h-4 w-4" /> 架電台本を生成する</>}
              </button>
            </div>

            {scriptError && <ErrorAlert message={scriptError} />}

            {scriptResult && (
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">生成された架電台本</h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-xs font-medium text-slate-300 transition-all" onClick={copyScript}>
                      {scriptCopied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> コピー完了</> : <><Copy className="h-3.5 w-3.5" /> コピー</>}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-xs font-medium text-white transition-all" onClick={useScriptForEstimate}>
                      <FileText className="h-3.5 w-3.5" /> この台本で見積もりを作成
                    </button>
                  </div>
                </div>
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-5 max-h-[600px] overflow-y-auto border border-slate-700/30">{scriptResult}</pre>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Estimate ── */}
        {activeTab === 'estimate' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" /> 見積もり情報を入力
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>会社名</label>
                  <input className={inputClass} placeholder="例: 株式会社サンプル" value={estimateForm.companyName} onChange={e => setEstimateForm(p => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>サービス名</label>
                  <input className={inputClass} placeholder="例: AI営業支援ツール・導入支援" value={estimateForm.serviceName} onChange={e => setEstimateForm(p => ({ ...p, serviceName: e.target.value }))} />
                </div>
              </div>

              {/* Items */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass + ' mb-0'}>明細</label>
                  <button onClick={addItem} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 px-2.5 py-1 rounded-lg transition-all">
                    <Plus className="h-3 w-3" /> 追加
                  </button>
                </div>
                <div className="space-y-2">
                  {estimateItems.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className={inputClass + ' flex-1'} placeholder="項目名（例: 初期費用、月額利用料）" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-slate-400 text-sm">¥</span>
                        <input type="number" className={inputClass + ' w-32'} placeholder="金額" value={item.price || ''} onChange={e => updateItem(i, 'price', e.target.value)} />
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
                  合計: ¥{estimateItems.reduce((s, i) => s + i.price, 0).toLocaleString()}
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass}>特記事項・条件</label>
                <textarea className={inputClass + ' h-20 resize-none'} placeholder="例: 3ヶ月の無料トライアル付き" value={estimateForm.notes} onChange={e => setEstimateForm(p => ({ ...p, notes: e.target.value }))} />
              </div>

              <button className={`${btnPrimary} w-full`} onClick={generateEstimate} disabled={estimateLoading || !estimateForm.companyName || !estimateForm.serviceName}>
                {estimateLoading ? <><Spinner /> 見積もりを生成中...</> : <><FileText className="h-4 w-4" /> 見積書コメントを生成する</>}
              </button>
            </div>

            {estimateError && <ErrorAlert message={estimateError} />}

            {estimateResult && (
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">見積もり結果</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-xs font-medium text-slate-300 transition-all" onClick={copyEstimate}>
                    {estimateCopied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> コピー完了</> : <><Copy className="h-3.5 w-3.5" /> コピー</>}
                  </button>
                </div>
                {/* Table */}
                <div className="mb-5 overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium">項目名</th>
                        <th className="text-right py-2.5 px-3 text-slate-400 font-medium">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimateResult.items.map((item, i) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          <td className="py-2.5 px-3 text-slate-300">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-300 text-right">¥{item.price.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-blue-500/5">
                        <td className="py-3 px-3 font-bold text-white">合計</td>
                        <td className="py-3 px-3 font-bold text-cyan-400 text-right text-lg">¥{estimateResult.total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-5 max-h-[500px] overflow-y-auto border border-slate-700/30">{estimateResult.estimate}</pre>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Records ── */}
        {activeTab === 'record' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-emerald-400" /> 架電結果を記録する
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>会社名</label>
                  <input className={inputClass} placeholder="例: 株式会社サンプル" value={recordForm.company} onChange={e => setRecordForm(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>担当者名</label>
                  <input className={inputClass} placeholder="例: 田中部長" value={recordForm.contact} onChange={e => setRecordForm(p => ({ ...p, contact: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>架電結果</label>
                  <select className={inputClass} value={recordForm.result} onChange={e => setRecordForm(p => ({ ...p, result: e.target.value }))}>
                    {['アポ取れた★', '資料送付待ち', '再コール希望', 'NG', '不在・折返し'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>次回架電予定日時</label>
                  <input type="datetime-local" className={inputClass} value={recordForm.nextCall} onChange={e => setRecordForm(p => ({ ...p, nextCall: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>メモ</label>
                  <textarea className={inputClass + ' h-20 resize-none'} placeholder="会話内容のメモ、気になる点を記録" value={recordForm.memo} onChange={e => setRecordForm(p => ({ ...p, memo: e.target.value }))} />
                </div>
              </div>
              <button className={`${btnPrimary} w-full mt-6`} onClick={addRecord} disabled={!recordForm.company}>
                <ClipboardList className="h-4 w-4" /> 記録を追加する
              </button>
            </div>

            {/* Records table */}
            {records.length > 0 && (
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">架電記録（{records.length}件）</h3>
                  <button className={`${btnPrimary} px-4`} onClick={getAdvice} disabled={adviceLoading}>
                    {adviceLoading ? <><Spinner /> 分析中...</> : '✨AIアドバイスを取得'}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium whitespace-nowrap">日時</th>
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium whitespace-nowrap">会社名</th>
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium whitespace-nowrap">結果</th>
                        <th className="text-left py-2.5 px-3 text-slate-400 font-medium">メモ</th>
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
                  ✨ AIからのアドバイス
                </h3>
                <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-5 border border-slate-700/30">{adviceResult}</pre>
              </div>
            )}

            {records.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">まだ記録がありません</p>
                <p className="text-xs mt-1">架電したら結果を記録してください</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
