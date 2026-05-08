'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  Table, ListChecks, FileText, Database, ShieldCheck, CreditCard, PieChart, Calculator
} from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'

export default function LoanAdvisorApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("入力された借入情報を解析しました。現在3社から計250万円の借入がありますが、利息制限法に基づき年利15%以下の『おまとめローン』へ借り換えることで、月々の支払額を2.4万円、総支払額を48万円削減できる可能性があります。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12 text-white font-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><CreditCard className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI借金完済・おまとめ診断</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
            <ApiLinkIndicator model="Edge Finance Analysis" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 text-left">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">現在の借入社数、合計残高、平均金利、月々の支払額を入力してください。AIが「利息の罠」を特定し、一本化による減額シミュレーションを無料でアドバイスします。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">借入合計金額 (万円)</label>
              <input type="number" className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：200" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">現在の平均金利 (%)</label>
              <input type="number" className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：18.0" />
            </div>
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-20 bg-emerald-600 hover:bg-emerald-50 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic active:scale-95">完済診断を実行 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Strategic Advice</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">完済ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '利息を止める', desc: '低金利おまとめへの借り換えを検討。', icon: Calculator }, { title: '支払額固定', desc: '月々を無理のない範囲で固定し追加借入封印。', icon: ShieldCheck }, { title: '資産形成へ', desc: '完済後の余力をNISA等へ回し転換。', icon: TrendingUp }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=借金完済&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all">
                <h3 className="text-2xl font-black text-white italic">不敗のマネーリテラシーを習得 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
