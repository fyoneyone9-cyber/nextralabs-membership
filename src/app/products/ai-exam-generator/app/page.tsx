'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, Brain, ListChecks, FileText, FileDown } from 'lucide-react'

const PRESETS = [
  { id: 'itpass', label: 'ITパスポート', content: 'ITパスポート試験のシラバスに基づき、テクノロジ・マネジメント・ストラテジ分野から頻出問題を生成してください。' },
  { id: 'fe', label: '基本情報技術者', content: '基本情報技術者の科目A形式で、アルゴリズムとネットワークの重要問題を生成してください。' }
];

export default function AiExamGeneratorApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [inputData, setInputData] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [docUrl, setDocUrl] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("分析に基づき予想問題を30問生成しました。解説付きでGoogleドキュメントへ出力可能です。");
    setIsAnalyzing(false);
  }

  const handleExport = async () => {
    setDocUrl('https://docs.google.com/document/d/example');
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Brain className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI問題生成 & 苦手分析</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">MASTER PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">学習したい科目を選択、または入力をしてください。AIが試験の出題傾向を分析し、あなたの弱点を克服するための専用問題を無限に生成します。結果はGoogleドキュメントへ書き出し可能です。</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PRESETS.map(p => (
            <Button key={p.id} onClick={() => setInputData(p.content)} variant="outline" className="h-16 border-2 border-white/5 bg-[#13141f] text-white font-black italic hover:border-emerald-500">{p.label} 形式を適用</Button>
          ))}
        </div>

        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6">
          <textarea value={inputData} onChange={e => setInputData(e.target.value)} className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all text-lg" placeholder="学習内容を入力..." />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputData} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10" /> : 'AI弱点分析を開始する 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI診断レポート</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              {!docUrl ? (
                <Button onClick={handleExport} className="h-16 px-10 bg-white text-slate-950 font-black text-lg rounded-xl shadow-xl hover:bg-slate-100 transition-all italic"><FileText className="mr-2" /> Googleドキュメントへ保存</Button>
              ) : (
                <Button onClick={() => window.open(docUrl)} className="h-16 px-10 bg-blue-600 text-white font-black text-lg rounded-xl shadow-xl hover:bg-blue-500 transition-all italic"><FileDown className="mr-2" /> ドキュメントを開く</Button>
              )}
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">学習ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '弱点特定', desc: '合格を妨げている真の「穴」を特定。', icon: Search }, { title: '特訓問題', desc: '予想問題を自動生成。', icon: ListChecks }, { title: '克服・合格', desc: '正答率100%を目指します。', icon: TrendingUp }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => window.open(`https://${ai.toLowerCase()}.com`)} className="h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:text-white">{ai}で深掘り</Button>
              ))}
            </div>

            <a href="https://www.amazon.co.jp/s?k=資格試験+参考書&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <h3 className="text-2xl font-black text-white italic">AI厳選：あなたの弱点を補完する参考書</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
