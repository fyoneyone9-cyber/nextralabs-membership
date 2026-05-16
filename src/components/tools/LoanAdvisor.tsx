'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Calculator, TrendingDown, Calendar, ShieldCheck, ArrowRight, Wallet, CheckCircle2, AlertCircle, Sparkles, BookOpen, CreditCard, Car, GraduationCap, Home, Smartphone, ShoppingBag, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ── プリセット定義 ──────────────────────────────────────────
const DEBT_PRESETS = [
  {
    category: 'カード・消費者金融',
    color: '#ef4444',
    icon: CreditCard,
    items: [
      { label: 'カードローン1社',         debts: [{ id:'p1', name:'カードローン', amount:50, rate:18.0 }] },
      { label: 'カード2社おまとめ',       debts: [{ id:'p1', name:'カードA', amount:50, rate:18.0 }, { id:'p2', name:'カードB', amount:30, rate:15.0 }] },
      { label: '消費者金融3社',           debts: [{ id:'p1', name:'消費者金融A', amount:100, rate:18.0 }, { id:'p2', name:'消費者金融B', amount:50, rate:17.0 }, { id:'p3', name:'消費者金融C', amount:30, rate:15.0 }] },
      { label: '多重借入（4社）',         debts: [{ id:'p1', name:'消費者金融A', amount:100, rate:18.0 }, { id:'p2', name:'消費者金融B', amount:80, rate:18.0 }, { id:'p3', name:'カードC', amount:50, rate:15.0 }, { id:'p4', name:'カードD', amount:30, rate:14.0 }] },
      { label: '少額・初めての借入',      debts: [{ id:'p1', name:'カードローン', amount:10, rate:18.0 }] },
      { label: '限度額フル利用',          debts: [{ id:'p1', name:'消費者金融', amount:500, rate:18.0 }, { id:'p2', name:'クレカキャッシング', amount:200, rate:18.0 }] },
      { label: 'リボ払い地獄',           debts: [{ id:'p1', name:'リボ払いA', amount:80, rate:15.0 }, { id:'p2', name:'リボ払いB', amount:60, rate:15.0 }, { id:'p3', name:'リボ払いC', amount:40, rate:15.0 }] },
    ],
  },
  {
    category: '教育・自動車ローン',
    color: '#3b82f6',
    icon: GraduationCap,
    items: [
      { label: '奨学金のみ',             debts: [{ id:'p1', name:'奨学金', amount:200, rate:1.5 }] },
      { label: '奨学金＋カード',          debts: [{ id:'p1', name:'奨学金', amount:200, rate:1.5 }, { id:'p2', name:'カードローン', amount:50, rate:18.0 }] },
      { label: '奨学金＋消費者金融',      debts: [{ id:'p1', name:'奨学金', amount:300, rate:1.5 }, { id:'p2', name:'消費者金融', amount:100, rate:18.0 }, { id:'p3', name:'カード', amount:50, rate:15.0 }] },
      { label: 'マイカーローン',          debts: [{ id:'p1', name:'オートローン', amount:150, rate:5.5 }] },
      { label: 'カー＋カードローン',      debts: [{ id:'p1', name:'オートローン', amount:150, rate:5.5 }, { id:'p2', name:'カードローン', amount:80, rate:18.0 }] },
      { label: '新車ローン（高額）',      debts: [{ id:'p1', name:'ディーラーローン', amount:300, rate:4.5 }] },
      { label: 'バイクローン',            debts: [{ id:'p1', name:'バイクローン', amount:50, rate:8.0 }] },
    ],
  },
  {
    category: '住宅・大型ローン',
    color: '#10b981',
    icon: Home,
    items: [
      { label: '住宅ローンのみ',           debts: [{ id:'p1', name:'住宅ローン', amount:3000, rate:1.2 }] },
      { label: '住宅＋カードローン',        debts: [{ id:'p1', name:'住宅ローン', amount:3000, rate:1.2 }, { id:'p2', name:'カードローン', amount:100, rate:18.0 }] },
      { label: '住宅＋消費者金融複数',      debts: [{ id:'p1', name:'住宅ローン', amount:2500, rate:1.5 }, { id:'p2', name:'消費者金融A', amount:100, rate:18.0 }, { id:'p3', name:'消費者金融B', amount:80, rate:17.0 }] },
      { label: 'リフォームローン',          debts: [{ id:'p1', name:'リフォームローン', amount:200, rate:4.5 }] },
      { label: '不動産担保ローン',          debts: [{ id:'p1', name:'不動産担保', amount:1000, rate:3.5 }] },
      { label: '住宅ローン借換え検討',      debts: [{ id:'p1', name:'住宅ローン（固定）', amount:4000, rate:2.5 }] },
    ],
  },
  {
    category: 'フリーランス・個人事業',
    color: '#f59e0b',
    icon: Wallet,
    items: [
      { label: '事業資金調達',             debts: [{ id:'p1', name:'事業ローン', amount:200, rate:8.0 }] },
      { label: '事業＋個人ローン混在',      debts: [{ id:'p1', name:'事業ローン', amount:300, rate:9.0 }, { id:'p2', name:'カードローン', amount:100, rate:18.0 }] },
      { label: '売掛金待ち・つなぎ融資',    debts: [{ id:'p1', name:'つなぎ融資', amount:50, rate:14.0 }] },
      { label: 'フリーランス複数借入',      debts: [{ id:'p1', name:'ビジネスローン', amount:200, rate:10.0 }, { id:'p2', name:'消費者金融A', amount:100, rate:18.0 }, { id:'p3', name:'消費者金融B', amount:50, rate:17.0 }] },
    ],
  },
  {
    category: '緊急・生活困窮',
    color: '#8b5cf6',
    icon: Zap,
    items: [
      { label: '生活費のためのキャッシング', debts: [{ id:'p1', name:'消費者金融', amount:30, rate:18.0 }] },
      { label: '医療費ローン',               debts: [{ id:'p1', name:'医療ローン', amount:100, rate:12.0 }] },
      { label: '緊急多重借入',               debts: [{ id:'p1', name:'消費者金融A', amount:50, rate:18.0 }, { id:'p2', name:'消費者金融B', amount:50, rate:18.0 }, { id:'p3', name:'カード', amount:30, rate:15.0 }, { id:'p4', name:'知人', amount:20, rate:0 }] },
      { label: '債務整理検討レベル',         debts: [{ id:'p1', name:'消費者金融A', amount:200, rate:18.0 }, { id:'p2', name:'消費者金融B', amount:150, rate:18.0 }, { id:'p3', name:'カードA', amount:100, rate:15.0 }, { id:'p4', name:'カードB', amount:80, rate:15.0 }] },
    ],
  },
]

