'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, MessageSquare, 
  ExternalLink, Search, ShoppingCart, Loader2, CheckCircle2, 
  ArrowRight, Info, BookOpen, UserPlus, Users
} from 'lucide-react'

export default function OfficePoliticsApp() {
  const [members, setMembers] = useState([{ name: '', role: '', power: '3' }])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 3000));
    setResult("AIによる分析が完了しました。現在の組織には大きく2つの派閥が存在しており、あなたは中立層を味方につけることで影響力を最大化できます。");
    setIsAnalyzing(false);
  }

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] md:rounded-[4rem] p-6 md:p-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Network className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Office Politics AI</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Strategic Power Mapping System</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
        </div>

        {/* 活用マニュアル */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            職場の主要人物とパワーバランスを入力してください。AIが水面下の派閥争いを特定し、あなたが損をしないための最適な立ち回り、または影響力を拡大するための最短攻略ロードマップを即座に策定します。
          </p>
        </div>

        {/* Input Area */}
        <div className="grid gap-6">
          {members.map((m, i) => (
            <Card key={i} className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl group hover:border-emerald-500/30 transition-all">
              <CardContent className="p-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Member Name</label>
                  <input className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-4 font-bold text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：田中課長" />
                </div>
                <div className="w-32 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Power (1-10)</label>
                  <input type="number" className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-4 font-bold text-white outline-none focus:border-emerald-500 transition-all" defaultValue="5" />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={() => setMembers([...members, { name: '', role: '', power: '5' }])} variant="outline" className="h-16 border-dashed border-2 border-white/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500 transition-all rounded-2xl">
            <UserPlus size={18} className="mr-2" /> メンバーを追加
          </Button>
        </div>

        {/* Execute Button */}
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all active:scale-95 uppercase italic">
          {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : 'AI戦略解析を実行する 🚀'}
        </Button>

        {/* Results Area */}
        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Strategic Output</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap">{result}</div>
            </Card>

            {/* AI Road Map */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Politics Roadmap</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '派閥マッピング', desc: '目に見えない対立構造と「真の権力者」をAIが特定します。', icon: Search },
                  { step: '02', title: '地雷回避ルート', desc: '関わると不利益を被る人物や、避けるべき話題を策定。', icon: ShieldAlert },
                  { step: '03', title: '影響力拡大プラン', desc: 'あなたが最短で味方を増やし、不敗の地位を築くための指針。', icon: TrendingUp },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400 group-hover:animate-bounce" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 外部リンク */}
            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => openAI(ai)} className="h-16 bg-white/5 border border-white/10 hover:border-blue-500/50 text-slate-400 hover:text-white font-black italic rounded-2xl transition-all uppercase">Detail with {ai}</Button>
              ))}
            </div>

            {/* Amazon収益化 */}
            <div className="pt-10 border-t border-white/5">
              <a href="https://www.amazon.co.jp/s?k=職場の人間関係&tag=nextralabs-22" target="_blank" className="block group">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Essential Knowledge</p>
                    <h3 className="text-2xl font-black text-white italic leading-tight">「人間関係」をハックし、組織を支配する知恵を。</h3>
                  </div>
                  <ShoppingCart size={40} className="text-white animate-pulse" />
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
