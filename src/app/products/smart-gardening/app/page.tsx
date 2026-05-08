'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  Sprout, Droplets, TreePine, Sun, AlertTriangle
} from 'lucide-react'

export default function SmartGardeningApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("葉の先端の変色と現在の気象データから『カリウム不足』と『水やり過多』を検知しました。今後3日間は給水を停止し、速効性のある肥料を適量投与してください。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Sprout className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Smart Gardening AI</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Intelligent Plant Vitality Analysis</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">STANDARD PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            植物の種類と、現在の葉や茎の状態、育てている環境（日当たり等）を入力してください。AIが植物の「心の声」を翻訳し、病気の早期発見や、最も成長を促すための「黄金のケアスケジュール」を自動生成します。
          </p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl p-8 space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Plant Condition / Environment</label>
          <textarea className="w-full h-40 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：パキラ。葉の端が茶色くなってきた。室内で日当たりは普通。" />
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : '植物の声を聴く 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Vitality Report</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap">{result}</div>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Cultivation Roadmap</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '異常特定', desc: '目視では分かりにくい肥料不足や害虫の初期症状をAIが診断。', icon: Search },
                  { step: '02', title: '環境最適化', desc: '現在の配置場所の照度と温度データから、最適な置き場所をリコメンド。', icon: Sun },
                  { step: '03', title: 'ケアプラン', desc: '次の水やり、肥料、剪定のタイミングをカレンダー形式で提示します。', icon: CheckCircle2 },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=観葉植物+肥料+育成ライト&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Cultivation Essentials</p>
                  <h3 className="text-2xl font-black text-white italic leading-tight">命を育む楽しみを。AIが選んだ最高品質の植物ケア用品。</h3>
                </div>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
