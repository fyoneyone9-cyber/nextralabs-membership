'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Loader2, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Info, 
  ShoppingCart, 
  Wallet, 
  ShieldAlert, 
  BarChart2,
  ExternalLink,
  Copy,
  Users,
  PiggyBank,
  TrendingDown,
  Calendar
} from 'lucide-react'

export default function MoneyGuardApp() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // 入力データ
  const [formData, setFormData] = useState({
    age: '35',
    family: '独身',
    income: '500',
    expense: '25',
    savings: '300',
    event: '特になし',
    target: '老後資金の確保'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generatePrompt = () => {
    setIsLoading(true)
    setTimeout(() => {
      const p = `あなたは日本最高峰のファイナンシャルプランナー兼リスクアナリストです。
以下の私の家計データに基づき、精密な「30年間の家計防衛シミュレーション」を行ってください。

【私のデータ】
・現在の年齢：${formData.age}歳
・家族構成：${formData.family}
・世帯年収：${formData.income}万円
・月間の平均支出：${formData.expense}万円
・現在の貯金額：${formData.savings}万円
・今後予定しているライフイベント：${formData.event}
・最も解決したい悩み：${formData.target}

【依頼事項】
1. 現在の日本の物価上昇率（年2%）や社会保険料の増加、年金予測を加味して、30年後までの資産残高の推移を予測してください。
2. 私の家計における最大の「脆弱性（リスク）」を特定してください。
3. 今すぐ実行すべき、効果の高い3つの「具体的な防衛策」を提示してください。
4. 最後に、私への「家計防衛格言」を一言添えてください。

回答は論理的かつ説得力のあるトーンで、読みやすく構造化して出力してください。`
      
      setPrompt(p)
      setIsLoading(false)
      setStep(2)
      
      // ログ記録の擬似呼び出し
      fetch('/api/usage/log', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'money-guard', action: 'generate_prompt' }) 
      }).catch(() => {});
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-4xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <ShieldAlert className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI家計防衛シミュレーター</h1>
              <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.3em] mt-1 italic">Financial Defense Intelligence System</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">MASTERMODEL v7.0</Badge>
        </div>

        {step === 1 ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Guide */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Info size={20} /> 
                <h3 className="font-black italic uppercase text-sm">システム概要</h3>
              </div>
              <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
                あなたの現在の家計データを入力してください。外部の最強AI「Gemini」に渡すための、精密な解析用プロンプトを生成します。
              </p>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                  <Users size={12} /> 現在の年齢 (歳)
                </label>
                <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                  <Users size={12} /> 家族構成
                </label>
                <select name="family" value={formData.family} onChange={handleInputChange} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all appearance-none">
                  <option>独身</option>
                  <option>夫婦のみ</option>
                  <option>夫婦＋子1人</option>
                  <option>夫婦＋子2人以上</option>
                  <option>その他</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                  <TrendingUp size={12} /> 世帯年収 (万円/年)
                </label>
                <input name="income" type="number" value={formData.income} onChange={handleInputChange} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                  <TrendingDown size={12} /> 平均支出 (万円/月)
                </label>
                <input name="expense" type="number" value={formData.expense} onChange={handleInputChange} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                  <PiggyBank size={12} /> 現在の貯金額 (万円)
                </label>
                <input name="savings" type="number" value={formData.savings} onChange={handleInputChange} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                  <Calendar size={12} /> 予定しているライフイベント
                </label>
                <input name="event" type="text" value={formData.event} onChange={handleInputChange} placeholder="結婚、住宅購入、子供の進学など" className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                <Zap size={12} /> 最も解決したい悩み
              </label>
              <input name="target" type="text" value={formData.target} onChange={handleInputChange} className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 text-lg font-bold text-white outline-none focus:border-emerald-500 transition-all" />
            </div>

            <Button onClick={generatePrompt} disabled={isLoading} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] uppercase italic transition-all active:scale-95">
              {isLoading ? <Loader2 className="animate-spin h-10 w-10" /> : '家計防衛プロンプトを生成 ➔'}
            </Button>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
            {/* Result Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-500/20 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">解析プロンプト生成完了</h2>
              <p className="text-slate-400 text-sm font-bold italic">以下の内容をコピーして、外部のGeminiに貼り付けてください。</p>
            </div>

            {/* Prompt Preview Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black border border-white/10 rounded-[2rem] p-8 space-y-6 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Zap size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Optimized Prompt</span>
                  </div>
                  <button onClick={copyToClipboard} className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 transition-all">
                    {copySuccess ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    <span className="text-[10px] font-black uppercase">{copySuccess ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-4 text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap font-mono custom-scrollbar">
                  {prompt}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-6">
              <Button onClick={() => setStep(1)} variant="outline" className="h-20 border-2 border-white/10 bg-transparent hover:bg-white/5 text-white font-black text-lg rounded-2xl uppercase italic">
                入力し直す
              </Button>
              <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-xl uppercase italic flex items-center justify-center gap-3">
                  Geminiを開く <ExternalLink size={24} />
                </Button>
              </a>
            </div>

            {/* Steps Guide */}
            <div className="bg-[#13141f] border border-white/5 rounded-3xl p-10 space-y-8">
              <h3 className="text-lg font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">解析の手順</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'STEP 01', desc: 'プロンプトをコピーする', icon: Copy },
                  { title: 'STEP 02', desc: 'Geminiを開き貼り付ける', icon: ExternalLink },
                  { title: 'STEP 03', desc: '防衛策を実行に移す', icon: ShieldAlert }
                ].map((s, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <s.icon size={16} />
                      <span className="text-[10px] font-black">{s.title}</span>
                    </div>
                    <p className="text-xs text-white font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Affiliate Footer */}
        <div className="pt-10 border-t border-emerald-500/20">
          <a href="https://www.amazon.co.jp/s?k=資産運用&tag=nextralabs-22" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black text-white italic">不敗の家計：お金を守り抜く推薦図書 ➔</h3>
                <p className="text-emerald-200/60 text-[10px] font-bold uppercase tracking-widest">Selected Resources for Wealth Defense</p>
              </div>
              <ShoppingCart size={40} className="text-white animate-pulse" />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
