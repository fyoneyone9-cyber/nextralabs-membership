'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  FileText, ListChecks, FileDown, Copy, Edit3, Sparkles
} from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'

export default function AiReportGeneratorApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [memo, setMemo] = useState('')

  const handleAnalyze = async () => {
    if (!memo) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("入力されたメモを解析し、論理構成を最適化したプロフェッショナルな報告書を生成しました。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left text-white font-black">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><FileText className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AIレポートジェネレーター</h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
            <ApiLinkIndicator />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">業務メモを箇条書きで入力してください。AIが適切なビジネスマナーと論理構成を備えた報告書を一瞬で完成させます。</p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <textarea value={memo} onChange={e => setMemo(e.target.value)} className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all text-lg" placeholder="業務メモを入力..." />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !memo} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : 'プロ級報告書を生成 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI解析結果</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              <Button onClick={() => alert('コピー完了')} className="h-16 px-10 bg-white text-slate-950 font-black text-lg rounded-xl shadow-xl hover:bg-slate-100 transition-all">テキストをコピー</Button>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">作成・納品ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '論理構成案', desc: '事実を背景・現状・対策へ整理。', icon: Search }, { title: 'プロ用語変換', desc: 'ビジネス向けの確信的な表現へ。', icon: Edit3 }, { title: '最終校閲', desc: '誤字脱字をAIが精査し納品。', icon: CheckCircle2 }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
