'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Repeat, Download, Video, ImageIcon, FileText, Lock, Copy, Scale, LineChart, Scissors, Sparkles, Trash2, Pen } from 'lucide-react'

export default function BuzzWriterApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [text, setText] = useState('')

  const handleAnalyze = async () => {
    if (!text) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("文章を解析しました。冒頭にフックを追加し改行位置を調整することで読了率が向上します。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Pen className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AIバズ文章コーチ</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">STANDARD PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">SNSやブログの文章を入力してください。AIが心理トリガーを分析し、数千人の反応を引き出す文章へ添削します。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all text-lg" placeholder="文章を入力..." />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !text} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic active:scale-95">バズり文章へ変換 🚀</Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI解析結果</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              <Button onClick={() => alert('コピーしました')} className="h-16 px-10 bg-white text-slate-950 font-black text-lg rounded-xl shadow-xl hover:bg-slate-100 transition-all italic">結果をコピー</Button>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">バズロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: 'フック強化', desc: '最初の一行を再構築。', icon: Search }, { title: 'リズム調整', desc: '改行位置を最適化。', icon: Sparkles }, { title: '拡散戦術', desc: '最適な投稿時間をアドバイス。', icon: TrendingUp }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=コピーライティング&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-orange-600 to-red-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all">
                <h3 className="text-2xl font-black text-white italic">不敗の筆致：一文字で人を動かす極意 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
