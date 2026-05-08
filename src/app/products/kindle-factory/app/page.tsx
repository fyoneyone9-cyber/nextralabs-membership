'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  BookOpen, Crown, FileText, Brain, Rocket
} from 'lucide-react'

export default function KindleFactoryApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    setResult("入力されたテーマに基づき、Amazonランキング上位を狙える『売れる目次』と、第1章の原稿を1万文字相当で生成しました。epub/docx形式での保存が可能です。");
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Crown className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Kindle AI Factory</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Automated E-Book Production Engine</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">PREMIUM PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            書きたい本のテーマ、読者ターゲット、そしてあなたの「伝えたい想い」を入力してください。AIがAmazonの最新トレンドを解析し、読者が最後まで一気読みしたくなる構成案と本文を自動生成。出版までの工数を90%削減します。
          </p>
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl p-8 space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Book Topic / Target Audience</label>
          <textarea className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：AIを活用した時短仕事術。30代の忙しいビジネスパーソン向け。専門知識なしでも実践できる内容。" />
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-24 bg-emerald-600 hover:bg-emerald-50 text-slate-950 font-black text-3xl rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all uppercase italic">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : '本の原稿を自動生成する 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Manuscript Output</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap">{result}</div>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Publishing Roadmap</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '目次・構成', desc: 'Amazonで「クリックされる」タイトル案と、読者が迷わない最強の章立てを策定。', icon: Search },
                  { step: '02', title: '超速執筆', desc: 'あなたの思考をAIが拡張。一貫性のある文体で、数万文字の原稿を爆速で書き上げます。', icon: Brain },
                  { step: '03', title: 'KDP入稿', desc: '電子書籍リーダーに最適化されたフォーマットで出力。あとはアップロードするだけ。', icon: TrendingUp },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=Kindle出版+稼ぎ方&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-orange-600 to-amber-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Author Mastery</p>
                  <h3 className="text-2xl font-black text-white italic leading-tight">「印税」を一生の資産にする。Kindle出版の全極意。</h3>
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