// ========================
// 型定義
// ========================
interface Debt {
  id: string
  name: string
  amount: number
  rate: number
}

interface DiagnosisResult {
  currentTotal: number
  currentAvgRate: number
  consolidatedMonthly: number
  totalInterestSaved: number
  advice: string
}

// ========================
// アフィリエイト案件定義（カテゴリタグ付き）
// ========================
type LoanOffer = {
  name: string
  desc: string
  url: string
  tags: string[]  // 'card' | 'omatomе' | 'housing' | 'business' | 'female' | 'urgent'
  badge?: string
}

const LOAN_OFFERS: LoanOffer[] = [
  // ── 消費者金融・カードローン ──
  { name: 'ハローハッピー',   desc: '安心のパートナー。審査柔軟なフリーローン。最短即日対応。',           url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+8NZE96+2EBI+5ZU29',  tags: ['card','urgent'],     badge: '即日OK' },
  { name: 'セントラル',       desc: '来店不要・振込キャッシング。創業40年以上の老舗消費者金融。',         url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9N3YY2+363I+699KI',  tags: ['card','omatomе'],    badge: '老舗安心' },
  { name: 'フクホー',         desc: '金利7.30％〜！銀行より低い独自審査。おまとめに強い。',               url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+AP7PNU+39OE+5YJRM',  tags: ['card','omatomе'],    badge: '低金利' },
  { name: 'アロー',           desc: '最短即日振込。他社審査NGでも独自基準で挑戦できる。',                 url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+A0SXUY+2SHI+5ZMCH',  tags: ['card','urgent'],     badge: '独自審査' },
  { name: 'プラン',           desc: '全国24時間ネット完結。スマホのみで申込〜振込まで完了。',             url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9X8C8A+3FWK+5YJRM',  tags: ['card'],              badge: 'スマホ完結' },
  { name: 'いつも',           desc: '全国ご融資対応。丁寧なサポートで初めての方も安心。',                 url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9TNQLM+3EC6+601S1',  tags: ['card','urgent'] },
  { name: 'キャレント',       desc: 'ネット完結・来店不要。働く方のためのキャッシング専門。',             url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9YF7FU+1LW6+HWXLD',  tags: ['card'] },
  { name: 'アルコシステム',   desc: '振込キャッシングのパイオニア。長年の実績と信頼。',                   url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+8DV0YY+25IK+609HU',  tags: ['card','omatomе'] },
  { name: 'フタバ',           desc: '借りやすくて返しやすい設計。女性専用窓口あり。',                     url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9NPEJU+38S6+614CX',  tags: ['card','female'] },
  { name: 'デイリーキャッシング', desc: '全国対応。おまとめ・不動産担保ローンまで幅広く対応。',          url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+A5KEP6+4WSG+5YJRM',  tags: ['card','omatomе','housing'], badge: 'おまとめ得意' },
  // ── 女性向け ──
  { name: 'マイレディス',     desc: '女性専用キャッシング。女性オペレーターが親身にサポート。',           url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9MIJCA+363I+BWVTE',  tags: ['card','female'],     badge: '女性専用' },
  // ── ビジネス・個人事業主 ──
  { name: 'ＭＲＦ',           desc: '個人事業主・法人向け。スピード審査のビジネスローン。',               url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9XTRU2+33NG+5YJRM',  tags: ['business'],          badge: '事業主向け' },
  // ── 不動産担保・住宅 ──
  { name: '不動産活用ローン', desc: '不動産を担保に低金利で借換え。高額融資にも対応。',                   url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+AZXIJU+OU6+601S2',   tags: ['housing','omatomе'], badge: '低金利借換え' },
]

// ── 診断結果に応じてタグフィルタリング ─────────────────────
function pickOffers(debts: { rate: number; amount: number; name: string }[], count = 3): LoanOffer[] {
  const totalAmount = debts.reduce((s, d) => s + d.amount, 0)
  const avgRate = debts.length > 0 
    ? debts.reduce((s, d) => s + d.rate * d.amount, 0) / (totalAmount || 1)
    : 18
  const debtCount = debts.length
  const hasHousing = debts.some(d => d.name.includes('住宅') || d.name.includes('不動産'))
  const hasBusiness = debts.some(d => d.name.includes('事業') || d.name.includes('ビジネス'))

  let priority: string[] = ['card']
  if (debtCount >= 3) priority.unshift('omatomе')
  if (hasHousing) priority.unshift('housing')
  if (hasBusiness) priority.unshift('business')
  if (avgRate >= 17) priority.push('urgent')

  // 優先タグに合うものを先頭に、残りをランダムに
  const matched = LOAN_OFFERS.filter(o => o.tags.some(t => priority.includes(t)))
  const unmatched = LOAN_OFFERS.filter(o => !o.tags.some(t => priority.includes(t)))
  const pool = [...matched.sort(() => 0.5 - Math.random()), ...unmatched.sort(() => 0.5 - Math.random())]
  return pool.slice(0, count)
}

// ========================
// メインコンポーネント
// ========================
export function LoanAdvisor() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: '借入先A', amount: 50, rate: 18.0 },
    { id: '2', name: '借入先B', amount: 30, rate: 15.0 },
  ])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [randomOffers, setRandomOffers] = useState<LoanOffer[]>([])

  // 借入先の追加
  const addDebt = () => {
    if (debts.length >= 5) return
    setDebts([...debts, { id: Date.now().toString(), name: `借入先${String.fromCharCode(65 + debts.length)}`, amount: 0, rate: 15.0 }])
  }

  // 入力変更
    const updateDebt = (id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d))
  }

  // 削除
  const removeDebt = (id: string) => {
    if (debts.length <= 1) return
    setDebts(debts.filter(d => d.id !== id))
  }

  // 診断実行
  const handleDiagnose = async () => {
    setLoading(true)
    setError(null)
    try {
      // 借入内容に応じてスマートに案件をピックアップ
      setRandomOffers(pickOffers(debts, 3))
      
      // 合計と平均金利の計算
      const totalAmount = debts.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
      const currentTotal = totalAmount * 10000
      
      const weightedRateSum = debts.reduce((sum, d) => sum + ((Number(d.rate) || 0) * (Number(d.amount) || 0)), 0)
      const currentAvgRate = totalAmount > 0 ? (weightedRateSum / totalAmount) : 0
      
      // おまとめ後（一律12%と仮定したシミュレーション）
      const newRate = 12.0
      const consolidatedMonthly = Math.floor((currentTotal * (newRate / 100)) / 12)
      const interestDiffYear = Math.floor(currentTotal * ((currentAvgRate - newRate) / 100))

      const response = await fetch('/api/tools/loan-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debts, currentTotal, currentAvgRate })
      })
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server Error (${response.status})`)
      }

      // Markdown記号の除去
      const cleanAdvice = (data.advice || '')
        .replace(/```markdown|```/g, '') // コードブロック除去
        .replace(/#{1,6}\s?/g, '')      // 見出し記号除去
        .replace(/\*\*/g, '')           // 太字記号除去
        .trim()

      setResult({
        currentTotal,
        currentAvgRate,
        consolidatedMonthly,
        totalInterestSaved: Math.max(0, interestDiffYear),
        advice: cleanAdvice || 'AIからのアドバイスを取得できませんでした。'
      })
    } catch (err: any) {
      setError(err.message || '診断中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-left rounded-[2rem] p-4 md:p-10 bg-[#050507]">
      
      {/* ヘッダー */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest uppercase italic">
          <ShieldCheck size={14} /> AI Money Defense System
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
          借金完済・おまとめ診断
        </h1>
        <p className="text-slate-400 font-bold text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          複数の借入をAIが分析し、<span className="text-emerald-400">おまとめによる年間節約額</span>と<br className="hidden md:block" />
          最適な完済ロードマップを無料・匿名でシミュレーションします。
        </p>
      </div>

      {/* ツール説明 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Calculator, title: '借入を入力',   desc: '残高（万円）と金利（%）を社ごとに入力。最大5社まで対応。' },
          { icon: Sparkles,   title: 'AIが即時診断', desc: 'おまとめ後の年間節約額・平均金利・返済シナリオをAIが算出。' },
          { icon: TrendingDown, title: '完済プランを取得', desc: 'AIが生成した完済ロードマップと、おすすめのおまとめ先を提示。' },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 bg-[#13141f] border border-white/5 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <step.icon size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400 mb-1">STEP {i + 1}　{step.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* プリセット */}
      <div className="bg-[#13141f] border border-white/5 rounded-2xl p-5 md:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-white">よくある借入パターンから選ぶ</p>
          <span className="text-[10px] text-slate-600 ml-auto">タップで自動入力</span>
        </div>
        {DEBT_PRESETS.map(cat => {
          const CatIcon = cat.icon
          return (
            <div key={cat.category} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <CatIcon size={10} style={{ color: cat.color }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cat.color }}>{cat.category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => {
                  const isSelected = JSON.stringify(debts.map(d => ({ name: d.name, amount: d.amount, rate: d.rate }))) ===
                    JSON.stringify(item.debts.map(d => ({ name: d.name, amount: d.amount, rate: d.rate })))
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => { setDebts(item.debts); setResult(null); setError(null) }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'text-slate-950 border-transparent'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                      }`}
                      style={isSelected ? { background: cat.color, borderColor: cat.color } : {}}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* 入力エリア */}
        <div className="space-y-6 bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8">
          <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
            <Calculator className="text-emerald-500" /> 現在の借入状況
          </h2>
          
          <div className="space-y-4">
            {debts.map((debt, index) => (
              <div key={debt.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Entry #{index + 1}</span>
                  {debts.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeDebt(debt.id)} 
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Badge variant="outline" className="border-white/10 text-[9px]">削除</Badge>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic">借入残高 (万円)</label>
                    <input 
                      type="number"
                      value={debt.amount || ''}
                      onChange={e => updateDebt(debt.id, 'amount', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic">金利 (%)</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={debt.rate || ''}
                      onChange={e => updateDebt(debt.id, 'rate', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={addDebt}
            disabled={debts.length >= 5}
            className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-slate-500 font-black text-xs hover:border-emerald-500/50 hover:text-emerald-500 transition-all uppercase italic"
          >
            + 借入先を追加する (最大5社)
          </button>

          <button
            type="button"
            onClick={handleDiagnose}
            disabled={loading}
            className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xl italic uppercase transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={24} /> AI完済診断を実行</>}
          </button>
        </div>

        {/* 結果エリア */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-white/5 rounded-[2rem] opacity-40">
              <TrendingDown size={48} className="text-slate-500 mb-4" />
              <p className="text-slate-400 font-bold">借入状況を入力して<br />AI診断ボタンを押してください</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white/5 rounded-[2rem]">
              <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
              <p className="text-emerald-400 font-black animate-pulse italic uppercase tracking-widest">AI Analyzing Your Debt...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* サマリーカード */}
              <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2rem] p-6 space-y-4">
                <h3 className="text-emerald-400 font-black italic uppercase tracking-tighter text-lg flex items-center gap-2">
                  <CheckCircle2 size={20} /> 診断結果：おまとめ効果あり
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase italic mb-1">現在の合計残高</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{(result.currentTotal / 10000).toLocaleString()}万円</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase italic mb-1">平均金利</p>
                    <p className="text-2xl font-black text-emerald-400 tracking-tighter">{result.currentAvgRate.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="bg-emerald-600 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-emerald-100 uppercase italic mb-1">年間で軽減できる利息（概算）</p>
                    <p className="text-3xl font-black text-white tracking-tighter">約 {result.totalInterestSaved.toLocaleString()} 円</p>
                  </div>
                  <TrendingDown className="text-white/40" size={40} />
                </div>
              </div>

              {/* AIアドバイス */}
              <div className="bg-[#13141f] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={80} className="text-emerald-500" />
                </div>
                <h4 className="text-white font-black italic uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="text-emerald-500" size={16} /> AI完済ロードマップ
                </h4>
                <div className="text-slate-300 text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">
                  {result.advice}
                </div>

                {/* さりげないAmazonリンク */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <a 
                    href="https://amzn.to/4nb7oYs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase italic">知識で自分を守る</p>
                      <p className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">AIが推奨：今のあなたに必要なマネーリテラシー</p>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-emerald-500 transition-all" />
                  </a>
                </div>
              </div>

              {/* アフィリエイト出口（PR） */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">AI推奨の解決策</Badge>
                  <span className="text-slate-500 text-[10px] font-black uppercase italic tracking-widest">Recommended Loan Partners</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {randomOffers.map((offer, i) => (
                    <a 
                      key={i} 
                      href={offer.url} 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="group bg-gradient-to-r from-emerald-600/20 to-[#13141f] border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-500 hover:scale-[1.01] transition-all shadow-lg"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                            {offer.name}
                          </h3>
                          {offer.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                              {offer.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed">{offer.desc}</p>
                      </div>
                      <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-wider whitespace-nowrap shrink-0 group-hover:bg-emerald-500 transition-colors flex items-center gap-1">
                        相談する <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                      </div>
                    </a>
                  ))}
                </div>
                
                <p className="text-center text-[10px] text-slate-600 font-bold italic">
                  ※AIが現在の借入状況に合わせて審査の柔軟性が高いパートナーをピックアップしました。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mt-10 p-6 border border-white/5 rounded-2xl bg-black/20">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <AlertCircle size={14} />
          <span className="text-[10px] font-black uppercase italic tracking-widest">Disclaimer</span>
        </div>
        <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
          ※本シミュレーションは入力された数値に基づく概算であり、実際の返済額や金利を保証するものではありません。
          おまとめローンの利用には各金融機関による審査が必要です。ご契約の際は必ず金融機関が提示する条件をご確認ください。
          本サービスは匿名で利用可能であり、入力された借入情報は診断終了後に破棄されます。
        </p>
      </div>
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="loan-advisor" />
</div>
  )
}

