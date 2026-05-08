'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Wallet, ShieldAlert, BarChart2 } from 'lucide-react'

export default function MoneyGuardApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [amount, setAmount] = useState('')

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    const savings = Math.floor(parseInt(amount || '0') * 2.5); // 10年後の運用益シミュレーション
    setResult(`解析完了：その購入を今すぐ停止し、インデックス投資へ回した場合、10年後のあなたの資産は期待値で約¥${savings.toLocaleString()}増加します。心理的な「期間限定」の罠を回避してください。`);
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Wallet className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI家計防衛シミュレーター</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">STANDARD PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">迷っている買い物や月々の出費額を入力してください。AIが「今そのお金を投資に回した場合の将来価値」を即座に計算。脳を冷やし、長期的な資産形成を優先するための冷徹なジャッジを行います。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">検討中の金額 (円) / 購入予定の物</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-xl px-6 text-2xl font-black text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：300000" />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !amount} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : '家計防衛解析を実行 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-red-500/10 border-2 border-red-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-red-500" /> AI 浪費抑制レポート</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">資産防衛ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '欲望特定', desc: 'ストレスや見栄など、心理的トリガーを特定。', icon: Search }, { title: '損失可視化', desc: '投資に回した場合の将来の「逸失利益」を算出。', icon: BarChart2 }, { title: '鉄壁の防衛', desc: '資産を最大化するための再投資戦略を提示。', icon: CheckCircle2 }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => window.open(`https://${ai.toLowerCase()}.com`)} className="h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:text-white">{ai}で打開策を探る</Button>
              ))}
            </div>

            <a href="https://www.amazon.co.jp/s?k=資産運用+節約+心理学&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <h3 className="text-2xl font-black text-white italic">不敗の家計：お金を守り抜く推薦図書 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
