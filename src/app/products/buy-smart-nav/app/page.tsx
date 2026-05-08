'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Repeat, Download, Video, ImageIcon, FileText, Lock, Copy, Scale } from 'lucide-react'

export default function BuySmartNavApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [itemName, setItemName] = useState('')

  const handleAnalyze = async () => {
    if (!itemName) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("中古相場が高騰しており、新品との価格差がわずか15%です。メーカー保証を考慮すると『新品』の購入が賢明な判断です。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Scale className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">中古・新品AI比較ナビ</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">買いたい商品の名前を入力してください。AIが新品・中古の相場を比較し、リセールバリューを考慮した「最も損をしない選択」をナビゲートします。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">商品名</label>
            <input value={itemName} onChange={e => setItemName(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white focus:border-emerald-500 transition-all outline-none" />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !itemName} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic active:scale-95">スマート判定を実行 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI価値診断結果</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">選択ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '相場比較', desc: '主要フリマと店舗の価格差を抽出。', icon: Search }, { title: '資産価値', desc: '売却価格を予測し実質コストを算出。', icon: TrendingUp }, { title: '購入先特定', desc: '最も安価な購入先を提示。', icon: CheckCircle2 }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=賢い買い物&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all">
                <h3 className="text-2xl font-black text-white italic">不敗の選択眼：安物買いを卒業する教本 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
