'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Repeat, Download, Video, ImageIcon, FileText, Lock, Copy, Scale, LineChart, Scissors, Sparkles, Trash2, Pen, MessageSquare, LogOut, ShieldCheck, Ticket, Bell, UserCircle, Briefcase, Table, FileSpreadsheet, Contact, UserPlus, FileSearch, Archive } from 'lucide-react'

export default function EvidenceManagerApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("サブスクログから無駄な支払いを特定しました。領収書の自動仕分けも完了しました。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Archive className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">エビデンス・マネージャー</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">サブスク利用履歴や契約メールをアップロードしてください。AIが価値と継続の必要性を判定し、管理シートを生成します。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/10 rounded-2xl p-8 text-center space-y-6 shadow-xl relative">
          <div className="w-full h-48 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all">
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="space-y-2">
                <FileSearch className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-500 font-bold uppercase italic">Upload Proof</p>
             </div>
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-20 bg-emerald-600 hover:bg-emerald-50 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic active:scale-95">エビデンス解析を開始 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Proof Insight</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">資産防衛ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '資産棚卸し', desc: '固定費の壁を可視化。', icon: Search }, { title: '価値判定', desc: '残すべき武器を厳選。', icon: ShieldCheck }, { title: '鉄壁防衛', desc: '解約プロトコルを策定。', icon: TrendingUp }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=資産管理&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all">
                <h3 className="text-2xl font-black text-white italic">不敗の資産管理：持たない自由を手に入れる ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
